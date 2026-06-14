import { Router } from 'express';
import { addUserCard, getUserCards, createCardPrint, getSnapshotHistory } from '../services/cards.js';

const router = Router();

router.post('/cards', async (req, res) => {
  try {
    const { userId, cardPrintId, condition, quantity, purchasePriceCents } = req.body;
    if (!userId || !cardPrintId) return res.status(400).json({ error: 'missing_fields' });
    const card = await addUserCard(userId, cardPrintId, condition || 'NEAR_MINT', quantity || 1, purchasePriceCents || 0);
    return res.status(201).json(card);
  } catch (err) {
    console.error(err);
    return res.status(500).json({ error: 'internal' });
  }
});

router.get('/cards', async (req, res) => {
  try {
    const userId = req.query.userId as string;
    if (!userId) return res.status(400).json({ error: 'missing_userId' });
    const cards = await getUserCards(userId);
    res.json(cards);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'internal' });
  }
});

router.post('/cards/register', async (req, res) => {
  try {
    const entry = req.body;
    const card = await createCardPrint(entry);
    res.status(201).json(card);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'internal' });
  }
});

router.get('/cards/:cardPrintId/history', async (req, res) => {
  const history = await getSnapshotHistory(req.params.cardPrintId);
  res.json(history);
});

export default router;
