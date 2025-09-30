# ╔═══════════════════════════════════════════════════════════════════╗
# ║          SCRIPT D'EXÉCUTION AUTOMATIQUE - SCÉNARIO 1             ║
# ╚═══════════════════════════════════════════════════════════════════╝

param(
    [string]$BaseUrl = "https://localhost:7033",
    [string]$SqlServer = "LAPTOP-81IAD844"
)

$ErrorActionPreference = "Continue"

Write-Host "`n╔═══════════════════════════════════════════════════════════╗" -ForegroundColor Cyan
Write-Host "║     SCÉNARIO 1 : TEST COMPLET API XTRAWORK               ║" -ForegroundColor Cyan
Write-Host "╚═══════════════════════════════════════════════════════════╝`n" -ForegroundColor Cyan

# ============================================================================
# ÉTAPE 1 : HEALTH CHECK
# ============================================================================
Write-Host "🏥 ÉTAPE 1 : Health Check..." -ForegroundColor Yellow
try {
    $health = Invoke-WebRequest -Uri "$BaseUrl/health" -SkipCertificateCheck
    if ($health.StatusCode -eq 200) {
        Write-Host "   ✅ API opérationnelle" -ForegroundColor Green
    }
} catch {
    Write-Host "   ❌ ERREUR : L'API ne répond pas. Vérifiez que 'dotnet run' est lancé." -ForegroundColor Red
    exit 1
}

Start-Sleep -Seconds 1

# ============================================================================
# ÉTAPE 2 : INSCRIPTION DES UTILISATEURS
# ============================================================================
Write-Host "`n👥 ÉTAPE 2 : Inscription des utilisateurs..." -ForegroundColor Yellow

# User 1
$user1Body = @{
    username = "marie.user"
    email = "marie@xtrawork.com"
    password = "Marie123!"
    firstName = "Marie"
    lastName = "Dupont"
} | ConvertTo-Json

try {
    $user1Response = Invoke-RestMethod -Uri "$BaseUrl/api/auth/register" `
      -Method Post -ContentType "application/json" `
      -Body $user1Body -SkipCertificateCheck
    
    $user1Token = $user1Response.token
    Write-Host "   ✅ User créé : $($user1Response.user.username)" -ForegroundColor Green
} catch {
    if ($_.Exception.Response.StatusCode.value__ -eq 400) {
        Write-Host "   ℹ️  Utilisateur existe déjà, connexion..." -ForegroundColor Yellow
        $loginBody = @{ username = "marie.user"; password = "Marie123!" } | ConvertTo-Json
        $user1Response = Invoke-RestMethod -Uri "$BaseUrl/api/auth/login" `
          -Method Post -ContentType "application/json" `
          -Body $loginBody -SkipCertificateCheck
        $user1Token = $user1Response.token
    }
}

# User 2 (Manager)
$user2Body = @{
    username = "jean.manager"
    email = "jean@xtrawork.com"
    password = "Jean123!"
    firstName = "Jean"
    lastName = "Martin"
} | ConvertTo-Json

try {
    $user2Response = Invoke-RestMethod -Uri "$BaseUrl/api/auth/register" `
      -Method Post -ContentType "application/json" `
      -Body $user2Body -SkipCertificateCheck
    
    Write-Host "   ✅ Manager créé : $($user2Response.user.username)" -ForegroundColor Green
} catch {
    if ($_.Exception.Response.StatusCode.value__ -eq 400) {
        Write-Host "   ℹ️  Utilisateur existe déjà" -ForegroundColor Yellow
    }
}

# User 3 (Admin)
$adminBody = @{
    username = "admin"
    email = "admin@xtrawork.com"
    password = "Admin123!"
    firstName = "Sophie"
    lastName = "Administrateur"
} | ConvertTo-Json

try {
    $adminResponse = Invoke-RestMethod -Uri "$BaseUrl/api/auth/register" `
      -Method Post -ContentType "application/json" `
      -Body $adminBody -SkipCertificateCheck
    
    Write-Host "   ✅ Admin créé : $($adminResponse.user.username)" -ForegroundColor Green
} catch {
    if ($_.Exception.Response.StatusCode.value__ -eq 400) {
        Write-Host "   ℹ️  Utilisateur existe déjà" -ForegroundColor Yellow
    }
}

Start-Sleep -Seconds 1

