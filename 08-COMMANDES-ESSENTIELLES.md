# Commandes Essentielles - XtraWork

Toutes les commandes dont vous avez besoin en un seul endroit.

---

## Démarrage Rapide

### Backend
```powershell
cd XtraWork
dotnet run
```
https://localhost:7033 | Swagger : /swagger

### Frontend
```powershell
cd frontend
npm install        # Première fois seulement
npm run dev
```
http://localhost:3000

---

## Backend (ASP.NET Core)

### Développement
```powershell
# Démarrer l'API
dotnet run

# Démarrer avec rechargement automatique
dotnet watch run

# Build du projet
dotnet build

# Restaurer les packages NuGet
dotnet restore

# Nettoyer les binaires
dotnet clean
```

### Base de données
```powershell
# Créer/mettre à jour la base de données
dotnet ef database update

# Créer une nouvelle migration
dotnet ef migrations add NomDeLaMigration

# Lister les migrations
dotnet ef migrations list

# Supprimer la dernière migration
dotnet ef migrations remove

# Supprimer la base de données
dotnet ef database drop
```

### Tests et Health
```powershell
# Vérifier l'état de l'API
curl -k https://localhost:7033/health

# Tester un endpoint
curl -k https://localhost:7033/api/titles

# Avec authentification
$token = "votre-token"
curl -k -H "Authorization: Bearer $token" https://localhost:7033/api/employees
```

---

## Frontend (Next.js)

### Développement
```powershell
# Démarrer en mode développement
npm run dev

# Sur un port différent
npm run dev -- -p 3001

# Build pour production
npm run build

# Démarrer en production
npm start

# Mode production local
npm run build
npm start
```

### Installation
```powershell
# Installer toutes les dépendances
npm install

# Installer une nouvelle dépendance
npm install nom-du-package

# Installer en dev dependency
npm install -D nom-du-package

# Mettre à jour les dépendances
npm update
```

### Quality & Tests
```powershell
# Vérifier les types TypeScript
npm run type-check

# Linter
npm run lint

# Corriger automatiquement les erreurs de lint
npm run lint -- --fix

# Nettoyer le cache Next.js
Remove-Item -Recurse -Force .next
```

---

## Gestion des Packages

### Backend (NuGet)
```powershell
# Lister les packages installés
dotnet list package

# Ajouter un package
dotnet add package NomDuPackage

# Mettre à jour un package
dotnet add package NomDuPackage --version X.Y.Z

# Supprimer un package
dotnet remove package NomDuPackage
```

### Frontend (npm)
```powershell
# Voir les packages outdated
npm outdated

# Mettre à jour un package spécifique
npm update nom-du-package

# Voir les dépendances installées
npm list --depth=0

# Nettoyer node_modules et réinstaller
Remove-Item -Recurse -Force node_modules
npm install
```

---

## Debugging

### Backend
```powershell
# Voir les logs en temps réel
Get-Content -Path "XtraWork\logs\xtrawork-*.txt" -Wait -Tail 50

# Vérifier les processus .NET
Get-Process -Name "dotnet"

# Tuer un processus .NET
Stop-Process -Name "dotnet"

# Vérifier SQL Server
sqlcmd -S localhost -Q "SELECT @@VERSION"
```

### Frontend
```powershell
# Nettoyer le cache
Remove-Item -Recurse -Force .next
Remove-Item -Recurse -Force node_modules\.cache

# Vérifier les processus Node
Get-Process -Name "node"

# Tuer un processus Node
Stop-Process -Name "node"

# Vérifier le port 3000
netstat -ano | findstr :3000
```

---

## Base de Données

### SQL Server
```powershell
# Se connecter à SQL Server
sqlcmd -S localhost -E

# Lister les bases de données
sqlcmd -S localhost -E -Q "SELECT name FROM sys.databases"

# Vérifier si XtraWork existe
sqlcmd -S localhost -E -Q "SELECT * FROM sys.databases WHERE name = 'XtraWork'"

# Supprimer la base de données
sqlcmd -S localhost -E -Q "DROP DATABASE XtraWork"

# Créer une sauvegarde
sqlcmd -S localhost -E -Q "BACKUP DATABASE XtraWork TO DISK='C:\Backup\XtraWork.bak'"
```

---

