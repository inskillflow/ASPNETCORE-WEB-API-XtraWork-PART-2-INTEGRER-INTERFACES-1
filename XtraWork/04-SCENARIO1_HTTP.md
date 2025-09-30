# 🎬 Scénario 1 - Version HTTP (Port 5280)

**Utilisez ce fichier si HTTPS ne fonctionne pas**

## Différence avec la version HTTPS

Remplacez simplement toutes les URLs :
- ❌ `https://localhost:7033` 
- ✅ `http://localhost:5280`

Supprimez aussi `-SkipCertificateCheck` de toutes les commandes.

---

## ÉTAPE 1 : Démarrer l'API

```powershell
cd C:\Users\rehou\Downloads\2-SuiviEtudiantsEtape2\SuiviEtudiantsEtape2\XtraWork
dotnet run
```

---

## ÉTAPE 2 : Test Health Check

```powershell
Invoke-WebRequest -Uri "http://localhost:5280/health" | Select-Object StatusCode, Content
```

---

## ÉTAPE 3 : Inscription Utilisateur

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
Write-Host "✅ Utilisateur créé : $($user1Response.user.username)" -ForegroundColor Green
```

---

## ÉTAPE 4 : Tester avec le token

```powershell
$headers = @{ Authorization = "Bearer $user1Token" }
$titles = Invoke-RestMethod -Uri "http://localhost:5280/api/titles" -Headers $headers
Write-Host "✅ Titres récupérés : $($titles.Count)" -ForegroundColor Green
```

---

## 🌐 Swagger UI

Ouvrir dans le navigateur :
```
http://localhost:5280/swagger
```

---

**Toutes les autres commandes sont identiques, changez juste l'URL !**
