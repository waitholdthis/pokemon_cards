CREATE TABLE users (
  user_id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  email TEXT UNIQUE NOT NULL,
  display_name TEXT,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

CREATE TABLE user_cards (
  user_card_id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  user_id UUID NOT NULL REFERENCES users(user_id) ON DELETE CASCADE,
  card_print_id UUID NOT NULL REFERENCES card_prints(card_print_id) ON DELETE RESTRICT,
  condition card_condition NOT NULL DEFAULT 'NEAR_MINT',
  quantity INT NOT NULL CHECK (quantity >= 1),
  purchase_price_cents NUMERIC(12,2),
  purchase_date DATE,
  is_in_collection BOOLEAN NOT NULL DEFAULT TRUE,
  condition_notes TEXT,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  UNIQUE(user_id, card_print_id, condition, visual_variant)
);
CREATE INDEX idx_user_cards_user ON user_cards(user_id);
