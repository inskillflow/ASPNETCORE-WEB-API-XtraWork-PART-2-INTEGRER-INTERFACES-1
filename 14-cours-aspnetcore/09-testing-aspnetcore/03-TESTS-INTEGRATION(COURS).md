# Module 3 - Tests d'Intégration

## WebApplicationFactory

Permet de tester l'API complète sans la déployer.

---

## Créer un test d'intégration

```csharp
public class EmployeesApiTests : IClassFixture<WebApplicationFactory<Program>>
{
    private readonly HttpClient _client;
    
    public EmployeesApiTests(WebApplicationFactory<Program> factory)
    {
        _client = factory.CreateClient();
    }
    
    [Fact]
    public async Task GetEmployees_ReturnsOk()
    {
        // Arrange - Login pour obtenir token
        var loginResponse = await _client.PostAsJsonAsync("/api/auth/login", 
            new { username = "admin", password = "Admin123!" });
        var authData = await loginResponse.Content.ReadFromJsonAsync<AuthResponse>();
        
        _client.DefaultRequestHeaders.Authorization = 
            new AuthenticationHeaderValue("Bearer", authData.Token);
        
        // Act
        var response = await _client.GetAsync("/api/employees");
        
        // Assert
        response.StatusCode.Should().Be(HttpStatusCode.OK);
    }
}
```

**Teste l'API complète** : Controllers, Services, Repositories, Database

---

**Prochain** : [04-TDD(COURS).md](./04-TDD(COURS).md)