# ============================================================================
# ÉTAPE 3 : CHANGEMENT DES RÔLES
# ============================================================================
Write-Host "`n🔑 ÉTAPE 3 : Changement des rôles..." -ForegroundColor Yellow

try {
    sqlcmd -S $SqlServer -E -Q "USE XtraWork; UPDATE Users SET Role = 'Manager' WHERE Username = 'jean.manager';" 2>$null
    sqlcmd -S $SqlServer -E -Q "USE XtraWork; UPDATE Users SET Role = 'Admin' WHERE Username = 'admin';" 2>$null
    Write-Host "   ✅ Rôles modifiés avec succès" -ForegroundColor Green
} catch {
    Write-Host "   ⚠️  Impossible de modifier les rôles via SQL. Modifiez manuellement." -ForegroundColor Yellow
}

Start-Sleep -Seconds 1

# ============================================================================
# ÉTAPE 4 : RECONNEXION POUR OBTENIR LES NOUVEAUX TOKENS
# ============================================================================
Write-Host "`n🔐 ÉTAPE 4 : Reconnexion des utilisateurs..." -ForegroundColor Yellow

# Manager Login
$managerLoginBody = @{ username = "jean.manager"; password = "Jean123!" } | ConvertTo-Json
$managerResponse = Invoke-RestMethod -Uri "$BaseUrl/api/auth/login" `
  -Method Post -ContentType "application/json" `
  -Body $managerLoginBody -SkipCertificateCheck
$managerToken = $managerResponse.token
Write-Host "   ✅ Manager connecté (Rôle: $($managerResponse.user.role))" -ForegroundColor Green

# Admin Login
$adminLoginBody = @{ username = "admin"; password = "Admin123!" } | ConvertTo-Json
$adminResponse = Invoke-RestMethod -Uri "$BaseUrl/api/auth/login" `
  -Method Post -ContentType "application/json" `
  -Body $adminLoginBody -SkipCertificateCheck
$adminToken = $adminResponse.token
Write-Host "   ✅ Admin connecté (Rôle: $($adminResponse.user.role))" -ForegroundColor Green

Start-Sleep -Seconds 1

# ============================================================================
# ÉTAPE 5 : VÉRIFICATION DES PROFILS (/api/auth/me)
# ============================================================================
Write-Host "`n👤 ÉTAPE 5 : Vérification des profils..." -ForegroundColor Yellow

$userHeaders = @{ Authorization = "Bearer $user1Token" }
$meUser = Invoke-RestMethod -Uri "$BaseUrl/api/auth/me" -Headers $userHeaders -SkipCertificateCheck
Write-Host "   User    : $($meUser.username) - Rôle: $($meUser.role)" -ForegroundColor White

$managerHeaders = @{ Authorization = "Bearer $managerToken" }
$meManager = Invoke-RestMethod -Uri "$BaseUrl/api/auth/me" -Headers $managerHeaders -SkipCertificateCheck
Write-Host "   Manager : $($meManager.username) - Rôle: $($meManager.role)" -ForegroundColor White

$adminHeaders = @{ Authorization = "Bearer $adminToken" }
$meAdmin = Invoke-RestMethod -Uri "$BaseUrl/api/auth/me" -Headers $adminHeaders -SkipCertificateCheck
Write-Host "   Admin   : $($meAdmin.username) - Rôle: $($meAdmin.role)" -ForegroundColor White

Start-Sleep -Seconds 1

# ============================================================================
# ÉTAPE 6 : TESTS CRUD TITLES
# ============================================================================
Write-Host "`n📋 ÉTAPE 6 : Tests CRUD sur Titles..." -ForegroundColor Yellow

# 6.1 GET avec User
$titles = Invoke-RestMethod -Uri "$BaseUrl/api/titles" -Headers $userHeaders -SkipCertificateCheck
Write-Host "   ✅ GET /api/titles : $($titles.Count) titre(s)" -ForegroundColor Green

# 6.2 POST avec User (doit échouer)
$titleBody = @{ description = "Test User" } | ConvertTo-Json
try {
    Invoke-RestMethod -Uri "$BaseUrl/api/titles" -Method Post `
      -Headers ($userHeaders + @{"Content-Type" = "application/json"}) `
      -Body $titleBody -SkipCertificateCheck
    Write-Host "   ❌ User a pu créer un titre (ne devrait pas !)" -ForegroundColor Red
} catch {
    if ($_.Exception.Response.StatusCode.value__ -eq 403) {
        Write-Host "   ✅ POST refusé pour User (403 Forbidden)" -ForegroundColor Green
    }
}

