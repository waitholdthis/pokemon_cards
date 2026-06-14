import axios from 'axios';
import { query } from '../db.js';

export interface SourceBreakdown {
  source: string;
  market?: number;
  low?: number;
  mid?: number;
  high?: number;
  count?: number;
}

export interface FairPriceResult {
  fair_price_cents: number;
  confidence: number;
  sources: number;
  trend_7d_cents: number;
  trend_30d_cents: number;
  breakdown: SourceBreakdown[];
}

export async function queryPokemonTCGPrice(cardPrintId: string): Promise<SourceBreakdown | null> {
  const rows = await query<any>(`SELECT set_code, card_number FROM card_prints WHERE card_print_id = $1 LIMIT 1`, [cardPrintId]);
  const card = rows[0];
  if (!card) return null;

  try {
    const searchUrl = `https://api.pokemontcg.io/v2/cards?q=set.id:${card.set_code} number:${card.card_number}`;
    const { data } = await axios.get(searchUrl, {
      headers: { 'X-Api-Key': process.env.POKEMON_TCG_API_KEY || '' },
      timeout: 4000,
    });

    const cardData = data?.data?.[0];
    if (!cardData?.tcgplayer?.prices) return null;

    const prices: any = cardData.tcgplayer.prices;
    const market = prices.normal?.market ?? prices.holofoil?.market;

    return {
      source: 'pokemon_tcg_api',
      market: typeof market === 'number' ? Math.round(market * 100) : undefined,
      low: market ? Math.round((market * 0.9) * 100) : undefined,
      mid: market ? Math.round(market * 100) : undefined,
      high: market ? Math.round((market * 1.1) * 100) : undefined,
    };
  } catch {
    return null;
  }
}

export async function queryTCGPlayerSold(cardPrintId: string): Promise<SourceBreakdown | null> {
  const apiKey = process.env.TCGPLAYER_API_KEY;
  if (!apiKey) return null;

  const rows = await query<any>(`SELECT set_code, card_number FROM card_prints WHERE card_print_id = $1 LIMIT 1`, [cardPrintId]);
  const card = rows[0];
  if (!card) return null;

  try {
    const url = `https://example.tcgplayer.com/v1.38.0/catalog/product/${encodeURIComponent(card.set_code)}/${encodeURIComponent(card.card_number)}`;
    const { data } = await axios.get(url, {
      headers: { Authorization: `Bearer ${apiKey}` },
      timeout: 4000,
    });

    const market = data?.marketPrice;
    if (typeof market !== 'number') return null;

    return {
      source: 'tcgplayer',
      market: Math.round(market * 100),
      low: Math.round((data.lowPrice ?? market * 0.9) * 100),
      mid: Math.round((data.midPrice ?? market) * 100),
      high: Math.round((data.highPrice ?? market * 1.1) * 100),
    };
  } catch {
    return null;
  }
}

export async function queryRecentSnapshots(cardPrintId: string): Promise<{ cents7d: number; cents30d: number }> {
  const rows = await query<any>(
    `SELECT market_price_cents, fetched_at FROM price_snapshots WHERE card_print_id = $1 AND fetched_at >= now() - interval '30 days' ORDER BY fetched_at ASC`,
    [cardPrintId]
  );

  const now = Date.now();
  const day = 24 * 60 * 60 * 1000;
  const day7 = now - 7 * day;
  const day30 = now - 30 * day;

  const vals7: number[] = [];
  const vals30: number[] = [];

  for (const row of rows) {
    const t = new Date(row.fetched_at).getTime();
    const v = typeof row.market_price_cents === 'number' ? row.market_price_cents : Number(row.market_price_cents);
    if (Number.isFinite(v)) {
      vals30.push(v);
      if (t >= day7) vals7.push(v);
    }
  }

  const cents7d = vals7.length >= 2 ? Math.round((vals7[vals7.length - 1] - vals7[0]) / vals7.length) : 0;
  const cents30d = vals30.length >= 2 ? Math.round((vals30[vals30.length - 1] - vals30[0]) / vals30.length) : 0;

  return { cents7d, cents30d };
}

export async function getFairMarketPrice(cardPrintId: string): Promise<FairPriceResult> {
  const [pokemon, tcg] = await Promise.all([queryPokemonTCGPrice(cardPrintId), queryTCGPlayerSold(cardPrintId)]);

  const breakdown: SourceBreakdown[] = [];
  if (pokemon) breakdown.push(pokemon);
  if (tcg) breakdown.push(tcg);

  const marketValues = breakdown.map((b) => b.market).filter((v): v is number => typeof v === 'number');
  const fair_price_cents = marketValues.length ? Math.round(marketValues.reduce((sum, v) => sum + v, 0) / marketValues.length) : 0;

  const confidence = Math.min(1, breakdown.length * 0.35);

  const trend = await queryRecentSnapshots(cardPrintId);

  return {
    fair_price_cents,
    confidence,
    sources: breakdown.length,
    trend_7d_cents: trend.cents7d,
    trend_30d_cents: trend.cents30d,
    breakdown,
  };
}
