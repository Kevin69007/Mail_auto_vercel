# Résolution de l'erreur ECONNRESET

## 🔍 Diagnostic

L'erreur `ECONNRESET` signifie que la connexion a été fermée de manière inattendue. Cela peut être causé par plusieurs facteurs.

## ✅ Corrections apportées

### 1. Gestion améliorée du parsing JSON
- Le serveur gère maintenant les erreurs de parsing JSON
- Messages d'erreur plus clairs si le body est invalide
- Validation du body avant traitement

### 2. Gestion des erreurs de connexion
- Détection des erreurs de connexion SMTP (`ECONNREFUSED`, `ETIMEDOUT`, `ENOTFOUND`)
- Messages d'erreur spécifiques pour chaque type d'erreur

### 3. Configuration du serveur
- Le serveur écoute sur `localhost` en développement (au lieu de `0.0.0.0`)
- Meilleure gestion des erreurs de démarrage
- Logs améliorés pour le débogage

## 🔧 Vérifications à faire

### 1. Vérifier que le serveur est démarré

```bash
# Démarrer le serveur
npm start
# ou
npm run dev
```

Vous devriez voir :
```
🚀 Serveur démarré sur localhost:3000
📧 Environnement: development
🌐 Accessible sur: http://localhost:3000
```

### 2. Vérifier le body de la requête dans Postman

**Important** : Le body ne doit pas être vide !

Dans Postman :
1. Allez dans l'onglet **Body**
2. Sélectionnez **raw**
3. Choisissez **JSON** dans le menu déroulant
4. Ajoutez un JSON valide :

```json
{
  "to": "test@example.com",
  "from": "sender@example.com",
  "subject": "Test Email",
  "messageId": "<test@example.com>",
  "body": "Contenu de l'email"
}
```

### 3. Vérifier les headers

Assurez-vous que ces headers sont présents :
- `x-api-secret` : Votre clé API
- `Content-Type` : `application/json`

### 4. Vérifier les variables d'environnement

Créez un fichier `.env` à la racine avec :

```env
API_SECRET_KEY=A7z9!Kp42*WxLvPc6QyB1jR8%ZnD3y1d
RIDGE_SMTP_HOST=smtp.example.com
RIDGE_SMTP_PORT=465
RIDGE_SMTP_USER=votre_utilisateur
RIDGE_SMTP_PASSWORD=votre_mot_de_passe
RIDGE_FROM_NAME=Nom Expéditeur
RIDGE_FROM_EMAIL=ridge@example.com
```

## 🧪 Test de la requête

### Avec cURL

```bash
curl -X POST http://localhost:3000/api/send-ridge \
  -H "x-api-secret: A7z9!Kp42*WxLvPc6QyB1jR8%ZnD3y1d" \
  -H "Content-Type: application/json" \
  -d '{
    "to": "test@example.com",
    "from": "sender@example.com",
    "subject": "Test",
    "messageId": "<test@example.com>",
    "body": "Test body"
  }'
```

### Avec Postman

1. **Method** : `POST`
2. **URL** : `http://localhost:3000/api/send-ridge`
3. **Headers** :
   - `x-api-secret`: `A7z9!Kp42*WxLvPc6QyB1jR8%ZnD3y1d`
   - `Content-Type`: `application/json`
4. **Body** (raw JSON) :
   ```json
   {
     "to": "test@example.com",
     "from": "sender@example.com",
     "subject": "Test",
     "messageId": "<test@example.com>",
     "body": "Test body"
   }
   ```

## 📋 Checklist de dépannage

- [ ] Le serveur est démarré et accessible
- [ ] Le body de la requête n'est pas vide
- [ ] Le body est un JSON valide
- [ ] Le header `x-api-secret` est présent et correct
- [ ] Le header `Content-Type` est `application/json`
- [ ] Les variables d'environnement sont configurées dans `.env`
- [ ] Le fichier `.env` est à la racine du projet
- [ ] Le serveur a été redémarré après modification de `.env`

## 🔍 Messages d'erreur possibles

### "Body invalide"
**Cause** : Le body est vide ou n'est pas un objet JSON valide
**Solution** : Vérifiez que le body contient un JSON valide dans Postman

### "Champs manquants"
**Cause** : Les champs `from`, `subject`, ou `messageId` sont absents
**Solution** : Ajoutez tous les champs requis dans le body

### "Non autorisé"
**Cause** : La clé API est incorrecte ou manquante
**Solution** : Vérifiez le header `x-api-secret`

### "Erreur de connexion SMTP"
**Cause** : Le serveur SMTP n'est pas accessible
**Solution** : Vérifiez les variables d'environnement SMTP

## 💡 Astuces

1. **Consultez les logs du serveur** pour voir les erreurs détaillées
2. **Testez d'abord avec le Health Check** : `GET http://localhost:3000/api/health`
3. **Utilisez Postman Console** (View → Show Postman Console) pour voir les détails de la requête
4. **Vérifiez que le port 3000 n'est pas utilisé** par un autre processus

## 🆘 Si le problème persiste

1. Vérifiez les logs du serveur dans le terminal
2. Vérifiez que toutes les dépendances sont installées : `npm install`
3. Vérifiez que Node.js est à jour : `node --version`
4. Essayez de redémarrer le serveur complètement

