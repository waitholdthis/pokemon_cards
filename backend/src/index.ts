import express from 'express';
import cors from 'cors';
import healthRouter from './routes/health.ts';
import apiRouter from './routes/api/index.ts';
import scanRouter from './routes/api/scan.ts';

const app = express();
const PORT = process.env.PORT ? Number(process.env.PORT) : 4000;

app.use(cors());
app.use(express.json({ limit: '1mb' }));
app.use('/health', healthRouter);
app.use('/api', apiRouter);
app.use('/api/scan', scanRouter);

app.get('/', (req, res) => {
  res.json({ ok: true, service: 'pokemon-cards-backend', time: new Date().toISOString() });
});

app.listen(PORT, () => {
  console.log(`Backend listening on :${PORT}`);
});
