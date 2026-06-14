import { Router } from 'express';

const router = Router();

router.post('/match', async (req, res) => {
  res.json({ ok: true, accepted: true });
});

export default router;
