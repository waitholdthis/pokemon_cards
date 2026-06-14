import axios from 'axios';
import { query } from '../db.js';

export interface TCGPlayerPrice {
  market: number;
  low: number;
  mid: number;
  high: number;
}

export async function fetchCardPrice(cardPrintId: string): Promise<TCGPlayerPrice | null> {
  const apiKey = process.env.TCGPLAYER_API_KEY;
  if (!apiKey) {
    return null;
  }

  const rows = await query<any>(
    `SELECT set_code, card_number FROM card_prints WHERE card_print_id = $1 LIMIT 1`,
    [cardPrintId]
  );
  const card = rows[0];

  const url = `https://example.tcgplayer.com/v1.38.0/catalog/product/${card.set_code}/${card.card_number}`;
  try {
    const { data } = await axios.get(url, {
      headers: { Authorization: `Bearer ${apiKey}` },
      timeout: 3000,
    });

    return {
      market: data?.marketPrice ?? null,
      low: data?.lowPrice ?? null,
      mid: data?.midPrice ?? null,
      high: data?.highPrice ?? null,
    } as any;
  } catch {
    return null;
  }
}

export async function upsertPriceSnapshot(cardPrintId: string): Promise<void> {
  const price = await fetchCardPrice(cardPrintId);
  if (!price) return;

  await query(
    `INSERT INTO price_snapshots
      (card_print_id, currency, market_price_cents, low_price_cents, mid_price_cents, high_price_cents, source, fetched_at)
    VALUES ($1, 'USD', $2, $3, $4, $5, 'TCGPLAYER', now())`,
    [cardPrintId, price.market, price.low, price.mid, price.high]
  );
}
