# Guide d'Acces : Documentation HTML et Test de l'API

## PARTIE 1 : Acceder aux Pages HTML de Documentation

### Methode 1 : Double-Clic (Le Plus Simple)

1. Ouvrez l'explorateur de fichiers Windows
2. Naviguez vers : `C:\Users\rehou\Downloads\2-SuiviEtudiantsEtape2\SuiviEtudiantsEtape2\html`
3. **Double-cliquez sur `index.html`**
4. La page s'ouvre dans votre navigateur par defaut (Chrome/Edge/Firefox)

### Methode 2 : Depuis PowerShell

```powershell
# Ouvrir la page d'accueil
Start-Process "html/index.html"

# Ou ouvrir une classe specifique
Start-Process "html/entities/User.html"

# Ou ouvrir la navigation rapide
Start-Process "html/navigation-rapide.html"
```

### Methode 3 : Depuis VS Code / Visual Studio

1. Dans l'explorateur de fichiers a gauche
2. Naviguez vers `html/index.html`
3. Clic droit sur `index.html`
4. Choisissez **"Open with Live Server"** (si installe)
5. Ou **"Reveal in File Explorer"** puis double-clic

---

## PARTIE 2 : Navigation dans la Documentation HTML

### Structure de Navigation

```
html/index.html
    ↓
Cliquez sur une classe (ex: User.cs)
    ↓
html/entities/User.html
    ↓
Liens vers :
  - UserRepository.cs (Repository)
  - AuthService.cs (Service)
  - AuthController.cs (Controller)
    ↓
Continuez a naviguer entre les fichiers
```

### Pages Principales

| Page | Description | Quand l'utiliser |
|------|-------------|------------------|
| **index.html** | Page d'accueil | Commencer ici, vue d'ensemble |
| **navigation-rapide.html** | Liste alphabetique | Chercher une classe specifique |
| **endpoints-api.html** | Reference API REST | Voir tous les endpoints |
| **entities/User.html** | Documentation User | Comprendre l'authentification |
| **repositories/XtraWorkContext.html** | DbContext EF Core | Comprendre les relations |

### Navigation Intuitive

Chaque page HTML contient :
- **Breadcrumb en haut** : `Documentation > Entities > User.cs`
- **Liens vers fichiers lies** en bas de page
- **Bouton "Retour a l'index"** sur chaque page
- **Liens dans les explications** vers d'autres classes

---

## PARTIE 3 : Lancer l'API XtraWork

### Etape 1 : Verifier .NET SDK

```powershell
dotnet --version
# Doit afficher 6.x ou 9.x
```

### Etape 2 : Naviguer vers le projet

```powershell
cd XtraWork
```

### Etape 3 : Lancer l'API

```powershell
dotnet run --launch-profile https
```

**L'API demarre sur :**
- HTTPS : `https://localhost:7033`
- Swagger : `https://localhost:7033/swagger`

### Etape 4 : Attendre le message

Attendez de voir :
```
Now listening on: https://localhost:7033
```

---

## PARTIE 4 : Tester l'API avec Swagger UI (Remplir les Formulaires)

### Etape 1 : Ouvrir Swagger UI

1. **Ouvrez votre navigateur**
2. **Allez sur** : `https://localhost:7033/swagger`
3. Vous verrez l'interface Swagger avec tous les endpoints

### Etape 2 : Test 1 - Inscription d'un Utilisateur

1. **Trouvez l'endpoint** : `POST /api/auth/register`
2. **Cliquez sur la ligne** pour l'ouvrir
3. **Cliquez sur "Try it out"** (bouton bleu a droite)
4. **Remplissez le formulaire JSON** :

```json
{
  "username": "marie.user",
  "email": "marie@xtrawork.com",
  "password": "Marie123!",
  "firstName": "Marie",
  "lastName": "Dupont"
}
```

5. **Cliquez sur "Execute"** (bouton bleu en bas)
6. **Regardez la reponse** :
   - Code : `201 Created` = succes !
   - Body : vous recevez un `token` et les infos `user`
7. **COPIEZ LE TOKEN** (la longue chaine qui commence par `eyJ...`)

### Etape 3 : S'Authentifier dans Swagger

1. **Cliquez sur le bouton "Authorize"** (cadenas en haut a droite de la page)
2. **Dans le popup**, entrez :
```
Bearer COLLEZ_VOTRE_TOKEN_ICI
```
   Exemple :
