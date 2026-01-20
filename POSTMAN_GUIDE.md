# Guide d'utilisation de la collection Postman

## 📥 Importation

1. Ouvrez Postman
2. Cliquez sur **Import** (en haut à gauche)
3. Sélectionnez le fichier `Mail_Auto_API.postman_collection.json`
4. La collection "Mail Auto API - Tests Complets" apparaîtra dans votre workspace

## 🔧 Configuration des variables

### Variables de collection

La collection contient deux variables pré-configurées :

| Variable | Valeur par défaut | Description |
|----------|-------------------|-------------|
| `base_url` | `https://mailautovercel-production.up.railway.app` | URL de base de l'API |
| `api_secret_key` | `A7z9!Kp42*WxLvPc6QyB1jR8%ZnD3y1d` | Clé API secrète |

### Modifier les variables

1. Cliquez sur la collection "Mail Auto API - Tests Complets"
2. Allez dans l'onglet **Variables**
3. Modifiez les valeurs selon vos besoins
4. Pour tester en local : changez `base_url` en `http://localhost:3000`

## 📋 Requêtes disponibles

### 1. Health Check
- **GET /api/health** - Vérifie que le serveur est opérationnel
  - ✅ Tests : Status 200, présence de `status: "ok"`, vérification de l'uptime

### 2. Root Endpoint
- **GET /** - Liste tous les endpoints disponibles
  - ✅ Tests : Status 200, vérification de la structure de la réponse

### 3. Send RIDGE (4 tests)
- **POST /api/send-ridge** - Succès avec tous les champs
- **POST /api/send-ridge** - Champs manquants (400)
- **POST /api/send-ridge** - Clé API invalide (403)
- **GET /api/send-ridge** - Méthode non autorisée (405)

### 4. Send JAK
- **POST /api/send-jak** - Envoi réussi

### 5. Send CUSPIDE
- **POST /api/send-cuspide** - Envoi réussi

### 6. Send KELAJ
- **POST /api/send-kelaj** - Envoi réussi

### 7. Tests d'erreurs (3 tests)
- **POST** - Body vide
- **POST** - JSON invalide
- **POST** - Header x-api-secret manquant

## 🧪 Exécution des tests

### Test individuel

1. Ouvrez une requête dans la collection
2. Cliquez sur **Send**
3. Les tests s'exécutent automatiquement
4. Consultez l'onglet **Test Results** pour voir les résultats

### Exécution de toute la collection

1. Cliquez sur la collection "Mail Auto API - Tests Complets"
2. Cliquez sur **Run** (ou les trois points → Run collection)
3. Sélectionnez les requêtes à exécuter
4. Cliquez sur **Run Mail Auto API - Tests Complets**
5. Consultez les résultats de tous les tests

## 📝 Format du body pour les requêtes POST

```json
{
    "to": "destinataire@example.com",
    "from": "expediteur@example.com",
    "subject": "Sujet de l'email",
    "messageId": "<message-id-original@example.com>",
    "body": "Contenu de l'email (optionnel)"
}
```

### Champs requis
- `from` : Adresse email de l'expéditeur
- `subject` : Sujet de l'email
- `messageId` : Message ID de l'email original

### Champs optionnels
- `to` : Destinataire
- `body` : Contenu de l'email (un message par défaut sera utilisé si absent)

## ✅ Tests automatisés inclus

Chaque requête contient des tests qui vérifient :

- ✅ **Code de statut HTTP** correct
- ✅ **Structure de la réponse JSON**
- ✅ **Présence des champs requis**
- ✅ **Types de données** corrects
- ✅ **Temps de réponse** (pour certaines requêtes)
- ✅ **Messages d'erreur** appropriés

## 🔍 Exemples de réponses

### Succès (200)
```json
{
  "success": true,
  "messageId": "<message-id@example.com>"
}
```

### Erreur 400 - Champs manquants
```json
{
  "error": "Champs manquants",
  "required": ["from", "subject", "messageId"],
  "received": ["to"],
  "timestamp": "2026-01-16T13:07:51.000Z"
}
```

### Erreur 403 - Non autorisé
```json
{
  "error": "Non autorisé",
  "message": "Clé API invalide",
  "timestamp": "2026-01-16T13:07:51.000Z"
}
```

### Erreur 405 - Méthode non autorisée
```json
{
  "error": "Méthode non autorisée",
  "message": "Cette route nécessite une requête POST",
  "allowed": ["POST"],
  "received": "GET"
}
```

## 🚀 Pour la production

Avant de tester en production :

1. Vérifiez que `base_url` pointe vers votre URL de production
2. Vérifiez que `api_secret_key` correspond à votre clé de production
3. Testez d'abord le Health Check pour vérifier la connectivité

## 💡 Astuces

- Utilisez **Ctrl+Alt+R** (Windows) ou **Cmd+Alt+R** (Mac) pour exécuter rapidement une requête
- Les tests échoués apparaissent en rouge dans l'onglet **Test Results**
- Vous pouvez modifier les valeurs dans les requêtes avant de les exécuter
- Utilisez l'onglet **Console** (View → Show Postman Console) pour voir les détails des requêtes
- Les variables `{{base_url}}` et `{{api_secret_key}}` sont automatiquement remplacées

## 🔐 Sécurité

⚠️ **Important** : 
- Ne partagez jamais votre `api_secret_key` publiquement
- Utilisez les variables d'environnement Postman pour gérer différentes clés (dev/prod)
- Ne commitez jamais le fichier de collection avec des clés réelles dans un repository public

## 📊 Statistiques des tests

La collection contient **12 requêtes de test** couvrant :
- ✅ 2 endpoints d'information (health, root)
- ✅ 4 endpoints d'envoi d'emails (ridge, jak, cuspide, kelaj)
- ✅ 7 scénarios de test d'erreur
- ✅ Tests automatisés pour chaque requête

