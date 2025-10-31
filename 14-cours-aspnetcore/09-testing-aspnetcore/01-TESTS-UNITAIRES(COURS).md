# Module 1 - Tests Unitaires

## xUnit

Framework de tests pour .NET.

---

## Créer un projet de tests

```bash
dotnet new xunit -n XtraWork.Tests
dotnet add reference ../XtraWork/XtraWork.csproj
dotnet add package Moq
```

---

## Exemple de test

```csharp
public class EmployeeServiceTests
{
    [Fact]
    public async Task GetAll_ReturnsEmployees()
    {
        // Arrange
        var mockRepo = new Mock<EmployeeRepository>();
        mockRepo.Setup(r => r.GetAllAsync()).ReturnsAsync(fakeEmployees);
        
        var service = new EmployeeService(mockRepo.Object, titleRepo);
        
        // Act
        var result = await service.GetAll();
        
        // Assert
        Assert.NotNull(result);
        Assert.Equal(2, result.Count);
    }
}
```

**Pattern AAA** : Arrange, Act, Assert

---

**Prochain** : Quiz

