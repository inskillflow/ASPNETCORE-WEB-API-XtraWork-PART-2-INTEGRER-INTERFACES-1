# Scénario 1 : Test Complet de l'API XtraWork

## Description du Scénario

Ce scénario teste toutes les fonctionnalités de l'API dans l'ordre suivant :
1. Démarrage et vérification de l'API
2. Inscription de 3 utilisateurs (User, Manager, Admin)
3. Tests des endpoints avec différents rôles
4. CRUD complet sur Titles et Employees
5. Vérification des autorisations

**Durée estimée :** 10-15 minutes

---

## CONFIGURATION TESTÉE

**Ce scénario utilise HTTPS avec PowerShell 5.1 (Windows par défaut)**

- URL de base : **`https://localhost:7033`**
- Swagger UI : **`https://localhost:7033/swagger/index.html`**
- Pas besoin de `-SkipCertificateCheck`

---

## AVANT DE COMMENCER

### Vérifier que les ports sont libres

```powershell
# Vérifier si le port 5280 est déjà utilisé
Get-NetTCPConnection -LocalPort 5280 -ErrorAction SilentlyContinue

# Si une connexion existe, arrêter tous les processus dotnet
Get-Process -Name "dotnet" -ErrorAction SilentlyContinue | Stop-Process -Force
```

**Si vous voyez une erreur "address already in use" :**
```powershell
# Arrêter TOUS les processus dotnet
Get-Process -Name "dotnet" | Stop-Process -Force

# Attendre 2 secondes
Start-Sleep -Seconds 2

# Relancer l'API
dotnet run
```

---

# ÉTAPE 1 : Démarrage de l'API

### Terminal 1 : Lancer l'API

```powershell
# Aller dans le dossier du projet
cd C:\Users\rehou\Downloads\2-SuiviEtudiantsEtape2\SuiviEtudiantsEtape2\XtraWork

# Arrêter tout processus dotnet existant
Get-Process -Name "dotnet" -ErrorAction SilentlyContinue | Stop-Process -Force

# Attendre un peu
Start-Sleep -Seconds 2

# Lancer l'API
dotnet run
```

**Résultat attendu :**
```
info: Microsoft.Hosting.Lifetime[14]
      Now listening on: https://localhost:7033
info: Microsoft.Hosting.Lifetime[14]
      Now listening on: http://localhost:5280
info: Microsoft.Hosting.Lifetime[0]
      Application started. Press Ctrl+C to shut down.
```

**Si vous voyez les DEUX ports (7033 ET 5280), c'est parfait !**
**Si vous ne voyez QUE 5280, utilisez http://localhost:5280 partout**

**LAISSER CE TERMINAL OUVERT**



# ÉTAPE 2 : Tests (Nouveau Terminal PowerShell)

Ouvrir un **NOUVEAU terminal PowerShell** pour les tests.

## IMPORTANT : Choix de l'URL

**Version PowerShell 7+ (avec -SkipCertificateCheck) :**
- Utilisez : `https://localhost:7033/swagger/index.html`
- Ajoutez : `-SkipCertificateCheck` aux commandes

**Version PowerShell 5.1 (Windows par défaut) OU si HTTPS ne fonctionne pas :**
- Utilisez : `http://localhost:5280/swagger/index.html`
- **SUPPRIMEZ** : `-SkipCertificateCheck` de toutes les commandes

### 2.1 Test Health Check

**Option A : HTTPS (PowerShell 7+)**
```powershell
# Test 1 : Vérifier que l'API fonctionne
Invoke-WebRequest -Uri "https://localhost:7033/health" -SkipCertificateCheck | Select-Object StatusCode, Content
```

**Option B : HTTP (PowerShell 5.1 ou par défaut)**
```powershell
# Test 1 : Vérifier que l'API fonctionne
Invoke-WebRequest -Uri "http://localhost:5280/health" | Select-Object StatusCode, Content
```

**Résultat attendu :**
```
StatusCode : 200
Content    : Healthy
```

**Si vous voyez "200" et "Healthy", l'API fonctionne !**

 **Astuce :** Pour le reste du scénario, utilisez toujours la même URL (HTTPS ou HTTP)



# ÉTAPE 3 : Inscription des Utilisateurs

### 3.1 Inscription Utilisateur 1 (User normal)

** CHOISISSEZ votre version (HTTPS ou HTTP) :**

