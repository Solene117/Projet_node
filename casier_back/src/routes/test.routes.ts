// src/routes/test.routes.ts

import { Router, Request, Response } from 'express';
import mongoose from 'mongoose';

const router = Router();

router.get('/db-status', (_req: Request, res: Response) => {
  const status = ['🔴 Déconnecté', '🟢 Connecté', '🟡 Connexion en cours', '🟠 Déconnexion en cours'];
  res.json({ mongoStatus: status[mongoose.connection.readyState] });
});

export default router;
