# Module 3 - Mapping Entity vers DTO

## Transformation Entity → Response

Le Service est responsable du mapping Entity vers Response DTO.

---

## Mapping manuel dans XtraWork

```csharp
public class EmployeeService
{
    public async Task<List<EmployeeResponse>> GetAll()
    {
        var employees = await _employeeRepository.GetAllAsync();
        
        // Mapping manuel
        return employees.Select(e => new EmployeeResponse
        {
            Id = e.Id,
            FirstName = e.FirstName,
            LastName = e.LastName,
            BirthDate = e.BirthDate,
            Gender = e.Gender,
            TitleId = e.TitleId,
            TitleDescription = e.Title.Description,  // Navigation property
            CreatedAt = e.CreatedAt
        }).ToList();
    }
}
```

---

## Méthode helper MapToResponse

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

// Utilisation
public async Task<EmployeeResponse> Get(Guid id)
{
    var employee = await _employeeRepository.GetByIdAsync(id);
    return MapToResponse(employee);
}
```

---

## Mapping Request → Entity

```csharp
public async Task<EmployeeResponse> Create(EmployeeRequest request)
{
    // Request → Entity
    var employee = new Employee
    {
        Id = Guid.NewGuid(),
        FirstName = request.FirstName,
        LastName = request.LastName,
        BirthDate = request.BirthDate,
        Gender = request.Gender,
        TitleId = request.TitleId,
        CreatedAt = DateTime.UtcNow
    };
    
    var created = await _employeeRepository.CreateAsync(employee);
    
    // Entity → Response
    return MapToResponse(created);
}
```

---

**Prochain** : [04-AUTOMAPPER(COURS).md](./04-AUTOMAPPER(COURS).md)

