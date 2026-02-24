-- 010_announcements.sql
-- Announcements, success stories, polls with voting

-- ── Announcements ─────────────────────────────────────────────────────────────

CREATE TABLE IF NOT EXISTS announcements (
  id            uuid          DEFAULT gen_random_uuid() PRIMARY KEY,
  title         text          NOT NULL,
  title_en      text,
  body          text          NOT NULL,
  body_en       text,
  type          text          NOT NULL DEFAULT 'general', -- general, event, achievement, opportunity
  cover_url     text,
  is_published  boolean       NOT NULL DEFAULT false,
  published_at  timestamptz,
  created_by    uuid          REFERENCES profiles(id) ON DELETE SET NULL,
  created_at    timestamptz   NOT NULL DEFAULT now(),
  updated_at    timestamptz   NOT NULL DEFAULT now()
);

ALTER TABLE announcements ENABLE ROW LEVEL SECURITY;

CREATE TRIGGER update_announcements_updated_at
  BEFORE UPDATE ON announcements
  FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE POLICY "announcements_select" ON announcements
  FOR SELECT USING (auth.uid() IS NOT NULL AND (is_published = true OR is_admin()));

CREATE POLICY "announcements_insert" ON announcements
  FOR INSERT WITH CHECK (is_admin());

CREATE POLICY "announcements_update" ON announcements
  FOR UPDATE USING (is_admin());

CREATE POLICY "announcements_delete" ON announcements
  FOR DELETE USING (is_admin());

CREATE INDEX IF NOT EXISTS idx_announcements_published ON announcements(is_published, published_at DESC);

-- ── Success Stories ───────────────────────────────────────────────────────────

CREATE TABLE IF NOT EXISTS success_stories (
  id            uuid          DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id       uuid          REFERENCES profiles(id) ON DELETE CASCADE NOT NULL,
  title         text          NOT NULL,
  title_en      text,
  content       text          NOT NULL,
  content_en    text,
  cover_url     text,
  is_approved   boolean       NOT NULL DEFAULT false,
  created_at    timestamptz   NOT NULL DEFAULT now(),
  updated_at    timestamptz   NOT NULL DEFAULT now()
);

ALTER TABLE success_stories ENABLE ROW LEVEL SECURITY;

CREATE TRIGGER update_success_stories_updated_at
  BEFORE UPDATE ON success_stories
  FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE POLICY "success_stories_select" ON success_stories
  FOR SELECT USING (
    auth.uid() IS NOT NULL AND (is_approved = true OR auth.uid() = user_id OR is_admin())
  );

CREATE POLICY "success_stories_insert" ON success_stories
  FOR INSERT WITH CHECK (auth.uid() = user_id AND is_verified_member());

CREATE POLICY "success_stories_update" ON success_stories
  FOR UPDATE USING (auth.uid() = user_id OR is_admin());

CREATE POLICY "success_stories_delete" ON success_stories
  FOR DELETE USING (auth.uid() = user_id OR is_admin());

CREATE INDEX IF NOT EXISTS idx_success_stories_user ON success_stories(user_id);
CREATE INDEX IF NOT EXISTS idx_success_stories_approved ON success_stories(is_approved, created_at DESC);

-- ── Polls ─────────────────────────────────────────────────────────────────────

CREATE TABLE IF NOT EXISTS polls (
  id            uuid          DEFAULT gen_random_uuid() PRIMARY KEY,
  question      text          NOT NULL,
  question_en   text,
  created_by    uuid          REFERENCES profiles(id) ON DELETE SET NULL,
  closes_at     timestamptz,
  is_active     boolean       NOT NULL DEFAULT true,
  created_at    timestamptz   NOT NULL DEFAULT now(),
  updated_at    timestamptz   NOT NULL DEFAULT now()
);

ALTER TABLE polls ENABLE ROW LEVEL SECURITY;

CREATE TRIGGER update_polls_updated_at
  BEFORE UPDATE ON polls
  FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

-- Poll options

CREATE TABLE IF NOT EXISTS poll_options (
  id            uuid          DEFAULT gen_random_uuid() PRIMARY KEY,
  poll_id       uuid          REFERENCES polls(id) ON DELETE CASCADE NOT NULL,
  text          text          NOT NULL,
  text_en       text,
  vote_count    integer       NOT NULL DEFAULT 0,
  position      smallint      NOT NULL DEFAULT 0
);

ALTER TABLE poll_options ENABLE ROW LEVEL SECURITY;

-- Poll votes (one per user per poll)

CREATE TABLE IF NOT EXISTS poll_votes (
  poll_id       uuid          REFERENCES polls(id) ON DELETE CASCADE NOT NULL,
  option_id     uuid          REFERENCES poll_options(id) ON DELETE CASCADE NOT NULL,
  user_id       uuid          REFERENCES profiles(id) ON DELETE CASCADE NOT NULL,
  voted_at      timestamptz   NOT NULL DEFAULT now(),
  PRIMARY KEY (poll_id, user_id)
);

ALTER TABLE poll_votes ENABLE ROW LEVEL SECURITY;

-- Trigger: update vote_count on poll_options

CREATE OR REPLACE FUNCTION handle_poll_vote()
RETURNS TRIGGER LANGUAGE plpgsql AS $$
BEGIN
  IF TG_OP = 'INSERT' THEN
    UPDATE poll_options SET vote_count = vote_count + 1 WHERE id = NEW.option_id;
  ELSIF TG_OP = 'DELETE' THEN
    UPDATE poll_options SET vote_count = GREATEST(vote_count - 1, 0) WHERE id = OLD.option_id;
  END IF;
  RETURN NULL;
END;
$$;

CREATE TRIGGER poll_vote_count
  AFTER INSERT OR DELETE ON poll_votes
  FOR EACH ROW EXECUTE FUNCTION handle_poll_vote();

-- RLS — Polls

CREATE POLICY "polls_select" ON polls
  FOR SELECT USING (auth.uid() IS NOT NULL AND (is_active = true OR is_admin()));

CREATE POLICY "polls_insert" ON polls
  FOR INSERT WITH CHECK (is_admin());

CREATE POLICY "polls_update" ON polls
  FOR UPDATE USING (is_admin());

CREATE POLICY "polls_delete" ON polls
  FOR DELETE USING (is_admin());

-- RLS — Poll options

CREATE POLICY "poll_options_select" ON poll_options
  FOR SELECT USING (auth.uid() IS NOT NULL);

CREATE POLICY "poll_options_insert" ON poll_options
  FOR INSERT WITH CHECK (is_admin());

CREATE POLICY "poll_options_update" ON poll_options
  FOR UPDATE USING (is_admin());

CREATE POLICY "poll_options_delete" ON poll_options
  FOR DELETE USING (is_admin());

-- RLS — Poll votes

CREATE POLICY "poll_votes_select" ON poll_votes
  FOR SELECT USING (auth.uid() IS NOT NULL);

CREATE POLICY "poll_votes_insert" ON poll_votes
  FOR INSERT WITH CHECK (auth.uid() = user_id AND is_active_member());

CREATE POLICY "poll_votes_delete" ON poll_votes
  FOR DELETE USING (auth.uid() = user_id);

-- Indexes

CREATE INDEX IF NOT EXISTS idx_polls_active ON polls(is_active, created_at DESC);
CREATE INDEX IF NOT EXISTS idx_poll_options_poll ON poll_options(poll_id, position);
CREATE INDEX IF NOT EXISTS idx_poll_votes_user ON poll_votes(user_id);
