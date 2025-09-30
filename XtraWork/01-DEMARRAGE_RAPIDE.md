# 🚀 Démarrage Rapide - API XtraWork

Guide ultra-rapide pour démarrer avec l'API XtraWork en 5 minutes !

---

## 📋 Étape 1 : Vérification des prérequis

```powershell
# Vérifier .NET 8
dotnet --version
# Doit afficher 8.x.x ou supérieur

# Vérifier SQL Server
sqlcmd -S . -E -Q "SELECT @@VERSION"
```

---

## ⚙️ Étape 2 : Configuration

### Option A : Base de données locale (SQL Server Express/LocalDB)

Modifier `appsettings.json` :

```json
{
  "ConnectionStrings": {
    "XtraWork": "Server=.;Database=XtraWork;Trusted_Connection=True;TrustServerCertificate=True"
  }
}
```

### Option B : Serveur SQL distant

```json
{
  "ConnectionStrings": {
    "XtraWork": "Server=NOM_SERVEUR;Database=XtraWork;User Id=USERNAME;Password=PASSWORD;TrustServerCertificate=True"
  }
}
```

---

## 🚀 Étape 3 : Lancement

```powershell
# Dans le dossier XtraWork
dotnet restore
dotnet run
```

**Résultat attendu :**
```
info: Microsoft.Hosting.Lifetime[14]
      Now listening on: https://localhost:7033
info: Microsoft.Hosting.Lifetime[14]
      Now listening on: http://localhost:5280
```

✅ **L'API est démarrée !**

---

## 🌐 Étape 4 : Accéder à Swagger

Ouvrir votre navigateur :

👉 **https://localhost:7033/swagger**

Vous verrez l'interface Swagger avec tous les endpoints disponibles.

---

## 🧪 Étape 5 : Premier test

### Test 1 : Health Check

Ouvrir un nouveau PowerShell :

```powershell
curl -k https://localhost:7033/health
```

**Réponse attendue :** `Healthy`

### Test 2 : Inscription d'un utilisateur

```powershell
curl -k -X POST "https://localhost:7033/api/auth/register" `
  -H "Content-Type: application/json" `
  -d '{
    "username": "admin",
    "email": "admin@xtrawork.com",
    "password": "Admin123!",
    "firstName": "Jean",
    "lastName": "Administrateur"
  }'
```

**Réponse attendue :**
```json
{
  "token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...",
  "user": {
    "id": "guid-ici",
    "username": "admin",
    "email": "admin@xtrawork.com",
    "firstName": "Jean",
    "lastName": "Administrateur",
    "role": "User"
  }
}
```

✅ **Copier le token** pour les prochains tests !

### Test 3 : Récupérer les titres (avec authentification)

Remplacer `VOTRE_TOKEN` par le token obtenu :

```powershell
$token = "VOTRE_TOKEN"
$headers = @{ Authorization = "Bearer $token" }
Invoke-RestMethod -Uri "https://localhost:7033/api/titles" -Headers $headers -SkipCertificateCheck
```

---

## 🎯 Étape 6 : Tests automatisés

Lancer le script de test complet :

```powershell
cd scripts
.\test-api.ps1
```

Ce script teste automatiquement :
- ✅ Health Check
- ✅ Inscription
- ✅ Connexion
- ✅ Récupération des données
- ✅ Authentification JWT

---

## 📚 Utiliser Swagger avec authentification

### 1. S'inscrire ou se connecter

Dans Swagger UI :
1. Dérouler `POST /api/auth/register` ou `POST /api/auth/login`
2. Cliquer **Try it out**
3. Entrer les identifiants :
   ```json
   {
     "username": "admin",
     "password": "Admin123!"
   }
   ```
4. Cliquer **Execute**
5. **Copier le token** dans la réponse

### 2. Authentifier dans Swagger

1. Cliquer sur le bouton **Authorize** 🔓 en haut de la page
2. Dans le champ, entrer :
   ```
   Bearer VOTRE_TOKEN
   ```
   (remplacer `VOTRE_TOKEN` par le token copié)
3. Cliquer **Authorize**
4. Fermer la fenêtre

✅ **Vous êtes maintenant authentifié !**

### 3. Tester les endpoints protégés

