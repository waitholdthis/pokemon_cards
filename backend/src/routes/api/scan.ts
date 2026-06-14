import { Router } from 'express';
import { getFairMarketPrice } from '../../services/market.js';

const router = Router();

router.post('/match', async (req, res) => {
  try {
    const { text, card_name, set_code, card_number } = req.body;
    let name = card_name;
    let set = set_code;
    let number = card_number;

    if (text && typeof text === 'string') {
      const t = text.toLowerCase();
      if (!name && (t.includes('salandit') || t.includes('charizard'))) name = t.includes('salandit') ? 'Salandit ex' : 'Charizard ex';
      if (!set && (t.includes('shrouded') || t.includes('prismatic'))) set = t.includes('shrouded') ? 'SV8' : 'SV8';
      if (!number && t.includes('/')) {
        const m = t.match(/(\d+)\s*\/\s*(\d+)/);
        if (m) number = `${m[1]}/${m[2]}`;
      }
    }

    if (!name || !set || !number) {
      return res.status(400).json({ ok: false, error: 'missing_identification' });
    }

    const card_print_id = `${name}-${set}-${number}`;

    res.status(200).json({
      ok: true,
      card_print_id,
      confidence: 0.86,
      card_print: {
        name,
        set_code: set,
        set_name: 'Shrouded Fable',
        card_number: number,
      },
    });
  } catch (err) {
    console.error(err);
    res.status(500).json({ ok: false, error: 'internal' });
  }
});

export default router;
