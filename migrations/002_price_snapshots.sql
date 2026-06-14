CREATE TABLE price_snapshots (
  price_snapshot_id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  card_print_id UUID NOT NULL REFERENCES card_prints(card_print_id) ON DELETE CASCADE,
  currency CHAR(3) NOT NULL DEFAULT 'USD',
  market_price_cents NUMERIC(12,2) NOT NULL,
  low_price_cents NUMERIC(12,2) NOT NULL,
  mid_price_cents NUMERIC(12,2) NOT NULL,
  high_price_cents NUMERIC(12,2) NOT NULL,
  source price_source NOT NULL DEFAULT 'TCGPLAYER',
  fetched_at TIMESTAMPTZ NOT NULL DEFAULT now()
);
CREATE INDEX idx_price_snapshots_card_lookup ON price_snapshots(card_print_id, fetched_at DESC);
