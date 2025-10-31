# Module 1 - Routing dans ASP.NET Core

## Routing : Associer URLs et methodes

Le routing determine quelle methode de controller executer selon l'URL et la methode HTTP de la requete.

---

## Attribute Routing

ASP.NET Core utilise l'attribute routing : les routes sont definies avec des attributs sur les classes et methodes.

### [Route] sur la classe

```csharp
[Route("api/[controller]")]
public class EmployeeController : ControllerBase
{
    // ...
}
```

**[controller]** est remplace par le nom du controller sans "Controller".

**Resultat** : `EmployeeController` → `/api/employee`

---

### [Http...] sur les methodes

```csharp
[HttpGet]
public ActionResult GetAll()
{
    // GET /api/employee
}

[HttpGet("{id}")]
public ActionResult Get(Guid id)
{
    // GET /api/employee/123
}

[HttpPost]
public ActionResult Create([FromBody] EmployeeRequest request)
{
    // POST /api/employee
}

[HttpPut("{id}")]
public ActionResult Update(Guid id, [FromBody] EmployeeRequest request)
{
    // PUT /api/employee/123
}

[HttpDelete("{id}")]
public ActionResult Delete(Guid id)
{
    // DELETE /api/employee/123
}
```

---

## Parametres de route

### Route parameters : {id}

```csharp
[HttpGet("{id}")]
public ActionResult Get(Guid id)
{
    // URL : /api/employees/3fa85f64-5717-4562-b3fc-2c963f66afa6
    // id = 3fa85f64-5717-4562-b3fc-2c963f66afa6
}
```

ASP.NET Core convertit automatiquement le segment d'URL en Guid.

---

### Plusieurs parametres

```csharp
[HttpGet("{employeeId}/titles/{titleId}")]
public ActionResult GetEmployeeTitle(Guid employeeId, Guid titleId)
{
    // URL : /api/employees/123/titles/456
    // employeeId = 123
    // titleId = 456
}
```

---

### Parametres optionnels

```csharp
[HttpGet("{id?}")]
public ActionResult Get(Guid? id)
{
    // /api/employees      → id = null
    // /api/employees/123  → id = 123
}
```

Le `?` rend le parametre optionnel.

---

## Query strings

### [FromQuery]

```csharp
[HttpGet]
public ActionResult GetAll([FromQuery] int page = 1, [FromQuery] int pageSize = 10)
{
    // GET /api/employees?page=2&pageSize=20
    // page = 2
    // pageSize = 20
}
```

---

### Objet de query

```csharp
public class EmployeeFilter
{
    public string? Gender { get; set; }
    public Guid? TitleId { get; set; }
    public int Page { get; set; } = 1;
}

[HttpGet]
public ActionResult GetAll([FromQuery] EmployeeFilter filter)
{
    // GET /api/employees?gender=Homme&titleId=123&page=2
    // filter.Gender = "Homme"
    // filter.TitleId = 123
    // filter.Page = 2
}
```

---

## Routes nommees et CreatedAtAction

### Nommer une action

```csharp
[HttpGet("{id}", Name = "GetEmployee")]
public ActionResult<EmployeeResponse> Get(Guid id)
{
    // ...
}
```

### Utiliser dans CreatedAtAction

```csharp
[HttpPost]
public ActionResult<EmployeeResponse> Create([FromBody] EmployeeRequest request)
{
    var employee = _employeeService.Create(request);
    
    return CreatedAtAction(
        nameof(Get),           // Nom de la methode
        new { id = employee.Id },  // Parametres de route
        employee               // Body de la reponse
    );
}
```

**Resultat** :
```
Status: 201 Created
Location: /api/employees/3fa85f64-5717-4562-b3fc-2c963f66afa6
Body: { "id": "3fa85f64...", "firstName": "Jean", ... }
```

Le header `Location` indique ou trouver la ressource creee.

---

## Dans XtraWork

### EmployeeController - Routes completes

```csharp
[ApiController]
[Route("api/[controller]")]
public class EmployeeController : ControllerBase
{
    // GET /api/employees
    [HttpGet]
    public async Task<ActionResult<List<EmployeeResponse>>> GetAll() { }
    
    // GET /api/employees/123
    [HttpGet("{id}")]
    public async Task<ActionResult<EmployeeResponse>> Get(Guid id) { }
    
    // POST /api/employees
    [HttpPost]
    public async Task<ActionResult<EmployeeResponse>> Create([FromBody] EmployeeRequest request) { }
    
    // PUT /api/employees/123
    [HttpPut("{id}")]
    public async Task<ActionResult<EmployeeResponse>> Update(Guid id, [FromBody] EmployeeRequest request) { }
    
    // DELETE /api/employees/123
    [HttpDelete("{id}")]
    public async Task<ActionResult> Delete(Guid id) { }
}
```

**Convention REST respectee** : GET, POST, PUT, DELETE avec URLs coherentes.

---

## Conventions de nommage

### URLs en minuscules

**Bon** : `/api/employees`
**Pas ideal** : `/api/Employees` ou `/api/EMPLOYEES`

ASP.NET Core accepte les deux mais la convention est minuscules.

---

### Pluriel pour collections

**Bon** : `/api/employees` (pluriel)
**Pas ideal** : `/api/employee` (singulier)

Exception : `/api/auth` (pas une collection)

---

### Noms de ressources, pas de verbes

**Bon** :
```
GET    /api/employees
POST   /api/employees
```

**Mauvais** :
```
GET    /api/getEmployees
POST   /api/createEmployee
```

Le verbe HTTP suffit. Pas besoin de verbes dans l'URL.

---

## Resume

Le routing dans ASP.NET Core :
- [Route] sur la classe definit la route de base
- [Http...] sur les methodes definit le verbe et le chemin
- {id} dans la route cree un parametre
- [FromQuery] pour query strings
- CreatedAtAction pour retourner la location de la ressource creee

**Dans XtraWork** :
- Convention REST respectee
- Routes claires et coherentes
- Tous les verbes HTTP utilises

---

**Prochain module** : [02-MODEL-BINDING(COURS).md](./02-MODEL-BINDING(COURS).md)

