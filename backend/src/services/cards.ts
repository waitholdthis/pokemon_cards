import { query } from '../db.js';
import { upsertPriceSnapshot } from './pricing.js';

export async function getCardByPrintId(cardPrintId: string) {
  const rows = await query<any>(
    `SELECT * FROM card_prints WHERE card_print_id = $1 LIMIT 1`,
    [cardPrintId],
  );
  return rows[0] || null;
}

export async function createCardPrint(entry: any) {
  const rows = await query<any>(
    `INSERT INTO card_prints
       (set_code, set_name, card_number, name, supertype, subtype, rarity_tier, visual_variant, unique_hash)
     VALUES ($1,$2,$3,$4,$5,$6,$7,$8,$9)
     RETURNING *`,
    [
      entry.set_code,
      entry.set_name,
      entry.card_number,
      entry.name,
      entry.supertype,
      entry.subtype,
      entry.rarity_tier,
      entry.visual_variant,
      `${entry.set_code}_${entry.card_number}_${entry.rarity_tier}_${entry.visual_variant}`,
    ],
  );
  return rows[0];
}

export async function addUserCard(userId: string, cardPrintId: string, condition: string, quantity: number, purchasePriceCents: number) {
  const rows = await query<any>(
    `INSERT INTO user_cards
       (user_id, card_print_id, condition, quantity, purchase_price_cents)
     VALUES ($1,$2,$3,$4,$5)
     RETURNING *`,
    [userId, cardPrintId, condition, quantity, purchasePriceCents],
  );
  await upsertPriceSnapshot(cardPrintId);
  return rows[0];
}

export async function getUserCards(userId: string) {
  const rows = await query<any>(
    `SELECT
       uc.*,
       cp.*,
       p.market_price_cents,
       p.fetched_at
     FROM user_cards uc
     JOIN card_prints cp USING (card_print_id)
     LEFT JOIN LATERAL (
       SELECT market_price_cents, fetched_at
       FROM price_snapshots
       WHERE card_print_id = cp.card_print_id
       ORDER BY fetched_at DESC
       LIMIT 1
     ) p ON true
     WHERE uc.user_id = $1`,
    [userId],
  );
  return rows;
}

export async function getSnapshotHistory(cardPrintId: string) {
  const rows = await query<any>(
    `SELECT * FROM price_snapshots
     WHERE card_print_id = $1
     ORDER BY fetched_at ASC`,
    [cardPrintId],
  );
  return rows;
}
