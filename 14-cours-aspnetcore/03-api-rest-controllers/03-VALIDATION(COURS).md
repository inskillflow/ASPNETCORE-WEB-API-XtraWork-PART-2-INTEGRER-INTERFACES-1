# Module 3 - Validation des donnees

## Pourquoi valider ?

**Ne jamais faire confiance aux donnees client.**

Meme si le frontend valide, quelqu'un peut :
- Utiliser Postman/cURL directement
- Modifier le JavaScript frontend
- Intercepter et modifier la requete

**La validation serveur est OBLIGATOIRE.**

---

## Deux approches dans XtraWork

### 1. DataAnnotations (simple)

Attributs sur les proprietes.

```csharp
public class EmployeeRequest
{
    [Required(ErrorMessage = "Le prenom est obligatoire")]
    [MaxLength(50)]
    public string FirstName { get; set; } = string.Empty;
    
    [Required]
    [MaxLength(50)]
    public string LastName { get; set; } = string.Empty;
    
    [Required]
    public DateTime BirthDate { get; set; }
    
    [Required]
    [MaxLength(10)]
    public string Gender { get; set; } = string.Empty;
}
```

**Validation automatique** : Avec [ApiController], si invalide → 400 Bad Request automatique.

---

### 2. FluentValidation (avance)

Classe de validation separee.

**Validator** : `Validators/EmployeeRequestValidator.cs`

```csharp
using FluentValidation;

public class EmployeeRequestValidator : AbstractValidator<EmployeeRequest>
{
    public EmployeeRequestValidator()
    {
        RuleFor(x => x.FirstName)
            .NotEmpty().WithMessage("Le prenom est requis")
            .MaximumLength(50).WithMessage("Maximum 50 caracteres");
        
        RuleFor(x => x.LastName)
            .NotEmpty().WithMessage("Le nom est requis")
            .MaximumLength(50);
        
        RuleFor(x => x.BirthDate)
            .NotEmpty()
            .LessThan(DateTime.Today).WithMessage("Date de naissance doit etre dans le passe")
            .Must(BeAtLeast16YearsOld).WithMessage("L'employe doit avoir au moins 16 ans");
        
        RuleFor(x => x.Gender)
            .NotEmpty()
            .Must(x => x == "Homme" || x == "Femme" || x == "Autre")
            .WithMessage("Genre invalide");
        
        RuleFor(x => x.TitleId)
            .NotEmpty().WithMessage("Le titre est requis");
    }
    
    private bool BeAtLeast16YearsOld(DateTime birthDate)
    {
        var age = DateTime.Today.Year - birthDate.Year;
        if (birthDate.Date > DateTime.Today.AddYears(-age)) age--;
        return age >= 16;
    }
}
```

**Avantages FluentValidation** :
- Validation complexe (Must, When)
- Messages personnalises
- Validation conditionnelle
- Reutilisable
- Testable

---

## Configuration FluentValidation

**Dans Program.cs** :

```csharp
builder.Services.AddFluentValidationAutoValidation();
builder.Services.AddFluentValidationClientsideAdapters();
builder.Services.AddValidatorsFromAssemblyContaining<EmployeeRequestValidator>();
```

**Resultat** : Validation automatique avant d'entrer dans la methode du controller.

---

## Reponse d'erreur de validation

**Requete invalide** :
```json
POST /api/employees
{
  "firstName": "",
  "lastName": "D",
  "birthDate": "2020-01-01"
}
```

**Reponse automatique (400 Bad Request)** :
```json
{
  "type": "https://tools.ietf.org/html/rfc7231#section-6.5.1",
  "title": "One or more validation errors occurred.",
  "status": 400,
  "errors": {
    "FirstName": ["Le prenom est requis"],
    "LastName": ["Maximum 50 caracteres"],
    "BirthDate": ["L'employe doit avoir au moins 16 ans"]
  }
}
```

Le client recoit tous les details des erreurs.

---

## Validation dans le Service

Meme avec FluentValidation, le Service peut faire des validations metier supplementaires.

**Exemple dans EmployeeService.Create** :

```csharp
public async Task<EmployeeResponse> Create(EmployeeRequest request)
{
    // FluentValidation a deja valide request
    
    // Validation metier : Le titre doit exister
    var titleExists = await _titleRepository.ExistsAsync(request.TitleId);
    if (!titleExists)
    {
        throw new NotFoundException($"Titre avec l'ID {request.TitleId} non trouve");
    }
    
    // Creer l'employe...
}
```

**Difference** :
- **FluentValidation** : Format des donnees (longueur, requis, etc.)
- **Service** : Regles metier (titre existe, age coherent avec poste, etc.)

---

## Validation conditionnelle

FluentValidation permet des validations complexes.

```csharp
RuleFor(x => x.Email)
    .EmailAddress()
    .When(x => !string.IsNullOrEmpty(x.Email));

RuleFor(x => x.Salary)
    .GreaterThan(0)
    .When(x => x.TitleId == managerTitleId)
    .WithMessage("Manager doit avoir un salaire superieur a 0");
```

---

## Validation avec dependances

```csharp
public class EmployeeRequestValidator : AbstractValidator<EmployeeRequest>
{
    private readonly TitleRepository _titleRepository;
    
    public EmployeeRequestValidator(TitleRepository titleRepository)
    {
        _titleRepository = titleRepository;
    }
    
    public EmployeeRequestValidator()
    {
        RuleFor(x => x.TitleId)
            .MustAsync(TitleExists).WithMessage("Le titre n'existe pas");
    }
    
    private async Task<bool> TitleExists(Guid titleId, CancellationToken cancellation)
    {
        return await _titleRepository.ExistsAsync(titleId);
    }
}
```

**Validation asynchrone** avec acces a la base de donnees.

---

## Tester la validation manuellement

Sans [ApiController], vous pouvez valider manuellement :

```csharp
[HttpPost]
public ActionResult Create(EmployeeRequest request)
{
    if (!ModelState.IsValid)
    {
        return BadRequest(ModelState);
    }
    
    // Continuer...
}
```

**Avec [ApiController]** : C'est automatique, pas besoin du if.

---

## Resume

Validation dans ASP.NET Core :
- DataAnnotations pour validation simple
- FluentValidation pour validation avancee
- Automatique avec [ApiController]
- Reponse 400 Bad Request avec details
- Validation metier dans le Service

**Dans XtraWork** :
- FluentValidation pour EmployeeRequest et TitleRequest
- Validators/ contient les validateurs
- Configuration dans Program.cs

---

**Prochain module** : [04-REPONSES-HTTP(COURS).md](./04-REPONSES-HTTP(COURS).md)

