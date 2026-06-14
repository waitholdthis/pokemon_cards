import React from 'react';
import { useCollection } from '../hooks/useCollection';
import { formatCents } from '../utils/helpers';

export default function App() {
  const { cards, addCard, removeCard, totalValueCents } = useCollection();

  return (
    <div style={{ minHeight: '100vh', background: '#0b1220', color: '#e5e7eb', fontFamily: 'sans-serif', padding: 16 }}>
      <h1 style={{ fontSize: 24, fontWeight: 700 }}>Pokemon TCG Collection</h1>
      <div style={{ fontSize: 32 }}>{formatCents(totalValueCents())}</div>
      <div style={{ marginTop: 12, display: 'flex', gap: 8 }}>
        <button
          onClick={() =>
            addCard({
              card_print: {
                card_print_id: crypto.randomUUID(),
                name: 'Salandit ex',
                set_code: 'SV8',
                set_name: 'Shrouded Fable',
                card_number: '075/64',
                supertype: 'POKEMON',
                rarity_tier: 'SECRET_RARE',
                visual_variant: 'ALTERNATE_ART',
              },
              condition: 'NEAR_MINT',
              quantity: 1,
              purchase_price_cents: 1500,
            })
          }
          style={{ padding: '8px 12px', background: '#16a34a', color: '#fff', border: 'none', borderRadius: 8 }}
        >
          Add sample card
        </button>
      </div>
      <div style={{ marginTop: 16 }}>
        {cards.length === 0 ? (
          <p>No cards yet.</p>
        ) : (
          <ul style={{ display: 'grid', gap: 8 }}>
            {cards.map((c) => (
              <li key={c.user_card_id} style={{ padding: 12, background: '#111827', borderRadius: 8 }}>
                <div style={{ fontWeight: 600 }}>{c.card_print.name}</div>
                <div style={{ color: '#9ca3af' }}>
                  {c.card_print.set_code} • {c.condition}
                </div>
                <div>{formatCents((c.purchase_price_cents || 0) * c.quantity)}</div>
                <button
                  onClick={() => removeCard(c.user_card_id)}
                  style={{ marginTop: 8, background: '#dc2626', color: '#fff', border: 'none', borderRadius: 8, padding: '6px 10px' }}
                >
                  Remove
                </button>
              </li>
            ))}
          </ul>
        )}
      </div>
    </div>
  );
}
