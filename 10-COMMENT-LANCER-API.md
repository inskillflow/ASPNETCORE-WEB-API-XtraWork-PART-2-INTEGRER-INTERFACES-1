# Comment Lancer le Projet XtraWork API

## Methode 1 : Lancement Rapide (Recommande)

### Etape 1 : Naviguer vers le dossier du projet

```powershell
cd XtraWork
```

### Etape 2 : Lancer l'API

```powershell
dotnet run
```

**L'API demarre sur :**
- HTTPS : `https://localhost:7033`
- HTTP : `http://localhost:5280`
- Swagger UI : `https://localhost:7033/swagger`

---

## Methode 2 : Lancement avec Profil HTTPS (Recommande pour Swagger)

```powershell
cd XtraWork
dotnet run --launch-profile https
```

---

## Methode 3 : Lancement en Mode Watch (Rechargement Auto)

Pour le developpement, utilisez le mode watch qui recharge automatiquement l'API quand vous modifiez le code :

```powershell
cd XtraWork
dotnet watch run
```

---

## Verification que l'API fonctionne

### 1. Test du Health Check (sans authentification)

```powershell
# PowerShell
Invoke-RestMethod -Uri "https://localhost:7033/health" -SkipCertificateCheck

# Ou avec curl
curl -k https://localhost:7033/health
```

### 2. Ouvrir Swagger UI

Ouvrez votre navigateur et allez sur :
```
https://localhost:7033/swagger
```

Vous verrez l'interface Swagger avec tous les endpoints documentes.

---

## Inscription d'un Premier Utilisateur

### Avec PowerShell :

```powershell
$body = @{
    username = "admin"
    email = "admin@xtrawork.com"
    password = "Admin123!"
    firstName = "Admin"
    lastName = "Systeme"
} | ConvertTo-Json

$response = Invoke-RestMethod -Uri "https://localhost:7033/api/auth/register" -Method Post -ContentType "application/json" -Body $body -SkipCertificateCheck

Write-Host "Token: $($response.token.Substring(0,50))..." -ForegroundColor Green
Write-Host "User: $($response.user.username) - Role: $($response.user.role)" -ForegroundColor Cyan
```

### Avec Swagger UI :

1. Allez sur `https://localhost:7033/swagger`
2. Cliquez sur **POST /api/auth/register**
3. Cliquez sur **Try it out**
4. Entrez :
```json
{
  "username": "admin",
  "email": "admin@xtrawork.com",
  "password": "Admin123!",
  "firstName": "Admin",
  "lastName": "Systeme"
}
```
5. Cliquez sur **Execute**
6. Copiez le **token** retourne

---

## Changer le Role d'un Utilisateur en Admin

### Option 1 : Directement en Base de Donnees (SQL Server)

```sql
-- Connectez-vous a SQL Server Management Studio
-- Base de donnees : XtraWork

UPDATE Users 
SET Role = 'Admin' 
WHERE Username = 'admin';

-- Verifier
SELECT Username, Role FROM Users;
```

### Option 2 : Avec SQL Server depuis PowerShell

```powershell
sqlcmd -S localhost -d XtraWork -E -Q "UPDATE Users SET Role = 'Admin' WHERE Username = 'admin'; SELECT Username, Role FROM Users;"
```

---

## Utiliser le Token JWT dans Swagger

1. Copiez le token recu lors du register/login
2. Dans Swagger UI, cliquez sur le bouton **Authorize** (cadenas en haut a droite)
3. Entrez : `Bearer VOTRE_TOKEN_ICI` (sans les guillemets)
4. Cliquez sur **Authorize**
5. Maintenant vous pouvez tester tous les endpoints proteges !

---

## Tester les Endpoints Proteges

### Exemple : Creer un Titre (Admin uniquement)

1. Assurez-vous d'etre authentifie avec un token Admin
2. Allez sur **POST /api/title**
3. Cliquez sur **Try it out**
4. Entrez :
```json
{
  "description": "Developpeur Senior .NET"
}
```
5. Cliquez sur **Execute**
6. Vous recevez un 201 Created avec l'ID du titre cree

