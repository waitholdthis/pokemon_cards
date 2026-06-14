CREATE TABLE scan_sessions (
  scan_session_id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  user_id UUID REFERENCES users(user_id) ON DELETE CASCADE,
  image_path TEXT NOT NULL,
  detected_set_code TEXT,
  detected_card_number TEXT,
  matched_card_print_id UUID REFERENCES card_prints(card_print_id),
  confidence DOUBLE PRECISION,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now()
);
CREATE INDEX idx_scan_sessions_user ON scan_sessions(user_id, created_at DESC);

CREATE TABLE watchlists (
  watchlist_id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  user_id UUID NOT NULL REFERENCES users(user_id) ON DELETE CASCADE,
  card_print_id UUID NOT NULL REFERENCES card_prints(card_print_id) ON DELETE CASCADE,
  target_price_cents NUMERIC(12,2),
  alert_on_drop BOOLEAN NOT NULL DEFAULT TRUE,
  alert_on_rise BOOLEAN NOT NULL DEFAULT FALSE,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  UNIQUE(user_id, card_print_id)
);
