# 🚀 DÉMARRAGE IMMÉDIAT - 2 Minutes

## ✅ Instructions Ultra-Rapides

### Étape 1 : Ouvrir PowerShell

1. Appuyez sur `Windows + R`
2. Tapez `powershell`
3. Appuyez sur `Entrée`

---

### Étape 2 : Copier-Coller EXACTEMENT ces 4 commandes

```powershell
# 1. Aller dans le dossier
cd C:\Users\rehou\Downloads\2-SuiviEtudiantsEtape2\SuiviEtudiantsEtape2\XtraWork

# 2. Arrêter les processus dotnet existants
Get-Process -Name "dotnet" -ErrorAction SilentlyContinue | Stop-Process -Force

# 3. Attendre 2 secondes
Start-Sleep -Seconds 2

# 4. Lancer l'API
dotnet run
```

---

### Étape 3 : Vérifier

Vous devez voir :

```
info: Microsoft.Hosting.Lifetime[14]
      Now listening on: https://localhost:7033
info: Microsoft.Hosting.Lifetime[14]
      Now listening on: http://localhost:5280
info: Microsoft.Hosting.Lifetime[0]
      Application started. Press Ctrl+C to shut down.
```

✅ **C'est parfait ! L'API fonctionne !**

**⏸️ LAISSER CE TERMINAL OUVERT**

---

### Étape 4 : Tester dans le navigateur

Ouvrir votre navigateur et aller sur :

```
http://localhost:5280/swagger
```

Vous verrez l'interface Swagger !

---

## 🧪 Test Rapide (Optionnel)

Ouvrir un **NOUVEAU terminal PowerShell** et taper :

```powershell
Invoke-WebRequest -Uri "http://localhost:5280/health" | Select-Object StatusCode, Content
```

Résultat attendu :
```
StatusCode : 200
Content    : Healthy
```

---

## ❌ PROBLÈME ? Port déjà utilisé ?

Si vous voyez une erreur **"address already in use"** :

```powershell
# Arrêter TOUT
Get-Process -Name "dotnet" | Stop-Process -Force

# Attendre
Start-Sleep -Seconds 2

# Relancer
cd C:\Users\rehou\Downloads\2-SuiviEtudiantsEtape2\SuiviEtudiantsEtape2\XtraWork
dotnet run
```

---

## 📚 Prochaines Étapes

Une fois que l'API fonctionne :

1. **Tests automatiques :** Voir le fichier `SCENARIO1_HTTP.md`
2. **Tests Swagger :** Utiliser l'interface `http://localhost:5280/swagger`
3. **Tests manuels :** Suivre le fichier `scenario1.md`

---

## 🎯 Résumé Ultra-Court

| Commande | But |
|----------|-----|
| `cd XtraWork` | Aller dans le dossier |
| `Get-Process ... Stop-Process` | Nettoyer les ports |
| `dotnet run` | Lancer l'API |
| `http://localhost:5280/swagger` | Interface web |
| `http://localhost:5280/health` | Test rapide |

---

**C'est tout ! Vous êtes prêt ! 🎉**
