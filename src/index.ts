import express from 'express';
import { config } from './config';
// import { requestLogger } from './middlewares/requestLogger';

const app = express();

app.use(express.json());
// app.use(requestLogger);

app.listen(config.port, () => {
  console.log(`🚀 Server running on port ${config.port}`);
});

export default app;