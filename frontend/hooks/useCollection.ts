import { create } from 'zustand';
import { persist } from 'zustand/middleware';

export type CardCondition = 'MINT' | 'NEAR_MINT' | 'LIGHTLY_PLAYED' | 'PLAYED' | 'HEAVILY_PLAYED' | 'DAMAGED';
export type RarityTier = 'COMMON' | 'UNCOMMON' | 'RARE' | 'ILLUSTRATION_RARE' | 'ULTRA_RARE' | 'SECRET_RARE';

export interface CardPrint {
  card_print_id: string;
  name: string;
  set_code: string;
  set_name: string;
  card_number: string;
  supertype: 'POKEMON' | 'TRAINER' | 'ENERGY';
  subtype?: string;
  rarity_tier: RarityTier;
  visual_variant: string;
  image_url?: string;
}

export interface UserCard {
  user_card_id: string;
  card_print: CardPrint;
  condition: CardCondition;
  quantity: number;
  purchase_price_cents: number;
}

export interface CollectionState {
  cards: UserCard[];
  addCard: (card: Omit<UserCard, 'user_card_id'>) => void;
  removeCard: (user_card_id: string) => void;
  totalValueCents: () => number;
}

export const useCollection = create<CollectionState>()(
  persist(
    (set, get) => ({
      cards: [],
      addCard: (entry) =>
        set((state) => ({
          cards: [...state.cards, { ...entry, user_card_id: crypto.randomUUID() }],
        })),
      removeCard: (id) =>
        set((state) => ({
          cards: state.cards.filter((c) => c.user_card_id !== id),
        })),
      totalValueCents: () =>
        get().cards.reduce(
          (acc, c) => acc + (c.purchase_price_cents || 0) * c.quantity,
          0
        ),
    }),
    {
      name: 'collection',
    }
  )
);
