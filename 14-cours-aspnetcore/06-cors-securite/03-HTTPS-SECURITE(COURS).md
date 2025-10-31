# Module 3 - HTTPS et Sécurité

## HTTPS obligatoire en production

En développement, XtraWork utilise HTTPS avec un certificat auto-signé.

En production, HTTPS est OBLIGATOIRE pour :
- Chiffrer le token JWT pendant le transport
- Protéger les données sensibles
- Éviter les attaques MITM (Man-in-the-Middle)

---

## Configuration HTTPS

### Dans Program.cs

```csharp
app.UseHttpsRedirection();  // Redirige HTTP → HTTPS
```

**Comportement** :
- Requête sur http://api.com/employees
- Redirection vers https://api.com/employees

---

## Certificat SSL

**Développement** :
```bash
dotnet dev-certs https --trust
```

Génère un certificat auto-signé pour localhost.

**Production** :
- Let's Encrypt (gratuit)
- Azure App Service (automatique)
- Certificat commercial

---

## Sécurité API

### 1. Password hashing (BCrypt)

```csharp
// Ne JAMAIS stocker en clair
user.PasswordHash = BCrypt.Net.BCrypt.HashPassword(request.Password);

// Vérification
BCrypt.Net.BCrypt.Verify(request.Password, user.PasswordHash);
```

---

### 2. Protection SQL Injection

Entity Framework protège automatiquement :

```csharp
// SÉCURISÉ - EF paramétrise automatiquement
var employee = await _context.Employees
    .FirstOrDefaultAsync(e => e.FirstName == userInput);
```

---

### 3. Rate Limiting

Limiter les requêtes par IP pour éviter abus.

```csharp
builder.Services.AddRateLimiter(options =>
{
    options.AddFixedWindowLimiter("fixed", opt =>
    {
        opt.Window = TimeSpan.FromMinutes(1);
        opt.PermitLimit = 100;
    });
});
```

---

**Prochain** : [04-BONNES-PRATIQUES(COURS).md](./04-BONNES-PRATIQUES(COURS).md)

