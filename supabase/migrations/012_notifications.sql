-- 012_notifications.sql
-- In-app notifications

CREATE TABLE notifications (
  id uuid DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id uuid REFERENCES profiles(id) ON DELETE CASCADE NOT NULL,
  type text NOT NULL DEFAULT 'system',
  -- 'message' | 'event_reminder' | 'benefit_expiry' | 'mentorship' | 'system'
  title text NOT NULL,
  body text,
  link text,
  -- Optional deep-link (e.g. /dashboard/messages/conv-id)
  is_read boolean DEFAULT false NOT NULL,
  created_at timestamptz DEFAULT now() NOT NULL
);

ALTER TABLE notifications ENABLE ROW LEVEL SECURITY;

-- Users see only their own notifications; admins see all
CREATE POLICY "notifications_select" ON notifications
  FOR SELECT USING (user_id = auth.uid() OR is_admin());

-- System (service role) inserts notifications; users cannot self-insert
CREATE POLICY "notifications_insert" ON notifications
  FOR INSERT WITH CHECK (is_admin());

-- Users mark their own as read
CREATE POLICY "notifications_update" ON notifications
  FOR UPDATE USING (user_id = auth.uid() OR is_admin());

-- Users can delete their own notifications
CREATE POLICY "notifications_delete" ON notifications
  FOR DELETE USING (user_id = auth.uid() OR is_admin());

-- Indexes
CREATE INDEX idx_notifications_user_id ON notifications(user_id);
CREATE INDEX idx_notifications_is_read ON notifications(is_read);
CREATE INDEX idx_notifications_created_at ON notifications(created_at DESC);
