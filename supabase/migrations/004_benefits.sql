-- 004_benefits.sql
-- Benefits system: discount cards, partner offers, member perks

-- Benefits table (admin-created offers)
CREATE TABLE benefits (
  id uuid DEFAULT gen_random_uuid() PRIMARY KEY,
  title text NOT NULL,
  title_en text,
  description text,
  description_en text,
  category text NOT NULL DEFAULT 'other',
  -- e.g. 'discount', 'service', 'event', 'travel', 'food', 'other'
  partner_name text NOT NULL,
  partner_logo_url text,
  discount_text text,
  -- Human-readable discount, e.g. "20% off", "Free delivery"
  terms text,
  terms_en text,
  redemption_code text,
  -- Static code shown on redeem (if any)
  redemption_url text,
  -- Link to partner site (if any)
  is_active boolean DEFAULT true NOT NULL,
  valid_from timestamptz DEFAULT now() NOT NULL,
  valid_until timestamptz,
  -- NULL means no expiry
  max_redemptions integer,
  -- NULL means unlimited
  redemption_count integer DEFAULT 0 NOT NULL,
  requires_verified_member boolean DEFAULT true NOT NULL,
  created_by uuid REFERENCES profiles(id) ON DELETE SET NULL,
  created_at timestamptz DEFAULT now() NOT NULL,
  updated_at timestamptz DEFAULT now() NOT NULL
);

-- Benefit redemptions (tracks who redeemed what)
CREATE TABLE benefit_redemptions (
  id uuid DEFAULT gen_random_uuid() PRIMARY KEY,
  benefit_id uuid REFERENCES benefits(id) ON DELETE CASCADE NOT NULL,
  user_id uuid REFERENCES profiles(id) ON DELETE CASCADE NOT NULL,
  redeemed_at timestamptz DEFAULT now() NOT NULL,
  verification_code text UNIQUE DEFAULT (
    upper(substring(replace(gen_random_uuid()::text, '-', '') for 8))
  ) NOT NULL,
  -- Unique code per redemption for partner verification
  verified_at timestamptz,
  -- Set when admin scans/verifies
  UNIQUE (benefit_id, user_id)
  -- One redemption per user per benefit
);

-- Updated_at triggers
CREATE TRIGGER update_benefits_updated_at
  BEFORE UPDATE ON benefits
  FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

-- RLS
ALTER TABLE benefits ENABLE ROW LEVEL SECURITY;
ALTER TABLE benefit_redemptions ENABLE ROW LEVEL SECURITY;

-- Benefits: any authenticated member can read active benefits
CREATE POLICY "benefits_select" ON benefits
  FOR SELECT USING (
    auth.uid() IS NOT NULL AND (
      is_active = true
      OR is_admin()
    )
  );

-- Benefits: only admins can create
CREATE POLICY "benefits_insert" ON benefits
  FOR INSERT WITH CHECK (is_admin());

-- Benefits: only admins can update
CREATE POLICY "benefits_update" ON benefits
  FOR UPDATE USING (is_admin());

-- Benefits: only admins can delete
CREATE POLICY "benefits_delete" ON benefits
  FOR DELETE USING (is_admin());

-- Redemptions: users see their own, admins see all
CREATE POLICY "benefit_redemptions_select" ON benefit_redemptions
  FOR SELECT USING (auth.uid() = user_id OR is_admin());

-- Redemptions: verified members can redeem
CREATE POLICY "benefit_redemptions_insert" ON benefit_redemptions
  FOR INSERT WITH CHECK (
    auth.uid() = user_id AND is_verified_member()
  );

-- Redemptions: only admins can update (for verification)
CREATE POLICY "benefit_redemptions_update" ON benefit_redemptions
  FOR UPDATE USING (is_admin());

-- Redemptions: no deletion (audit trail)
-- (no DELETE policy — effectively prevents deletes by non-superusers)

-- Indexes
CREATE INDEX idx_benefits_category ON benefits(category);
CREATE INDEX idx_benefits_is_active ON benefits(is_active);
CREATE INDEX idx_benefits_valid_until ON benefits(valid_until);
CREATE INDEX idx_benefit_redemptions_benefit_id ON benefit_redemptions(benefit_id);
CREATE INDEX idx_benefit_redemptions_user_id ON benefit_redemptions(user_id);
CREATE INDEX idx_benefit_redemptions_verification_code ON benefit_redemptions(verification_code);

-- Auto-increment redemption_count on new redemption
CREATE OR REPLACE FUNCTION increment_benefit_redemption_count()
RETURNS TRIGGER AS $$
BEGIN
  UPDATE benefits
  SET redemption_count = redemption_count + 1
  WHERE id = NEW.benefit_id;
  RETURN NEW;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

CREATE TRIGGER on_benefit_redeemed
  AFTER INSERT ON benefit_redemptions
  FOR EACH ROW EXECUTE FUNCTION increment_benefit_redemption_count();
