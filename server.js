import express from 'express';
import cors from 'cors';
import dotenv from 'dotenv';
import healthRoutes from './routes/health.js';
import sendRidgeRoutes from './routes/send-ridge.js';
import sendJakRoutes from './routes/send-jak.js';
import sendCuspideRoutes from './routes/send-cuspide.js';
import sendKelajRoutes from './routes/send-kelaj.js';

// Charger les variables d'environnement
dotenv.config();

const app = express();
const PORT = process.env.PORT || 3000;

// Middleware
app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Logging des requêtes
app.use((req, res, next) => {
  console.log(`${new Date().toISOString()} - ${req.method} ${req.path}`);
  next();
});

// Routes
app.use('/api/health', healthRoutes);
app.use('/api/send-ridge', sendRidgeRoutes);
app.use('/api/send-jak', sendJakRoutes);
app.use('/api/send-cuspide', sendCuspideRoutes);
app.use('/api/send-kelaj', sendKelajRoutes);

// Route par défaut
app.get('/', (req, res) => {
  res.json({
    message: 'API Mailer Service',
    version: '1.0.0',
    endpoints: [
      '/api/health',
      '/api/send-ridge',
      '/api/send-jak',
      '/api/send-cuspide',
      '/api/send-kelaj'
    ]
  });
});

// Gestion des erreurs 404
app.use((req, res) => {
  res.status(404).json({
    error: 'Route non trouvée',
    path: req.path,
    method: req.method
  });
});

// Gestion des erreurs globales
app.use((err, req, res, next) => {
  console.error('Erreur non gérée:', err);
  res.status(500).json({
    error: 'Erreur interne du serveur',
    message: err.message,
    timestamp: new Date().toISOString()
  });
});

// Démarrer le serveur
// Railway/Vercel nécessite d'écouter sur 0.0.0.0, pas seulement localhost
const HOST = process.env.HOST || '0.0.0.0';

app.listen(PORT, HOST, () => {
  console.log(`🚀 Serveur démarré sur ${HOST}:${PORT}`);
  console.log(`📧 Environnement: ${process.env.NODE_ENV || 'development'}`);
  console.log(`🌐 Accessible sur: http://${HOST}:${PORT}`);
});

// Gestion des erreurs de démarrage
process.on('uncaughtException', (error) => {
  console.error('Erreur non capturée:', error);
  process.exit(1);
});

process.on('unhandledRejection', (reason, promise) => {
  console.error('Promesse rejetée non gérée:', reason);
  process.exit(1);
});

