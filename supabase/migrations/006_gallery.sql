-- 006_gallery.sql
-- Photo gallery: albums and photos

CREATE TABLE gallery_albums (
  id uuid DEFAULT gen_random_uuid() PRIMARY KEY,
  title text NOT NULL,
  title_en text,
  description text,
  description_en text,
  cover_photo_url text,
  photo_count integer DEFAULT 0 NOT NULL,
  is_published boolean DEFAULT false NOT NULL,
  event_id uuid REFERENCES events(id) ON DELETE SET NULL,
  -- Optional: link album to an event
  created_by uuid REFERENCES profiles(id) ON DELETE SET NULL,
  created_at timestamptz DEFAULT now() NOT NULL,
  updated_at timestamptz DEFAULT now() NOT NULL
);

CREATE TABLE gallery_photos (
  id uuid DEFAULT gen_random_uuid() PRIMARY KEY,
  album_id uuid REFERENCES gallery_albums(id) ON DELETE CASCADE NOT NULL,
  storage_path text NOT NULL,
  -- Path in Supabase Storage bucket "gallery"
  url text NOT NULL,
  -- Public URL (from Supabase Storage)
  thumbnail_url text,
  -- Optional pre-generated thumbnail
  caption text,
  caption_en text,
  width integer,
  height integer,
  file_size integer,
  -- bytes
  is_approved boolean DEFAULT true NOT NULL,
  -- Set to false for moderation queue
  uploaded_by uuid REFERENCES profiles(id) ON DELETE SET NULL,
  created_at timestamptz DEFAULT now() NOT NULL,
  updated_at timestamptz DEFAULT now() NOT NULL
);

-- Updated_at triggers
CREATE TRIGGER update_gallery_albums_updated_at
  BEFORE UPDATE ON gallery_albums
  FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_gallery_photos_updated_at
  BEFORE UPDATE ON gallery_photos
  FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

-- RLS
ALTER TABLE gallery_albums ENABLE ROW LEVEL SECURITY;
ALTER TABLE gallery_photos ENABLE ROW LEVEL SECURITY;

-- Albums: authenticated users see published albums; admins see all
CREATE POLICY "gallery_albums_select" ON gallery_albums
  FOR SELECT USING (
    auth.uid() IS NOT NULL AND (
      is_published = true OR is_admin()
    )
  );

-- Albums: only admins can create
CREATE POLICY "gallery_albums_insert" ON gallery_albums
  FOR INSERT WITH CHECK (is_admin());

-- Albums: only admins can update
CREATE POLICY "gallery_albums_update" ON gallery_albums
  FOR UPDATE USING (is_admin());

-- Albums: only admins can delete
CREATE POLICY "gallery_albums_delete" ON gallery_albums
  FOR DELETE USING (is_admin());

-- Photos: authenticated users see approved photos in published albums
CREATE POLICY "gallery_photos_select" ON gallery_photos
  FOR SELECT USING (
    auth.uid() IS NOT NULL AND (
      (is_approved = true AND EXISTS (
        SELECT 1 FROM gallery_albums
        WHERE id = album_id AND is_published = true
      ))
      OR is_admin()
    )
  );

-- Photos: verified members can upload to published albums
CREATE POLICY "gallery_photos_insert" ON gallery_photos
  FOR INSERT WITH CHECK (
    auth.uid() = uploaded_by AND is_verified_member() AND
    EXISTS (SELECT 1 FROM gallery_albums WHERE id = album_id AND is_published = true)
  );

-- Photos: owner or admin can update caption
CREATE POLICY "gallery_photos_update" ON gallery_photos
  FOR UPDATE USING (uploaded_by = auth.uid() OR is_admin());

-- Photos: owner or admin can delete
CREATE POLICY "gallery_photos_delete" ON gallery_photos
  FOR DELETE USING (uploaded_by = auth.uid() OR is_admin());

-- Indexes
CREATE INDEX idx_gallery_albums_is_published ON gallery_albums(is_published);
CREATE INDEX idx_gallery_albums_event_id ON gallery_albums(event_id);
CREATE INDEX idx_gallery_photos_album_id ON gallery_photos(album_id);
CREATE INDEX idx_gallery_photos_uploaded_by ON gallery_photos(uploaded_by);
CREATE INDEX idx_gallery_photos_is_approved ON gallery_photos(is_approved);

-- Auto-update photo_count on album when photo is inserted/deleted
CREATE OR REPLACE FUNCTION update_album_photo_count()
RETURNS TRIGGER AS $$
BEGIN
  IF TG_OP = 'INSERT' THEN
    UPDATE gallery_albums
    SET photo_count = photo_count + 1
    WHERE id = NEW.album_id;
  ELSIF TG_OP = 'DELETE' THEN
    UPDATE gallery_albums
    SET photo_count = GREATEST(0, photo_count - 1)
    WHERE id = OLD.album_id;
  END IF;
  RETURN COALESCE(NEW, OLD);
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

CREATE TRIGGER on_gallery_photo_change
  AFTER INSERT OR DELETE ON gallery_photos
  FOR EACH ROW EXECUTE FUNCTION update_album_photo_count();
