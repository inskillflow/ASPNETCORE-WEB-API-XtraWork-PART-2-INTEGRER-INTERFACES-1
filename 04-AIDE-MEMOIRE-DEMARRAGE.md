# AIDE-MÉMOIRE - DÉMARRAGE XTRAWORK

Guide de référence rapide pour démarrer l'application en quelques minutes.

---

## PRÉREQUIS

Vérifier que ces commandes fonctionnent :

```powershell
dotnet --version        # Doit afficher 8.0.xxx
node --version          # Doit afficher v18.x ou v20.x
npm --version           # Doit afficher 9.x ou 10.x
sqlcmd -S localhost -E -Q "SELECT 1"  # Doit se connecter à SQL Server
```

---

## DÉMARRAGE INITIAL (PREMIÈRE FOIS)

### ÉTAPE 1 : Backend

```powershell
# Naviguer vers le projet
cd C:\Users\rehou\Downloads\2-SuiviEtudiantsEtape3\SuiviEtudiantsEtape2\XtraWork

# Restaurer les packages
dotnet restore

# Démarrer
dotnet run
```

Résultat : Backend accessible sur https://localhost:7033

### ÉTAPE 2 : Frontend (Nouveau terminal)

```powershell
# Naviguer vers frontend
cd C:\Users\rehou\Downloads\2-SuiviEtudiantsEtape3\SuiviEtudiantsEtape2\frontend

# Installer les dépendances (première fois uniquement)
npm install

# Démarrer
npm run dev
```

Résultat : Frontend accessible sur http://localhost:3000

### ÉTAPE 3 : Connexion

1. Ouvrir : http://localhost:3000
2. Cliquer : "Se connecter"
3. Username : admin
4. Password : Admin123!
5. Cliquer : "Se connecter"

Résultat : Dashboard affiché

---

## DÉMARRAGE RAPIDE (FOIS SUIVANTES)

Si déjà installé, simplement :

### Terminal 1 - Backend
```powershell
cd C:\Users\rehou\Downloads\2-SuiviEtudiantsEtape3\SuiviEtudiantsEtape2\XtraWork
dotnet run
```

### Terminal 2 - Frontend
```powershell
cd C:\Users\rehou\Downloads\2-SuiviEtudiantsEtape3\SuiviEtudiantsEtape2\frontend
npm run dev
```

### Navigateur
```
http://localhost:3000
```

Durée totale : 30-60 secondes

---

## VÉRIFICATIONS RAPIDES

```powershell
# Backend en cours ?
curl -k https://localhost:7033/health
# Doit retourner : Healthy

# Frontend en cours ?
curl http://localhost:3000
# Doit retourner : du code HTML

# Ouvrir Swagger
start https://localhost:7033/swagger

# Ouvrir l'application
start http://localhost:3000
```

---

## RÉSOLUTION RAPIDE DES PROBLÈMES

### Backend ne démarre pas
```powershell
dotnet clean
dotnet restore
dotnet run
```

### Frontend ne démarre pas
```powershell
Remove-Item -Recurse -Force node_modules
Remove-Item -Force package-lock.json
npm install
npm run dev
```

### Port déjà utilisé

Backend (7033) :
```powershell
netstat -ano | findstr :7033
Stop-Process -Id [PID] -Force
```

Frontend (3000) :
```powershell
npm run dev -- -p 3001
```

### Erreur de connexion
1. Vérifier que Backend est démarré
2. Utiliser : admin / Admin123! (respecter la casse)
3. Ouvrir F12, onglet Console, vérifier les erreurs

### Token expiré
```javascript
// Dans la console navigateur (F12)
localStorage.clear()
// Puis rafraîchir et se reconnecter
```

### Erreur CORS
1. Vérifier Backend démarré
2. Redémarrer le Backend
3. Rafraîchir le Frontend

### Erreur base de données
```powershell
# Modifier XtraWork\appsettings.json
# Remplacer le nom du serveur par "."
"Server=.;Database=XtraWork;Trusted_Connection=True;Encrypt=True;TrustServerCertificate=True"
```

---

## STRUCTURE DES DOSSIERS

```
SuiviEtudiantsEtape2/
├── XtraWork/                # Backend ASP.NET Core
│   ├── Controllers/         # Endpoints API
│   ├── Services/            # Business logic
│   ├── Repositories/        # Data access
│   ├── Program.cs           # Configuration principale
│   └── appsettings.json     # Configuration DB et JWT
│
└── frontend/                # Frontend Next.js
    ├── src/
    │   ├── app/             # Pages
    │   ├── services/        # Services API
    │   ├── types/           # Types TypeScript
    │   └── store/           # State management
    ├── package.json         # Dépendances
    └── .env.local           # Configuration API
```

---

## URLS IMPORTANTES

- Application : http://localhost:3000
- Backend API : https://localhost:7033
- Swagger : https://localhost:7033/swagger
- Health Check : https://localhost:7033/health

---

## IDENTIFIANTS DE TEST

- Username : admin
- Password : Admin123!
- Rôle : Admin (tous les droits)

---

## ARRÊT DE L'APPLICATION

Dans chaque terminal (Backend et Frontend) :
1. Appuyer sur Ctrl+C
2. Confirmer si demandé

Ou fermer les fenêtres de terminal.

---

## COMMANDES UTILES

### Backend
```powershell
dotnet run              # Démarrer
dotnet watch run        # Démarrer avec rechargement auto
dotnet build            # Compiler
dotnet clean            # Nettoyer
```

### Frontend
```powershell
npm run dev             # Démarrer développement
npm run build           # Compiler production
npm run type-check      # Vérifier types TypeScript
```

### Base de données
```powershell
dotnet ef database update       # Créer/mettre à jour
dotnet ef migrations add Nom    # Nouvelle migration
```

---

## CHECKLIST DE DÉMARRAGE

- [ ] Backend démarré sur https://localhost:7033
- [ ] Frontend démarré sur http://localhost:3000
- [ ] Health check répond "Healthy"
- [ ] Page d'accueil s'affiche
- [ ] Connexion admin/Admin123! fonctionne
- [ ] Dashboard affiché après connexion
- [ ] Page employés accessible
- [ ] Pas d'erreur dans console navigateur (F12)

---

## DOCUMENTATION COMPLÈTE

Pour plus de détails :

- GUIDE-DEMARRAGE-EXHAUSTIF.md : Guide détaillé étape par étape
- DEMARRAGE-RAPIDE.md : Guide de démarrage rapide
- GUIDE-FRONTEND-BACKEND.md : Architecture et liaison
- README.md : Vue d'ensemble du projet
- COMMANDES-ESSENTIELLES.md : Toutes les commandes

---

## PROCHAINES ÉTAPES APRÈS DÉMARRAGE

1. Explorer le dashboard
2. Tester la navigation vers Employés
3. Consulter Swagger pour voir les endpoints
4. Lire la documentation
5. Commencer le développement

---

FIN DE L'AIDE-MÉMOIRE

