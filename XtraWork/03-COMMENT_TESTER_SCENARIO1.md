# 🎯 Comment Tester le Scénario 1

## 📋 Vue d'ensemble

Le scénario 1 teste **TOUTES** les fonctionnalités de l'API XtraWork :
- ✅ Authentification JWT
- ✅ Autorisation par rôles
- ✅ CRUD complet (Titles & Employees)
- ✅ Validation FluentValidation
- ✅ Gestion des erreurs

---

## 🚀 Méthode 1 : Script Automatique (RECOMMANDÉ)

### Étape 1 : Lancer l'API

**Terminal 1 (PowerShell) :**

```powershell
cd C:\Users\rehou\Downloads\2-SuiviEtudiantsEtape2\SuiviEtudiantsEtape2\XtraWork
dotnet run
```

⏸️ **LAISSER CE TERMINAL OUVERT**

Attendez de voir :
```
Now listening on: https://localhost:7033
```

---

### Étape 2 : Exécuter le scénario

**Terminal 2 (NOUVEAU PowerShell) :**

```powershell
cd C:\Users\rehou\Downloads\2-SuiviEtudiantsEtape2\SuiviEtudiantsEtape2\XtraWork\scripts
.\scenario1.ps1
```

### C'est tout ! 🎉

Le script va :
1. Tester l'API
2. Créer 3 utilisateurs (User, Manager, Admin)
3. Créer des titres
4. Créer des employés
5. Tester toutes les autorisations
6. Afficher un résumé complet

**Durée : environ 15 secondes**

---

## 📝 Méthode 2 : Étape par Étape (Manuel)

Si vous préférez exécuter les commandes manuellement et comprendre chaque étape :

### Étape 1 : Lancer l'API

**Terminal 1 :**
```powershell
cd C:\Users\rehou\Downloads\2-SuiviEtudiantsEtape2\SuiviEtudiantsEtape2\XtraWork
dotnet run
```

---

### Étape 2 : Ouvrir le fichier scenario1.md

**Ouvrir le fichier :**
```
XtraWork/scenario1.md
```

---

### Étape 3 : Copier-Coller les Commandes

**Dans un NOUVEAU terminal PowerShell**, copier et exécuter les commandes **dans l'ordre** :

1. **ÉTAPE 1** : Health Check
2. **ÉTAPE 2** : Tests
3. **ÉTAPE 3** : Inscription des utilisateurs
4. **ÉTAPE 4** : Changer les rôles (SQL)
5. **ÉTAPE 5** : Tests des endpoints /api/auth/me
6. **ÉTAPE 6** : CRUD sur Titles
7. **ÉTAPE 7** : CRUD sur Employees
8. **ÉTAPE 8** : Tests de validation
9. **ÉTAPE 9** : Tests d'authentification
10. **ÉTAPE 10** : Résumé final

---

## 🌐 Méthode 3 : Tester avec Swagger UI

### Étape 1 : Lancer l'API

```powershell
cd XtraWork
dotnet run
```

---

### Étape 2 : Ouvrir Swagger

Ouvrir dans votre navigateur :
```
https://localhost:7033/swagger
```

---

### Étape 3 : S'inscrire

1. Dérouler **POST /api/auth/register**
2. Cliquer **Try it out**
3. Entrer :
```json
{
  "username": "admin",
  "email": "admin@xtrawork.com",
  "password": "Admin123!",
  "firstName": "Sophie",
  "lastName": "Admin"
}
```
4. Cliquer **Execute**
5. **COPIER le token** dans la réponse

---

### Étape 4 : S'authentifier dans Swagger

1. Cliquer sur **Authorize** 🔓 (en haut)
2. Dans le champ, entrer :
```
Bearer VOTRE_TOKEN_ICI
```
(Remplacer `VOTRE_TOKEN_ICI` par le token copié)
3. Cliquer **Authorize**
4. Fermer la fenêtre

✅ **Vous êtes authentifié !**

---

### Étape 5 : Tester les endpoints

Maintenant vous pouvez tester tous les endpoints :
- **GET /api/titles** - Récupérer les titres
- **POST /api/titles** - Créer un titre
- **GET /api/employees** - Récupérer les employés
- etc.

---

## 🔧 Modifier le Rôle d'un Utilisateur

Par défaut, les utilisateurs créés ont le rôle "User".

### Méthode 1 : Via sqlcmd (PowerShell)

```powershell
# Changer en Admin
sqlcmd -S LAPTOP-81IAD844 -E -Q "USE XtraWork; UPDATE Users SET Role = 'Admin' WHERE Username = 'admin';"

# Changer en Manager
sqlcmd -S LAPTOP-81IAD844 -E -Q "USE XtraWork; UPDATE Users SET Role = 'Manager' WHERE Username = 'jean.manager';"
```

### Méthode 2 : Via SQL Server Management Studio

1. Ouvrir **SQL Server Management Studio**
2. Se connecter à `LAPTOP-81IAD844`
3. Ouvrir une nouvelle requête
4. Exécuter :

```sql
USE XtraWork;

-- Voir les utilisateurs
SELECT Username, Email, Role FROM Users;

-- Changer le rôle
UPDATE Users SET Role = 'Admin' WHERE Username = 'admin';
UPDATE Users SET Role = 'Manager' WHERE Username = 'jean.manager';

-- Vérifier
SELECT Username, Email, Role FROM Users;
```

### Méthode 3 : Via Azure Data Studio

Même procédure que SSMS.

---

## ⚠️ Important : Reconnecter après changement de rôle

