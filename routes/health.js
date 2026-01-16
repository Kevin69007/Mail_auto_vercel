import express from 'express';

const router = express.Router();

/**
 * GET /api/health
 * Endpoint de vérification de santé du serveur
 */
router.get('/', (req, res) => {
  const health = {
    status: 'ok',
    timestamp: new Date().toISOString(),
    uptime: process.uptime(),
    environment: process.env.NODE_ENV || 'development',
    method: req.method,
    path: req.path,
  };

  return res.status(200).json(health);
});

export default router;

