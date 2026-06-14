# Real-Time Card Pricing Plan

## Goal
Let a user scan or enter a Pokémon card, identify it precisely, pull live market data from every available source, and return a fair market price plus clear price breakdown.

## User Flow
1. User opens app scan screen
2. Camera/OCR/upload identifies the card
3. App matches to canonical card print + variant + condition
4. Backend queries multiple price sources in parallel
5. UI shows:
   - Fair market price
   - Low / median / high
   - Recent sales confidence
   - Price trend (7d / 30d)
   - Source breakdown (TCGPlayer / Pokémon TCG API / sold listings)

## Backend

### 1. Card Identification
- Endpoint: `POST /api/scan/match`
- Input: image upload or text from OCR
- Logic:
  - Normalize text (card name, set, number)
  - Map to `card_prints` via `unique_hash`
  - If missing, call Pokémon TCG API set/card list to enrich
- Output: `card_print_id`, confidence, matched variant

### 2. Price Sources
Implement adapters for:
- `TCGPlayer API v2` (existing stub)
- `Pokémon TCG API` (public product catalog + prices)
- `eBay Sold Listings` (via Browse API or proxy)
- `PriceCharting` (if available)
Normalize to:
- `market_price_cents`
- `low_price_cents`
- `mid_price_cents`
- `high_price_cents`
- `source`
- `fetched_at`

### 3. Fair Price Algorithm
`/api/cards/:cardPrintId/fair-price` returns:
```json
{
  "fair_price_cents": 2500,
  "confidence": 0.82,
  "sources": 3,
  "trend_7d_cents": 120,
  "trend_30d_cents": -45,
  "breakdown": [
    { "source": "tcgplayer", "market": 2600, "low": 2200, "mid": 2500, "high": 3100 },
    { "source": "pokemon_tcg_api", "market": 2450 },
    { "source": "ebay_sold", "avg": 2480, "count": 12 }
  ]
}
```

## Frontend

### Scan Screen
- Camera capture / upload
- Loading + match confidence
- Direct jump to card details

### Card Details
- Card image + meta
- Fair price hero
- Price range chart (low/mid/high)
- 30-day mini chart
- Source table
- Add to collection + condition picker

### Collection Dashboard
- Total value
- Unrealized gain/loss
- Asset concentration
- Market volatility score

## Implementation Order
1. Fix backend route resolution + bad imports
2. Add `/api/scan/match` plus text OCR stub
3. Add Pokémon TCG API price adapter
4. Add eBay sold adapter (basic)
5. Add fair-price aggregation endpoint
6. Add frontend scan + details screens
7. Add chart (`recharts`) + condition filtering
8. Persist snapshots for history/trend
9. Add watchlist + alerts

## Runbook
- Backend: `cd backend && npm install && npm run dev`
- Frontend: `cd frontend && npm install --legacy-peer-deps && npx vite --port 8081`
- Env: set `TCGPLAYER_API_KEY`, `EBAY_CLIENT_ID`, `EBAY_CLIENT_SECRET`
