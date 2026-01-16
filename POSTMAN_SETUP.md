# Guide d'utilisation de la collection Postman

## 📥 Importation de la collection

1. Ouvrez Postman
2. Cliquez sur **Import** (en haut à gauche)
3. Sélectionnez le fichier `Mail_Auto_API.postman_collection.json`
4. La collection "Mail Auto API" apparaîtra dans votre workspace

## 🔧 Configuration des variables d'environnement

### Option 1 : Variables de collection (recommandé)

1. Cliquez sur la collection "Mail Auto API"
2. Allez dans l'onglet **Variables**
3. Configurez les variables suivantes :

| Variable | Valeur | Description |
|----------|--------|-------------|
| `base_url` | `http://localhost:3000` | URL de base de votre API (ou URL de production) |
| `api_secret_key` | `votre_cle_secrete` | Clé API secrète définie dans votre `.env` |

### Option 2 : Environnement Postman (pour plusieurs environnements)

1. Cliquez sur **Environments** dans la barre latérale
2. Créez un nouvel environnement (ex: "Local", "Production")
3. Ajoutez les mêmes variables que ci-dessus
4. Sélectionnez l'environnement dans le menu déroulant en haut à droite

## 🧪 Exécution des tests

### Test individuel

1. Ouvrez une requête dans la collection
2. Cliquez sur **Send**
3. Les tests s'exécutent automatiquement
4. Consultez l'onglet **Test Results** pour voir les résultats

### Exécution de toute la collection

1. Cliquez sur la collection "Mail Auto API"
2. Cliquez sur **Run** (ou les trois points → Run collection)
3. Sélectionnez les requêtes à exécuter
4. Cliquez sur **Run Mail Auto API**
5. Consultez les résultats de tous les tests

## 📋 Requêtes disponibles

### 1. Health Check
- **GET /api/health** - Vérifie que le serveur est opérationnel
  - Tests : Status 200, présence de `status: "ok"`, vérification de l'uptime

### 2. Send RIDGE
- **POST /api/send-ridge** - Envoie un email via RIDGE
  - **Success** : Test avec tous les champs requis
  - **Missing Fields** : Test de validation (400)
  - **Unauthorized** : Test d'authentification (403)

### 3. Send JAK
- **POST /api/send-jak** - Envoie un email via JAK
  - **Success** : Test avec tous les champs requis

### 4. Send CUSPIDE
- **POST /api/send-cuspide** - Envoie un email via CUSPIDE
  - **Success** : Test avec tous les champs requis

### 5. Send KELAJ
- **POST /api/send-kelaj** - Envoie un email via KELAJ
  - **Success** : Test avec tous les champs requis

### 6. Root Endpoint
- **GET /** - Liste les endpoints disponibles

## 🔍 Tests automatisés inclus

Chaque requête contient des tests automatisés qui vérifient :

- ✅ **Code de statut HTTP** correct
- ✅ **Structure de la réponse JSON**
- ✅ **Présence des champs requis**
- ✅ **Types de données** corrects
- ✅ **Temps de réponse** (pour certaines requêtes)

## 📝 Exemple de body pour les requêtes POST

```json
{
    "to": "destinataire@example.com",
    "from": "expediteur@example.com",
    "subject": "Sujet de l'email",
    "messageId": "<message-id-original@example.com>",
    "body": "Contenu de l'email (optionnel)"
}
```

## 🚀 Pour la production

Avant de tester en production :

1. Mettez à jour la variable `base_url` avec l'URL de production
   - Exemple : `https://mailautovercel-production.up.railway.app`
2. Vérifiez que `api_secret_key` correspond à votre clé de production
3. Testez d'abord le Health Check pour vérifier la connectivité

## 💡 Astuces

- Utilisez **Ctrl+Alt+R** (Windows) ou **Cmd+Alt+R** (Mac) pour exécuter rapidement une requête
- Les tests échoués apparaissent en rouge dans l'onglet **Test Results**
- Vous pouvez modifier les valeurs dans les requêtes avant de les exécuter
- Utilisez l'onglet **Console** (View → Show Postman Console) pour voir les détails des requêtes

## 🔐 Sécurité

⚠️ **Important** : Ne partagez jamais votre `api_secret_key` dans les collections Postman publiques. Utilisez les variables d'environnement et gardez-les privées.

