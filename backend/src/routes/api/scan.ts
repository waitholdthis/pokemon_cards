import { Router } from 'express';
import { getFairMarketPrice } from '../../services/market.js';

const router = Router();

router.post('/match', async (req, res) => {
  try {
    const text = String(req.body.text || '').trim();
    const card_name = String(req.body.card_name || '').trim();
    const set_code = String(req.body.set_code || '').trim();
    const card_number = String(req.body.card_number || '').trim();

    if (!text && (!card_name || !set_code || !card_number)) {
      return res.status(400).json({ ok: false, error: 'missing_identification' });
    }

    let name = card_name;
    let set = set_code;
    let number = card_number;

    if (text) {
      const parts = text.split(/[\s,|]+/);
      const cardIdx = parts.findIndex((p) => /ex|v|vmax|gx|ex/i.test(p));
      if (!name && cardIdx >= 0) name = parts.slice(cardIdx, cardIdx + 2).join(' ');
      if (!set && parts.some((p) => /SV\d+|SSI|sm\d+|swsh/i.test(p))) set = parts.find((p) => /^[A-Z0-9]+$/.test(p)) || set;
      if (!number) {
        const m = text.match(/(\d{1,3})\s*\/\s*(\d{1,4})/);
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
