import { Router } from 'express';
import { getFairMarketPrice } from '../../services/market.js';

const router = Router();

router.get('/cards/:cardPrintId/fair-price', async (req, res) => {
  try {
    const result = await getFairMarketPrice(req.params.cardPrintId);
    res.json({ ok: true, ...result });
  } catch (err) {
    console.error(err);
    res.status(500).json({ ok: false, error: 'internal' });
  }
});

export default router;
