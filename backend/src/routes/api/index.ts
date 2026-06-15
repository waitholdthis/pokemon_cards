import { Router } from 'express';
import scanRouter from './scan.ts';
import cardsRouter from './cards.ts';
import productsRouter from './products.ts';
import marketRouter from './market.ts';

const router = Router();

router.use('/scan', scanRouter);
router.use('/cards', cardsRouter);
router.use('/products', productsRouter);

router.use('/cards/:cardPrintId', marketRouter);

router.get('/', (req, res) => {
  res.json({ ok: true });
});

export default router;
