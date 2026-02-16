-- Supabase SQL: create the trust_signals table
-- Run this in your Supabase SQL Editor (https://supabase.com/dashboard/project/_/sql)

CREATE TABLE IF NOT EXISTS trust_signals (
  id BIGSERIAL PRIMARY KEY,
  token_id INTEGER NOT NULL,
  signer_address TEXT NOT NULL,
  signature TEXT NOT NULL,
  message TEXT NOT NULL,
  created_at TIMESTAMPTZ DEFAULT now(),
  UNIQUE (token_id, signer_address)
);

-- Index for fast per-article lookups
CREATE INDEX IF NOT EXISTS idx_trust_signals_token_id ON trust_signals (token_id);

-- Enable Row Level Security (optional, since we use service role key server-side)
ALTER TABLE trust_signals ENABLE ROW LEVEL SECURITY;

-- Allow the service role full access (already has it by default)
-- Public read access if you want client-side reads later:
-- CREATE POLICY "Public read" ON trust_signals FOR SELECT USING (true);
