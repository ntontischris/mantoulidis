-- 002_profiles.sql
-- Core profiles table — the central entity of Alumni Connect
-- Every auth.user automatically gets a profile row via trigger

-- ============================================================
-- ENUMS
-- ============================================================

CREATE TYPE user_role AS ENUM (
  'super_admin',
  'admin',
  'verified_member',
  'basic_member'
);

CREATE TYPE membership_status AS ENUM (
  'active',
  'inactive',
  'suspended'
);

CREATE TYPE language_pref AS ENUM ('el', 'en');

-- ============================================================
-- PROFILES TABLE
-- ============================================================

CREATE TABLE profiles (
  id                  uuid         REFERENCES auth.users(id) ON DELETE CASCADE PRIMARY KEY,
  membership_number   text         UNIQUE,

  -- Names (bilingual)
  first_name          text         NOT NULL,
  last_name           text         NOT NULL,
  first_name_en       text,
  last_name_en        text,

  -- Academic
  graduation_year     smallint     CHECK (graduation_year >= 1990 AND graduation_year <= 2035),
  department          text,

  -- Professional
  current_position    text,
  current_company     text,
  industry            text,

  -- Bio (bilingual)
  bio                 text         CHECK (char_length(bio) <= 5000),
  bio_en              text         CHECK (char_length(bio_en) <= 5000),

  -- Media
  avatar_url          text,
  cover_url           text,

  -- Contact
  linkedin_url        text,
  website_url         text,
  phone               text,

  -- Location
  city                text,
  country             text         DEFAULT 'Ελλάδα',

  -- Features
  is_mentor           boolean      NOT NULL DEFAULT false,

  -- Privacy toggles
  phone_public        boolean      NOT NULL DEFAULT false,
  email_public        boolean      NOT NULL DEFAULT true,

  -- Status & Role
  membership_status   membership_status  NOT NULL DEFAULT 'inactive',
  role                user_role          NOT NULL DEFAULT 'basic_member',
  language_pref       language_pref      NOT NULL DEFAULT 'el',
  onboarding_completed boolean           NOT NULL DEFAULT false,

  -- Full-text search
  search_vector       tsvector,

  created_at          timestamptz  NOT NULL DEFAULT now(),
  updated_at          timestamptz  NOT NULL DEFAULT now()
);

-- ============================================================
-- INDEXES
-- ============================================================

CREATE INDEX idx_profiles_search_vector    ON profiles USING GIN(search_vector);
CREATE INDEX idx_profiles_name_trgm        ON profiles USING GIN((first_name || ' ' || last_name) gin_trgm_ops);
CREATE INDEX idx_profiles_graduation_year  ON profiles(graduation_year);
CREATE INDEX idx_profiles_industry         ON profiles(industry);
CREATE INDEX idx_profiles_is_mentor        ON profiles(is_mentor) WHERE is_mentor = true;
CREATE INDEX idx_profiles_membership       ON profiles(membership_status);
CREATE INDEX idx_profiles_role             ON profiles(role);

-- ============================================================
-- TRIGGERS & FUNCTIONS
-- ============================================================

-- 1. Auto-create profile when a new user signs up
CREATE OR REPLACE FUNCTION handle_new_user()
RETURNS TRIGGER
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
DECLARE
  _first text;
  _last  text;
  _full  text;
BEGIN
  _full  := COALESCE(NEW.raw_user_meta_data->>'full_name', '');
  _first := COALESCE(NEW.raw_user_meta_data->>'first_name', split_part(_full, ' ', 1), 'Νέος');
  _last  := COALESCE(NEW.raw_user_meta_data->>'last_name',  split_part(_full, ' ', 2), 'Χρήστης');

  INSERT INTO public.profiles (id, first_name, last_name)
  VALUES (NEW.id, _first, _last)
  ON CONFLICT (id) DO NOTHING;

  RETURN NEW;
END;
$$;

CREATE TRIGGER on_auth_user_created
  AFTER INSERT ON auth.users
  FOR EACH ROW
  EXECUTE FUNCTION handle_new_user();

-- 2. Auto-assign membership number when status → active
CREATE OR REPLACE FUNCTION assign_membership_number()
RETURNS TRIGGER
LANGUAGE plpgsql
AS $$
DECLARE
  _year text;
  _seq  integer;
