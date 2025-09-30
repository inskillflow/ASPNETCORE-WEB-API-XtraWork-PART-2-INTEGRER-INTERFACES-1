# Guide Complet : Tester 100% de l'API avec Swagger

## ETAPE 1 : Demarrer l'API

### 1.1 Ouvrir PowerShell

```powershell
cd C:\Users\rehou\Downloads\2-SuiviEtudiantsEtape2\SuiviEtudiantsEtape2\XtraWork

# Arreter les processus existants
Get-Process -Name "dotnet" -ErrorAction SilentlyContinue | Stop-Process -Force

# Attendre 2 secondes
Start-Sleep -Seconds 2

# Lancer l'API
dotnet run
```

### 1.2 Verifier que l'API est demarree

Vous devez voir :
```
Now listening on: https://localhost:7033
Now listening on: http://localhost:5280
Application started. Press Ctrl+C to shut down.
```

**LAISSER CE TERMINAL OUVERT**

---

## ETAPE 2 : Ouvrir Swagger UI

### 2.1 Ouvrir votre navigateur

Ouvrir Chrome, Edge, ou Firefox

### 2.2 Aller sur Swagger

```
https://localhost:7033/swagger/index.html
```

Vous verrez l'interface Swagger avec tous les endpoints organises par categories :
- Auth
- Employee
- Title
- WeatherForecast

---

## ETAPE 3 : Test Health Check (SANS authentification)

### 3.1 Scroller jusqu'a "GET /health"

Cliquer sur la ligne **GET /health**

### 3.2 Cliquer sur "Try it out"

Bouton bleu en haut a droite

### 3.3 Cliquer sur "Execute"

Bouton bleu en bas

### 3.4 Verifier la reponse

**Server response - Code : 200**
```
Healthy
```

---

## ETAPE 4 : Inscription des Utilisateurs

### 4.1 Creer le premier utilisateur (User normal)

1. Trouver **POST /api/auth/register**
2. Cliquer dessus pour ouvrir
3. Cliquer **Try it out**
4. Remplacer le JSON par :

```json
{
  "username": "marie.user",
  "email": "marie@xtrawork.com",
  "password": "Marie123!",
  "firstName": "Marie",
  "lastName": "Dupont"
}
```

5. Cliquer **Execute**
6. **COPIER LE TOKEN** dans la reponse (champ "token")

**Reponse attendue - Code 200 :**
```json
{
  "token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...",
  "user": {
    "id": 1,
    "username": "marie.user",
    "email": "marie@xtrawork.com",
    "role": "User",
    "firstName": "Marie",
    "lastName": "Dupont"
  }
}
```

### 4.2 Creer le deuxieme utilisateur (futur Manager)

Repeter avec :
```json
{
  "username": "jean.manager",
  "email": "jean@xtrawork.com",
  "password": "Jean123!",
  "firstName": "Jean",
  "lastName": "Martin"
}
```

**COPIER LE TOKEN**

### 4.3 Creer le troisieme utilisateur (futur Admin)

Repeter avec :
```json
{
  "username": "admin",
  "email": "admin@xtrawork.com",
  "password": "Admin123!",
  "firstName": "Sophie",
  "lastName": "Administrateur"
}
```

**COPIER LE TOKEN**

---

## ETAPE 5 : Changer les Roles (via SQL)

### 5.1 Ouvrir un nouveau terminal PowerShell

```powershell
# Changer jean.manager en Manager
sqlcmd -S LAPTOP-81IAD844 -E -Q "USE XtraWork; UPDATE Users SET Role = 'Manager' WHERE Username = 'jean.manager';"

# Changer admin en Admin
sqlcmd -S LAPTOP-81IAD844 -E -Q "USE XtraWork; UPDATE Users SET Role = 'Admin' WHERE Username = 'admin';"
```

### 5.2 Reconnecter pour obtenir les nouveaux tokens

**Dans Swagger :**

1. Aller sur **POST /api/auth/login**
2. Try it out
3. Utiliser :

**Pour le Manager :**
```json
{
  "username": "jean.manager",
  "password": "Jean123!"
}
```
COPIER LE NOUVEAU TOKEN

**Pour l'Admin :**
```json
{
  "username": "admin",
  "password": "Admin123!"
}
```
COPIER LE NOUVEAU TOKEN

---

## ETAPE 6 : Authentifier Swagger avec le Token

### 6.1 Cliquer sur le bouton "Authorize" en haut

Bouton avec un cadenas (en haut a droite de la page)

### 6.2 Dans la popup, entrer :

```
Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...
```

**IMPORTANT :** Le mot **Bearer** suivi d'un espace, puis votre token complet

### 6.3 Cliquer "Authorize" puis "Close"

Le cadenas devient ferme = Vous etes authentifie !

**Conseil :** Commencez avec le token Admin pour tester tous les endpoints

---

## ETAPE 7 : Tester /api/auth/me

### 7.1 Aller sur GET /api/auth/me

### 7.2 Try it out > Execute