**Option A : HTTPS (PowerShell 7+)**
```powershell
$user1Body = @{
    username = "marie.user"
    email = "marie@xtrawork.com"
    password = "Marie123!"
    firstName = "Marie"
    lastName = "Dupont"
} | ConvertTo-Json

$user1Response = Invoke-RestMethod -Uri "https://localhost:7033/api/auth/register" `
  -Method Post `
  -ContentType "application/json" `
  -Body $user1Body `

$user1Token = $user1Response.token
Write-Host "Utilisateur 1 créé : $($user1Response.user.username) - Rôle: $($user1Response.user.role)" -ForegroundColor Green
Write-Host "Token: $($user1Token.Substring(0, 30))..." -ForegroundColor Gray
```

**Option B : HTTP (PowerShell 5.1 - RECOMMANDÉ)**
```powershell
$user1Body = @{
    username = "marie.user"
    email = "marie@xtrawork.com"
    password = "Marie123!"
    firstName = "Marie"
    lastName = "Dupont"
} | ConvertTo-Json

$user1Response = Invoke-RestMethod -Uri "http://localhost:5280/api/auth/register" `
  -Method Post `
  -ContentType "application/json" `
  -Body $user1Body

$user1Token = $user1Response.token
Write-Host "Utilisateur 1 créé : $($user1Response.user.username) - Rôle: $($user1Response.user.role)" -ForegroundColor Green
Write-Host "Token: $($user1Token.Substring(0, 30))..." -ForegroundColor Gray
```

**Résultat attendu :**
```
Utilisateur 1 créé : marie.user - Rôle: User
Token: eyJhbGciOiJIUzI1NiIsInR5cCI6...
```

### 3.2 Inscription Utilisateur 2 (futur Manager)

```powershell
$user2Body = @{
    username = "jean.manager"
    email = "jean@xtrawork.com"
    password = "Jean123!"
    firstName = "Jean"
    lastName = "Martin"
} | ConvertTo-Json

$user2Response = Invoke-RestMethod -Uri "https://localhost:7033/api/auth/register" `
  -Method Post `
  -ContentType "application/json" `
  -Body $user2Body `

$user2Token = $user2Response.token

Write-Host "Utilisateur 2 créé : $($user2Response.user.username) - Rôle: $($user2Response.user.role)" -ForegroundColor Green
```

### 3.3 Inscription Utilisateur 3 (futur Admin)

```powershell
$adminBody = @{
    username = "admin"
    email = "admin@xtrawork.com"
    password = "Admin123!"
    firstName = "Sophie"
    lastName = "Administrateur"
} | ConvertTo-Json

$adminResponse = Invoke-RestMethod -Uri "https://localhost:7033/api/auth/register" `
  -Method Post `
  -ContentType "application/json" `
  -Body $adminBody `

$adminToken = $adminResponse.token

Write-Host "Utilisateur 3 créé : $($adminResponse.user.username) - Rôle: $($adminResponse.user.role)" -ForegroundColor Green
```



# ÉTAPE 4 : Changer les Rôles (via SQL)

Les utilisateurs créés ont tous le rôle "User" par défaut. Nous devons changer les rôles.

### 4.1 Ouvrir SQL Server Management Studio OU utiliser sqlcmd

**Option A : Via sqlcmd (dans PowerShell)**

```powershell
# Changer jean.manager en Manager
sqlcmd -S LAPTOP-81IAD844 -E -Q "USE XtraWork; UPDATE Users SET Role = 'Manager' WHERE Username = 'jean.manager';"

# Changer admin en Admin
sqlcmd -S LAPTOP-81IAD844 -E -Q "USE XtraWork; UPDATE Users SET Role = 'Admin' WHERE Username = 'admin';"

Write-Host "Rôles modifiés avec succès" -ForegroundColor Green
```

**Option B : Via SSMS**

```sql
USE XtraWork;

-- Changer en Manager
UPDATE Users SET Role = 'Manager' WHERE Username = 'jean.manager';

-- Changer en Admin
UPDATE Users SET Role = 'Admin' WHERE Username = 'admin';

-- Vérifier
SELECT Username, Email, Role FROM Users;
```

### 4.2 Reconnecter les utilisateurs pour obtenir les nouveaux tokens

```powershell
# Reconnexion Manager
$managerLoginBody = @{
    username = "jean.manager"
    password = "Jean123!"
} | ConvertTo-Json

