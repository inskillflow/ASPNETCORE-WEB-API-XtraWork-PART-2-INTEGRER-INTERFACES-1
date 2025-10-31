# Module 4 - Test-Driven Development

## TDD : Test-Driven Development

Écrire les tests AVANT le code.

---

## Cycle TDD

**1. Red** : Écrire un test qui échoue

```csharp
[Fact]
public async Task Create_ShouldThrowException_WhenAgeUnder16()
{
    // Arrange
    var request = new EmployeeRequest
    {
        BirthDate = DateTime.Today.AddYears(-15)  // 15 ans
    };
    
    // Act & Assert
    await Assert.ThrowsAsync<InvalidOperationException>(() =>
        _service.Create(request));
}
```

Test échoue car la validation n'existe pas encore.

---

**2. Green** : Écrire le code minimum pour passer le test

```csharp
public async Task<EmployeeResponse> Create(EmployeeRequest request)
{
    var age = CalculateAge(request.BirthDate);
    if (age < 16)
    {
        throw new InvalidOperationException("Age minimum 16 ans");
    }
    // ...
}
```

Test passe maintenant.

---

**3. Refactor** : Améliorer le code sans casser les tests

```csharp
private void ValidateAge(DateTime birthDate)
{
    var age = CalculateAge(birthDate);
    if (age < MIN_AGE)
    {
        throw new InvalidOperationException($"Age minimum {MIN_AGE} ans");
    }
}
```

Test passe toujours.

---

## Avantages TDD

- Code toujours testé
- Design par les tests
- Confiance dans le refactoring
- Documentation vivante

---

**Prochain** : [05-QUIZ-QUESTIONS(OBLIGATOIRE).md](./05-QUIZ-QUESTIONS(OBLIGATOIRE).md)

