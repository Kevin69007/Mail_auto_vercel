/**
 * Middleware d'authentification pour vérifier la clé API
 */
export const authenticateApiKey = (req, res, next) => {
  const apiSecret = req.headers['x-api-secret'];
  const expectedSecret = process.env.API_SECRET_KEY;

  if (!expectedSecret) {
    console.error('[AUTH] API_SECRET_KEY non configurée dans les variables d\'environnement');
    return res.status(500).json({
      error: 'Configuration serveur invalide',
      timestamp: new Date().toISOString()
    });
  }

  if (!apiSecret || apiSecret !== expectedSecret) {
    const clientIp = req.headers['x-forwarded-for'] || req.socket.remoteAddress;
    console.warn(`[AUTH] Tentative d'accès non autorisée depuis ${clientIp} - Route: ${req.path}`);
    return res.status(403).json({
      error: 'Non autorisé',
      timestamp: new Date().toISOString()
    });
  }

  next();
};

