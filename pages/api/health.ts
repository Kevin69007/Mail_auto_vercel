import type { NextApiRequest, NextApiResponse } from 'next';

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  // Permet toutes les méthodes pour le health check
  if (req.method === 'OPTIONS') {
    return res.status(200).end();
  }

  const health = {
    status: 'ok',
    timestamp: new Date().toISOString(),
    uptime: process.uptime(),
    environment: process.env.NODE_ENV || 'development',
    method: req.method,
    path: req.url,
  };

  return res.status(200).json(health);
}

