# Configuration Pabbly Connect pour Mail Auto API

## ✅ Statut actuel

Le serveur fonctionne correctement ! L'erreur 405 que vous recevez est normale car Pabbly Connect envoie une requête **GET** alors que l'endpoint nécessite **POST**.

## 🔧 Configuration dans Pabbly Connect

### Étape 1 : Créer une action HTTP Request

1. Dans votre workflow Pabbly Connect, ajoutez une action **"HTTP Request"**
2. Configurez les paramètres suivants :

### Étape 2 : Configuration de la requête

#### Méthode HTTP
```
POST
```
⚠️ **Important** : Assurez-vous que la méthode est bien **POST** et non GET.

#### URL
```
https://mailautovercel-production.up.railway.app/api/send-ridge
```
(Remplacez par l'endpoint que vous souhaitez utiliser : `send-ridge`, `send-jak`, `send-cuspide`, ou `send-kelaj`)

#### Headers
Ajoutez ces headers :

| Header Name | Header Value |
|------------|--------------|
| `x-api-secret` | `votre_cle_secrete_ici` |
| `Content-Type` | `application/json` |

⚠️ **Important** : 
- Remplacez `votre_cle_secrete_ici` par votre vraie clé API
- Le header `x-api-secret` est **obligatoire** pour l'authentification

#### Body (Request Body)
Sélectionnez **"JSON"** et ajoutez :

```json
{
  "to": "{{to}}",
  "from": "{{from}}",
  "subject": "{{subject}}",
  "messageId": "{{messageId}}",
  "body": "{{body}}"
}
```

Remplacez les variables `{{variable}}` par les valeurs de votre workflow Pabbly Connect.

### Étape 3 : Exemple de configuration complète

#### Configuration de base
- **Method** : `POST`
- **URL** : `https://mailautovercel-production.up.railway.app/api/send-ridge`
- **Request Type** : `JSON`

#### Headers
```
x-api-secret: votre_cle_secrete_ici
Content-Type: application/json
```

#### Body (JSON)
```json
{
  "to": "destinataire@example.com",
  "from": "expediteur@example.com",
  "subject": "Sujet de l'email",
  "messageId": "<message-id-original@example.com>",
  "body": "Contenu de l'email (optionnel)"
}
```

## 📋 Champs requis

Les champs suivants sont **obligatoires** :
- `from` : Adresse email de l'expéditeur
- `subject` : Sujet de l'email
- `messageId` : Message ID de l'email original (pour la réponse)

Les champs suivants sont **optionnels** :
- `to` : Destinataire (peut être défini dans votre workflow)
- `body` : Contenu de l'email (un message par défaut sera utilisé si absent)

## 🔍 Vérification

### Test de la configuration

1. **Vérifiez la méthode** : Doit être `POST`
2. **Vérifiez l'URL** : Doit pointer vers `/api/send-ridge` (ou autre endpoint)
3. **Vérifiez les headers** : `x-api-secret` et `Content-Type` doivent être présents
4. **Vérifiez le body** : Doit être en JSON valide

### Réponses attendues

#### ✅ Succès (200)
```json
{
  "success": true,
  "messageId": "<message-id@example.com>"
}
```

#### ❌ Erreur 403 - Non autorisé
```json
{
  "error": "Non autorisé",
  "message": "Clé API invalide",
  "timestamp": "2026-01-16T12:38:50.406Z"
}
```
**Solution** : Vérifiez que le header `x-api-secret` contient la bonne clé.

#### ❌ Erreur 400 - Champs manquants
```json
{
  "error": "Champs manquants",
  "required": ["from", "subject", "messageId"]
}
```
**Solution** : Vérifiez que tous les champs requis sont présents dans le body.

#### ❌ Erreur 405 - Méthode non autorisée
```json
{
  "error": "Méthode non autorisée",
  "message": "Cette route nécessite une requête POST",
  "allowed": ["POST"],
  "received": "GET"
}
```
**Solution** : Changez la méthode HTTP de `GET` à `POST` dans Pabbly Connect.

## 🎯 Endpoints disponibles

| Endpoint | Description |
|----------|-------------|
| `/api/send-ridge` | Envoie un email via le service RIDGE |
| `/api/send-jak` | Envoie un email via le service JAK |
| `/api/send-cuspide` | Envoie un email via le service CUSPIDE |
| `/api/send-kelaj` | Envoie un email via le service KELAJ |

## 🔐 Sécurité

- Ne partagez jamais votre clé API (`x-api-secret`)
- Utilisez des variables d'environnement dans Pabbly Connect si possible
- Testez d'abord avec des emails de test avant de mettre en production

## 📝 Notes

- Le serveur répond maintenant correctement avec un 405 si une requête GET est envoyée
- L'erreur 502 "connection refused" est résolue
- Le serveur écoute sur `0.0.0.0` pour accepter les connexions externes
- Tous les endpoints nécessitent une authentification via le header `x-api-secret`

## 🆘 Dépannage

### Le workflow ne fonctionne pas

1. **Vérifiez les logs Railway** pour voir les erreurs du serveur
2. **Testez avec Postman** d'abord pour vérifier que l'API fonctionne
3. **Vérifiez la méthode HTTP** dans Pabbly Connect (doit être POST)
4. **Vérifiez les headers** (x-api-secret doit être présent)
5. **Vérifiez le format JSON** du body

### Erreurs courantes

- **405 Method Not Allowed** : La méthode est GET au lieu de POST
- **403 Non autorisé** : La clé API est incorrecte ou manquante
- **400 Champs manquants** : Un ou plusieurs champs requis sont absents
- **500 Erreur SMTP** : Problème de configuration SMTP (vérifiez les variables d'environnement)

