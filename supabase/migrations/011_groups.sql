-- 011_groups.sql
-- Alumni groups (interest communities)

-- ── Groups ────────────────────────────────────────────────────────────────────

CREATE TABLE IF NOT EXISTS groups (
  id              uuid          DEFAULT gen_random_uuid() PRIMARY KEY,
  name            text          NOT NULL,
  name_en         text,
  description     text,
  description_en  text,
  cover_url       text,
  is_private      boolean       NOT NULL DEFAULT false,
  member_count    integer       NOT NULL DEFAULT 0,
  created_by      uuid          REFERENCES profiles(id) ON DELETE SET NULL,
  created_at      timestamptz   NOT NULL DEFAULT now(),
  updated_at      timestamptz   NOT NULL DEFAULT now()
);

ALTER TABLE groups ENABLE ROW LEVEL SECURITY;

CREATE TRIGGER update_groups_updated_at
  BEFORE UPDATE ON groups
  FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

-- ── Group members ─────────────────────────────────────────────────────────────

CREATE TABLE IF NOT EXISTS group_members (
  group_id    uuid          REFERENCES groups(id) ON DELETE CASCADE NOT NULL,
  user_id     uuid          REFERENCES profiles(id) ON DELETE CASCADE NOT NULL,
  role        text          NOT NULL DEFAULT 'member', -- member | admin
  joined_at   timestamptz   NOT NULL DEFAULT now(),
  PRIMARY KEY (group_id, user_id)
);

ALTER TABLE group_members ENABLE ROW LEVEL SECURITY;

-- Trigger: maintain member_count

CREATE OR REPLACE FUNCTION handle_group_member_change()
RETURNS TRIGGER LANGUAGE plpgsql AS $$
BEGIN
  IF TG_OP = 'INSERT' THEN
    UPDATE groups SET member_count = member_count + 1 WHERE id = NEW.group_id;
  ELSIF TG_OP = 'DELETE' THEN
    UPDATE groups SET member_count = GREATEST(member_count - 1, 0) WHERE id = OLD.group_id;
  END IF;
  RETURN NULL;
END;
$$;

CREATE TRIGGER group_member_count
  AFTER INSERT OR DELETE ON group_members
  FOR EACH ROW EXECUTE FUNCTION handle_group_member_change();

-- ── Group posts ───────────────────────────────────────────────────────────────

CREATE TABLE IF NOT EXISTS group_posts (
  id          uuid          DEFAULT gen_random_uuid() PRIMARY KEY,
  group_id    uuid          REFERENCES groups(id) ON DELETE CASCADE NOT NULL,
  user_id     uuid          REFERENCES profiles(id) ON DELETE CASCADE NOT NULL,
  content     text          NOT NULL,
  is_deleted  boolean       NOT NULL DEFAULT false,
  created_at  timestamptz   NOT NULL DEFAULT now(),
  updated_at  timestamptz   NOT NULL DEFAULT now()
);

ALTER TABLE group_posts ENABLE ROW LEVEL SECURITY;

CREATE TRIGGER update_group_posts_updated_at
  BEFORE UPDATE ON group_posts
  FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

-- ── RLS — groups ──────────────────────────────────────────────────────────────

-- Public groups visible to all auth users; private only to members or admin
CREATE POLICY "groups_select" ON groups
  FOR SELECT USING (
    auth.uid() IS NOT NULL AND (
      is_private = false
      OR is_admin()
      OR EXISTS (SELECT 1 FROM group_members WHERE group_id = id AND user_id = auth.uid())
    )
  );

CREATE POLICY "groups_insert" ON groups
  FOR INSERT WITH CHECK (auth.uid() = created_by AND is_verified_member());

CREATE POLICY "groups_update" ON groups
  FOR UPDATE USING (
    is_admin()
    OR EXISTS (SELECT 1 FROM group_members WHERE group_id = id AND user_id = auth.uid() AND role = 'admin')
  );

CREATE POLICY "groups_delete" ON groups
  FOR DELETE USING (is_admin());

-- ── RLS — group_members ───────────────────────────────────────────────────────

CREATE POLICY "group_members_select" ON group_members
  FOR SELECT USING (auth.uid() IS NOT NULL);

CREATE POLICY "group_members_insert" ON group_members
  FOR INSERT WITH CHECK (auth.uid() = user_id AND is_active_member());

CREATE POLICY "group_members_delete" ON group_members
  FOR DELETE USING (auth.uid() = user_id OR is_admin());

-- ── RLS — group_posts ─────────────────────────────────────────────────────────

-- Only group members can read posts
CREATE POLICY "group_posts_select" ON group_posts
  FOR SELECT USING (
    is_deleted = false AND (
      is_admin()
      OR EXISTS (SELECT 1 FROM group_members WHERE group_id = group_posts.group_id AND user_id = auth.uid())
    )
  );

CREATE POLICY "group_posts_insert" ON group_posts
  FOR INSERT WITH CHECK (
    auth.uid() = user_id
    AND EXISTS (SELECT 1 FROM group_members WHERE group_id = group_posts.group_id AND user_id = auth.uid())
  );

CREATE POLICY "group_posts_update" ON group_posts
  FOR UPDATE USING (auth.uid() = user_id OR is_admin());

CREATE POLICY "group_posts_delete" ON group_posts
  FOR DELETE USING (auth.uid() = user_id OR is_admin());

-- ── Indexes ───────────────────────────────────────────────────────────────────

CREATE INDEX IF NOT EXISTS idx_groups_private      ON groups(is_private);
CREATE INDEX IF NOT EXISTS idx_group_members_user  ON group_members(user_id);
CREATE INDEX IF NOT EXISTS idx_group_members_group ON group_members(group_id);
CREATE INDEX IF NOT EXISTS idx_group_posts_group   ON group_posts(group_id, created_at DESC);
CREATE INDEX IF NOT EXISTS idx_group_posts_user    ON group_posts(user_id);
