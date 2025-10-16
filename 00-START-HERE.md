# DÉMARRER XTRAWORK - LE PLUS IMPORTANT

## ORDRE DE LECTURE

1. **Lire ce fichier** (2 minutes)
2. **Suivre 03-GUIDE-TRES-IMPORTANT-DEMARRAGE-EXHAUSTIF.md** (30 minutes première fois)

---

## DÉMARRAGE EN 5 MINUTES

### TERMINAL 1 - Backend

```powershell
cd XtraWork
dotnet run
```

Attendre : "Now listening on: https://localhost:7033"

### TERMINAL 2 - Frontend

```powershell
cd frontend
npm install
npm run dev
```

Attendre : "Ready in XXXms"

### NAVIGATEUR

```
http://localhost:3000
```

**Connexion :**
- Username : admin
- Password : Admin123!

---

## SI ÇA NE MARCHE PAS

**Backend ne démarre pas ?**
```powershell
dotnet clean
dotnet restore
dotnet run
```

**Frontend ne démarre pas ?**
```powershell
Remove-Item -Recurse -Force node_modules
npm install
npm run dev
```

**Erreur de connexion ?**
- Vérifier que Backend est lancé
- Utiliser exactement : admin / Admin123!

**Token expiré ?**
```javascript
// Dans console navigateur (F12)
localStorage.clear()
```

---

## PRÉREQUIS

Vérifier que ces commandes fonctionnent :

```powershell
dotnet --version    # Doit afficher 8.0.xxx
node --version      # Doit afficher v18 ou v20
npm --version       # Doit afficher 9 ou 10
```

Si erreur, installer :
- .NET 8.0 SDK : https://dotnet.microsoft.com/download
- Node.js LTS : https://nodejs.org/

---

## STRUCTURE DU PROJET

```
SuiviEtudiantsEtape2/
├── XtraWork/          Backend ASP.NET Core (Port 7033)
├── frontend/          Frontend Next.js (Port 3000)
└── 03-GUIDE...md      Guide complet étape par étape
```

---

## URLS IMPORTANTES

- **Application** : http://localhost:3000
- **Backend API** : https://localhost:7033
- **Swagger** : https://localhost:7033/swagger
- **Health Check** : https://localhost:7033/health

---

## AIDE

**Premier démarrage complet ?**
→ Lire 03-GUIDE-TRES-IMPORTANT-DEMARRAGE-EXHAUSTIF.md

**Démarrages suivants ?**
→ Utiliser ce fichier

**Problème technique ?**
→ Section 8 de 03-GUIDE-TRES-IMPORTANT-DEMARRAGE-EXHAUSTIF.md

**Chercher une commande ?**
→ 08-COMMANDES-ESSENTIELLES.md

**Comprendre l'architecture ?**
→ 07-GUIDE-VISUEL.md

---

## CHECKLIST RAPIDE

- [ ] Backend démarré (https://localhost:7033)
- [ ] Frontend démarré (http://localhost:3000)
- [ ] Page d'accueil s'affiche
- [ ] Connexion admin/Admin123! fonctionne
- [ ] Dashboard affiché

Si tous cochés : Vous êtes prêt !

---

**IMPORTANT :** Gardez les 2 terminaux (Backend et Frontend) ouverts pendant l'utilisation.

