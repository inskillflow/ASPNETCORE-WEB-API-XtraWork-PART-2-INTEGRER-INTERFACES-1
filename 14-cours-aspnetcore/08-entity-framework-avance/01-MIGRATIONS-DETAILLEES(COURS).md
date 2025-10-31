# Module 1 - Migrations EF Core Détaillées

## Commandes de migration

### Créer une migration

```bash
dotnet ef migrations add NomDeLaMigration
```

Génère un fichier dans Migrations/ avec Up() et Down().

---

### Appliquer les migrations

```bash
dotnet ef database update
```

Exécute les migrations en attente sur la base de données.

---

### Annuler une migration

```bash
dotnet ef database update NomMigrationPrecedente
```

Exécute Down() pour revenir en arrière.

---

### Supprimer la dernière migration

```bash
dotnet ef migrations remove
```

Supprime le fichier de migration (si pas encore appliquée).

---

## Dans XtraWork

Les migrations sont dans Migrations/ (si créées).

XtraWork utilise `EnsureCreated()` pour simplicité :

```csharp
using (var scope = app.Services.CreateScope())
{
    var ctx = scope.ServiceProvider.GetRequiredService<XtraWorkContext>();
    ctx.Database.EnsureCreated();  // Crée la DB si n'existe pas
}
```

**En production** : Utiliser des migrations pour contrôle total.

---

**Prochain** : Quiz

