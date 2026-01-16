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
app.use(express.json({ limit: '10mb' }));
app.use(express.urlencoded({ extended: true, limit: '10mb' }));

// Middleware de gestion des erreurs de parsing JSON
app.use((err, req, res, next) => {
  if (err instanceof SyntaxError && err.status === 400 && 'body' in err) {
    console.error('[SERVER] Erreur de parsing JSON:', err.message);
    return res.status(400).json({
      error: 'JSON invalide',
      message: 'Le body de la requête doit être un JSON valide',
      details: err.message,
      timestamp: new Date().toISOString()
    });
  }
  next(err);
});

// Logging des requêtes
app.use((req, res, next) => {
  console.log(`${new Date().toISOString()} - ${req.method} ${req.path}`);
  if (req.method === 'POST' && req.body && Object.keys(req.body).length > 0) {
    console.log(`[REQUEST] Body keys:`, Object.keys(req.body));
  }
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
// En local, on écoute sur localhost, en production sur 0.0.0.0
const HOST = process.env.NODE_ENV === 'production' 
  ? (process.env.HOST || '0.0.0.0')
  : 'localhost';

const server = app.listen(PORT, HOST, () => {
  console.log(`🚀 Serveur démarré sur ${HOST}:${PORT}`);
  console.log(`📧 Environnement: ${process.env.NODE_ENV || 'development'}`);
  console.log(`🌐 Accessible sur: http://${HOST}:${PORT}`);
});

// Gestion des erreurs de connexion
server.on('error', (error) => {
  if (error.code === 'EADDRINUSE') {
    console.error(`❌ Le port ${PORT} est déjà utilisé`);
  } else {
    console.error('❌ Erreur du serveur:', error);
  }
  process.exit(1);
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