## Authentification

### Tester l'authentification
```powershell
# 1. Login
$response = Invoke-RestMethod -Uri "https://localhost:7033/api/auth/login" `
  -Method Post `
  -ContentType "application/json" `
  -Body '{"username":"admin","password":"Admin123!"}' `
  -SkipCertificateCheck

# 2. Extraire le token
$token = $response.token

# 3. Utiliser le token
$headers = @{ Authorization = "Bearer $token" }
Invoke-RestMethod -Uri "https://localhost:7033/api/employees" `
  -Headers $headers `
  -SkipCertificateCheck
```

---

## Nettoyage

### Backend
```powershell
# Nettoyer les binaires
dotnet clean

# Supprimer bin et obj
Get-ChildItem -Include bin,obj -Recurse | Remove-Item -Recurse -Force

# Nettoyer les logs
Remove-Item -Path "XtraWork\logs\*" -Force
```

### Frontend
```powershell
# Nettoyer Next.js
Remove-Item -Recurse -Force .next

# Nettoyer node_modules
Remove-Item -Recurse -Force node_modules

# Nettoyer tout
Remove-Item -Recurse -Force .next, node_modules
npm install
```

---

## Production

### Backend
```powershell
# Build en mode Release
dotnet build --configuration Release

# Publier l'application
dotnet publish --configuration Release --output ./publish

# Démarrer en production
$env:ASPNETCORE_ENVIRONMENT="Production"
dotnet run --configuration Release
```

### Frontend
```powershell
# Build optimisé
npm run build

# Analyser le build
npm run build
# Puis ouvrir .next/analyze/client.html

# Démarrer en production
npm start
```

---

## Git (Optionnel)

```powershell
# Initialiser un repo
git init

# Ajouter tous les fichiers
git add .

# Ignorer les fichiers générés
git add -A -- ':!/.vs' ':!**/.vs/**' ':!**/bin/**' ':!**/obj/**' ':!**/node_modules/**'

# Commit
git commit -m "feat: ajout frontend Next.js"

# Voir le statut
git status

# Voir l'historique
git log --oneline

# Créer une branche
git checkout -b feature/nouvelle-fonctionnalite
```

---

## Monitoring

### Backend
```powershell
# Voir les logs en continu
Get-Content -Path "XtraWork\logs\xtrawork-$(Get-Date -Format 'yyyyMMdd').txt" -Wait

# Statistiques de l'API
Invoke-RestMethod -Uri "https://localhost:7033/health" -SkipCertificateCheck
```

### Frontend
```powershell
# Analyser les performances
# Ouvrir les DevTools (F12) → Lighthouse → Générer un rapport
```

---

## Dépannage Rapide

### Problème : Port déjà utilisé

**Backend (7033)**
```powershell
# Trouver le processus
netstat -ano | findstr :7033

# Tuer le processus (remplacer PID)
Stop-Process -Id PID -Force
```

**Frontend (3000)**
```powershell
# Trouver le processus
netstat -ano | findstr :3000

# Tuer le processus (remplacer PID)
Stop-Process -Id PID -Force

# Ou démarrer sur un autre port
npm run dev -- -p 3001
```

### Problème : Token expiré
```javascript
// Dans la console du navigateur (F12)
localStorage.clear()
// Puis se reconnecter
```

### Problème : CORS
```powershell
# Vérifier que le backend est lancé
curl -k https://localhost:7033/health

# Vérifier la configuration CORS dans Program.cs
# Vérifier NEXT_PUBLIC_API_URL dans .env.local
```

### Problème : Base de données
```powershell
# Réinitialiser la base de données
dotnet ef database drop --force
dotnet ef database update
```

---

## Liens Utiles

- **Backend** : https://localhost:7033
- **Swagger** : https://localhost:7033/swagger
- **Frontend** : http://localhost:3000
- **Health Check** : https://localhost:7033/health

---

## Workflow Quotidien

### Début de journée
```powershell
# Terminal 1 : Backend
cd XtraWork
dotnet watch run

# Terminal 2 : Frontend
cd frontend
npm run dev
```

### Fin de journée
```powershell
# Ctrl+C dans chaque terminal pour arrêter
# Ou fermer les terminaux
```

---

Conseil : Gardez ce fichier ouvert pendant le développement.

