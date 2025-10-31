# Module 5 - Performance EF Core

## AsNoTracking pour lecture seule

Par défaut, EF Core suit les modifications (change tracking).

Pour lecture seule (pas de Update), utiliser AsNoTracking :

```csharp
public async Task<List<Employee>> GetAllAsync()
{
    return await _context.Employees
        .Include(e => e.Title)
        .AsNoTracking()  // Performance améliorée
        .ToListAsync();
}
```

**Avantage** : Plus rapide, moins de mémoire

**Quand** : Requêtes de lecture uniquement

---

## Pagination

Éviter de charger toutes les données :

```csharp
public async Task<List<Employee>> GetPagedAsync(int page, int pageSize)
{
    return await _context.Employees
        .Skip((page - 1) * pageSize)
        .Take(pageSize)
        .ToListAsync();
}
```

---

## Indexation

Créer des index sur les colonnes fréquemment recherchées :

```csharp
modelBuilder.Entity<Employee>(entity =>
{
    entity.HasIndex(e => e.LastName);  // Index pour recherches
});
```

---

## Requêtes compilées

Pour requêtes répétées :

```csharp
private static readonly Func<XtraWorkContext, Guid, Task<Employee?>> GetByIdCompiled =
    EF.CompileAsyncQuery((XtraWorkContext context, Guid id) =>
        context.Employees.FirstOrDefault(e => e.Id == id));
```

---

**Prochain** : [06-QUIZ-QUESTIONS(OBLIGATOIRE).md](./06-QUIZ-QUESTIONS(OBLIGATOIRE).md)

