# Module 3 - Documenter les Endpoints

## XML Comments

Ajouter des commentaires XML sur les méthodes pour enrichir la documentation Swagger.

---

## Dans EmployeeController

```csharp
/// <summary>
/// Récupère tous les employés
/// </summary>
/// <returns>Liste des employés</returns>
[HttpGet]
[ProducesResponseType(StatusCodes.Status200OK)]
[ProducesResponseType(StatusCodes.Status401Unauthorized)]
public async Task<ActionResult<List<EmployeeResponse>>> GetAll()
{
    var response = await _employeeService.GetAll();
    return Ok(response);
}

/// <summary>
/// Crée un nouvel employé
/// </summary>
/// <param name="request">Données de l'employé</param>
/// <returns>Employé créé</returns>
[HttpPost]
[ProducesResponseType(StatusCodes.Status201Created)]
[ProducesResponseType(StatusCodes.Status400BadRequest)]
public async Task<ActionResult<EmployeeResponse>> Create([FromBody] EmployeeRequest request)
{
    var response = await _employeeService.Create(request);
    return CreatedAtAction(nameof(Get), new { id = response.Id }, response);
}
```

---

## ProducesResponseType

Documente les réponses HTTP possibles :

```csharp
[ProducesResponseType(StatusCodes.Status200OK)]            // 200
[ProducesResponseType(StatusCodes.Status404NotFound)]      // 404
[ProducesResponseType(StatusCodes.Status401Unauthorized)]  // 401
```

**Résultat dans Swagger** : Affiche tous les codes de réponse possibles.

---

## Activer XML Documentation

**1. Modifier XtraWork.csproj** :

```xml
<PropertyGroup>
  <GenerateDocumentationFile>true</GenerateDocumentationFile>
  <NoWarn>$(NoWarn);1591</NoWarn>
</PropertyGroup>
```

**2. Configurer Swashbuckle** :

```csharp
builder.Services.AddSwaggerGen(c =>
{
    var xmlFile = $"{Assembly.GetExecutingAssembly().GetName().Name}.xml";
    var xmlPath = Path.Combine(AppContext.BaseDirectory, xmlFile);
    c.IncludeXmlComments(xmlPath);
});
```

**Résultat** : Les commentaires XML apparaissent dans Swagger UI.

---

**Prochain** : [04-QUIZ-QUESTIONS(OBLIGATOIRE).md](./04-QUIZ-QUESTIONS(OBLIGATOIRE).md)

