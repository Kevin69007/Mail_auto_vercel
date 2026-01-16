# Guide de dépannage - Erreur "Non autorisé"

## 🔍 Diagnostic de l'erreur 403 "Non autorisé"

Si vous recevez cette erreur :
```json
{
    "error": "Non autorisé",
    "timestamp": "2026-01-16T11:32:27.206Z"
}
```

## ✅ Vérifications à effectuer

### 1. Vérifier que le header est envoyé

Le header `x-api-secret` doit être présent dans votre requête.

**Avec cURL :**
```bash
curl -X POST http://localhost:3000/api/send-ridge \
  -H "x-api-secret: votre_cle_secrete" \
  -H "Content-Type: application/json" \
  -d '{"to":"test@example.com","from":"sender@example.com","subject":"Test","messageId":"<test@example.com>"}'
```

**Avec Postman :**
1. Ouvrez votre requête
2. Allez dans l'onglet **Headers**
3. Vérifiez que `x-api-secret` est présent avec la bonne valeur
4. OU utilisez la variable `{{api_secret_key}}` de la collection

**Avec JavaScript/Fetch :**
```javascript
fetch('http://localhost:3000/api/send-ridge', {
  method: 'POST',
  headers: {
    'x-api-secret': 'votre_cle_secrete',
    'Content-Type': 'application/json'
  },
  body: JSON.stringify({
    to: 'test@example.com',
    from: 'sender@example.com',
    subject: 'Test',
    messageId: '<test@example.com>'
  })
});
```

### 2. Vérifier la variable d'environnement

Assurez-vous que `API_SECRET_KEY` est définie dans votre fichier `.env` :

```env
API_SECRET_KEY=votre_cle_secrete_ici
```

**Important :**
- La valeur dans `.env` doit correspondre exactement à celle envoyée dans le header
- Pas d'espaces avant ou après la valeur
- Pas de guillemets autour de la valeur

### 3. Vérifier que le serveur a bien chargé les variables

Après avoir modifié le fichier `.env`, **redémarrez le serveur** :

```bash
# Arrêtez le serveur (Ctrl+C)
# Puis redémarrez
npm start
# ou
npm run dev
```

### 4. Vérifier les logs du serveur

Le middleware affiche des messages de débogage en mode développement :

```
[AUTH] Header x-api-secret présent: true/false
[AUTH] Authentification réussie
```

Ou en cas d'erreur :
```
[AUTH] Header x-api-secret manquant - IP: ...
[AUTH] Clé API invalide - IP: ...
```

## 🔧 Solutions courantes

### Problème : Le header n'est pas envoyé

**Solution :** Vérifiez que votre client HTTP envoie bien le header `x-api-secret`.

### Problème : La clé ne correspond pas

**Solution :** 
1. Vérifiez que la valeur dans `.env` correspond exactement à celle envoyée
2. Attention aux espaces, caractères spéciaux, casse
3. Redémarrez le serveur après modification de `.env`

### Problème : Variables d'environnement non chargées

**Solution :**
1. Vérifiez que `dotenv` est bien installé : `npm list dotenv`
2. Vérifiez que le fichier `.env` est à la racine du projet
3. Vérifiez que le serveur charge bien dotenv (voir `server.js` ligne 11)

### Problème : En production (Railway/Vercel)

**Solution :**
1. Vérifiez que la variable `API_SECRET_KEY` est bien configurée dans les variables d'environnement de votre plateforme
2. Redéployez l'application après avoir ajouté/modifié la variable
3. Vérifiez que la variable est bien accessible (pas de typo dans le nom)

## 🧪 Test rapide

Pour tester rapidement si l'authentification fonctionne :

```bash
# Test avec la bonne clé
curl -X POST http://localhost:3000/api/send-ridge \
  -H "x-api-secret: votre_cle_secrete" \
  -H "Content-Type: application/json" \
  -d '{"to":"test@example.com","from":"sender@example.com","subject":"Test","messageId":"<test@example.com>"}'

# Test sans clé (devrait retourner 403)
curl -X POST http://localhost:3000/api/send-ridge \
  -H "Content-Type: application/json" \
  -d '{"to":"test@example.com","from":"sender@example.com","subject":"Test","messageId":"<test@example.com>"}'
```

## 📝 Checklist

- [ ] Le header `x-api-secret` est présent dans la requête
- [ ] La valeur du header correspond à `API_SECRET_KEY` dans `.env`
- [ ] Le fichier `.env` existe à la racine du projet
- [ ] Le serveur a été redémarré après modification de `.env`
- [ ] Pas d'espaces ou caractères invisibles dans la clé
- [ ] En production : la variable est configurée dans la plateforme de déploiement

## 🔐 Sécurité

⚠️ **Important :**
- Ne partagez jamais votre clé API publiquement
- Ne commitez jamais le fichier `.env` dans Git
- Utilisez des clés différentes pour développement et production
- Régénérez la clé si elle a été compromise