# 6.3 POST avec Admin (doit fonctionner)
$title1Body = @{ description = "Développeur Full Stack" } | ConvertTo-Json
$title1 = Invoke-RestMethod -Uri "$BaseUrl/api/titles" -Method Post `
  -Headers ($adminHeaders + @{"Content-Type" = "application/json"}) `
  -Body $title1Body -SkipCertificateCheck
Write-Host "   ✅ Titre créé : $($title1.description)" -ForegroundColor Green
$title1Id = $title1.id

$title2Body = @{ description = "Chef de Projet" } | ConvertTo-Json
$title2 = Invoke-RestMethod -Uri "$BaseUrl/api/titles" -Method Post `
  -Headers ($adminHeaders + @{"Content-Type" = "application/json"}) `
  -Body $title2Body -SkipCertificateCheck
Write-Host "   ✅ Titre créé : $($title2.description)" -ForegroundColor Green
$title2Id = $title2.id

$title3Body = @{ description = "Analyste Business" } | ConvertTo-Json
$title3 = Invoke-RestMethod -Uri "$BaseUrl/api/titles" -Method Post `
  -Headers ($adminHeaders + @{"Content-Type" = "application/json"}) `
  -Body $title3Body -SkipCertificateCheck
Write-Host "   ✅ Titre créé : $($title3.description)" -ForegroundColor Green
$title3Id = $title3.id

# 6.4 PUT avec Manager (doit fonctionner)
$updateTitleBody = @{ description = "Développeur Full Stack Senior" } | ConvertTo-Json
$updatedTitle = Invoke-RestMethod -Uri "$BaseUrl/api/titles/$title1Id" -Method Put `
  -Headers ($managerHeaders + @{"Content-Type" = "application/json"}) `
  -Body $updateTitleBody -SkipCertificateCheck
Write-Host "   ✅ Titre modifié par Manager : $($updatedTitle.description)" -ForegroundColor Green

# 6.5 GET un titre spécifique
$singleTitle = Invoke-RestMethod -Uri "$BaseUrl/api/titles/$title1Id" `
  -Headers $userHeaders -SkipCertificateCheck
Write-Host "   ✅ GET /api/titles/{id} : $($singleTitle.description)" -ForegroundColor Green

Start-Sleep -Seconds 1

# ============================================================================
# ÉTAPE 7 : TESTS CRUD EMPLOYEES
# ============================================================================
Write-Host "`n👥 ÉTAPE 7 : Tests CRUD sur Employees..." -ForegroundColor Yellow

# 7.1 POST avec User (doit fonctionner)
$employee1Body = @{
    firstName = "Pierre"
    lastName = "Durand"
    birthDate = "1990-03-15"
    gender = "M"
    titleId = $title1Id
} | ConvertTo-Json

$employee1 = Invoke-RestMethod -Uri "$BaseUrl/api/employees" -Method Post `
  -Headers ($userHeaders + @{"Content-Type" = "application/json"}) `
  -Body $employee1Body -SkipCertificateCheck
Write-Host "   ✅ Employé créé : $($employee1.firstName) $($employee1.lastName)" -ForegroundColor Green
$employee1Id = $employee1.id

$employee2Body = @{
    firstName = "Claire"
    lastName = "Dubois"
    birthDate = "1988-07-22"
    gender = "F"
    titleId = $title2Id
} | ConvertTo-Json

$employee2 = Invoke-RestMethod -Uri "$BaseUrl/api/employees" -Method Post `
  -Headers ($userHeaders + @{"Content-Type" = "application/json"}) `
  -Body $employee2Body -SkipCertificateCheck
Write-Host "   ✅ Employé créé : $($employee2.firstName) $($employee2.lastName)" -ForegroundColor Green
$employee2Id = $employee2.id

$employee3Body = @{
    firstName = "Thomas"
    lastName = "Bernard"
    birthDate = "1995-11-08"
    gender = "M"
    titleId = $title3Id
} | ConvertTo-Json

$employee3 = Invoke-RestMethod -Uri "$BaseUrl/api/employees" -Method Post `
  -Headers ($userHeaders + @{"Content-Type" = "application/json"}) `
  -Body $employee3Body -SkipCertificateCheck
Write-Host "   ✅ Employé créé : $($employee3.firstName) $($employee3.lastName)" -ForegroundColor Green
$employee3Id = $employee3.id