**Reponse attendue - Code 200 :**
```json
{
  "id": 3,
  "username": "admin",
  "email": "admin@xtrawork.com",
  "role": "Admin",
  "firstName": "Sophie",
  "lastName": "Administrateur"
}
```

---

## ETAPE 8 : Tester CRUD sur Titles

### 8.1 Lister les titres - GET /api/titles

1. Cliquer sur **GET /api/titles**
2. Try it out > Execute

**Reponse - Code 200 :**
```json
[]
```
(vide au debut)

### 8.2 Creer un titre - POST /api/titles

1. Cliquer sur **POST /api/titles**
2. Try it out
3. Body :

```json
{
  "description": "Developpeur Full Stack"
}
```

4. Execute

**Reponse - Code 200 :**
```json
{
  "id": 1,
  "description": "Developpeur Full Stack",
  "createdAt": "2025-09-30T..."
}
```

**NOTER L'ID du titre (exemple: 1)**

### 8.3 Creer 2 autres titres

```json
{
  "description": "Chef de Projet"
}
```

```json
{
  "description": "Analyste Business"
}
```

### 8.4 Recuperer un titre specifique - GET /api/titles/{id}

1. Cliquer sur **GET /api/titles/{id}**
2. Try it out
3. Entrer l'ID : **1**
4. Execute

**Reponse - Code 200 :**
```json
{
  "id": 1,
  "description": "Developpeur Full Stack",
  "createdAt": "2025-09-30T..."
}
```

### 8.5 Modifier un titre - PUT /api/titles/{id}

1. Cliquer sur **PUT /api/titles/{id}**
2. Try it out
3. ID : **1**
4. Body :

```json
{
  "description": "Developpeur Full Stack Senior"
}
```

5. Execute

**Reponse - Code 200 :**
```json
{
  "id": 1,
  "description": "Developpeur Full Stack Senior",
  "createdAt": "2025-09-30T..."
}
```

### 8.6 Supprimer un titre - DELETE /api/titles/{id}

**ATTENTION :** Ne supprimez pas les titres maintenant, vous en avez besoin pour les employes !

---

## ETAPE 9 : Tester CRUD sur Employees

### 9.1 Lister les employes - GET /api/employees

1. Cliquer sur **GET /api/employees**
2. Try it out > Execute

**Reponse - Code 200 :**
```json
[]
```

### 9.2 Creer un employe - POST /api/employees

1. Cliquer sur **POST /api/employees**
2. Try it out
3. Body :

```json
{
  "firstName": "Pierre",
  "lastName": "Durand",
  "birthDate": "1990-03-15",
  "gender": "M",
  "titleId": 1
}
```

**IMPORTANT :** Utiliser un ID de titre qui existe (1, 2, ou 3)

4. Execute

**Reponse - Code 200 :**
```json
{
  "id": 1,
  "firstName": "Pierre",
  "lastName": "Durand",
  "birthDate": "1990-03-15",
  "gender": "M",
  "age": 35,
  "titleId": 1,
  "titleDescription": "Developpeur Full Stack Senior"
}
```

**NOTER L'ID de l'employe**

### 9.3 Creer 2 autres employes

```json
{
  "firstName": "Claire",
  "lastName": "Dubois",
  "birthDate": "1988-07-22",
  "gender": "F",
  "titleId": 2
}
```

```json
{
  "firstName": "Thomas",
  "lastName": "Bernard",
  "birthDate": "1995-11-08",
  "gender": "M",
  "titleId": 3
}
```

### 9.4 Recuperer un employe - GET /api/employees/{id}

1. Cliquer sur **GET /api/employees/{id}**
2. Try it out
3. ID : **1**
4. Execute

**Reponse - Code 200 :**
```json
{
  "id": 1,
  "firstName": "Pierre",
  "lastName": "Durand",
  "birthDate": "1990-03-15",
  "gender": "M",
  "age": 35,
  "titleId": 1,
  "titleDescription": "Developpeur Full Stack Senior"
}
```

### 9.5 Modifier un employe - PUT /api/employees/{id}

1. Cliquer sur **PUT /api/employees/{id}**
2. Try it out
3. ID : **1**
4. Body :

```json
{
  "firstName": "Pierre",
  "lastName": "Durand-Martin",
  "birthDate": "1990-03-15",
  "gender": "M",
  "titleId": 1
}
```

5. Execute

**Reponse - Code 200 :**
Le nom de famille est change

### 9.6 Supprimer un employe - DELETE /api/employees/{id}

1. Cliquer sur **DELETE /api/employees/{id}**
2. Try it out
3. ID : **3**
4. Execute

**Reponse - Code 204 No Content**

---

## ETAPE 10 : Tester les Validations

### 10.1 Titre trop court (doit echouer)

**POST /api/titles**

```json
{
  "description": "D"
}
```

**Reponse - Code 400 Bad Request :**
```json
{
  "type": "https://tools.ietf.org/html/rfc9110#section-15.5.1",
  "title": "One or more validation errors occurred.",
  "status": 400,
  "errors": {
    "Description": [
      "La description doit contenir au moins 3 caracteres."
    ]
  }
}
```

