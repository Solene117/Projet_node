import dotenv from 'dotenv';
dotenv.config();

import app from './app';
import connectDB from './config/db';

const PORT = process.env.PORT || 3033;

// Vérification de MONGO_URI avant de continuer
if (!process.env.MONGO_URI) {
  console.error('❌ MONGO_URI non défini dans le fichier .env');
  process.exit(1);
}

// Connexion à la base de données
connectDB().then(() => {
  app.listen(PORT, () => {
    console.log(`🚀 Serveur lancé sur http://localhost:${PORT}`);
  });
});