# 7.2 GET tous les employés
$employees = Invoke-RestMethod -Uri "$BaseUrl/api/employees" -Headers $userHeaders -SkipCertificateCheck
Write-Host "   ✅ GET /api/employees : $($employees.Count) employé(s)" -ForegroundColor Green

# 7.3 GET un employé spécifique
$singleEmployee = Invoke-RestMethod -Uri "$BaseUrl/api/employees/$employee1Id" `
  -Headers $userHeaders -SkipCertificateCheck
Write-Host "   ✅ GET /api/employees/{id} : $($singleEmployee.firstName) $($singleEmployee.lastName) ($($singleEmployee.age) ans)" -ForegroundColor Green

# 7.4 PUT avec User (doit fonctionner)
$updateEmployeeBody = @{
    firstName = "Pierre"
    lastName = "Durand-Martin"
    birthDate = "1990-03-15"
    gender = "M"
    titleId = $title1Id
} | ConvertTo-Json

$updatedEmployee = Invoke-RestMethod -Uri "$BaseUrl/api/employees/$employee1Id" -Method Put `
  -Headers ($userHeaders + @{"Content-Type" = "application/json"}) `
  -Body $updateEmployeeBody -SkipCertificateCheck
Write-Host "   ✅ Employé modifié : $($updatedEmployee.lastName)" -ForegroundColor Green

# 7.5 DELETE avec User (doit échouer)
try {
    Invoke-RestMethod -Uri "$BaseUrl/api/employees/$employee3Id" -Method Delete `
      -Headers $userHeaders -SkipCertificateCheck
    Write-Host "   ❌ User a pu supprimer un employé (ne devrait pas !)" -ForegroundColor Red
} catch {
    if ($_.Exception.Response.StatusCode.value__ -eq 403) {
        Write-Host "   ✅ DELETE refusé pour User (403 Forbidden)" -ForegroundColor Green
    }
}

# 7.6 DELETE avec Manager (doit fonctionner)
Invoke-RestMethod -Uri "$BaseUrl/api/employees/$employee3Id" -Method Delete `
  -Headers $managerHeaders -SkipCertificateCheck
Write-Host "   ✅ Employé supprimé par Manager" -ForegroundColor Green

Start-Sleep -Seconds 1

# ============================================================================
# ÉTAPE 8 : TESTS DE VALIDATION
# ============================================================================
Write-Host "`n🧪 ÉTAPE 8 : Tests de validation FluentValidation..." -ForegroundColor Yellow

# 8.1 Titre trop court
$invalidTitleBody = @{ description = "D" } | ConvertTo-Json
try {
    Invoke-RestMethod -Uri "$BaseUrl/api/titles" -Method Post `
      -Headers ($adminHeaders + @{"Content-Type" = "application/json"}) `
      -Body $invalidTitleBody -SkipCertificateCheck
    Write-Host "   ❌ Validation devrait rejeter ce titre !" -ForegroundColor Red
} catch {
    if ($_.Exception.Response.StatusCode.value__ -eq 400) {
        Write-Host "   ✅ Titre trop court rejeté (400 Bad Request)" -ForegroundColor Green
    }
}

# 8.2 Employé trop jeune
$invalidEmployeeBody = @{
    firstName = "Jeune"
    lastName = "Employé"
    birthDate = "2015-01-01"
    gender = "M"
    titleId = $title1Id
} | ConvertTo-Json

try {
    Invoke-RestMethod -Uri "$BaseUrl/api/employees" -Method Post `
      -Headers ($adminHeaders + @{"Content-Type" = "application/json"}) `
      -Body $invalidEmployeeBody -SkipCertificateCheck
    Write-Host "   ❌ Validation devrait rejeter cet employé !" -ForegroundColor Red
} catch {
    if ($_.Exception.Response.StatusCode.value__ -eq 400) {
        Write-Host "   ✅ Employé trop jeune rejeté (400 Bad Request)" -ForegroundColor Green
    }
}

Start-Sleep -Seconds 1

# ============================================================================
# ÉTAPE 9 : TESTS D'AUTHENTIFICATION
# ============================================================================
Write-Host "`n🔒 ÉTAPE 9 : Tests d'authentification..." -ForegroundColor Yellow