Après avoir changé le rôle, **reconnectez-vous** pour obtenir un nouveau token avec les bonnes permissions :

```powershell
$loginBody = @{
    username = "admin"
    password = "Admin123!"
} | ConvertTo-Json

$response = Invoke-RestMethod -Uri "https://localhost:7033/api/auth/login" `
  -Method Post `
  -ContentType "application/json" `
  -Body $loginBody `
  -SkipCertificateCheck

$newToken = $response.token
Write-Host "Nouveau token : $($newToken.Substring(0, 30))..."
```

---

## 📊 Résultat Attendu du Scénario

À la fin du scénario, vous devriez avoir :

### Utilisateurs créés
- ✅ **marie.user** - Rôle : User
- ✅ **jean.manager** - Rôle : Manager
- ✅ **admin** - Rôle : Admin

### Titres créés
- ✅ Développeur Full Stack Senior
- ✅ Chef de Projet
- ✅ Analyste Business

### Employés créés
- ✅ Pierre Durand-Martin - Développeur Full Stack Senior (35 ans)
- ✅ Claire Dubois - Chef de Projet (37 ans)
- ~~Thomas Bernard~~ (supprimé pour tester le DELETE)

### Tests validés
- ✅ Health Check fonctionnel
- ✅ Inscription réussie
- ✅ Authentification JWT OK
- ✅ Autorisations par rôle OK
- ✅ CRUD complet OK
- ✅ Validation FluentValidation OK
- ✅ Gestion des erreurs OK (401/403/404)

---

## 🐛 Problèmes Fréquents

### L'API ne démarre pas

**Solution :**
```powershell
cd XtraWork
dotnet restore
dotnet build
dotnet run
```

### "Cannot connect to database"

**Solution :**
1. Vérifier que SQL Server est démarré
2. Tester la connexion :
```powershell
sqlcmd -S LAPTOP-81IAD844 -E -Q "SELECT @@VERSION"
```

### Erreur "Jwt:Key manquant"

**Solution :**
```powershell
dotnet user-secrets set "Jwt:Key" "7e6da5d9e5514ce288683845e6068df782a23f6c15fb43cd92e19b4147d8ce95"
```

### Le script scenario1.ps1 ne s'exécute pas

**Solution :**
```powershell
# Autoriser l'exécution de scripts
Set-ExecutionPolicy -ExecutionPolicy RemoteSigned -Scope CurrentUser

# Puis relancer
cd scripts
.\scenario1.ps1
```

### Erreur 401 sur tous les endpoints

**Solutions :**
1. Vérifier que le token est bien dans le header `Authorization`
2. Format : `Bearer {token}` (avec espace)
3. Reconnecter si le token est expiré (24h)

---

## 📈 Visualiser les Résultats

### Voir tous les titres

```powershell
$token = "VOTRE_TOKEN"
$headers = @{ Authorization = "Bearer $token" }
$titles = Invoke-RestMethod -Uri "https://localhost:7033/api/titles" -Headers $headers -SkipCertificateCheck
$titles | Format-Table
```

### Voir tous les employés

```powershell
$employees = Invoke-RestMethod -Uri "https://localhost:7033/api/employees" -Headers $headers -SkipCertificateCheck
$employees | Format-Table firstName, lastName, age, titleDescription
```

### Voir tous les utilisateurs (SQL)

```powershell
sqlcmd -S LAPTOP-81IAD844 -E -Q "USE XtraWork; SELECT Username, Email, Role, IsActive FROM Users;" -s "," | Format-Table
```

---

## 🔄 Relancer le Scénario

Pour relancer le scénario depuis le début :

### Option 1 : Supprimer la base de données

```powershell
# Arrêter l'API (Ctrl+C dans le terminal de l'API)

# Supprimer la DB
sqlcmd -S LAPTOP-81IAD844 -E -Q "DROP DATABASE IF EXISTS XtraWork;"

# Relancer l'API (elle recréera la DB)
dotnet run

# Relancer le scénario
cd scripts
.\scenario1.ps1
```

### Option 2 : Supprimer uniquement les données

```sql
USE XtraWork;

DELETE FROM Employees;
DELETE FROM Titles;
DELETE FROM Users;
```

---

## 📚 Ressources

- **Documentation complète** : `README.md`
- **Guide rapide** : `DEMARRAGE_RAPIDE.md`
- **Scénario détaillé** : `scenario1.md`
- **Script automatique** : `scripts/scenario1.ps1`
- **Commandes** : `COMMANDES_ESSENTIELLES.txt`

---

## 🎯 Checklist de Test

Avant de considérer le scénario réussi, vérifiez :

- [ ] L'API démarre sans erreur
- [ ] Health Check retourne "Healthy"
- [ ] 3 utilisateurs créés (User, Manager, Admin)
- [ ] Les rôles sont bien modifiés dans la DB
- [ ] Au moins 3 titres créés
- [ ] Au moins 2 employés créés
- [ ] Tests d'autorisation passent (403 pour actions non autorisées)
- [ ] Tests de validation passent (400 pour données invalides)
- [ ] Tests d'authentification passent (401 sans token)
- [ ] Le résumé final s'affiche correctement

---

## 🎉 Succès !

Si toutes les étapes se sont bien passées, vous avez :

✅ **Testé avec succès toutes les fonctionnalités de l'API XtraWork !**

Vous pouvez maintenant :
- Continuer à développer de nouvelles fonctionnalités
- Créer des scénarios de test plus avancés
- Déployer l'API en production

---

**Bon test ! 🚀**
