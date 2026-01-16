/**
 * Middleware d'authentification pour vérifier la clé API
 */
export const authenticateApiKey = (req, res, next) => {
  // Express normalise les headers en minuscules, donc on vérifie les deux cas
  const apiSecret = req.headers['x-api-secret'] || req.headers['X-Api-Secret'];
  const expectedSecret = process.env.API_SECRET_KEY;

  // Log pour débogage (en développement uniquement)
  if (process.env.NODE_ENV !== 'production') {
    console.log('[AUTH] Headers reçus:', Object.keys(req.headers).filter(h => h.toLowerCase().includes('api')));
    console.log('[AUTH] Header x-api-secret présent:', !!apiSecret);
  }

  if (!expectedSecret) {
    console.error('[AUTH] API_SECRET_KEY non configurée dans les variables d\'environnement');
    return res.status(500).json({
      error: 'Configuration serveur invalide',
      timestamp: new Date().toISOString()
    });
  }

  if (!apiSecret) {
    const clientIp = req.headers['x-forwarded-for'] || req.socket.remoteAddress;
    console.warn(`[AUTH] Header x-api-secret manquant - IP: ${clientIp} - Route: ${req.path}`);
    return res.status(403).json({
      error: 'Non autorisé',
      message: 'Header x-api-secret requis',
      timestamp: new Date().toISOString()
    });
  }

  if (apiSecret !== expectedSecret) {
    const clientIp = req.headers['x-forwarded-for'] || req.socket.remoteAddress;
    console.warn(`[AUTH] Clé API invalide - IP: ${clientIp} - Route: ${req.path}`);
    console.warn(`[AUTH] Clé reçue (premiers caractères): ${apiSecret.substring(0, 4)}...`);
    return res.status(403).json({
      error: 'Non autorisé',
      message: 'Clé API invalide',
      timestamp: new Date().toISOString()
    });
  }

  // Authentification réussie
  if (process.env.NODE_ENV !== 'production') {
    console.log('[AUTH] Authentification réussie');
  }

  next();
};

