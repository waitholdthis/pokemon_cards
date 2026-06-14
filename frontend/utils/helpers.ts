export const BACKEND_URL = process.env.EXPO_PUBLIC_BACKEND_URL ?? 'http://localhost:4000';

export const formatCents = (cents: number, currency = 'USD') => {
  return new Intl.NumberFormat('en-US', {
    style: 'currency',
    currency,
  }).format(cents / 100);
};

export const rarityRank = (tier: string) => {
  const order: Record<string, number> = {
    COMMON: 1,
    UNCOMMON: 2,
    RARE: 3,
    ILLUSTRATION_RARE: 4,
    ULTRA_RARE: 5,
    SECRET_RARE: 6,
  };
  return order[tier] ?? 99;
};
