-- 009_mentorship.sql
-- Mentorship program: request → accept → active → completed lifecycle

-- ── Enum ──────────────────────────────────────────────────────────────────────

DO $$ BEGIN
  CREATE TYPE mentorship_status AS ENUM ('pending', 'accepted', 'declined', 'active', 'completed', 'cancelled');
EXCEPTION WHEN duplicate_object THEN null; END $$;

-- ── Mentorships ───────────────────────────────────────────────────────────────

CREATE TABLE IF NOT EXISTS mentorships (
  id                uuid              DEFAULT gen_random_uuid() PRIMARY KEY,
  mentor_id         uuid              REFERENCES profiles(id) ON DELETE CASCADE NOT NULL,
  mentee_id         uuid              REFERENCES profiles(id) ON DELETE CASCADE NOT NULL,
  status            mentorship_status NOT NULL DEFAULT 'pending',
  goals             text,                         -- what the mentee wants to achieve
  message           text,                         -- initial request message from mentee
  mentor_notes      text,                         -- private notes visible only to mentor
  mentee_feedback   text,                         -- post-completion feedback from mentee
  mentor_feedback   text,                         -- post-completion feedback from mentor
  started_at        timestamptz,
  completed_at      timestamptz,
  created_at        timestamptz       NOT NULL DEFAULT now(),
  updated_at        timestamptz       NOT NULL DEFAULT now(),
  CONSTRAINT no_self_mentorship CHECK (mentor_id <> mentee_id),
  CONSTRAINT unique_active_pair UNIQUE (mentor_id, mentee_id)
);

ALTER TABLE mentorships ENABLE ROW LEVEL SECURITY;

CREATE TRIGGER update_mentorships_updated_at
  BEFORE UPDATE ON mentorships
  FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

-- Auto-set started_at when status transitions to 'active'
CREATE OR REPLACE FUNCTION handle_mentorship_status_change()
RETURNS TRIGGER LANGUAGE plpgsql AS $$
BEGIN
  IF NEW.status = 'active' AND OLD.status <> 'active' THEN
    NEW.started_at = now();
  END IF;
  IF NEW.status = 'completed' AND OLD.status <> 'completed' THEN
    NEW.completed_at = now();
  END IF;
  RETURN NEW;
END;
$$;

CREATE TRIGGER mentorship_status_change
  BEFORE UPDATE ON mentorships
  FOR EACH ROW EXECUTE FUNCTION handle_mentorship_status_change();

-- ── RLS Policies ──────────────────────────────────────────────────────────────

-- Participants can see their own mentorships; admins see all
CREATE POLICY "mentorships_select" ON mentorships
  FOR SELECT USING (
    auth.uid() = mentor_id
    OR auth.uid() = mentee_id
    OR is_admin()
  );

-- Mentee initiates a request (mentee_id = current user, mentor must be is_mentor)
CREATE POLICY "mentorships_insert" ON mentorships
  FOR INSERT WITH CHECK (
    auth.uid() = mentee_id
    AND is_verified_member()
    AND EXISTS (
      SELECT 1 FROM profiles
      WHERE id = mentor_id AND is_mentor = true
    )
  );

-- Mentor can accept/decline/complete; mentee can cancel; admin can do all
CREATE POLICY "mentorships_update" ON mentorships
  FOR UPDATE USING (
    auth.uid() = mentor_id
    OR auth.uid() = mentee_id
    OR is_admin()
  );

-- Only admin can delete (soft-delete via status preferred)
CREATE POLICY "mentorships_delete" ON mentorships
  FOR DELETE USING (is_admin());

-- ── Indexes ───────────────────────────────────────────────────────────────────

CREATE INDEX IF NOT EXISTS idx_mentorships_mentor  ON mentorships(mentor_id);
CREATE INDEX IF NOT EXISTS idx_mentorships_mentee  ON mentorships(mentee_id);
CREATE INDEX IF NOT EXISTS idx_mentorships_status  ON mentorships(status);