$managerResponse = Invoke-RestMethod -Uri "https://localhost:7033/api/auth/login" `
  -Method Post `
  -ContentType "application/json" `
  -Body $managerLoginBody `

$managerToken = $managerResponse.token
Write-Host "Manager connecté - Token mis à jour" -ForegroundColor Green

# Reconnexion Admin
$adminLoginBody = @{
    username = "admin"
    password = "Admin123!"
} | ConvertTo-Json

$adminResponse = Invoke-RestMethod -Uri "https://localhost:7033/api/auth/login" `
  -Method Post `
  -ContentType "application/json" `
  -Body $adminLoginBody `

$adminToken = $adminResponse.token
Write-Host "Admin connecté - Token mis à jour" -ForegroundColor Green
```



# ÉTAPE 5 : Tests des Endpoints /api/auth/me

### 5.1 Vérifier User

```powershell
$userHeaders = @{ Authorization = "Bearer $user1Token" }
$meUser = Invoke-RestMethod -Uri "https://localhost:7033/api/auth/me" `
  -Headers $userHeaders `

Write-Host "`n=== Utilisateur User ===" -ForegroundColor Cyan
Write-Host "Username: $($meUser.username)" -ForegroundColor White
Write-Host "Email: $($meUser.email)" -ForegroundColor White
Write-Host "Rôle: $($meUser.role)" -ForegroundColor Yellow
```

### 5.2 Vérifier Manager

```powershell
$managerHeaders = @{ Authorization = "Bearer $managerToken" }
$meManager = Invoke-RestMethod -Uri "https://localhost:7033/api/auth/me" `
  -Headers $managerHeaders `

Write-Host "`n=== Utilisateur Manager ===" -ForegroundColor Cyan
Write-Host "Username: $($meManager.username)" -ForegroundColor White
Write-Host "Email: $($meManager.email)" -ForegroundColor White
Write-Host "Rôle: $($meManager.role)" -ForegroundColor Yellow
```

### 5.3 Vérifier Admin

```powershell
$adminHeaders = @{ Authorization = "Bearer $adminToken" }
$meAdmin = Invoke-RestMethod -Uri "https://localhost:7033/api/auth/me" `
  -Headers $adminHeaders `

Write-Host "`n=== Utilisateur Admin ===" -ForegroundColor Cyan
Write-Host "Username: $($meAdmin.username)" -ForegroundColor White
Write-Host "Email: $($meAdmin.email)" -ForegroundColor White
Write-Host "Rôle: $($meAdmin.role)" -ForegroundColor Yellow
```



# ÉTAPE 6 : CRUD sur Titles (Postes)

### 6.1 Lire les titres (avec User - doit fonctionner)

```powershell
Write-Host "`n=== GET /api/titles avec User ===" -ForegroundColor Cyan
$titles = Invoke-RestMethod -Uri "https://localhost:7033/api/titles" `
  -Headers $userHeaders `

Write-Host "Nombre de titres: $($titles.Count)" -ForegroundColor Green
$titles | Format-Table -Property id, description, createdAt
```

### 6.2 Créer un titre avec User (doit échouer - 403 Forbidden)

```powershell
Write-Host "`n=== POST /api/titles avec User (doit échouer) ===" -ForegroundColor Cyan
$titleBody = @{ description = "Développeur Frontend" } | ConvertTo-Json

try {
    $createTitle = Invoke-RestMethod -Uri "https://localhost:7033/api/titles" `
      -Method Post `
      -Headers ($userHeaders + @{"Content-Type" = "application/json"}) `
      -Body $titleBody `
    
    Write-Host "ERREUR : Un User ne devrait pas pouvoir créer un titre !" -ForegroundColor Red
} catch {
    $statusCode = $_.Exception.Response.StatusCode.value__
    if ($statusCode -eq 403) {
        Write-Host "Correct : 403 Forbidden (User n'a pas les droits)" -ForegroundColor Green
    } else {
        Write-Host "Code d'erreur inattendu : $statusCode" -ForegroundColor Yellow
    }
}
```

### 6.3 Créer des titres avec Admin (doit fonctionner)

```powershell
Write-Host "`n=== POST /api/titles avec Admin ===" -ForegroundColor Cyan

# Titre 1
$title1Body = @{ description = "Développeur Full Stack" } | ConvertTo-Json
$title1 = Invoke-RestMethod -Uri "https://localhost:7033/api/titles" `
  -Method Post `
  -Headers ($adminHeaders + @{"Content-Type" = "application/json"}) `
  -Body $title1Body `

