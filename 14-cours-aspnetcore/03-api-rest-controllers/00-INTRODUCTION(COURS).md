# Introduction - API REST et Controllers

## Qu'est-ce qu'une API REST ?

REST (Representational State Transfer) est un style d'architecture pour les API web qui utilise HTTP de maniere standard.

---

## Principes REST

### 1. Ressources

Tout est une ressource identifiee par une URL.

**Exemples dans XtraWork** :
- `/api/employees` - Collection d'employes
- `/api/employees/{id}` - Un employe specifique
- `/api/titles` - Collection de titres

---

### 2. Methodes HTTP

Chaque methode a une semantique precise :

**GET** : Recuperer des donnees (lecture)
```
GET /api/employees      → Liste tous les employes
GET /api/employees/123  → Recupere l'employe 123
```

**POST** : Creer une ressource
```
POST /api/employees     → Cree un nouvel employe
Body: { "firstName": "Jean", ... }
```

**PUT** : Modifier une ressource complete
```
PUT /api/employees/123  → Modifie l'employe 123
Body: { "firstName": "Jean", ... }
```

**DELETE** : Supprimer une ressource
```
DELETE /api/employees/123  → Supprime l'employe 123
```

---

### 3. Stateless

Chaque requete est independante. Le serveur ne garde pas d'etat entre les requetes.

**Avec JWT** : Le token contient toutes les informations necessaires.

---

### 4. Representations (JSON)

Les donnees sont echangees en JSON.

**Exemple de reponse** :
```json
{
  "id": "3fa85f64-5717-4562-b3fc-2c963f66afa6",
  "firstName": "Jean",
  "lastName": "Dupont",
  "birthDate": "1990-05-15T00:00:00Z",
  "gender": "Homme",
  "titleId": "...",
  "titleDescription": "Developpeur Senior"
}
```

---

### 5. Status codes HTTP

Les reponses utilisent les codes HTTP standards :

**2xx Succes** :
- 200 OK - Requete reussie
- 201 Created - Ressource creee
- 204 No Content - Succes sans contenu

**4xx Erreurs client** :
- 400 Bad Request - Donnees invalides
- 401 Unauthorized - Pas authentifie
- 403 Forbidden - Pas autorise
- 404 Not Found - Ressource introuvable

**5xx Erreurs serveur** :
- 500 Internal Server Error - Erreur serveur

---

## Controllers dans ASP.NET Core

Un Controller est une classe qui :
- Herite de `ControllerBase` (pour API) ou `Controller` (pour MVC)
- Contient des methodes (actions) qui repondent aux requetes HTTP
- Est decoree avec `[ApiController]`

### Exemple minimal

```csharp
[ApiController]
[Route("api/[controller]")]
public class EmployeeController : ControllerBase
{
    [HttpGet]
    public ActionResult<string> GetAll()
    {
        return Ok("Liste des employes");
    }
}
```

**URL** : GET /api/employee

---

## Structure d'un Controller XtraWork

```csharp
[ApiController]                      // 1. Marque comme API controller
[Route("api/[controller]")]          // 2. Route de base
[Authorize]                          // 3. Necessite JWT
[Produces("application/json")]       // 4. Retourne JSON
public class EmployeeController : ControllerBase
{
    private readonly EmployeeService _employeeService;
    
    // 5. Injection de dependance
    public EmployeeController(EmployeeService employeeService)
    {
        _employeeService = employeeService;
    }
    
    // 6. Methodes (actions)
    [HttpGet]
    public async Task<ActionResult<List<EmployeeResponse>>> GetAll()
    {
        var employees = await _employeeService.GetAll();
        return Ok(employees);
    }
}
```

---

## Endpoints dans XtraWork

### AuthController

```
POST   /api/auth/login        - Connexion
POST   /api/auth/register     - Inscription
GET    /api/auth/me           - Info utilisateur
POST   /api/auth/logout       - Deconnexion
```

### EmployeeController

```
GET    /api/employees         - Liste
GET    /api/employees/{id}    - Detail
POST   /api/employees         - Creer
PUT    /api/employees/{id}    - Modifier
DELETE /api/employees/{id}    - Supprimer
```

### TitleController

```
GET    /api/titles            - Liste
GET    /api/titles/{id}       - Detail
POST   /api/titles            - Creer
PUT    /api/titles/{id}       - Modifier
DELETE /api/titles/{id}       - Supprimer
```

---

## Ce que vous allez apprendre

**Module 1** : Comment definir les routes avec [Route] et [Http...]

**Module 2** : Comment recevoir les donnees ([FromBody], [FromRoute], etc.)

**Module 3** : Comment valider les donnees avec FluentValidation

**Module 4** : Comment retourner les bonnes reponses HTTP

**Module 5** : Comment gerer les erreurs proprement

**Chaque concept illustre avec le code reel de XtraWork.**

---

**Prochain module** : [01-ROUTING(COURS).md](./01-ROUTING(COURS).md)

