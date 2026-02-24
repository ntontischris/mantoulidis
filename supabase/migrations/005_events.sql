-- 005_events.sql
-- Events system: in-person, virtual, and hybrid events with RSVP and waitlist

-- Enums
CREATE TYPE event_status AS ENUM ('draft', 'published', 'cancelled', 'completed');
CREATE TYPE event_type AS ENUM ('in_person', 'virtual', 'hybrid');

-- Events table
CREATE TABLE events (
  id uuid DEFAULT gen_random_uuid() PRIMARY KEY,
  title text NOT NULL,
  title_en text,
  description text,
  description_en text,
  type event_type NOT NULL DEFAULT 'in_person',
  status event_status NOT NULL DEFAULT 'draft',
  start_date timestamptz NOT NULL,
  end_date timestamptz NOT NULL,
  location text,
  -- Physical address or venue name
  location_url text,
  -- Google Maps / directions link
  virtual_url text,
  -- Zoom / Meet / Teams link (for virtual/hybrid)
  cover_url text,
  capacity integer,
  -- NULL = unlimited
  rsvp_count integer DEFAULT 0 NOT NULL,
  waitlist_count integer DEFAULT 0 NOT NULL,
  is_public boolean DEFAULT true NOT NULL,
  -- Public events visible to all authenticated users
  created_by uuid REFERENCES profiles(id) ON DELETE SET NULL,
  created_at timestamptz DEFAULT now() NOT NULL,
  updated_at timestamptz DEFAULT now() NOT NULL,
  CONSTRAINT end_after_start CHECK (end_date > start_date)
);

-- Event RSVPs table
CREATE TABLE event_rsvps (
  id uuid DEFAULT gen_random_uuid() PRIMARY KEY,
  event_id uuid REFERENCES events(id) ON DELETE CASCADE NOT NULL,
  user_id uuid REFERENCES profiles(id) ON DELETE CASCADE NOT NULL,
  status text NOT NULL DEFAULT 'attending',
  -- 'attending' | 'waitlist' | 'cancelled'
  created_at timestamptz DEFAULT now() NOT NULL,
  updated_at timestamptz DEFAULT now() NOT NULL,
  UNIQUE (event_id, user_id)
);

-- Updated_at trigger for events
CREATE TRIGGER update_events_updated_at
  BEFORE UPDATE ON events
  FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

-- Updated_at trigger for event_rsvps
CREATE TRIGGER update_event_rsvps_updated_at
  BEFORE UPDATE ON event_rsvps
  FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

-- RLS
ALTER TABLE events ENABLE ROW LEVEL SECURITY;
ALTER TABLE event_rsvps ENABLE ROW LEVEL SECURITY;

-- Events: any authenticated user can read published/completed events
CREATE POLICY "events_select" ON events
  FOR SELECT USING (
    auth.uid() IS NOT NULL AND (
      status IN ('published', 'completed')
      OR is_admin()
      OR created_by = auth.uid()
    )
  );

-- Events: admin + verified_member can create
CREATE POLICY "events_insert" ON events
  FOR INSERT WITH CHECK (is_verified_member());

-- Events: owner or admin can update
CREATE POLICY "events_update" ON events
  FOR UPDATE USING (created_by = auth.uid() OR is_admin());

-- Events: owner or admin can delete (only drafts)
CREATE POLICY "events_delete" ON events
  FOR DELETE USING ((created_by = auth.uid() OR is_admin()) AND status = 'draft');

-- RSVPs: users see their own RSVPs, admin sees all
CREATE POLICY "event_rsvps_select" ON event_rsvps
  FOR SELECT USING (auth.uid() = user_id OR is_admin());

-- RSVPs: authenticated users can insert their own RSVP
CREATE POLICY "event_rsvps_insert" ON event_rsvps
  FOR INSERT WITH CHECK (auth.uid() = user_id);

-- RSVPs: users can update (cancel) their own RSVP
CREATE POLICY "event_rsvps_update" ON event_rsvps
  FOR UPDATE USING (auth.uid() = user_id OR is_admin());

-- RSVPs: users can delete their own RSVP
CREATE POLICY "event_rsvps_delete" ON event_rsvps
  FOR DELETE USING (auth.uid() = user_id OR is_admin());

-- Indexes
CREATE INDEX idx_events_status ON events(status);
CREATE INDEX idx_events_start_date ON events(start_date);
CREATE INDEX idx_events_created_by ON events(created_by);
CREATE INDEX idx_event_rsvps_event_id ON event_rsvps(event_id);
CREATE INDEX idx_event_rsvps_user_id ON event_rsvps(user_id);
CREATE INDEX idx_event_rsvps_status ON event_rsvps(status);

-- ── Triggers: auto-manage rsvp_count and waitlist_count ───────────────────────

CREATE OR REPLACE FUNCTION handle_event_rsvp_change()
RETURNS TRIGGER AS $$
DECLARE
  v_capacity integer;
  v_rsvp_count integer;
BEGIN
  -- Get event capacity and current attending count
  SELECT capacity, rsvp_count INTO v_capacity, v_rsvp_count
  FROM events WHERE id = COALESCE(NEW.event_id, OLD.event_id);

  IF TG_OP = 'INSERT' THEN
    -- Determine if attending or waitlist
    IF v_capacity IS NULL OR v_rsvp_count < v_capacity THEN
      NEW.status := 'attending';
    ELSE
      NEW.status := 'waitlist';
    END IF;

    -- Increment the appropriate counter
    IF NEW.status = 'attending' THEN
      UPDATE events SET rsvp_count = rsvp_count + 1
      WHERE id = NEW.event_id;
    ELSE
      UPDATE events SET waitlist_count = waitlist_count + 1
      WHERE id = NEW.event_id;
    END IF;

  ELSIF TG_OP = 'UPDATE' THEN
    -- Handle status transitions
    IF OLD.status = 'attending' AND NEW.status = 'cancelled' THEN
      UPDATE events SET rsvp_count = GREATEST(0, rsvp_count - 1)
      WHERE id = NEW.event_id;
      -- Promote first waitlisted person to attending
      UPDATE event_rsvps SET status = 'attending'
      WHERE id = (
        SELECT id FROM event_rsvps
        WHERE event_id = NEW.event_id AND status = 'waitlist'
        ORDER BY created_at ASC LIMIT 1
      );
      -- If someone was promoted, adjust counts
      IF FOUND THEN
        UPDATE events SET
          rsvp_count = rsvp_count + 1,
          waitlist_count = GREATEST(0, waitlist_count - 1)
        WHERE id = NEW.event_id;
      END IF;

    ELSIF OLD.status = 'waitlist' AND NEW.status = 'cancelled' THEN
      UPDATE events SET waitlist_count = GREATEST(0, waitlist_count - 1)
      WHERE id = NEW.event_id;
    END IF;

  ELSIF TG_OP = 'DELETE' THEN
    IF OLD.status = 'attending' THEN
      UPDATE events SET rsvp_count = GREATEST(0, rsvp_count - 1)
      WHERE id = OLD.event_id;
    ELSIF OLD.status = 'waitlist' THEN
      UPDATE events SET waitlist_count = GREATEST(0, waitlist_count - 1)
      WHERE id = OLD.event_id;
    END IF;
  END IF;

  IF TG_OP = 'DELETE' THEN RETURN OLD; END IF;
  RETURN NEW;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

CREATE TRIGGER on_event_rsvp_change
  BEFORE INSERT OR UPDATE OR DELETE ON event_rsvps
  FOR EACH ROW EXECUTE FUNCTION handle_event_rsvp_change();
