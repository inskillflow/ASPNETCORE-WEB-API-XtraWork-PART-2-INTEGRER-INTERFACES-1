# Module 4 - AutoMapper (Optionnel)

## Alternative au mapping manuel

AutoMapper automatise le mapping entre objets.

---

## Installation

```bash
dotnet add package AutoMapper.Extensions.Microsoft.DependencyInjection
```

---

## Configuration

```csharp
// Program.cs
builder.Services.AddAutoMapper(typeof(Program));

// MappingProfile.cs
public class MappingProfile : Profile
{
    public MappingProfile()
    {
        CreateMap<Employee, EmployeeResponse>()
            .ForMember(dest => dest.TitleDescription, 
                      opt => opt.MapFrom(src => src.Title.Description));
        
        CreateMap<EmployeeRequest, Employee>();
    }
}
```

---

## Utilisation

```csharp
public class EmployeeService
{
    private readonly IMapper _mapper;
    
    public EmployeeService(IMapper mapper)
    {
        _mapper = mapper;
    }
    
    public async Task<List<EmployeeResponse>> GetAll()
    {
        var employees = await _employeeRepository.GetAllAsync();
        return _mapper.Map<List<EmployeeResponse>>(employees);  // Automatique
    }
}
```

---

## XtraWork n'utilise pas AutoMapper

Pour garder la simplicité et le contrôle explicite.

**Mapping manuel** : Plus verbeux mais plus clair pour l'apprentissage.

---

**Prochain** : [05-QUIZ-QUESTIONS(OBLIGATOIRE).md](./05-QUIZ-QUESTIONS(OBLIGATOIRE).md)

