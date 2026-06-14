CREATE TABLE card_prints (
  card_print_id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  set_code TEXT NOT NULL,
  set_name TEXT NOT NULL,
  card_number TEXT NOT NULL,
  name TEXT NOT NULL,
  supertype supertype NOT NULL,
  subtype subtype,
  rarity_tier rarity_tier NOT NULL,
  visual_variant visual_variant NOT NULL DEFAULT 'STANDARD',
  image_url TEXT,
  artist TEXT,
  release_date DATE,
  legalities JSONB,
  unique_hash TEXT NOT NULL,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  UNIQUE(set_code, card_number, rarity_tier, visual_variant)
);

CREATE INDEX idx_card_prints_hash ON card_prints(unique_hash);
CREATE INDEX idx_card_prints_rarity ON card_prints(rarity_tier);