```
Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJuYW1laWQ...
```
3. **Cliquez sur "Authorize"** (bouton dans le popup)
4. **Cliquez sur "Close"**
5. Vous etes maintenant authentifie ! Le cadenas est ferme.

### Etape 4 : Test 2 - Creer un Titre (Requiert Admin)

**IMPORTANT :** Par defaut, le role est "User". Pour creer un titre, vous devez etre "Admin".

**Option A - Changer le role en SQL :**

```powershell
sqlcmd -S localhost -d XtraWork -E -Q "UPDATE Users SET Role = 'Admin' WHERE Username = 'marie.user'; SELECT Username, Role FROM Users;"
```

**Option B - Creer un nouvel utilisateur et le passer Admin immediatement :**

Creez "admin" et changez son role en Admin en SQL.

**Ensuite, dans Swagger :**

1. **POST /api/title**
2. **Try it out**
3. **Remplissez** :
```json
{
  "description": "Developpeur Senior .NET"
}
```
4. **Execute**
5. **Copiez l'ID** du titre cree (dans la reponse)

### Etape 5 : Test 3 - Creer un Employe

1. **POST /api/employee**
2. **Try it out**
3. **Remplissez** (utilisez l'ID du titre cree) :
```json
{
  "firstName": "Jean",
  "lastName": "Dupont",
  "birthDate": "1990-05-15",
  "gender": "M",
  "titleId": "COLLEZ_L_ID_DU_TITRE_ICI"
}
```
4. **Execute**
5. Vous recevez l'employe cree avec `titleDescription` = "Developpeur Senior .NET"

### Etape 6 : Test 4 - Lister tous les Employes

1. **GET /api/employee**
2. **Try it out**
3. **Execute**
4. Vous voyez la liste de tous les employes avec leur titre

---

## PARTIE 5 : Remplir les Formulaires dans Swagger - Guide Detaille

### Anatomie de Swagger UI

```
+----------------------------------------------------------+
| Swagger UI                                    [Authorize]|
+----------------------------------------------------------+
|                                                          |
| Servers: https://localhost:7033                          |
|                                                          |
| POST /api/auth/register        [▼]                      |
| POST /api/auth/login           [▼]                      |
| GET  /api/auth/me              [▼] 🔒                   |
|                                                          |
| GET  /api/title                [▼] 🔒                   |
| POST /api/title                [▼] 🔒 Admin only        |
+----------------------------------------------------------+
```

### Comment Remplir un Formulaire

**Exemple avec POST /api/auth/register :**

1. **Cliquez sur la ligne** `POST /api/auth/register` pour l'ouvrir
2. Vous voyez :
```
POST /api/auth/register
Inscription nouvel utilisateur

Parameters:
  No parameters

Request body (required):
  application/json

[Try it out]
```

3. **Cliquez sur "Try it out"**
4. Le champ devient editable :
```json
{
  "username": "string",
  "email": "user@example.com",
  "password": "string",
  "firstName": "string",
  "lastName": "string"
}
```

5. **Remplacez** les valeurs par les votres :
```json
{
  "username": "marie.user",
  "email": "marie@xtrawork.com",
  "password": "Marie123!",
  "firstName": "Marie",
  "lastName": "Dupont"
}
```

6. **Cliquez sur "Execute"** (bouton bleu)

7. **Regardez la reponse** en dessous :
```
Response:
Code: 201 Created

Response body:
{
  "token": "eyJhbGc...",
  "user": {
    "id": "guid",
    "username": "marie.user",
    "email": "marie@xtrawork.com",
    "firstName": "Marie",
    "lastName": "Dupont",
    "role": "User"
  }
}
```

8. **IMPORTANT :** Selectionnez et copiez TOUT le token (commencant par `eyJ...`)

---

## PARTIE 6 : Tester Tous les Endpoints dans l'Ordre

### Scenario Complet de Test

**1. S'inscrire**
```
POST /api/auth/register
{
  "username": "admin",
  "email": "admin@xtrawork.com",
  "password": "Admin123!",
  "firstName": "Admin",
  "lastName": "Systeme"
}
```
→ Copiez le token

**2. S'authentifier dans Swagger**
- Cliquez **Authorize**
- Entrez : `Bearer VOTRE_TOKEN`
- Cliquez **Authorize**

**3. Changer le role en Admin (SQL)**
```sql
UPDATE Users SET Role = 'Admin' WHERE Username = 'admin';
```

**4. Se reconnecter pour avoir un nouveau token avec role Admin**
```
POST /api/auth/login
{
  "username": "admin",
  "password": "Admin123!"
}
```
→ Copiez le nouveau token
→ Cliquez **Authorize** et remplacez l'ancien token

**5. Creer un titre (Admin uniquement)**
```
POST /api/title
{
  "description": "Developpeur Senior .NET"
}
```
→ Copiez l'ID du titre cree

**6. Creer un employe**
```
POST /api/employee
{
  "firstName": "Jean",
  "lastName": "Dupont",
  "birthDate": "1990-05-15",
  "gender": "M",
  "titleId": "COLLEZ_L_ID_DU_TITRE_ICI"
}
```

**7. Lister tous les employes**
```
GET /api/employee
```

**8. Tester les infos utilisateur connecte**
```
GET /api/auth/me
```

---

## PARTIE 7 : Ouvrir et Naviguer dans la Documentation HTML

### Acces Rapide (Recommande)

```powershell
# Ouvrir la page d'accueil
Start-Process "html/index.html"

# Ouvrir la navigation rapide
Start-Process "html/navigation-rapide.html"

# Ouvrir la reference des endpoints
Start-Process "html/endpoints-api.html"
```

### Navigation dans la Documentation

**Depuis index.html :**

1. Vous voyez 8 sections (Entities, Repositories, Services, etc.)
2. Cliquez sur une classe, par exemple **User.cs**
3. Vous arrivez sur `html/entities/User.html`
4. Lisez le code source et les explications
5. En bas de page, cliquez sur **UserRepository.cs**
6. Vous arrivez sur `html/repositories/UserRepository.html`
7. Continuez a naviguer entre les fichiers lies

**Depuis navigation-rapide.html :**

1. Liste alphabetique de TOUTES les 24 classes
2. Utilisez **Ctrl+F** pour chercher
3. Exemple : cherchez "Employee"
4. Cliquez sur le lien **Ouvrir** correspondant

---

## PARTIE 8 : Guide Visuel Swagger UI

### Zones de Swagger UI

```
┌─────────────────────────────────────────────────────────┐
│ Swagger UI              [Authorize 🔓] [Explore]        │ ← Bouton Authorize ICI
├─────────────────────────────────────────────────────────┤
│                                                         │
│ 🟢 Auth                                                 │
│   POST /api/auth/register    [▼]                       │ ← Cliquez pour ouvrir
│   POST /api/auth/login       [▼]                       │
│   GET  /api/auth/me          [▼] 🔒                    │ ← 🔒 = Authentification requise
│                                                         │
│ 🟡 Title                                                │
│   GET    /api/title          [▼] 🔒                    │
│   POST   /api/title          [▼] 🔒 Admin              │ ← Admin only
│   GET    /api/title/{id}     [▼] 🔒                    │
│   PUT    /api/title/{id}     [▼] 🔒 Manager/Admin      │
│   DELETE /api/title/{id}     [▼] 🔒 Admin              │
│                                                         │
│ 🔵 Employee                                             │
│   GET    /api/employee       [▼] 🔒                    │
│   POST   /api/employee       [▼] 🔒                    │
│   GET    /api/employee/{id}  [▼] 🔒                    │
│   PUT    /api/employee/{id}  [▼] 🔒                    │
│   DELETE /api/employee/{id}  [▼] 🔒 Manager/Admin      │
└─────────────────────────────────────────────────────────┘
```

### Remplir un Formulaire dans Swagger

**Quand vous cliquez sur un endpoint, vous voyez :**

```
POST /api/auth/register
Inscription nouvel utilisateur

Parameters                           [Try it out]  ← Cliquez ICI
  No parameters

Request body *
  application/json

  {                                  ← Ce champ devient editable
    "username": "string",               apres "Try it out"
    "email": "user@example.com",
    "password": "string",
    "firstName": "string",
    "lastName": "string"
  }

                                     [Execute]     ← Puis cliquez ICI
```

**Apres avoir clique "Execute", vous voyez la reponse :**

```
Responses

Curl
  curl -X 'POST' ...

Request URL
  https://localhost:7033/api/auth/register

Server response
  Code: 201                          ← Code HTTP
  
Response body
  {                                  ← Reponse JSON
    "token": "eyJhbGc...",              COPIEZ CE TOKEN !
    "user": {
      "id": "guid",
      "username": "marie.user",
      ...
    }
  }
```

---

## PARTIE 9 : Erreurs Courantes et Solutions

### Erreur : "Unauthorized" (401)

**Probleme :** Vous n'etes pas authentifie ou le token a expire

**Solution :**
1. Cliquez **Authorize** dans Swagger
2. Entrez : `Bearer VOTRE_TOKEN`
3. Cliquez **Authorize**

### Erreur : "Forbidden" (403)

**Probleme :** Votre role n'est pas suffisant

**Solution :**
1. Verifiez votre role avec `GET /api/auth/me`
2. Changez le role en SQL :
```sql
UPDATE Users SET Role = 'Admin' WHERE Username = 'votre-username';
```
3. Reconnectez-vous avec `POST /api/auth/login` pour avoir un nouveau token

### Erreur : "Bad Request" (400)

**Probleme :** Donnees invalides

**Solution :**
- Verifiez que tous les champs obligatoires sont remplis
- Verifiez le format de l'email
- Verifiez la longueur du password (min 6 caracteres)
- Verifiez le format de birthDate : "1990-05-15"

### Erreur : "Not Found" (404)

**Probleme :** L'ID n'existe pas

**Solution :**
- Verifiez que l'ID existe (GET /api/title pour lister tous les titres)
- Copiez l'ID exact depuis la reponse

---

## PARTIE 10 : Workflow Complet de Test

### Scenario : Creer un employe de A a Z

**Etape 1 : Lancer l'API**
```powershell
cd XtraWork
dotnet run --launch-profile https
```

**Etape 2 : Ouvrir Swagger**
- Navigateur : `https://localhost:7033/swagger`

**Etape 3 : S'inscrire**
- `POST /api/auth/register`
- Try it out
- Remplir le JSON
- Execute
- **COPIER LE TOKEN**

**Etape 4 : S'authentifier**
- Cliquez **Authorize**
- Entrez `Bearer VOTRE_TOKEN`
- Authorize

**Etape 5 : Passer Admin en SQL**
```powershell
sqlcmd -S localhost -d XtraWork -E -Q "UPDATE Users SET Role = 'Admin' WHERE Username = 'marie.user';"
```

**Etape 6 : Se reconnecter**
- `POST /api/auth/login`
- username: "marie.user"
- password: "Marie123!"
- **COPIER LE NOUVEAU TOKEN**
- **Authorize** avec le nouveau token

**Etape 7 : Creer un titre**
- `POST /api/title`
- description: "Manager"
- Execute
- **COPIER L'ID DU TITRE**

**Etape 8 : Creer un employe**
- `POST /api/employee`
- firstName: "Jean"
- lastName: "Dupont"
- birthDate: "1990-05-15"
- gender: "M"
- titleId: "COLLEZ_L_ID_DU_TITRE"
- Execute

**Etape 9 : Verifier**
- `GET /api/employee`
- Execute
- Vous voyez Jean Dupont avec titleDescription = "Manager"

---

## PARTIE 11 : Raccourcis Utiles

### Ouvrir tout en meme temps

```powershell
# Ouvrir la documentation HTML
Start-Process "html/index.html"

# Attendre 2 secondes
Start-Sleep -Seconds 2

# Ouvrir Swagger UI
Start-Process "https://localhost:7033/swagger"
```

### Verifier que l'API tourne

```powershell
Get-Process -Name dotnet
```

### Voir les logs de l'API

Les logs sont dans la console ou l'API tourne. Si lancee en arriere-plan, regardez le fichier de sortie ou relancez en mode normal :

```powershell
cd XtraWork
dotnet run
```

---

## PARTIE 12 : Acces Rapides

| Ressource | Lien/Commande | Description |
|-----------|---------------|-------------|
| **Documentation HTML** | `html/index.html` | Guide complet 24 classes |
| **Swagger UI** | `https://localhost:7033/swagger` | Tester l'API |
| **Health Check** | `https://localhost:7033/health` | Verifier l'API |
| **Guide de lancement** | `COMMENT-LANCER-API.md` | Commandes detaillees |
| **Ce guide** | `GUIDE-ACCES-DOCUMENTATION-ET-API.md` | Acces et formulaires |

---

## Resume Rapide

```powershell
# 1. Lancer l'API
cd XtraWork
dotnet run --launch-profile https

# 2. Ouvrir la documentation (dans un autre terminal)
Start-Process "html/index.html"

# 3. Ouvrir Swagger UI
Start-Process "https://localhost:7033/swagger"

# 4. Tester dans Swagger :
#    - POST /api/auth/register
#    - Copier le token
#    - Cliquer Authorize
#    - Entrer : Bearer VOTRE_TOKEN
#    - Tester les autres endpoints !
```

---

**Vous avez maintenant tout ce qu'il faut pour utiliser la documentation HTML ET tester l'API !**

