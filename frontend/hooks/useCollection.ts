import { useState } from 'react';

export type CardCondition = 'MINT' | 'NEAR_MINT' | 'LIGHTLY_PLAYED' | 'PLAYED' | 'HEAVILY_PLAYED' | 'DAMAGED';
export type RarityTier = 'COMMON' | 'UNCOMMON' | 'RARE' | 'ILLUSTRATION_RARE' | 'ULTRA_RARE' | 'SECRET_RARE';

export interface CardSnapshot {
  market_price_cents: number;
  mid_price_cents: number;
  fetched_at: string;
}

export interface CardPrint {
  card_print_id: string;
  name: string;
  set_code: string;
  set_name: string;
  card_number: string;
  supertype: 'POKEMON' | 'TRAINER' | 'ENERGY';
  rarity_tier: RarityTier;
  visual_variant: string;
  image_url?: string;
  condition?: CardCondition;
  quantity?: number;
  purchase_price_cents?: number;
  snapshot?: CardSnapshot;
}

export interface CollectionState {
  cards: CardPrint[];
  addCard: (card: Omit<CardPrint, 'card_print_id'> & { card_print_id?: string }) => void;
  removeCard: (card_print_id: string) => void;
  totalValueCents: () => number;
}

export const useCollection = (): CollectionState => {
  const [cards, setCards] = useState<CardPrint[]>([]);

  const addCard = (entry: Omit<CardPrint, 'card_print_id'> & { card_print_id?: string }) => {
    setCards((prev) => [...prev, { ...entry, card_print_id: entry.card_print_id ?? crypto.randomUUID() } as CardPrint]);
  };

  const removeCard = (card_print_id: string) => {
    setCards((prev) => prev.filter((c) => c.card_print_id !== card_print_id));
  };

  const totalValueCents = () => cards.reduce((acc, c) => acc + (c.snapshot?.market_price_cents ?? 0) * (c.quantity ?? 1), 0);

  return { cards, addCard, removeCard, totalValueCents };
};
