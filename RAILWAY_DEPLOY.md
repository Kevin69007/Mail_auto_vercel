# Guide de déploiement sur Railway

## 🚀 Configuration pour Railway

### 1. Variables d'environnement requises

Configurez toutes ces variables dans Railway (Settings → Variables) :

#### Configuration serveur
```
PORT=3000
NODE_ENV=production
HOST=0.0.0.0
API_SECRET_KEY=votre_cle_secrete_ici
```

#### Configuration SMTP RIDGE
```
RIDGE_SMTP_HOST=smtp.example.com
RIDGE_SMTP_PORT=465
RIDGE_SMTP_USER=votre_utilisateur
RIDGE_SMTP_PASSWORD=votre_mot_de_passe
RIDGE_FROM_NAME=Nom Expéditeur
RIDGE_FROM_EMAIL=ridge@example.com
```

#### Configuration SMTP JAK
```
JAK_SMTP_HOST=smtp.example.com
JAK_SMTP_PORT=465
JAK_SMTP_USER=votre_utilisateur
JAK_SMTP_PASSWORD=votre_mot_de_passe
JAK_FROM_NAME=Nom Expéditeur
JAK_FROM_EMAIL=jak@example.com
```

#### Configuration SMTP CUSPIDE
```
CUSPIDE_SMTP_HOST=smtp.example.com
CUSPIDE_SMTP_PORT=465
CUSPIDE_SMTP_USER=votre_utilisateur
CUSPIDE_SMTP_PASSWORD=votre_mot_de_passe
CUSPIDE_FROM_NAME=Nom Expéditeur
CUSPIDE_FROM_EMAIL=cuspide@example.com
```

#### Configuration SMTP KELAJ
```
KELAJ_SMTP_HOST=smtp.example.com
KELAJ_SMTP_PORT=465
KELAJ_SMTP_USER=votre_utilisateur
KELAJ_SMTP_PASSWORD=votre_mot_de_passe
KELAJ_FROM_NAME=Nom Expéditeur
KELAJ_FROM_EMAIL=kelaj@example.com
```

### 2. Script de démarrage

Le fichier `package.json` contient déjà le script `start` :
```json
"start": "node server.js"
```

Railway utilisera automatiquement ce script.

### 3. Port et Host

Le serveur est configuré pour :
- Écouter sur `0.0.0.0` (nécessaire pour Railway)
- Utiliser le port défini par Railway via `process.env.PORT`

### 4. Déploiement

1. **Connectez votre repository GitHub** à Railway
2. **Configurez les variables d'environnement** (voir section 1)
3. **Déployez** - Railway détectera automatiquement Node.js et utilisera `npm start`

### 5. Vérification du déploiement

Une fois déployé, testez avec :

```bash
# Health check
curl https://votre-app.railway.app/api/health

# Test d'envoi (remplacez par votre URL et clé)
curl -X POST https://votre-app.railway.app/api/send-ridge \
  -H "x-api-secret: votre_cle_secrete" \
  -H "Content-Type: application/json" \
  -d '{
    "to": "test@example.com",
    "from": "sender@example.com",
    "subject": "Test",
    "messageId": "<test@example.com>"
  }'
```

## 🔍 Dépannage

### Erreur 502 "Connection Refused"

**Causes possibles :**
1. Le serveur n'écoute pas sur `0.0.0.0` (corrigé dans `server.js`)
2. Le port n'est pas correctement configuré
3. Le serveur crash au démarrage

**Solutions :**
1. Vérifiez les logs Railway (Deployments → View Logs)
2. Vérifiez que toutes les variables d'environnement sont configurées
3. Vérifiez que le script `start` est correct dans `package.json`

### Erreur 405 "Method Not Allowed"

Si vous recevez une requête GET sur un endpoint POST, vous obtiendrez maintenant une erreur 405 claire au lieu de 502.

**Solution :** Utilisez POST pour les endpoints d'envoi d'emails.

### Le serveur ne démarre pas

**Vérifiez :**
1. Les logs Railway pour voir les erreurs
2. Que toutes les dépendances sont dans `package.json`
3. Que Node.js est correctement détecté (Railway le fait automatiquement)

## 📝 Notes importantes

- Railway définit automatiquement `PORT` - ne le définissez pas manuellement
- Le serveur écoute maintenant sur `0.0.0.0` pour accepter les connexions externes
- Les erreurs de démarrage sont maintenant mieux gérées avec `uncaughtException` et `unhandledRejection`
- Les requêtes GET sur les endpoints POST retournent maintenant 405 au lieu de 502

## 🔐 Sécurité

- Ne partagez jamais vos clés API publiquement
- Utilisez des clés différentes pour développement et production
- Railway chiffre automatiquement les variables d'environnement

