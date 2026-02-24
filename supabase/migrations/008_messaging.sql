-- 008_messaging.sql
-- Real-time 1-on-1 and group messaging

CREATE TABLE conversations (
  id uuid DEFAULT gen_random_uuid() PRIMARY KEY,
  title text,
  -- NULL for 1-on-1; set for group conversations
  last_message_at timestamptz DEFAULT now() NOT NULL,
  last_message_preview text,
  created_at timestamptz DEFAULT now() NOT NULL,
  updated_at timestamptz DEFAULT now() NOT NULL
);

CREATE TABLE conversation_participants (
  conversation_id uuid REFERENCES conversations(id) ON DELETE CASCADE NOT NULL,
  user_id uuid REFERENCES profiles(id) ON DELETE CASCADE NOT NULL,
  joined_at timestamptz DEFAULT now() NOT NULL,
  last_read_at timestamptz DEFAULT now() NOT NULL,
  PRIMARY KEY (conversation_id, user_id)
);

CREATE TABLE messages (
  id uuid DEFAULT gen_random_uuid() PRIMARY KEY,
  conversation_id uuid REFERENCES conversations(id) ON DELETE CASCADE NOT NULL,
  sender_id uuid REFERENCES profiles(id) ON DELETE SET NULL,
  content text NOT NULL,
  is_deleted boolean DEFAULT false NOT NULL,
  created_at timestamptz DEFAULT now() NOT NULL
);

-- Updated_at trigger for conversations
CREATE TRIGGER update_conversations_updated_at
  BEFORE UPDATE ON conversations
  FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

-- RLS
ALTER TABLE conversations ENABLE ROW LEVEL SECURITY;
ALTER TABLE conversation_participants ENABLE ROW LEVEL SECURITY;
ALTER TABLE messages ENABLE ROW LEVEL SECURITY;

-- Conversations: participants can see their own conversations
CREATE POLICY "conversations_select" ON conversations
  FOR SELECT USING (
    EXISTS (
      SELECT 1 FROM conversation_participants
      WHERE conversation_id = conversations.id
        AND user_id = auth.uid()
    )
    OR is_admin()
  );

-- Conversations: any authenticated user can create
CREATE POLICY "conversations_insert" ON conversations
  FOR INSERT WITH CHECK (auth.uid() IS NOT NULL);

-- Conversations: only admins update (last_message fields updated by trigger)
CREATE POLICY "conversations_update" ON conversations
  FOR UPDATE USING (is_admin());

-- Participants: users see their own participation rows
CREATE POLICY "participants_select" ON conversation_participants
  FOR SELECT USING (user_id = auth.uid() OR is_admin());

-- Participants: authenticated users can add participants (when creating a conversation)
CREATE POLICY "participants_insert" ON conversation_participants
  FOR INSERT WITH CHECK (auth.uid() IS NOT NULL);

-- Participants: users can update their own last_read_at
CREATE POLICY "participants_update" ON conversation_participants
  FOR UPDATE USING (user_id = auth.uid() OR is_admin());

-- Participants: users can leave conversations
CREATE POLICY "participants_delete" ON conversation_participants
  FOR DELETE USING (user_id = auth.uid() OR is_admin());

-- Messages: participants in the conversation can read
CREATE POLICY "messages_select" ON messages
  FOR SELECT USING (
    EXISTS (
      SELECT 1 FROM conversation_participants
      WHERE conversation_id = messages.conversation_id
        AND user_id = auth.uid()
    )
    OR is_admin()
  );

-- Messages: participants can send messages
CREATE POLICY "messages_insert" ON messages
  FOR INSERT WITH CHECK (
    auth.uid() = sender_id AND
    EXISTS (
      SELECT 1 FROM conversation_participants
      WHERE conversation_id = messages.conversation_id
        AND user_id = auth.uid()
    )
  );

-- Messages: sender can soft-delete (is_deleted)
CREATE POLICY "messages_update" ON messages
  FOR UPDATE USING (sender_id = auth.uid() OR is_admin());

-- Indexes
CREATE INDEX idx_conversations_last_message_at ON conversations(last_message_at DESC);
CREATE INDEX idx_conv_participants_user ON conversation_participants(user_id);
CREATE INDEX idx_conv_participants_conv ON conversation_participants(conversation_id);
CREATE INDEX idx_messages_conversation ON messages(conversation_id, created_at);
CREATE INDEX idx_messages_sender ON messages(sender_id);

-- Trigger: update last_message_at and last_message_preview on new message
CREATE OR REPLACE FUNCTION update_conversation_last_message()
RETURNS TRIGGER AS $$
BEGIN
  UPDATE conversations
  SET
    last_message_at = NEW.created_at,
    last_message_preview = left(NEW.content, 100)
  WHERE id = NEW.conversation_id;
  RETURN NEW;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

CREATE TRIGGER on_message_sent
  AFTER INSERT ON messages
  FOR EACH ROW EXECUTE FUNCTION update_conversation_last_message();