BEGIN
  IF NEW.membership_status = 'active'
     AND (OLD.membership_status IS DISTINCT FROM 'active')
     AND NEW.membership_number IS NULL
  THEN
    _year := to_char(now(), 'YYYY');
    SELECT COUNT(*) + 1 INTO _seq
    FROM profiles
    WHERE membership_number LIKE 'ALU-' || _year || '-%';

    NEW.membership_number := 'ALU-' || _year || '-' || lpad(_seq::text, 5, '0');
  END IF;
  RETURN NEW;
END;
$$;

CREATE TRIGGER assign_membership_number_trigger
  BEFORE UPDATE ON profiles
  FOR EACH ROW
  EXECUTE FUNCTION assign_membership_number();

-- 3. Auto-update updated_at
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER
LANGUAGE plpgsql
AS $$
BEGIN
  NEW.updated_at = now();
  RETURN NEW;
END;
$$;

CREATE TRIGGER update_profiles_updated_at
  BEFORE UPDATE ON profiles
  FOR EACH ROW
  EXECUTE FUNCTION update_updated_at_column();

-- 4. Maintain FTS search_vector
CREATE OR REPLACE FUNCTION update_profile_search_vector()
RETURNS TRIGGER
LANGUAGE plpgsql
AS $$
BEGIN
  NEW.search_vector :=
    setweight(to_tsvector('simple', unaccent(coalesce(NEW.first_name, ''))),        'A') ||
    setweight(to_tsvector('simple', unaccent(coalesce(NEW.last_name, ''))),         'A') ||
    setweight(to_tsvector('simple', unaccent(coalesce(NEW.first_name_en, ''))),     'A') ||
    setweight(to_tsvector('simple', unaccent(coalesce(NEW.last_name_en, ''))),      'A') ||
    setweight(to_tsvector('simple', unaccent(coalesce(NEW.current_position, ''))),  'B') ||
    setweight(to_tsvector('simple', unaccent(coalesce(NEW.current_company, ''))),   'B') ||
    setweight(to_tsvector('simple', unaccent(coalesce(NEW.industry, ''))),          'C') ||
    setweight(to_tsvector('simple', unaccent(coalesce(NEW.bio, ''))),               'D');
  RETURN NEW;
END;
$$;

CREATE TRIGGER update_profiles_search_vector
  BEFORE INSERT OR UPDATE ON profiles
  FOR EACH ROW
  EXECUTE FUNCTION update_profile_search_vector();

-- ============================================================
-- HELPER FUNCTIONS FOR RLS
-- ============================================================

CREATE OR REPLACE FUNCTION is_admin()
RETURNS boolean
LANGUAGE plpgsql
SECURITY DEFINER
STABLE
SET search_path = public
AS $$
BEGIN
  RETURN EXISTS (
    SELECT 1 FROM profiles
    WHERE id = auth.uid()
      AND role IN ('admin', 'super_admin')
  );
END;
$$;

CREATE OR REPLACE FUNCTION is_verified_member()
RETURNS boolean
LANGUAGE plpgsql
SECURITY DEFINER
STABLE
SET search_path = public
AS $$
BEGIN
  RETURN EXISTS (
    SELECT 1 FROM profiles
    WHERE id = auth.uid()
      AND role IN ('verified_member', 'admin', 'super_admin')
  );
END;
$$;

CREATE OR REPLACE FUNCTION is_active_member()
RETURNS boolean
LANGUAGE plpgsql
SECURITY DEFINER
STABLE
SET search_path = public
AS $$
BEGIN
  RETURN EXISTS (
    SELECT 1 FROM profiles
    WHERE id = auth.uid()
      AND membership_status = 'active'
  );
END;
$$;

-- ============================================================
-- ROW LEVEL SECURITY
-- ============================================================

ALTER TABLE profiles ENABLE ROW LEVEL SECURITY;

-- Anyone (including non-authenticated) can read public profile data
CREATE POLICY "profiles_select_all"
  ON profiles FOR SELECT
  USING (true);

-- Users can only insert their own profile (the trigger handles this, but as safety net)
CREATE POLICY "profiles_insert_own"
  ON profiles FOR INSERT
  WITH CHECK (auth.uid() = id);

-- Users can update their own profile; admins can update anyone's
CREATE POLICY "profiles_update_own_or_admin"
  ON profiles FOR UPDATE
  USING (auth.uid() = id OR is_admin());

-- Only admins can delete profiles
CREATE POLICY "profiles_delete_admin"
  ON profiles FOR DELETE
  USING (is_admin());