Tous les endpoints nécessitant une authentification sont maintenant accessibles :
- `GET /api/titles`
- `GET /api/employees`
- `GET /api/auth/me`
- etc.

---

## 🎨 Créer des données de test

### Créer un titre (poste)

Dans Swagger, `POST /api/titles` :

```json
{
  "description": "Développeur Full Stack"
}
```

⚠️ **Nécessite rôle Admin**. Par défaut, les nouveaux utilisateurs ont le rôle "User".

### Créer un employé

Dans Swagger, `POST /api/employees` :

```json
{
  "firstName": "Marie",
  "lastName": "Dupont",
  "birthDate": "1990-05-15",
  "gender": "F",
  "titleId": "GUID_DU_TITRE"
}
```

Remplacer `GUID_DU_TITRE` par l'ID d'un titre existant.

---

## 🔧 Changer le rôle d'un utilisateur

Par défaut, les utilisateurs créés ont le rôle "User".

### Méthode 1 : Via SQL Server Management Studio

```sql
USE XtraWork;
UPDATE Users 
SET Role = 'Admin' 
WHERE Username = 'admin';
```

### Méthode 2 : Via sqlcmd

```powershell
sqlcmd -S . -E -Q "USE XtraWork; UPDATE Users SET Role = 'Admin' WHERE Username = 'admin';"
```

Rôles disponibles : `User`, `Manager`, `Admin`

---

## 📊 Vérifier les logs

Les logs sont écrits dans :

### Console
Vérifier le terminal où `dotnet run` est lancé.

### Fichiers
```powershell
cd logs
ls
Get-Content xtrawork-20250929.txt -Tail 50
```

---

## ❌ Problèmes fréquents

### "Jwt:Key manquant"

**Solution :**
```powershell
dotnet user-secrets set "Jwt:Key" "7e6da5d9e5514ce288683845e6068df782a23f6c15fb43cd92e19b4147d8ce95"
```

### "Cannot connect to database"

**Solutions :**
1. Vérifier que SQL Server est démarré
2. Tester la chaîne de connexion dans `appsettings.json`
3. Essayer avec `Server=(localdb)\\mssqllocaldb` pour LocalDB

### Port déjà utilisé

**Solution :** Modifier `Properties/launchSettings.json` :
```json
{
  "applicationUrl": "https://localhost:7034;http://localhost:5281"
}
```

### Erreur 401 (Unauthorized)

**Solutions :**
1. Vérifier que le token est bien dans le header `Authorization`
2. Format correct : `Bearer {token}` (avec espace)
3. Token non expiré (24h de validité)

---

## 📖 Commandes utiles

```powershell
# Lancer en mode watch (rechargement auto)
dotnet watch run

# Nettoyer et rebuilder
dotnet clean
dotnet build

# Lister les packages installés
dotnet list package

# Voir les migrations EF Core
dotnet ef migrations list

# Créer une migration
dotnet ef migrations add NomMigration

# Appliquer les migrations
dotnet ef database update

# Supprimer la base de données
dotnet ef database drop
```

---

## 🎓 Prochaines étapes

1. **Explorer Swagger UI** : https://localhost:7033/swagger
2. **Lire le README complet** : `README.md`
3. **Tester tous les endpoints** avec le script : `scripts\test-api.ps1`
4. **Modifier le code** et voir les changements en temps réel avec `dotnet watch run`
5. **Ajouter des fonctionnalités** :
   - Pagination
   - Filtres avancés
   - Export Excel
   - Notifications

---

## 📞 Ressources

- **Swagger UI** : https://localhost:7033/swagger
- **Health Check** : https://localhost:7033/health
- **Logs** : `logs/xtrawork-*.txt`
- **README complet** : `README.md`

---

## ✅ Checklist de démarrage

- [ ] .NET 8 installé
- [ ] SQL Server accessible
- [ ] `appsettings.json` configuré
- [ ] `dotnet restore` exécuté
- [ ] `dotnet run` lancé
- [ ] Swagger accessible
- [ ] Health check OK
- [ ] Inscription réussie
- [ ] Token récupéré
- [ ] Authentification dans Swagger OK
- [ ] Premier GET réussi

---

**Félicitations ! Vous êtes prêt à utiliser l'API XtraWork ! 🎉**

Pour aller plus loin, consultez le `README.md` complet.