### Exemple : Creer un Employe

1. Copiez l'ID du titre cree ci-dessus
2. Allez sur **POST /api/employee**
3. Cliquez sur **Try it out**
4. Entrez :
```json
{
  "firstName": "Jean",
  "lastName": "Dupont",
  "birthDate": "1990-05-15",
  "gender": "M",
  "titleId": "COLLEZ_L_ID_DU_TITRE_ICI"
}
```
5. Cliquez sur **Execute**

---

## Arreter l'API

### Si lancee en mode normal :
Appuyez sur **Ctrl+C** dans le terminal

### Si lancee en arriere-plan :
```powershell
# Trouver le processus
Get-Process -Name dotnet

# Arreter tous les processus dotnet
Get-Process -Name dotnet | Stop-Process -Force
```

---

## Recreer la Base de Donnees

Si vous voulez repartir de zero :

```powershell
# Arreter l'API d'abord (Ctrl+C)

# Supprimer la base de donnees
sqlcmd -S localhost -E -Q "DROP DATABASE XtraWork;"

# Relancer l'API (elle recreera la BDD automatiquement)
cd XtraWork
dotnet run
```

---

## Problemes Courants et Solutions

### Probleme 1 : "Couldn't find a project to run"

**Solution :** Vous n'etes pas dans le bon dossier

```powershell
cd XtraWork
dotnet run
```

### Probleme 2 : "Port already in use"

**Solution :** Une instance de l'API tourne deja

```powershell
Get-Process -Name dotnet | Stop-Process -Force
dotnet run
```

### Probleme 3 : "Invalid object name 'Users'"

**Solution :** La base de donnees n'est pas creee correctement

```powershell
# Supprimer et recreer la BDD
sqlcmd -S localhost -E -Q "DROP DATABASE XtraWork;"
dotnet run
```

### Probleme 4 : "Cannot connect to SQL Server"

**Solution :** Verifier que SQL Server tourne

```powershell
# Verifier le service SQL Server
Get-Service -Name "MSSQL*"

# Si arrete, le demarrer
Start-Service -Name "MSSQLSERVER"
```

---

## Commandes Utiles

### Restaurer les packages NuGet

```powershell
cd XtraWork
dotnet restore
```

### Compiler le projet

```powershell
dotnet build
```

### Nettoyer le projet

```powershell
dotnet clean
```

### Lister les packages installes

```powershell
dotnet list package
```

---

## Configuration de la Base de Donnees

La chaine de connexion est dans **appsettings.json** :

```json
"ConnectionStrings": {
  "XtraWork": "Server=localhost;Database=XtraWork;Trusted_Connection=True;TrustServerCertificate=True;"
}
```

Si votre SQL Server est sur un autre serveur ou necessite un username/password, modifiez cette chaine.

---

## Demarrage Rapide Complet (Copier-Coller)

```powershell
# 1. Arreter toute instance existante
Get-Process -Name dotnet -ErrorAction SilentlyContinue | Stop-Process -Force

# 2. Naviguer vers le projet
cd XtraWork

# 3. Lancer l'API
dotnet run --launch-profile https

# Attendez le message "Now listening on: https://localhost:7033"
# Puis ouvrez https://localhost:7033/swagger dans votre navigateur
```

---

## Verifier que Tout Fonctionne

Une fois l'API lancee, testez dans l'ordre :

1. ✅ Health Check : `GET /health` (doit retourner 200 OK)
2. ✅ Register : `POST /api/auth/register` (doit retourner 201 Created + token)
3. ✅ Login : `POST /api/auth/login` (doit retourner 200 OK + token)
4. ✅ Get Titles : `GET /api/title` (avec token, doit retourner 200 OK)
5. ✅ Create Title : `POST /api/title` (Admin only, doit retourner 201 Created)

---

## Ressources

- **Documentation HTML** : Ouvrez `html/index.html`
- **Swagger UI** : `https://localhost:7033/swagger`
- **Code source** : Dossier `XtraWork/`

---

**🎉 Bon developpement ! 🎉**

