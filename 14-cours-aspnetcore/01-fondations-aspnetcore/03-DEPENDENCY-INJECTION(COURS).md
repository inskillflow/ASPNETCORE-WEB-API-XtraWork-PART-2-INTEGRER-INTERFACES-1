# Module 3 - Dependency Injection

## Qu'est-ce que la Dependency Injection ?

La Dependency Injection (DI) est un pattern qui permet de **fournir automatiquement les dépendances** dont une classe a besoin, au lieu de les créer manuellement.

---

## Sans Dependency Injection

### Problème

```csharp
public class EmployeeController : ControllerBase
{
    [HttpGet]
    public async Task<ActionResult> GetAll()
    {
        // Créer les dépendances manuellement
        var context = new XtraWorkContext(options);
        var titleRepo = new TitleRepository(context);
        var employeeRepo = new EmployeeRepository(context);
        var service = new EmployeeService(employeeRepo, titleRepo);
        
        // Utiliser le service
        var employees = await service.GetAll();
        return Ok(employees);
    }
}
```

**Problèmes** :
- Code répétitif dans chaque méthode
- Couplage fort (dépend de l'implémentation concrète)
- Difficile à tester (comment mocker ?)
- Gestion manuelle du cycle de vie
- Pas de partage du DbContext entre requêtes

---

## Avec Dependency Injection

### Solution

```csharp
public class EmployeeController : ControllerBase
{
    private readonly EmployeeService _employeeService;
    
    // Le constructeur reçoit les dépendances
    public EmployeeController(EmployeeService employeeService)
    {
        _employeeService = employeeService;
    }
    
    [HttpGet]
    public async Task<ActionResult> GetAll()
    {
        // Utiliser directement le service injecté
        var employees = await _employeeService.GetAll();
        return Ok(employees);
    }
}
```

**Avantages** :
- Code plus propre
- Pas de création manuelle
- Facile à tester (injecter un mock)
- ASP.NET Core gère le cycle de vie

---

## Configuration de la DI dans Program.cs

### Enregistrer les services

Dans XtraWork/Program.cs :

```csharp
// DbContext
builder.Services.AddDbContext<XtraWorkContext>(
    opt => opt.UseSqlServer(connectionString)
);

// Repositories
builder.Services.AddScoped<TitleRepository>();
builder.Services.AddScoped<EmployeeRepository>();
builder.Services.AddScoped<UserRepository>();

// Services
builder.Services.AddScoped<TitleService>();
builder.Services.AddScoped<EmployeeService>();
builder.Services.AddScoped<IAuthService, AuthService>();
```

**Ce code dit à ASP.NET Core** :
"Quand quelqu'un demande un `EmployeeService`, crée-le en lui fournissant automatiquement un `EmployeeRepository` et un `TitleRepository`."

---

## Cycle de vie des services

ASP.NET Core propose **3 cycles de vie** :

### 1. Scoped (AddScoped)

**Durée de vie** : Une requête HTTP

**Utilisation** : DbContext, Repositories, Services

```csharp
builder.Services.AddScoped<EmployeeService>();
```

**Comportement** :
- Créé au début de la requête HTTP
- Partagé pendant toute la requête
- Détruit à la fin de la requête

**Dans XtraWork** :
Tous les Services et Repositories sont Scoped car ils dépendent du DbContext qui doit être Scoped.

---

### 2. Transient (AddTransient)

**Durée de vie** : À chaque injection

**Utilisation** : Services légers sans état

```csharp
builder.Services.AddTransient<EmailService>();
```

**Comportement** :
- Nouvelle instance à chaque fois qu'il est demandé
- Pas de partage

---

### 3. Singleton (AddSingleton)

**Durée de vie** : Toute la durée de l'application

**Utilisation** : Services sans état, configuration

```csharp
builder.Services.AddSingleton<IConfiguration>(configuration);
```

**Comportement** :
- Une seule instance créée au démarrage
- Partagée par toutes les requêtes
- Existe jusqu'à l'arrêt de l'application

**⚠️ Attention** : Ne jamais injecter un Scoped dans un Singleton !

---

## Exemple complet dans XtraWork

### 1. Enregistrement dans Program.cs

```csharp
// DbContext (Scoped par défaut avec AddDbContext)
builder.Services.AddDbContext<XtraWorkContext>(
    opt => opt.UseSqlServer(connectionString)
);

// Repository (Scoped car dépend du DbContext)
builder.Services.AddScoped<EmployeeRepository>();

// Service (Scoped car dépend du Repository)
builder.Services.AddScoped<EmployeeService>();
```

---

### 2. Injection dans EmployeeService

```csharp
public class EmployeeService
{
    private readonly EmployeeRepository _employeeRepository;
    private readonly TitleRepository _titleRepository;
    
    // ASP.NET Core injecte automatiquement les repositories
    public EmployeeService(
        EmployeeRepository employeeRepository,
        TitleRepository titleRepository)
    {
        _employeeRepository = employeeRepository;
        _titleRepository = titleRepository;
    }
    
    public async Task<List<EmployeeResponse>> GetAll()
    {
        var employees = await _employeeRepository.GetAllAsync();
        // ...
    }
}
```

**Ce qui se passe** :
1. ASP.NET Core voit que EmployeeService a besoin de 2 repositories
2. Il les crée automatiquement
3. Il les injecte dans le constructeur
4. Le service peut les utiliser

---

### 3. Injection dans EmployeeController

```csharp
public class EmployeeController : ControllerBase
{
    private readonly EmployeeService _employeeService;
    
    // ASP.NET Core injecte automatiquement le service
    public EmployeeController(EmployeeService employeeService)
    {
        _employeeService = employeeService;
    }
}
```

---

## Chaîne de dépendances

```
EmployeeController
    └─ a besoin de → EmployeeService
                         └─ a besoin de → EmployeeRepository
                                              └─ a besoin de → XtraWorkContext
```

**ASP.NET Core résout toute la chaîne automatiquement !**

---

## Avantages de la DI

### 1. Testabilité

```csharp
// En test : injecter un mock
var mockService = new Mock<EmployeeService>();
var controller = new EmployeeController(mockService.Object);
```

Facile de remplacer les dépendances réelles par des mocks.

---

### 2. Découplage

Le Controller ne sait pas comment le Service est créé, il le reçoit juste.

Si demain vous changez l'implémentation de `EmployeeService`, le Controller n'a pas besoin de changer.

---

### 3. Gestion automatique du cycle de vie

ASP.NET Core :
- Crée les instances au bon moment
- Les partage selon le scope
- Les détruit quand nécessaire
- Libère les ressources

Vous n'avez PAS à gérer manuellement.

---

## Interface vs Implémentation

### Pourquoi utiliser des interfaces ?

**Dans XtraWork** :
```csharp
builder.Services.AddScoped<IAuthService, AuthService>();
//                         ↑ Interface  ↑ Implémentation
```

**Avantage** :
Le code dépend de l'interface `IAuthService`, pas de `AuthService` concret.

```csharp
public class AuthController
{
    private readonly IAuthService _authService;  // Interface
    
    public AuthController(IAuthService authService)
    {
        _authService = authService;
    }
}
```

**Bénéfices** :
- Facile de changer l'implémentation
- Testabilité (mocker l'interface)
- Respect du principe SOLID (Dependency Inversion)

---

## Erreurs courantes

### Erreur 1 : Oublier d'enregistrer un service

```csharp
// Program.cs
// Oublié : builder.Services.AddScoped<EmployeeService>();

// Dans le Controller
public EmployeeController(EmployeeService employeeService)  // ERREUR !
```

**Résultat** : Exception au démarrage
```
Unable to resolve service for type 'EmployeeService'
```

**Solution** : Toujours enregistrer dans Program.cs

---

### Erreur 2 : Injecter Scoped dans Singleton

```csharp
builder.Services.AddSingleton<MyCacheService>();

public class MyCacheService
{
    public MyCacheService(XtraWorkContext context)  // ERREUR !
    {
        // Context est Scoped mais MyCacheService est Singleton
    }
}
```

**Résultat** : Le DbContext serait partagé entre toutes les requêtes → Erreurs de concurrence

---

## Résumé

La Dependency Injection dans ASP.NET Core :
- Gère automatiquement la création des objets
- Résout les chaînes de dépendances
- Gère les cycles de vie (Scoped, Transient, Singleton)
- Facilite les tests
- Réduit le couplage

**Dans XtraWork** :
- Tout est configuré dans `Program.cs`
- DbContext, Repositories, Services sont tous Scoped
- Les Controllers reçoivent leurs dépendances automatiquement

---

**Prochain module** : [04-ANALYSE-XTRAWORK(COURS).md](./04-ANALYSE-XTRAWORK(COURS).md)

