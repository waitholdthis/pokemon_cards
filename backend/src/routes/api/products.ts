import { Router } from 'express';
const router = Router();

const FALLBACK_PRODUCTS = [
  { id: 'p1', name: 'Salandit ex', set: 'Shrouded Fable', num: '075/64', price: 15.0, condition: 'Near Mint', image: 'https://images.pokemontcg.io/sv8/75.png' },
  { id: 'p2', name: 'Charizard ex', set: 'Prismatic Evolutions', num: '201/150', price: 24.5, condition: 'Near Mint', image: 'https://images.pokemontcg.io/sv8/201.png' },
  { id: 'p3', name: 'Pikachu', set: 'Base Set', num: '58/102', price: 120.0, condition: 'Near Mint', image: 'https://images.pokemontcg.io/base1/58.png' },
  { id: 'p4', name: 'Umbreon VMAX', set: 'Evolving Skies', num: '215/203', price: 340.0, condition: 'Near Mint', image: 'https://images.pokemontcg.io/sv8/215.png' },
  { id: 'p5', name: 'Giratina V', set: 'Lost Origin', num: '100/203', price: 28.75, condition: 'Near Mint', image: 'https://images.pokemontcg.io/swsh12pt5/100.png' },
  { id: 'p6', name: 'Mewtwo GX', set: 'Shining Legends', num: '63/73', price: 18.2, condition: 'Near Mint', image: 'https://images.pokemontcg.io/sm7/63.png' }
];

const FALLBACK_LATEST = [
  { id: 'l1', name: 'Mewtwo GX', set: 'Shining Legends', num: '63/73', price: 18.2, condition: 'Near Mint', image: 'https://images.pokemontcg.io/sm7/63.png' },
  { id: 'l2', name: 'Duraludon V', set: 'Silver Tempest', num: '138/203', price: 6.5, condition: 'Near Mint', image: 'https://images.pokemontcg.io/swsh12/138.png' },
  { id: 'l3', name: 'Lugia V', set: 'Silver Tempest', num: '219/203', price: 42.0, condition: 'Near Mint', image: 'https://images.pokemontcg.io/swsh12/219.png' },
  { id: 'l4', name: 'Galarian Zigzagoon', set: 'Rebel Clash', num: '117/192', price: 3.75, condition: 'Near Mint', image: 'https://images.pokemontcg.io/swsh4/117.png' }
];

router.get('/products', (req, res) => {
  res.json({ ok: true, source: 'fallback', items: FALLBACK_PRODUCTS });
});

router.get('/products/latest', (req, res) => {
  res.json({ ok: true, source: 'fallback', items: FALLBACK_LATEST });
});

router.get('/search', (req, res) => {
  const q = String(req.query.q || '').toLowerCase();
  if (!q) return res.json({ ok: true, items: [] });
  const pool = [...FALLBACK_PRODUCTS, ...FALLBACK_LATEST].filter((item) => {
    const text = `${item.name} ${item.set}`.toLowerCase();
    return text.includes(q);
  });
  res.json({ ok: true, source: 'fallback', items: pool });
});

export default router;
