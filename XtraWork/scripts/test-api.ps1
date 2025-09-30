param(
  [string]$BaseUrl = "https://localhost:7033"
)

Write-Host "`n========================================" -ForegroundColor Cyan
Write-Host "TESTS API XTRAWORK" -ForegroundColor Cyan
Write-Host "========================================`n" -ForegroundColor Cyan

# Test 1: Health Check
Write-Host "1. Test Health Check..." -ForegroundColor Yellow
try { 
    $healthResponse = Invoke-WebRequest "$BaseUrl/health" -UseBasicParsing -SkipCertificateCheck
    Write-Host "   ✓ Health Check: $($healthResponse.StatusCode) - $($healthResponse.Content)" -ForegroundColor Green
} catch { 
    Write-Host "   ✗ Health Check échoué: $($_.Exception.Response.StatusCode.value__)" -ForegroundColor Red
}

# Test 2: GET /api/titles sans token (doit retourner 401)
Write-Host "`n2. Test GET /api/titles sans authentification (attendu: 401)..." -ForegroundColor Yellow
try { 
    $response = Invoke-WebRequest "$BaseUrl/api/titles" -UseBasicParsing -SkipCertificateCheck
    Write-Host "   ✗ Devrait retourner 401 mais a retourné: $($response.StatusCode)" -ForegroundColor Red
} catch { 
    if ($_.Exception.Response.StatusCode.value__ -eq 401) {
        Write-Host "   ✓ Retourne bien 401 Unauthorized" -ForegroundColor Green
    } else {
        Write-Host "   ✗ Erreur inattendue: $($_.Exception.Response.StatusCode.value__)" -ForegroundColor Red
    }
}

# Test 3: Inscription
Write-Host "`n3. Test inscription d'un utilisateur..." -ForegroundColor Yellow
$registerBody = @{
    username = "admin"
    email = "admin@xtrawork.com"
    password = "Admin123!"
    firstName = "Jean"
    lastName = "Administrateur"
} | ConvertTo-Json

try {
    $registerResponse = Invoke-RestMethod "$BaseUrl/api/auth/register" -Method Post -ContentType "application/json" -Body $registerBody -SkipCertificateCheck
    $token = $registerResponse.token
    Write-Host "   ✓ Inscription réussie" -ForegroundColor Green
    Write-Host "   → Token: $($token.Substring(0, 30))..." -ForegroundColor Gray
    Write-Host "   → User: $($registerResponse.user.username) ($($registerResponse.user.role))" -ForegroundColor Gray
} catch {
    if ($_.Exception.Response.StatusCode.value__ -eq 400) {
        Write-Host "   ℹ Utilisateur déjà existant, tentative de connexion..." -ForegroundColor Yellow
        
        # Test 4: Connexion
        Write-Host "`n4. Test connexion..." -ForegroundColor Yellow
        $loginBody = @{
            username = "admin"
            password = "Admin123!"
        } | ConvertTo-Json
        
        try {
            $loginResponse = Invoke-RestMethod "$BaseUrl/api/auth/login" -Method Post -ContentType "application/json" -Body $loginBody -SkipCertificateCheck
            $token = $loginResponse.token
            Write-Host "   ✓ Connexion réussie" -ForegroundColor Green
            Write-Host "   → Token: $($token.Substring(0, 30))..." -ForegroundColor Gray
        } catch {
            Write-Host "   ✗ Connexion échouée: $($_.Exception.Message)" -ForegroundColor Red
            exit 1
        }
    }
}

if (-not $token) {
    Write-Host "`n✗ Impossible d'obtenir un token d'authentification" -ForegroundColor Red
    exit 1
}

# Test 5: GET /api/titles avec token
Write-Host "`n5. Test GET /api/titles avec authentification..." -ForegroundColor Yellow
try {
    $headers = @{ Authorization = "Bearer $token" }
    $titlesResponse = Invoke-RestMethod "$BaseUrl/api/titles" -Headers $headers -SkipCertificateCheck
    Write-Host "   ✓ Récupération des titres réussie" -ForegroundColor Green
    Write-Host "   → Nombre de titres: $($titlesResponse.Count)" -ForegroundColor Gray
} catch {
    Write-Host "   ✗ Échec: $($_.Exception.Message)" -ForegroundColor Red
}

# Test 6: GET /api/auth/me
Write-Host "`n6. Test GET /api/auth/me..." -ForegroundColor Yellow
try {
    $headers = @{ Authorization = "Bearer $token" }
    $meResponse = Invoke-RestMethod "$BaseUrl/api/auth/me" -Headers $headers -SkipCertificateCheck
    Write-Host "   ✓ Informations utilisateur récupérées" -ForegroundColor Green
    Write-Host "   → Username: $($meResponse.username)" -ForegroundColor Gray
    Write-Host "   → Email: $($meResponse.email)" -ForegroundColor Gray
    Write-Host "   → Role: $($meResponse.role)" -ForegroundColor Gray
} catch {
    Write-Host "   ✗ Échec: $($_.Exception.Message)" -ForegroundColor Red
}

# Test 7: POST /api/titles (nécessite rôle Admin)
Write-Host "`n7. Test POST /api/titles (création)..." -ForegroundColor Yellow
$titleBody = @{
    description = "Développeur Full Stack"
} | ConvertTo-Json

try {
    $headers = @{ 
        Authorization = "Bearer $token"
        "Content-Type" = "application/json"
    }
    $createTitleResponse = Invoke-RestMethod "$BaseUrl/api/titles" -Method Post -Headers $headers -Body $titleBody -SkipCertificateCheck
    Write-Host "   ✓ Titre créé avec succès" -ForegroundColor Green
    Write-Host "   → ID: $($createTitleResponse.id)" -ForegroundColor Gray
    Write-Host "   → Description: $($createTitleResponse.description)" -ForegroundColor Gray
} catch {
    $statusCode = $_.Exception.Response.StatusCode.value__
    if ($statusCode -eq 403) {
        Write-Host "   ℹ Accès refusé (nécessite rôle Admin)" -ForegroundColor Yellow
    } else {
        Write-Host "   ✗ Échec ($statusCode): $($_.Exception.Message)" -ForegroundColor Red
    }
}

Write-Host "`n========================================" -ForegroundColor Cyan
Write-Host "TESTS TERMINÉS" -ForegroundColor Cyan
Write-Host "========================================`n" -ForegroundColor Cyan

Write-Host "Pour accéder à Swagger UI: $BaseUrl/swagger" -ForegroundColor Magenta
Write-Host "Token à utiliser dans Swagger: Bearer $token`n" -ForegroundColor Magenta
