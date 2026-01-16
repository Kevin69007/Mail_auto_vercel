# API Mailer Service

Service d'envoi d'emails automatisé utilisant Node.js et Express.

## 🚀 Démarrage rapide

### Installation

```bash
npm install
```

### Configuration

Créez un fichier `.env` à la racine du projet avec les variables suivantes :

```env
# Configuration serveur
PORT=3000
NODE_ENV=production
API_SECRET_KEY=votre_cle_secrete

# Configuration SMTP RIDGE
RIDGE_SMTP_HOST=smtp.example.com
RIDGE_SMTP_PORT=465
RIDGE_SMTP_USER=votre_utilisateur
RIDGE_SMTP_PASSWORD=votre_mot_de_passe
RIDGE_FROM_NAME=Nom Expéditeur
RIDGE_FROM_EMAIL=email@example.com

# Configuration SMTP JAK
JAK_SMTP_HOST=smtp.example.com
JAK_SMTP_PORT=465
JAK_SMTP_USER=votre_utilisateur
JAK_SMTP_PASSWORD=votre_mot_de_passe
JAK_FROM_NAME=Nom Expéditeur
JAK_FROM_EMAIL=email@example.com

# Configuration SMTP CUSPIDE
CUSPIDE_SMTP_HOST=smtp.example.com
CUSPIDE_SMTP_PORT=465
CUSPIDE_SMTP_USER=votre_utilisateur
CUSPIDE_SMTP_PASSWORD=votre_mot_de_passe
CUSPIDE_FROM_NAME=Nom Expéditeur
CUSPIDE_FROM_EMAIL=email@example.com

# Configuration SMTP KELAJ
KELAJ_SMTP_HOST=smtp.example.com
KELAJ_SMTP_PORT=465
KELAJ_SMTP_USER=votre_utilisateur
KELAJ_SMTP_PASSWORD=votre_mot_de_passe
KELAJ_FROM_NAME=Nom Expéditeur
KELAJ_FROM_EMAIL=email@example.com
```

### Démarrage

**Mode développement :**
```bash
npm run dev
```

**Mode production :**
```bash
npm start
```

Le serveur démarre sur `http://localhost:3000` par défaut.

## 📡 Endpoints API

### Health Check
```
GET /api/health
```
Vérifie l'état du serveur.

### Envoi d'emails

Tous les endpoints d'envoi d'emails nécessitent :
- **Méthode** : `POST`
- **Header** : `x-api-secret` avec votre clé API
- **Body JSON** :
  ```json
  {
    "to": "destinataire@example.com",
    "from": "expediteur@example.com",
    "subject": "Sujet de l'email",
    "messageId": "message-id-original",
    "body": "Contenu de l'email (optionnel)"
  }
  ```

#### Endpoints disponibles :

- `POST /api/send-ridge` - Envoi via service RIDGE
- `POST /api/send-jak` - Envoi via service JAK
- `POST /api/send-cuspide` - Envoi via service CUSPIDE
- `POST /api/send-kelaj` - Envoi via service KELAJ

## 📁 Structure du projet

```
.
├── server.js              # Point d'entrée de l'application
├── middleware/
│   └── auth.js           # Middleware d'authentification
├── routes/
│   ├── health.js         # Route de health check
│   ├── send-ridge.js     # Route d'envoi RIDGE
│   ├── send-jak.js       # Route d'envoi JAK
│   ├── send-cuspide.js   # Route d'envoi CUSPIDE
│   └── send-kelaj.js     # Route d'envoi KELAJ
├── package.json
└── .env                  # Variables d'environnement (non versionné)
```

## 🔒 Sécurité

- Tous les endpoints d'envoi d'emails nécessitent une clé API via le header `x-api-secret`
- Les tentatives d'accès non autorisées sont loggées avec l'adresse IP
- Les variables d'environnement sensibles ne doivent jamais être commitées

## 🚢 Déploiement

### Railway / Vercel

1. Configurez les variables d'environnement dans votre plateforme de déploiement
2. Assurez-vous que le port est configuré via la variable `PORT` (Railway/Vercel le définit automatiquement)
3. Le script `start` sera utilisé automatiquement pour démarrer le serveur

## 📝 Logs

Le service enregistre :
- Toutes les requêtes entrantes
- Les tentatives d'accès non autorisées
- Les succès et erreurs d'envoi d'emails
- Les stack traces en cas d'erreur

## ⚠️ Notes

- Les notifications internes sont envoyées à `asathoud16@gmail.com` en cas de succès
- Les erreurs de notification n'empêchent pas l'envoi principal de l'email
- Le service utilise des modules ES6 (type: "module" dans package.json)
