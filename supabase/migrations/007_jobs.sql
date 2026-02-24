-- 007_jobs.sql
-- Job board: listings posted by alumni, optional applications tracking

-- ── Enums ─────────────────────────────────────────────────────────────────────

DO $$ BEGIN
  CREATE TYPE job_type AS ENUM ('full_time', 'part_time', 'contract', 'internship', 'freelance', 'volunteer');
EXCEPTION WHEN duplicate_object THEN null; END $$;

DO $$ BEGIN
  CREATE TYPE job_status AS ENUM ('open', 'closed', 'draft');
EXCEPTION WHEN duplicate_object THEN null; END $$;

-- ── Jobs ──────────────────────────────────────────────────────────────────────

CREATE TABLE IF NOT EXISTS jobs (
  id              uuid              DEFAULT gen_random_uuid() PRIMARY KEY,
  posted_by       uuid              REFERENCES profiles(id) ON DELETE SET NULL,
  title           text              NOT NULL,
  title_en        text,
  company         text              NOT NULL,
  description     text,
  description_en  text,
  type            job_type          NOT NULL DEFAULT 'full_time',
  status          job_status        NOT NULL DEFAULT 'open',
  location        text,
  is_remote       boolean           NOT NULL DEFAULT false,
  salary_range    text,
  apply_url       text,
  apply_email     text,
  industry        text,
  expires_at      timestamptz,
  created_at      timestamptz       NOT NULL DEFAULT now(),
  updated_at      timestamptz       NOT NULL DEFAULT now()
);

ALTER TABLE jobs ENABLE ROW LEVEL SECURITY;

CREATE TRIGGER update_jobs_updated_at
  BEFORE UPDATE ON jobs
  FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

-- ── Saved jobs ────────────────────────────────────────────────────────────────

CREATE TABLE IF NOT EXISTS saved_jobs (
  user_id         uuid              REFERENCES profiles(id) ON DELETE CASCADE NOT NULL,
  job_id          uuid              REFERENCES jobs(id) ON DELETE CASCADE NOT NULL,
  saved_at        timestamptz       NOT NULL DEFAULT now(),
  PRIMARY KEY (user_id, job_id)
);

ALTER TABLE saved_jobs ENABLE ROW LEVEL SECURITY;

-- ── RLS Policies — jobs ───────────────────────────────────────────────────────

-- Anyone authenticated reads open + published jobs
CREATE POLICY "jobs_select" ON jobs
  FOR SELECT USING (
    auth.uid() IS NOT NULL
    AND (
      status = 'open'
      OR auth.uid() = posted_by
      OR is_admin()
    )
  );

-- Verified members can post jobs
CREATE POLICY "jobs_insert" ON jobs
  FOR INSERT WITH CHECK (
    auth.uid() = posted_by
    AND is_verified_member()
  );

-- Owner or admin can update
CREATE POLICY "jobs_update" ON jobs
  FOR UPDATE USING (auth.uid() = posted_by OR is_admin());

-- Owner or admin can delete
CREATE POLICY "jobs_delete" ON jobs
  FOR DELETE USING (auth.uid() = posted_by OR is_admin());

-- ── RLS Policies — saved_jobs ─────────────────────────────────────────────────

CREATE POLICY "saved_jobs_select" ON saved_jobs
  FOR SELECT USING (auth.uid() = user_id);

CREATE POLICY "saved_jobs_insert" ON saved_jobs
  FOR INSERT WITH CHECK (auth.uid() = user_id);

CREATE POLICY "saved_jobs_delete" ON saved_jobs
  FOR DELETE USING (auth.uid() = user_id);

-- ── Indexes ───────────────────────────────────────────────────────────────────

CREATE INDEX IF NOT EXISTS idx_jobs_posted_by  ON jobs(posted_by);
CREATE INDEX IF NOT EXISTS idx_jobs_status     ON jobs(status);
CREATE INDEX IF NOT EXISTS idx_jobs_industry   ON jobs(industry);
CREATE INDEX IF NOT EXISTS idx_jobs_type       ON jobs(type);
CREATE INDEX IF NOT EXISTS idx_jobs_created_at ON jobs(created_at DESC);
CREATE INDEX IF NOT EXISTS idx_saved_jobs_user ON saved_jobs(user_id);
