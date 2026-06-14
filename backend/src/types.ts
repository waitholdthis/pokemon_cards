export type Supertype = 'POKEMON' | 'TRAINER' | 'ENERGY';
export type RarityTier = 'COMMON' | 'UNCOMMON' | 'RARE' | 'ILLUSTRATION_RARE' | 'ULTRA_RARE' | 'SECRET_RARE';
export type VisualVariant = 'STANDARD' | 'REVERSE_HOLO' | 'PROMO' | 'ALTERNATE_ART' | 'RAINBOW_RARE';
export type CardCondition = 'MINT' | 'NEAR_MINT' | 'LIGHTLY_PLAYED' | 'PLAYED' | 'HEAVILY_PLAYED' | 'DAMAGED';

export interface CardPrint {
  card_print_id: string;
  name: string;
  set_code: string;
  set_name: string;
  card_number: string;
  supertype: Supertype;
  rarity_tier: RarityTier;
  visual_variant: VisualVariant;
}

export interface PriceSnapshot {
  market_price_cents: number;
  mid_price_cents: number;
  fetched_at: string;
}

export interface UserCard {
  user_card_id: string;
  card_print: CardPrint;
  condition: CardCondition;
  quantity: number;
  purchase_price_cents: number;
}