### 10.2 Employe trop jeune (doit echouer)

**POST /api/employees**

```json
{
  "firstName": "Jeune",
  "lastName": "Employe",
  "birthDate": "2015-01-01",
  "gender": "M",
  "titleId": 1
}
```

**Reponse - Code 400 :**
Message d'erreur sur l'age minimum

### 10.3 Genre invalide (doit echouer)

**POST /api/employees**

```json
{
  "firstName": "Test",
  "lastName": "Genre",
  "birthDate": "1990-01-01",
  "gender": "X",
  "titleId": 1
}
```

**Reponse - Code 400 :**
Message d'erreur sur le genre

---

## ETAPE 11 : Tester les Autorisations

### 11.1 Se deconnecter

1. Cliquer sur **Authorize**
2. Cliquer sur **Logout**
3. Close

### 11.2 Essayer d'acceder a un endpoint protege

**GET /api/titles**
Try it out > Execute

**Reponse - Code 401 Unauthorized**

### 11.3 Se reconnecter avec le token User

1. Authorize
2. Entrer le token de marie.user
3. Authorize > Close

### 11.4 Tester avec role User

**POST /api/titles** (doit echouer)

```json
{
  "description": "Test"
}
```

**Reponse - Code 403 Forbidden**
Un User ne peut pas creer de titre

**POST /api/employees** (doit reussir)

```json
{
  "firstName": "Test",
  "lastName": "User",
  "birthDate": "1990-01-01",
  "gender": "M",
  "titleId": 1
}
```

**Reponse - Code 200**
Un User peut creer des employes

### 11.5 Tester avec role Manager

1. Se deconnecter (Logout)
2. Se reconnecter avec le token de jean.manager

**POST /api/titles** (doit reussir)

```json
{
  "description": "Nouveau Poste Manager"
}
```

**Reponse - Code 200**
Un Manager peut creer des titres

**DELETE /api/titles/{id}** (doit echouer)

**Reponse - Code 403 Forbidden**
Seul un Admin peut supprimer des titres

---

## ETAPE 12 : Tester la Validation de Token

### 12.1 Aller sur POST /api/auth/validate

### 12.2 Try it out

### 12.3 Dans le body, entrer votre token entre guillemets

```json
"eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9..."
```

### 12.4 Execute

**Reponse - Code 200 :**
```json
{
  "isValid": true
}
```

### 12.5 Tester avec un faux token

```json
"INVALID_TOKEN_123456"
```

**Reponse - Code 200 :**
```json
{
  "isValid": false
}
```

---

## ETAPE 13 : Verifier les Logs

### 13.1 Dans le terminal ou l'API tourne

Vous verrez tous les logs :
```
[19:45:23 INF] HTTP POST /api/auth/register responded 200 in 45.2345 ms
[19:46:15 INF] HTTP GET /api/titles responded 200 in 12.5678 ms
[19:47:30 WRN] Validation failed for POST /api/titles
```

### 13.2 Verifier le fichier de logs

```
XtraWork/logs/xtrawork-20250930.txt
```

---

## RESUME : 100% de Couverture

### Endpoints Testes

**Auth (5 endpoints) :**
- POST /api/auth/register
- POST /api/auth/login
- POST /api/auth/validate
- GET /api/auth/me
- GET /health

**Titles (5 endpoints) :**
- GET /api/titles
- GET /api/titles/{id}
- POST /api/titles
- PUT /api/titles/{id}
- DELETE /api/titles/{id}

**Employees (5 endpoints) :**
- GET /api/employees
- GET /api/employees/{id}
- POST /api/employees
- PUT /api/employees/{id}
- DELETE /api/employees/{id}

### Fonctionnalites Testees

- Authentification JWT
- Autorisation par roles (User, Manager, Admin)
- Validation FluentValidation
- CRUD complet
- Gestion d'erreurs (400, 401, 403, 404)
- Logs Serilog
- Health Check

---

## CHECKLIST FINALE

- [ ] API demarre correctement
- [ ] Swagger accessible
- [ ] 3 utilisateurs crees (User, Manager, Admin)
- [ ] Roles modifies en base de donnees
- [ ] Tokens recuperes et testes
- [ ] 3 titres crees
- [ ] 3 employes crees
- [ ] Validation testee (erreurs 400)
- [ ] Autorisations testees (erreurs 403)
- [ ] Authentification testee (erreurs 401)
- [ ] CRUD complet sur Titles
- [ ] CRUD complet sur Employees
- [ ] Logs visibles dans le terminal
- [ ] Fichier de logs genere

---

## CONSEILS

1. **Garder une copie des tokens** dans un fichier texte
2. **Tester dans l'ordre** : Auth > Titles > Employees
3. **Creer des donnees de test** avant de tester les suppressions
4. **Verifier les codes HTTP** apres chaque requete
5. **Lire les messages d'erreur** pour comprendre les validations

---

**FIN DU GUIDE - Vous avez teste 100% de l'API avec Swagger !**