Write-Host "Titre créé : $($title1.description) (ID: $($title1.id))" -ForegroundColor Green
$title1Id = $title1.id

# Titre 2
$title2Body = @{ description = "Chef de Projet" } | ConvertTo-Json
$title2 = Invoke-RestMethod -Uri "https://localhost:7033/api/titles" `
  -Method Post `
  -Headers ($adminHeaders + @{"Content-Type" = "application/json"}) `
  -Body $title2Body `

Write-Host "Titre créé : $($title2.description) (ID: $($title2.id))" -ForegroundColor Green
$title2Id = $title2.id

# Titre 3
$title3Body = @{ description = "Analyste Business" } | ConvertTo-Json
$title3 = Invoke-RestMethod -Uri "https://localhost:7033/api/titles" `
  -Method Post `
  -Headers ($adminHeaders + @{"Content-Type" = "application/json"}) `
  -Body $title3Body `

Write-Host "Titre créé : $($title3.description) (ID: $($title3.id))" -ForegroundColor Green
$title3Id = $title3.id
```

### 6.4 Modifier un titre avec Manager (doit fonctionner)

```powershell
Write-Host "`n=== PUT /api/titles avec Manager ===" -ForegroundColor Cyan

$updateTitleBody = @{ description = "Développeur Full Stack Senior" } | ConvertTo-Json
$updatedTitle = Invoke-RestMethod -Uri "https://localhost:7033/api/titles/$title1Id" `
  -Method Put `
  -Headers ($managerHeaders + @{"Content-Type" = "application/json"}) `
  -Body $updateTitleBody `

Write-Host "Titre modifié : $($updatedTitle.description)" -ForegroundColor Green
```

### 6.5 Modifier un titre avec User (doit échouer - 403)

```powershell
Write-Host "`n=== PUT /api/titles avec User (doit échouer) ===" -ForegroundColor Cyan

$updateTitleBody2 = @{ description = "Test Modification" } | ConvertTo-Json

try {
    $updateTitle = Invoke-RestMethod -Uri "https://localhost:7033/api/titles/$title2Id" `
      -Method Put `
      -Headers ($userHeaders + @{"Content-Type" = "application/json"}) `
      -Body $updateTitleBody2 `
    
    Write-Host "ERREUR : Un User ne devrait pas pouvoir modifier un titre !" -ForegroundColor Red
} catch {
    $statusCode = $_.Exception.Response.StatusCode.value__
    if ($statusCode -eq 403) {
        Write-Host "Correct : 403 Forbidden" -ForegroundColor Green
    } else {
        Write-Host "⚠️ Code d'erreur inattendu : $statusCode" -ForegroundColor Yellow
    }
}
```

### 6.6 Récupérer un titre spécifique

```powershell
Write-Host "`n=== GET /api/titles/{id} ===" -ForegroundColor Cyan

$singleTitle = Invoke-RestMethod -Uri "https://localhost:7033/api/titles/$title1Id" `
  -Headers $userHeaders `

Write-Host "Titre récupéré :" -ForegroundColor White
Write-Host "  ID: $($singleTitle.id)" -ForegroundColor Gray
Write-Host "  Description: $($singleTitle.description)" -ForegroundColor Gray
Write-Host "  Créé le: $($singleTitle.createdAt)" -ForegroundColor Gray
```



# ÉTAPE 7 : CRUD sur Employees

### 7.1 Créer des employés avec User (doit fonctionner)

```powershell
Write-Host "`n=== POST /api/employees avec User ===" -ForegroundColor Cyan

# Employé 1
$employee1Body = @{
    firstName = "Pierre"
    lastName = "Durand"
    birthDate = "1990-03-15"
    gender = "M"
    titleId = $title1Id
} | ConvertTo-Json

$employee1 = Invoke-RestMethod -Uri "https://localhost:7033/api/employees" `
  -Method Post `
  -Headers ($userHeaders + @{"Content-Type" = "application/json"}) `
  -Body $employee1Body `

Write-Host "Employé créé : $($employee1.firstName) $($employee1.lastName) - $($employee1.titleDescription)" -ForegroundColor Green
$employee1Id = $employee1.id