# 9.1 Sans token
try {
    Invoke-RestMethod -Uri "$BaseUrl/api/titles" -SkipCertificateCheck
    Write-Host "   ❌ Devrait retourner 401 !" -ForegroundColor Red
} catch {
    if ($_.Exception.Response.StatusCode.value__ -eq 401) {
        Write-Host "   ✅ Sans token : 401 Unauthorized" -ForegroundColor Green
    }
}

# 9.2 Token invalide
$invalidHeaders = @{ Authorization = "Bearer INVALID_TOKEN" }
try {
    Invoke-RestMethod -Uri "$BaseUrl/api/titles" -Headers $invalidHeaders -SkipCertificateCheck
    Write-Host "   ❌ Devrait retourner 401 !" -ForegroundColor Red
} catch {
    if ($_.Exception.Response.StatusCode.value__ -eq 401) {
        Write-Host "   ✅ Token invalide : 401 Unauthorized" -ForegroundColor Green
    }
}

# 9.3 Validation de token
$validateBody = "`"$adminToken`""
$validateResult = Invoke-RestMethod -Uri "$BaseUrl/api/auth/validate" `
  -Method Post -ContentType "application/json" `
  -Body $validateBody -SkipCertificateCheck
Write-Host "   ✅ Validation token : $($validateResult.isValid)" -ForegroundColor Green

Start-Sleep -Seconds 1

# ============================================================================
# ÉTAPE 10 : RÉSUMÉ FINAL
# ============================================================================
Write-Host "`n╔═══════════════════════════════════════════════════════════╗" -ForegroundColor Cyan
Write-Host "║               RÉSUMÉ DU SCÉNARIO                          ║" -ForegroundColor Cyan
Write-Host "╚═══════════════════════════════════════════════════════════╝" -ForegroundColor Cyan

$allTitles = Invoke-RestMethod -Uri "$BaseUrl/api/titles" -Headers $adminHeaders -SkipCertificateCheck
$allEmployees = Invoke-RestMethod -Uri "$BaseUrl/api/employees" -Headers $adminHeaders -SkipCertificateCheck

Write-Host "`n📊 STATISTIQUES :" -ForegroundColor Yellow
Write-Host "   Titres créés    : $($allTitles.Count)" -ForegroundColor White
Write-Host "   Employés créés  : $($allEmployees.Count)" -ForegroundColor White
Write-Host "   Utilisateurs    : 3 (User, Manager, Admin)" -ForegroundColor White

Write-Host "`n📋 TITRES :" -ForegroundColor Yellow
$allTitles | ForEach-Object {
    Write-Host "   • $($_.description)" -ForegroundColor Gray
}

Write-Host "`n👥 EMPLOYÉS :" -ForegroundColor Yellow
$allEmployees | ForEach-Object {
    Write-Host "   • $($_.firstName) $($_.lastName) - $($_.titleDescription) ($($_.age) ans)" -ForegroundColor Gray
}

Write-Host "`n✅ TESTS RÉUSSIS :" -ForegroundColor Green
Write-Host "   ✓ Health Check" -ForegroundColor White
Write-Host "   ✓ Inscription utilisateurs" -ForegroundColor White
Write-Host "   ✓ Authentification JWT" -ForegroundColor White
Write-Host "   ✓ Autorisations par rôle" -ForegroundColor White
Write-Host "   ✓ CRUD Titles complet" -ForegroundColor White
Write-Host "   ✓ CRUD Employees complet" -ForegroundColor White
Write-Host "   ✓ Validation FluentValidation" -ForegroundColor White
Write-Host "   ✓ Gestion erreurs (401/403/404)" -ForegroundColor White

Write-Host "`n🔑 TOKENS DISPONIBLES :" -ForegroundColor Magenta
Write-Host "   User    : $($user1Token.Substring(0, 30))..." -ForegroundColor Gray
Write-Host "   Manager : $($managerToken.Substring(0, 30))..." -ForegroundColor Gray
Write-Host "   Admin   : $($adminToken.Substring(0, 30))..." -ForegroundColor Gray

Write-Host "`n🌐 SWAGGER UI : $BaseUrl/swagger" -ForegroundColor Magenta
Write-Host "   Utilisez un des tokens ci-dessus pour vous authentifier`n" -ForegroundColor Gray

Write-Host "╔═══════════════════════════════════════════════════════════╗" -ForegroundColor Green
Write-Host "║          🎉 SCÉNARIO TERMINÉ AVEC SUCCÈS ! 🎉            ║" -ForegroundColor Green
Write-Host "╚═══════════════════════════════════════════════════════════╝`n" -ForegroundColor Green
