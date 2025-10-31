# Module 2 - Relations dans EF Core

## Relations dans XtraWork

### One-to-Many : Title → Employees

Un titre peut avoir plusieurs employés, mais un employé a un seul titre.

---

## Configuration dans XtraWorkContext

```csharp
protected override void OnModelCreating(ModelBuilder modelBuilder)
{
    // Configuration Employee
    modelBuilder.Entity<Employee>(entity =>
    {
        entity.HasKey(e => e.Id);
        
        // Relation Employee → Title
        entity.HasOne(e => e.Title)           // Un employé a un titre
              .WithMany(t => t.Employees)      // Un titre a plusieurs employés
              .HasForeignKey(e => e.TitleId)   // Clé étrangère
              .OnDelete(DeleteBehavior.Restrict);  // Empêcher suppression si employés liés
    });
}
```

---

## Dans les entités

**Employee.cs** :
```csharp
public Guid TitleId { get; set; }      // Foreign Key
public Title Title { get; set; }       // Navigation property
```

**Title.cs** :
```csharp
public ICollection<Employee> Employees { get; set; } = new List<Employee>();
```

---

## DeleteBehavior

**Restrict** : Empêche suppression si relations existent
**Cascade** : Supprime les entités liées
**SetNull** : Met la FK à NULL

**XtraWork utilise Restrict** : Un titre ne peut pas être supprimé s'il a des employés.

---

**Prochain** : [03-INCLUDE-EAGER-LOADING(COURS).md](./03-INCLUDE-EAGER-LOADING(COURS).md)

