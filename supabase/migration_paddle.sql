-- =============================================
-- ProposalAI - Paddle Subscription Fields
-- Run this in Supabase SQL Editor
-- =============================================

-- Add Paddle subscription fields to profiles
ALTER TABLE profiles ADD COLUMN IF NOT EXISTS paddle_subscription_id TEXT;
ALTER TABLE profiles ADD COLUMN IF NOT EXISTS paddle_customer_id TEXT;

-- Add slug field to proposals if not exists (for public URLs)
ALTER TABLE proposals ADD COLUMN IF NOT EXISTS slug TEXT UNIQUE;

-- Create index for fast slug lookups
CREATE INDEX IF NOT EXISTS idx_proposals_slug ON proposals(slug);

-- Monthly reset function for proposals_this_month
-- This should run on the 1st of each month
CREATE OR REPLACE FUNCTION reset_monthly_proposals()
RETURNS void AS $$
BEGIN
  UPDATE profiles SET proposals_this_month = 0;
END;
$$ LANGUAGE plpgsql;

-- Schedule with pg_cron (if available in your Supabase plan)
-- SELECT cron.schedule('reset-monthly-proposals', '0 0 1 * *', 'SELECT reset_monthly_proposals()');
