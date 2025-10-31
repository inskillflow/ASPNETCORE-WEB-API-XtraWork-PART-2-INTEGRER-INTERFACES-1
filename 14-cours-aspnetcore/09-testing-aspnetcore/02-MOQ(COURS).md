# Module 2 - Moq pour Mocker

## Qu'est-ce que Moq ?

Bibliothèque pour créer des objets mock (faux) pour les tests.

---

## Mocker un Repository

```csharp
// Créer un mock
var mockRepo = new Mock<EmployeeRepository>();

// Configurer le comportement
mockRepo.Setup(r => r.GetAllAsync())
    .ReturnsAsync(new List<Employee>
    {
        new Employee { Id = Guid.NewGuid(), FirstName = "Test" }
    });

// Utiliser dans le test
var service = new EmployeeService(mockRepo.Object, titleRepo);
var result = await service.GetAll();

// Vérifier
mockRepo.Verify(r => r.GetAllAsync(), Times.Once);
```

---

## Setup avec paramètres

```csharp
mockRepo.Setup(r => r.GetByIdAsync(It.IsAny<Guid>()))
    .ReturnsAsync((Guid id) => fakeEmployees.Find(e => e.Id == id));
```

**It.IsAny<Guid>()** : Accepte n'importe quel Guid

---

**Prochain** : [03-TESTS-INTEGRATION(COURS).md](./03-TESTS-INTEGRATION(COURS).md)

