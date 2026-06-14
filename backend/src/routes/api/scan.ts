import { Router } from 'express';

const router = Router();

router.post('/match', (req, res) => {
  res.json({ ok: true, accepted: true });
});

export default router;