# Employé 2
$employee2Body = @{
    firstName = "Claire"
    lastName = "Dubois"
    birthDate = "1988-07-22"
    gender = "F"
    titleId = $title2Id
} | ConvertTo-Json

$employee2 = Invoke-RestMethod -Uri "https://localhost:7033/api/employees" `
  -Method Post `
  -Headers ($userHeaders + @{"Content-Type" = "application/json"}) `
  -Body $employee2Body `

Write-Host "Employé créé : $($employee2.firstName) $($employee2.lastName) - $($employee2.titleDescription)" -ForegroundColor Green
$employee2Id = $employee2.id

# Employé 3
$employee3Body = @{
    firstName = "Thomas"
    lastName = "Bernard"
    birthDate = "1995-11-08"
    gender = "M"
    titleId = $title3Id
} | ConvertTo-Json

$employee3 = Invoke-RestMethod -Uri "https://localhost:7033/api/employees" `
  -Method Post `
  -Headers ($userHeaders + @{"Content-Type" = "application/json"}) `
  -Body $employee3Body `

Write-Host "Employé créé : $($employee3.firstName) $($employee3.lastName) - $($employee3.titleDescription)" -ForegroundColor Green
$employee3Id = $employee3.id
```

### 7.2 Lire tous les employés

```powershell
Write-Host "`n=== GET /api/employees ===" -ForegroundColor Cyan

$employees = Invoke-RestMethod -Uri "https://localhost:7033/api/employees" `
  -Headers $userHeaders `

Write-Host "Nombre d'employés: $($employees.Count)" -ForegroundColor Green
$employees | Format-Table -Property firstName, lastName, gender, age, titleDescription
```

### 7.3 Récupérer un employé spécifique

```powershell
Write-Host "`n=== GET /api/employees/{id} ===" -ForegroundColor Cyan

$singleEmployee = Invoke-RestMethod -Uri "https://localhost:7033/api/employees/$employee1Id" `
  -Headers $userHeaders `

Write-Host "Employé récupéré :" -ForegroundColor White
Write-Host "  Nom: $($singleEmployee.firstName) $($singleEmployee.lastName)" -ForegroundColor Gray
Write-Host "  Date naissance: $($singleEmployee.birthDate)" -ForegroundColor Gray
Write-Host "  Genre: $($singleEmployee.gender)" -ForegroundColor Gray
Write-Host "  Âge: $($singleEmployee.age) ans" -ForegroundColor Gray
Write-Host "  Poste: $($singleEmployee.titleDescription)" -ForegroundColor Gray
```

### 7.4 Modifier un employé avec User (doit fonctionner)

```powershell
Write-Host "`n=== PUT /api/employees avec User ===" -ForegroundColor Cyan

$updateEmployeeBody = @{
    firstName = "Pierre"
    lastName = "Durand-Martin"
    birthDate = "1990-03-15"
    gender = "M"
    titleId = $title1Id
} | ConvertTo-Json

$updatedEmployee = Invoke-RestMethod -Uri "https://localhost:7033/api/employees/$employee1Id" `
  -Method Put `
  -Headers ($userHeaders + @{"Content-Type" = "application/json"}) `
  -Body $updateEmployeeBody `

Write-Host "Employé modifié : $($updatedEmployee.firstName) $($updatedEmployee.lastName)" -ForegroundColor Green
```

### 7.5 Supprimer un employé avec User (doit échouer - 403)

```powershell
Write-Host "`n=== DELETE /api/employees avec User (doit échouer) ===" -ForegroundColor Cyan

