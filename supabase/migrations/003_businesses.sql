-- 003_businesses.sql
-- Business listings — alumni can showcase their companies/ventures

-- ============================================================
-- BUSINESSES TABLE
-- ============================================================

CREATE TABLE businesses (
  id              uuid          PRIMARY KEY DEFAULT gen_random_uuid(),
  owner_id        uuid          NOT NULL REFERENCES profiles(id) ON DELETE CASCADE,

  -- Core info (bilingual)
  name            text          NOT NULL,
  name_en         text,
  description     text          CHECK (char_length(description) <= 3000),
  description_en  text          CHECK (char_length(description_en) <= 3000),

  -- Categorisation
  category        text,
  industry        text,

  -- Media
  logo_url        text,

  -- Contact & Location
  website_url     text,
  email           text,
  phone           text,
  address         text,
  city            text,
  country         text          DEFAULT 'Ελλάδα',

  -- Social
  linkedin_url    text,
  instagram_url   text,

  -- Status
  is_verified     boolean       NOT NULL DEFAULT false,
  is_active       boolean       NOT NULL DEFAULT true,

  -- Full-text search
  search_vector   tsvector,

  created_at      timestamptz   NOT NULL DEFAULT now(),
  updated_at      timestamptz   NOT NULL DEFAULT now()
);

-- ============================================================
-- INDEXES
-- ============================================================

CREATE INDEX idx_businesses_owner_id      ON businesses(owner_id);
CREATE INDEX idx_businesses_category      ON businesses(category);
CREATE INDEX idx_businesses_industry      ON businesses(industry);
CREATE INDEX idx_businesses_is_active     ON businesses(is_active) WHERE is_active = true;
CREATE INDEX idx_businesses_is_verified   ON businesses(is_verified) WHERE is_verified = true;
CREATE INDEX idx_businesses_search_vector ON businesses USING GIN(search_vector);
CREATE INDEX idx_businesses_name_trgm     ON businesses USING GIN(name gin_trgm_ops);

-- ============================================================
-- TRIGGERS
-- ============================================================

-- Auto-update updated_at (reuse existing function)
CREATE TRIGGER update_businesses_updated_at
  BEFORE UPDATE ON businesses
  FOR EACH ROW
  EXECUTE FUNCTION update_updated_at_column();

-- Maintain FTS search_vector
CREATE OR REPLACE FUNCTION update_business_search_vector()
RETURNS TRIGGER
LANGUAGE plpgsql
AS $$
BEGIN
  NEW.search_vector :=
    setweight(to_tsvector('simple', unaccent(coalesce(NEW.name, ''))),         'A') ||
    setweight(to_tsvector('simple', unaccent(coalesce(NEW.name_en, ''))),      'A') ||
    setweight(to_tsvector('simple', unaccent(coalesce(NEW.category, ''))),     'B') ||
    setweight(to_tsvector('simple', unaccent(coalesce(NEW.industry, ''))),     'B') ||
    setweight(to_tsvector('simple', unaccent(coalesce(NEW.description, ''))),  'C') ||
    setweight(to_tsvector('simple', unaccent(coalesce(NEW.city, ''))),         'D');
  RETURN NEW;
END;
$$;

CREATE TRIGGER update_businesses_search_vector
  BEFORE INSERT OR UPDATE ON businesses
  FOR EACH ROW
  EXECUTE FUNCTION update_business_search_vector();

-- ============================================================
-- ROW LEVEL SECURITY
-- ============================================================

ALTER TABLE businesses ENABLE ROW LEVEL SECURITY;

-- Anyone can read active businesses
CREATE POLICY "businesses_select_active"
  ON businesses FOR SELECT
  USING (is_active = true OR auth.uid() = owner_id OR is_admin());

-- Verified members and admins can create
CREATE POLICY "businesses_insert_verified"
  ON businesses FOR INSERT
  WITH CHECK (
    auth.uid() = owner_id
    AND is_verified_member()
  );

-- Owner and admins can update
CREATE POLICY "businesses_update_owner_or_admin"
  ON businesses FOR UPDATE
  USING (auth.uid() = owner_id OR is_admin());

-- Owner and admins can delete
CREATE POLICY "businesses_delete_owner_or_admin"
  ON businesses FOR DELETE
  USING (auth.uid() = owner_id OR is_admin());
