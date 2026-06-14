import { Router } from 'express';

const router = Router();

router.get('/ready', (req, res) => {
  res.json({ ready: true });
});

export default router;
