# Module 4 - Reponses HTTP

## Methodes de reponse

ASP.NET Core fournit des methodes helpers pour retourner les bonnes reponses HTTP.

---

## 2xx Succes

### Ok() - 200 OK

Requete reussie avec donnees.

```csharp
[HttpGet]
public ActionResult<List<EmployeeResponse>> GetAll()
{
    var employees = await _employeeService.GetAll();
    return Ok(employees);  // 200 OK
}
```

**Reponse** :
```
Status: 200 OK
Body: [ { "id": "...", "firstName": "Jean", ... }, ... ]
```

---

### Created() - 201 Created

Ressource creee avec succes.

```csharp
[HttpPost]
public ActionResult<EmployeeResponse> Create([FromBody] EmployeeRequest request)
{
    var employee = await _employeeService.Create(request);
    
    return Created($"/api/employees/{employee.Id}", employee);
    // OU
    return CreatedAtAction(nameof(Get), new { id = employee.Id }, employee);
}
```

**Reponse** :
```
Status: 201 Created
Location: /api/employees/3fa85f64-5717-4562-b3fc-2c963f66afa6
Body: { "id": "3fa85f64...", "firstName": "Jean", ... }
```

**CreatedAtAction** genere automatiquement l'URL dans le header Location.

---

### NoContent() - 204 No Content

Succes sans donnees a retourner.

```csharp
[HttpDelete("{id}")]
public async Task<ActionResult> Delete(Guid id)
{
    await _employeeService.Delete(id);
    return NoContent();  // 204 No Content
}
```

**Reponse** :
```
Status: 204 No Content
(pas de body)
```

Utilise pour DELETE et parfois PUT.

---

## 4xx Erreurs client

### BadRequest() - 400 Bad Request

Donnees invalides.

```csharp
[HttpPost]
public ActionResult Create([FromBody] EmployeeRequest request)
{
    if (string.IsNullOrEmpty(request.FirstName))
    {
        return BadRequest(new { message = "Prenom requis" });
    }
    // ...
}
```

**Reponse** :
```
Status: 400 Bad Request
Body: { "message": "Prenom requis" }
```

---

### Unauthorized() - 401 Unauthorized

Pas authentifie.

```csharp
[HttpPost("login")]
public ActionResult Login([FromBody] LoginRequest request)
{
    var user = await _authService.Login(request);
    
    if (user == null)
    {
        return Unauthorized(new { message = "Credentials invalides" });
    }
    
    return Ok(user);
}
```

**Note** : Avec [Authorize], le middleware retourne 401 automatiquement si pas de token.

---

### Forbid() - 403 Forbidden

Authentifie mais pas autorise.

```csharp
[HttpPost]
[Authorize(Roles = "Admin")]
public ActionResult CreateTitle([FromBody] TitleRequest request)
{
    // Si role != Admin, middleware retourne 403 automatiquement
}
```

Rarement retourne manuellement car gere automatiquement par [Authorize].

---

### NotFound() - 404 Not Found

Ressource introuvable.

```csharp
[HttpGet("{id}")]
public async Task<ActionResult<EmployeeResponse>> Get(Guid id)
{
    try
    {
        var employee = await _employeeService.Get(id);
        return Ok(employee);
    }
    catch (NotFoundException ex)
    {
        return NotFound(new { message = ex.Message });
    }
}
```

**Reponse** :
```
Status: 404 Not Found
Body: { "message": "Employe avec l'ID 123 non trouve" }
```

---

## 5xx Erreurs serveur

### StatusCode() - Code personnalise

```csharp
return StatusCode(500, new { message = "Erreur interne" });
```

**Note** : Rarement utilise car les exceptions non gerees retournent 500 automatiquement.

---

## Dans XtraWork

### EmployeeController - Toutes les reponses

```csharp
// GET - 200 OK ou 404
[HttpGet("{id}")]
public async Task<ActionResult<EmployeeResponse>> Get(Guid id)
{
    try
    {
        var response = await _employeeService.Get(id);
        return Ok(response);  // 200
    }
    catch (NotFoundException ex)
    {
        return NotFound(new { message = ex.Message });  // 404
    }
}

// POST - 201 Created ou 400
[HttpPost]
public async Task<ActionResult<EmployeeResponse>> Create([FromBody] EmployeeRequest request)
{
    try
    {
        var response = await _employeeService.Create(request);
        return CreatedAtAction(nameof(Get), new { id = response.Id }, response);  // 201
    }
    catch (NotFoundException ex)
    {
        return BadRequest(new { message = ex.Message });  // 400
    }
}

// PUT - 200 OK ou 404
[HttpPut("{id}")]
public async Task<ActionResult<EmployeeResponse>> Update(Guid id, [FromBody] EmployeeRequest request)
{
    try
    {
        var response = await _employeeService.Update(id, request);
        return Ok(response);  // 200
    }
    catch (NotFoundException ex)
    {
        return NotFound(new { message = ex.Message });  // 404
    }
}

// DELETE - 204 No Content ou 404
[HttpDelete("{id}")]
[Authorize(Policy = "ManagerOrAdmin")]
public async Task<ActionResult> Delete(Guid id)
{
    try
    {
        await _employeeService.Delete(id);
        return NoContent();  // 204
    }
    catch (NotFoundException ex)
    {
        return NotFound(new { message = ex.Message });  // 404
    }
}
```

---

## ProducesResponseType

Documenter les reponses possibles pour Swagger.

```csharp
[HttpGet("{id}")]
[ProducesResponseType(StatusCodes.Status200OK)]
[ProducesResponseType(StatusCodes.Status404NotFound)]
[ProducesResponseType(StatusCodes.Status401Unauthorized)]
public async Task<ActionResult<EmployeeResponse>> Get(Guid id)
{
    // ...
}
```

**Avantage** : Swagger affiche toutes les reponses possibles.

---

## Format des erreurs

### Format standard

```json
{
  "message": "Employe avec l'ID 123 non trouve"
}
```

### Format avec details

```json
{
  "message": "Validation echouee",
  "errors": {
    "FirstName": ["Le prenom est requis"],
    "BirthDate": ["Doit avoir au moins 16 ans"]
  }
}
```

---

## Resume

Reponses HTTP dans ASP.NET Core :
- Ok() pour 200
- CreatedAtAction() pour 201
- NoContent() pour 204
- BadRequest() pour 400
- Unauthorized() pour 401
- NotFound() pour 404
- StatusCode() pour codes personnalises

**Dans XtraWork** :
- Chaque methode retourne le bon code
- try/catch pour gerer NotFoundException
- ProducesResponseType pour Swagger

---

**Prochain module** : [05-GESTION-ERREURS(COURS).md](./05-GESTION-ERREURS(COURS).md)

