# Module 2 - Model Binding

## Qu'est-ce que le Model Binding ?

Le Model Binding est le processus par lequel ASP.NET Core convertit automatiquement les donnees HTTP en objets C#.

---

## Sources de donnees

### [FromBody] - Corps de la requete

Utilise pour POST et PUT avec JSON.

```csharp
[HttpPost]
public ActionResult Create([FromBody] EmployeeRequest request)
{
    // Le JSON du body est converti en EmployeeRequest
}
```

**Requete** :
```
POST /api/employees
Content-Type: application/json

{
  "firstName": "Jean",
  "lastName": "Dupont",
  "birthDate": "1990-05-15",
  "gender": "Homme",
  "titleId": "3fa85f64-5717-4562-b3fc-2c963f66afa6"
}
```

ASP.NET Core deserialise automatiquement le JSON en objet `EmployeeRequest`.

---

### [FromRoute] - Parametres d'URL

```csharp
[HttpGet("{id}")]
public ActionResult Get([FromRoute] Guid id)
{
    // id vient du segment {id} dans l'URL
}
```

**Requete** : `GET /api/employees/3fa85f64-5717-4562-b3fc-2c963f66afa6`

**Note** : `[FromRoute]` est implicite pour les parametres qui correspondent a `{...}` dans la route.

---

### [FromQuery] - Query string

```csharp
[HttpGet]
public ActionResult GetAll(
    [FromQuery] int page = 1,
    [FromQuery] int pageSize = 10,
    [FromQuery] string? search = null)
{
    // Parametres viennent de la query string
}
```

**Requete** : `GET /api/employees?page=2&pageSize=20&search=dupont`

**Resultat** :
- page = 2
- pageSize = 20
- search = "dupont"

---

### [FromHeader] - Headers HTTP

```csharp
[HttpGet]
public ActionResult GetAll([FromHeader] string userAgent)
{
    // userAgent vient du header User-Agent
}
```

Rarement utilise car les headers importants (Authorization) sont geres automatiquement.

---

## Binding automatique

Sans attribut, ASP.NET Core devine :

```csharp
[HttpGet("{id}")]
public ActionResult Get(Guid id)
{
    // id vient de la route (automatique)
}

[HttpPost]
public ActionResult Create(EmployeeRequest request)
{
    // request vient du body (automatique pour objets complexes)
}
```

**Convention** :
- Types simples (int, string, Guid) → Route ou Query
- Types complexes (objets) → Body

---

## Validation automatique

Avec `[ApiController]`, la validation est automatique.

### DataAnnotations

```csharp
public class EmployeeRequest
{
    [Required(ErrorMessage = "Le prenom est obligatoire")]
    [MaxLength(50)]
    public string FirstName { get; set; } = string.Empty;
    
    [Required]
    public DateTime BirthDate { get; set; }
}
```

**Si invalide** : ASP.NET Core retourne automatiquement 400 Bad Request avec details.

**Reponse d'erreur** :
```json
{
  "type": "https://tools.ietf.org/html/rfc7231#section-6.5.1",
  "title": "One or more validation errors occurred.",
  "status": 400,
  "errors": {
    "FirstName": ["Le prenom est obligatoire"]
  }
}
```

---

## Dans XtraWork

### EmployeeController.Create

```csharp
[HttpPost]
public async Task<ActionResult<EmployeeResponse>> Create([FromBody] EmployeeRequest request)
{
    try
    {
        var response = await _employeeService.Create(request);
        return CreatedAtAction(nameof(Get), new { id = response.Id }, response);
    }
    catch (NotFoundException ex)
    {
        return BadRequest(new { message = ex.Message });
    }
}
```

**[FromBody]** : Le JSON est converti en EmployeeRequest.

**Validation automatique** : Si EmployeeRequest est invalide, 400 retourne avant meme d'entrer dans la methode.

---

## Binding de types complexes

### Objet imbrique

```csharp
public class CreateEmployeeRequest
{
    public string FirstName { get; set; }
    public string LastName { get; set; }
    public Address Address { get; set; }  // Objet imbrique
}

public class Address
{
    public string Street { get; set; }
    public string City { get; set; }
}
```

**JSON** :
```json
{
  "firstName": "Jean",
  "lastName": "Dupont",
  "address": {
    "street": "123 Rue Principale",
    "city": "Paris"
  }
}
```

ASP.NET Core lie automatiquement les objets imbriques.

---

## Binding de collections

```csharp
[HttpPost("batch")]
public ActionResult CreateMultiple([FromBody] List<EmployeeRequest> employees)
{
    // Tableau d'objets
}
```

**JSON** :
```json
[
  { "firstName": "Jean", "lastName": "Dupont", ... },
  { "firstName": "Marie", "lastName": "Martin", ... }
]
```

---

## Problemes courants

### Oublier [FromBody]

```csharp
// MAUVAIS
[HttpPost]
public ActionResult Create(EmployeeRequest request)
{
    // request sera null !
}

// BON
[HttpPost]
public ActionResult Create([FromBody] EmployeeRequest request)
{
    // request correctement lie
}
```

**Avec [ApiController]** : [FromBody] est implicite pour les types complexes, mais explicite est plus clair.

---

### Noms de parametres

```csharp
[HttpGet("{employeeId}")]
public ActionResult Get(Guid id)  // ATTENTION !
{
    // id sera null car le nom ne correspond pas
}

// BON
[HttpGet("{employeeId}")]
public ActionResult Get(Guid employeeId)  // Noms correspondent
{
    // employeeId correctement lie
}

// OU
[HttpGet("{id}")]
public ActionResult Get([FromRoute] Guid employeeId)
{
    // Mapping explicite avec [FromRoute(Name = "id")]
}
```

---

## Resume

Model Binding dans ASP.NET Core :
- [FromBody] : Donnees du body JSON
- [FromRoute] : Parametres dans l'URL {id}
- [FromQuery] : Query string ?page=1
- [FromHeader] : Headers HTTP
- Automatique avec [ApiController]
- Validation automatique avec DataAnnotations

**Dans XtraWork** :
- [FromBody] pour POST et PUT
- Parametres {id} pour GET by ID, PUT, DELETE
- Validation automatique avec FluentValidation

---

**Prochain module** : [03-VALIDATION(COURS).md](./03-VALIDATION(COURS).md)

