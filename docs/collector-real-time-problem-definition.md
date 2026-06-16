# Pokémon Collector Real-Time Tracking Problem Definition + Solution

## Core Collector Pain Points

1. **Cross-source lookup tax**  
   Collectors manually check TCGPlayer, PokéTCG, eBay Sold, PriceCharting, and mercari for the same card, then average mentally. The number changes by source depends on whether it’s asking price vs sold price.

2. **Trust gap: asking vs sold**  
   Storefront prices are inflated; real market value comes from sold listings. Without sold listings, prices mislead buyers and sellers.

3. **Variant blindness**  
   Normal / Reverse Holo / Illustration Rare / Alternate Art / Promo / Secret Rare are visually distinct but only one digit or suffix changes the value by 10x-1000x. Most manual lookups miss this.

4. **Condition tax**  
   Near Mint vs Lightly Played vs Damaged is huge. Most quick lookups assume NM.

5. **Portfolio blindness**  
   Collectors know what they paid, but not what their stack is worth now, how concentrated their risk is, or which cards are volatile.

6. **Friction of capture**  
   OCR is bad on glare, edges, and non-English text. Users want typed fallback and image upload.

7. **Trust fragility**  
   No one shows methodology. A number without source breakdown or confidence is a suggestion, not a price.

---

## Proposed Solution Shape

The app becomes a **real-time fair-price oracle + portfolio tracker**:

- Canonical identity: every scan/manual entry resolves to one `card_print_id` tied to set + number + supertype + subtyping + visual variant.
- Multi-source engine: query TCGPlayer, PokéTCG, eBay Sold, PriceCharting in parallel, normalize all prices to cents.
- Condition-aware pricing: calibrate each source’s value to a baseline “Near Mint” equivalent, then discount/premium for the user’s actual condition.
- Sold listings first: weight compacted market values by sold history, not current listing.
- Portfolio engine: group by card + condition, persist purchase price, compute unrealized gain/loss, concentration, and volatility.
- Investor-grade surfaces: show methodology, confidence, source counts, and time-window deltas.

---

## What Users Actually Want

- “What’s this worth today, not what someone is asking?”
- “Am I holding too much of one set?”
- “Is this card trending up or down?”
- “How do I prove this value if I need a loan or insurance?”

---

## Backend Work

### Identity
- `POST /api/scan/match`  
  Input: text or image-url  
  Output: `card_print_id`, confidence, variant, matched source rules, ambiguity notes.

### Pricing
- `GET /api/cards/:cardPrintId/fair-price`  
  Returns:
  - `fair_price_cents`
  - `confidence`
  - `trend_7d`, `trend_30d`
  - `breakdown` with source-specific market/low/mid/high/count/sold-vs-listing flag
  - `condition_adjusted_price_cents` tied to the user’s selected condition

### Portfolio
- `GET /api/portfolio/:userId`  
  - total unrealized gain/loss
  - collection yield
  - top movers
  - concentration metrics
  - volatility score per card

### Persistence
- Snapshot price history per `card_print_id` every N minutes/hours, plus on-demand fetch.

---

## Frontend Surfaces

1. **Scan / Identify**
   - Camera
   - Paste text
   - Gallery upload
   - Match confidence UI
   - Manual fallback search + autocomplete

2. **Card Details**
   - Real image + variant badge
   - Condition selector
   - Fair price hero
   - Sold-vs-Listing delta callout
   - Source breakdown table
   - Trend chart 7d/30d/90d/1y
   - Add to Collection / Watchlist

3. **Collection**
   - Current value, cost basis, unrealized P/L
   - Sort/filter by set, rarity, condition, volatility
   - Drill-down to price history per card

4. **Watchlist**
   - Price change alerts
   - Threshold triggers

5. **Settings / Data Source Health**
   - Show which sources are live, cached, or stale
   - Last updated timestamps
   - Auto-refresh cadence

---

## Why This Is Different

- It doesn’t show one storefront’s ask price.
- It doesn’t hide where the number came from.
- It doesn’t let you own cards as text rows; it shows portfolio-level investment metrics collectors actually use for insurance, loans, and flipping decisions.

---

## Implementation Order

1. Confirm scan route resolves text cleanly
2. Confirm fair-price route responds with data
3. Add eBay Sold + PriceCharting adapters
4. Persist snapshots for trend history
5. Wire frontend details screen to real backend
6. Add collection metrics endpoints
7. Add collection screen UI
8. Add watchlist + alerts
9. Add condition-aware calculator into pricing engine
10. Add storefront-vs-sold flag on cards UI