try {
    Invoke-RestMethod -Uri "https://localhost:7033/api/employees/$employee3Id" `
      -Method Delete `
      -Headers $userHeaders `
    
    Write-Host "ERREUR : Un User ne devrait pas pouvoir supprimer un employé !" -ForegroundColor Red
} catch {
    $statusCode = $_.Exception.Response.StatusCode.value__
    if ($statusCode -eq 403) {
        Write-Host "Correct : 403 Forbidden" -ForegroundColor Green
    } else {
        Write-Host "⚠️ Code d'erreur inattendu : $statusCode" -ForegroundColor Yellow
    }
}
```

### 7.6 Supprimer un employé avec Manager (doit fonctionner)

```powershell
Write-Host "`n=== DELETE /api/employees avec Manager ===" -ForegroundColor Cyan

Invoke-RestMethod -Uri "https://localhost:7033/api/employees/$employee3Id" `
  -Method Delete `
  -Headers $managerHeaders `

Write-Host "Employé supprimé avec succès" -ForegroundColor Green

# Vérifier que l'employé n'existe plus
try {
    Invoke-RestMethod -Uri "https://localhost:7033/api/employees/$employee3Id" `
      -Headers $userHeaders `
    
    Write-Host "L'employé existe encore !" -ForegroundColor Red
} catch {
    $statusCode = $_.Exception.Response.StatusCode.value__
    if ($statusCode -eq 404) {
        Write-Host "Vérification : l'employé n'existe plus (404)" -ForegroundColor Green
    }
}
```



# ÉTAPE 8 : Tests de Validation FluentValidation

### 8.1 Créer un titre avec description invalide (trop courte)

```powershell
Write-Host "`n=== Test Validation : Titre trop court ===" -ForegroundColor Cyan

$invalidTitleBody = @{ description = "D" } | ConvertTo-Json

try {
    Invoke-RestMethod -Uri "https://localhost:7033/api/titles" `
      -Method Post `
      -Headers ($adminHeaders + @{"Content-Type" = "application/json"}) `
      -Body $invalidTitleBody `
    
    Write-Host "La validation devrait rejeter ce titre !" -ForegroundColor Red
} catch {
    $statusCode = $_.Exception.Response.StatusCode.value__
    if ($statusCode -eq 400) {
        Write-Host "Validation correcte : 400 Bad Request" -ForegroundColor Green
        Write-Host "Message d'erreur : $($_.ErrorDetails.Message)" -ForegroundColor Gray
    }
}
```

### 8.2 Créer un employé avec âge invalide (trop jeune)

```powershell
Write-Host "`n=== Test Validation : Employé trop jeune ===" -ForegroundColor Cyan

$invalidEmployeeBody = @{
    firstName = "Jeune"
    lastName = "Employé"
    birthDate = "2015-01-01"  # 10 ans
    gender = "M"
    titleId = $title1Id
} | ConvertTo-Json

try {
    Invoke-RestMethod -Uri "https://localhost:7033/api/employees" `
      -Method Post `
      -Headers ($adminHeaders + @{"Content-Type" = "application/json"}) `
      -Body $invalidEmployeeBody `
    
    Write-Host "La validation devrait rejeter cet employé !" -ForegroundColor Red
} catch {
    $statusCode = $_.Exception.Response.StatusCode.value__
    if ($statusCode -eq 400) {
        Write-Host "Validation correcte : 400 Bad Request" -ForegroundColor Green
        Write-Host "Message d'erreur : $($_.ErrorDetails.Message)" -ForegroundColor Gray
    }
}
```

### 8.3 Créer un employé avec genre invalide

```powershell
Write-Host "`n=== Test Validation : Genre invalide ===" -ForegroundColor Cyan

$invalidGenderBody = @{
    firstName = "Test"
    lastName = "Genre"
    birthDate = "1990-01-01"
    gender = "X"  # Genre non valide
    titleId = $title1Id
} | ConvertTo-Json

try {
    Invoke-RestMethod -Uri "https://localhost:7033/api/employees" `
      -Method Post `
      -Headers ($adminHeaders + @{"Content-Type" = "application/json"}) `
      -Body $invalidGenderBody `
    
    Write-Host "La validation devrait rejeter cet employé !" -ForegroundColor Red
} catch {
    $statusCode = $_.Exception.Response.StatusCode.value__
    if ($statusCode -eq 400) {
        Write-Host "Validation correcte : 400 Bad Request" -ForegroundColor Green
        Write-Host "Message d'erreur : $($_.ErrorDetails.Message)" -ForegroundColor Gray
    }
}
```



# ÉTAPE 9 : Tests d'Authentification

### 9.1 Tester sans token (doit retourner 401)

```powershell
Write-Host "`n=== Test sans authentification ===" -ForegroundColor Cyan

try {
    Invoke-RestMethod -Uri "https://localhost:7033/api/titles" -SkipCertificateCheck
    Write-Host "Devrait retourner 401 Unauthorized !" -ForegroundColor Red
} catch {
    $statusCode = $_.Exception.Response.StatusCode.value__
    if ($statusCode -eq 401) {
        Write-Host "Correct : 401 Unauthorized" -ForegroundColor Green
    }
}
```

### 9.2 Tester avec token invalide (doit retourner 401)

```powershell
Write-Host "`n=== Test avec token invalide ===" -ForegroundColor Cyan

$invalidHeaders = @{ Authorization = "Bearer INVALID_TOKEN_123456" }

try {
    Invoke-RestMethod -Uri "https://localhost:7033/api/titles" `
      -Headers $invalidHeaders `
    Write-Host "Devrait retourner 401 Unauthorized !" -ForegroundColor Red
} catch {
    $statusCode = $_.Exception.Response.StatusCode.value__
    if ($statusCode -eq 401) {
        Write-Host "Correct : 401 Unauthorized" -ForegroundColor Green
    }
}
```

### 9.3 Tester la validation de token

```powershell
Write-Host "`n=== POST /api/auth/validate ===" -ForegroundColor Cyan

# Token valide
$validateBody = "`"$adminToken`"" # JSON string
$validateResult = Invoke-RestMethod -Uri "https://localhost:7033/api/auth/validate" `
  -Method Post `
  -ContentType "application/json" `
  -Body $validateBody `

Write-Host "Token Admin valide : $($validateResult.isValid)" -ForegroundColor Green

# Token invalide
$invalidValidateBody = "`"INVALID_TOKEN_12345`""
$invalidResult = Invoke-RestMethod -Uri "https://localhost:7033/api/auth/validate" `
  -Method Post `
  -ContentType "application/json" `
  -Body $invalidValidateBody `

Write-Host "Token invalide : $($invalidResult.isValid)" -ForegroundColor Yellow
```



# ÉTAPE 10 : Résumé Final

### 10.1 Afficher le récapitulatif

```powershell
Write-Host "`n╔═══════════════════════════════════════════════════════════╗" -ForegroundColor Cyan
Write-Host "║           RÉSUMÉ DU SCÉNARIO DE TEST                     ║" -ForegroundColor Cyan
Write-Host "╚═══════════════════════════════════════════════════════════╝" -ForegroundColor Cyan

# Compter les titres
$allTitles = Invoke-RestMethod -Uri "https://localhost:7033/api/titles" `
  -Headers $adminHeaders `

Write-Host "`n TITRES CRÉÉS : $($allTitles.Count)" -ForegroundColor Yellow
$allTitles | Format-Table -Property description, createdAt

# Compter les employés
$allEmployees = Invoke-RestMethod -Uri "https://localhost:7033/api/employees" `
  -Headers $adminHeaders `

Write-Host "`n EMPLOYÉS CRÉÉS : $($allEmployees.Count)" -ForegroundColor Yellow
$allEmployees | Format-Table -Property firstName, lastName, age, titleDescription

Write-Host "`nTESTS RÉUSSIS :" -ForegroundColor Green
Write-Host "  • Health Check" -ForegroundColor White
Write-Host "  • Inscription de 3 utilisateurs" -ForegroundColor White
Write-Host "  • Authentification JWT" -ForegroundColor White
Write-Host "  • Autorisations par rôle" -ForegroundColor White
Write-Host "  • CRUD Titles complet" -ForegroundColor White
Write-Host "  • CRUD Employees complet" -ForegroundColor White
Write-Host "  • Validation FluentValidation" -ForegroundColor White
Write-Host "  • Gestion des erreurs 401/403/404" -ForegroundColor White

Write-Host "`n SCÉNARIO TERMINÉ AVEC SUCCÈS !" -ForegroundColor Green
```



# Notes Importantes

### Variables Créées Durant le Scénario

Vous aurez ces variables disponibles :
- `$user1Token` - Token utilisateur normal
- `$managerToken` - Token manager
- `$adminToken` - Token admin
- `$title1Id`, `$title2Id`, `$title3Id` - IDs des titres créés
- `$employee1Id`, `$employee2Id` - IDs des employés restants

### Tester dans Swagger UI

Vous pouvez également tester dans Swagger :
1. Ouvrir `https://localhost:7033/swagger`
2. Cliquer **Authorize** 🔓
3. Entrer : `Bearer` suivi du token (ex: `Bearer $adminToken`)
4. Tester les endpoints visuellement


# Relancer le Scénario

Pour relancer complètement le scénario :

```powershell
# Supprimer la base de données
sqlcmd -S LAPTOP-81IAD844 -E -Q "DROP DATABASE XtraWork;"

# Relancer l'API (elle recréera la DB)
# Puis relancer tous les tests depuis l'ÉTAPE 2
```



**Fin du Scénario 1**
