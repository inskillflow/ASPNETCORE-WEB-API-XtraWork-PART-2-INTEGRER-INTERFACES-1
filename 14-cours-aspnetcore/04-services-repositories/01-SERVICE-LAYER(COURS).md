# Module 1 - Service Layer Pattern

## Qu'est-ce qu'un Service Layer ?

Le Service Layer est une couche qui contient la logique metier de l'application. Il se situe entre les Controllers (presentation) et les Repositories (donnees).

---

## Responsabilites d'un Service

### 1. Logique metier

Validation des regles business complexes.

**Exemple dans EmployeeService** :
```csharp
public async Task<EmployeeResponse> Create(EmployeeRequest request)
{
    // REGLE METIER : Le titre doit exister
    var titleExists = await _titleRepository.ExistsAsync(request.TitleId);
    if (!titleExists)
    {
        throw new NotFoundException("Titre non trouve");
    }
    
    // REGLE METIER : Age minimum 16 ans
    var age = CalculateAge(request.BirthDate);
    if (age < 16)
    {
        throw new InvalidOperationException("Age minimum 16 ans");
    }
    
    // Creer l'employe...
}
```

---

### 2. Orchestration

Coordonner plusieurs repositories.

```csharp
public async Task<EmployeeResponse> Create(EmployeeRequest request)
{
    // Utilise 2 repositories differents
    var titleExists = await _titleRepository.ExistsAsync(request.TitleId);
    var employee = await _employeeRepository.CreateAsync(newEmployee);
    
    // Orchestration
    return MapToResponse(employee);
}
```

---

### 3. Transformation

Mapper Entity vers DTO Response.

```csharp
private EmployeeResponse MapToResponse(Employee employee)
{
    return new EmployeeResponse
    {
        Id = employee.Id,
        FirstName = employee.FirstName,
        LastName = employee.LastName,
        BirthDate = employee.BirthDate,
        Gender = employee.Gender,
        TitleId = employee.TitleId,
        TitleDescription = employee.Title.Description,
        CreatedAt = employee.CreatedAt
    };
}
```

---

### 4. Gestion des transactions

Si plusieurs operations doivent reussir ensemble.

```csharp
public async Task<EmployeeResponse> TransferEmployee(Guid employeeId, Guid newTitleId)
{
    using var transaction = await _context.Database.BeginTransactionAsync();
    try
    {
        // Operation 1
        var employee = await _employeeRepository.GetByIdAsync(employeeId);
        employee.TitleId = newTitleId;
        
        // Operation 2
        await _employeeRepository.UpdateAsync(employee);
        
        // Operation 3
        await _auditRepository.LogTransfer(employeeId, newTitleId);
        
        await transaction.CommitAsync();
        return MapToResponse(employee);
    }
    catch
    {
        await transaction.RollbackAsync();
        throw;
    }
}
```

---

## Structure d'un Service XtraWork

```csharp
public class EmployeeService
{
    private readonly EmployeeRepository _employeeRepository;
    private readonly TitleRepository _titleRepository;
    
    // Injection des repositories
    public EmployeeService(
        EmployeeRepository employeeRepository,
        TitleRepository titleRepository)
    {
        _employeeRepository = employeeRepository;
        _titleRepository = titleRepository;
    }
    
    // Methodes publiques (appelees par les controllers)
    public async Task<List<EmployeeResponse>> GetAll() { }
    public async Task<EmployeeResponse> Get(Guid id) { }
    public async Task<EmployeeResponse> Create(EmployeeRequest request) { }
    public async Task<EmployeeResponse> Update(Guid id, EmployeeRequest request) { }
    public async Task Delete(Guid id) { }
    
    // Methodes privees (helpers)
    private EmployeeResponse MapToResponse(Employee employee) { }
}
```

---

## Avantages du Service Layer

**Separation des responsabilites** :
- Controller gere HTTP
- Service gere business
- Repository gere donnees

**Testabilite** :
```csharp
// Mocker les repositories
var mockRepo = new Mock<EmployeeRepository>();
mockRepo.Setup(r => r.GetAllAsync()).ReturnsAsync(fakeData);

var service = new EmployeeService(mockRepo.Object, titleRepo);
var result = await service.GetAll();
```

**Reutilisabilite** :
Le meme service peut etre utilise par plusieurs controllers.

---

**Prochain** : [02-REPOSITORY-PATTERN(COURS).md](./02-REPOSITORY-PATTERN(COURS).md)

