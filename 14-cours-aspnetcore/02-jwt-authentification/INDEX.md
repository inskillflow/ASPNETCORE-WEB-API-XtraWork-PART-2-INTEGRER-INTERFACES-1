# Cours 2 - JWT Authentification

## Navigation du cours

### Modules de cours (COURS)

1. [Introduction](./00-INTRODUCTION(COURS).md) - Authentification moderne et JWT
2. [Anatomie d'un JWT](./01-ANATOMIE-JWT(COURS).md) - header.payload.signature
3. [Configuration ASP.NET](./02-CONFIGURATION-ASPNET(COURS).md) - AddAuthentication, JwtBearer
4. [Génération de tokens](./03-GENERATION-TOKENS(COURS).md) - JwtSecurityTokenHandler, Claims
5. [Validation et Claims](./04-VALIDATION-CLAIMS(COURS).md) - [Authorize], ClaimsPrincipal, Roles
6. [Sécurité et Refresh Tokens](./05-SECURITE-REFRESH(COURS).md) - Bonnes pratiques

### Évaluation

- [Quiz Questions (OBLIGATOIRE)](./06-QUIZ-QUESTIONS(OBLIGATOIRE).md) - 30 questions
- [Quiz Réponses (OBLIGATOIRE)](./07-QUIZ-REPONSES(OBLIGATOIRE).md) - Corrections
- [Exercices (OPTIONNEL)](./08-EXERCICES(OPTIONNEL).md) - 6 exercices pratiques

---

## Durée estimée

**Total** : 5-6 heures
- Modules de cours : 4-5 heures
- Quiz : 30-40 minutes
- Exercices : 1-2 heures

---

## Objectifs d'apprentissage

À la fin de ce cours, vous serez capable de :

- ✅ Expliquer ce qu'est un JWT et sa structure
- ✅ Configurer l'authentification JWT dans ASP.NET Core
- ✅ Générer des tokens JWT avec claims
- ✅ Valider les tokens et extraire les claims
- ✅ Utiliser [Authorize] et les policies
- ✅ Implémenter des refresh tokens
- ✅ Sécuriser votre API avec les bonnes pratiques

---

## Code analysé dans ce cours

### XtraWork/Program.cs

```csharp
// Configuration JWT analysée en détail
builder.Services.AddAuthentication(JwtBearerDefaults.AuthenticationScheme)
    .AddJwtBearer(opt => { ... });
    
builder.Services.AddAuthorization(options => {
    options.AddPolicy("AdminOnly", p => p.RequireRole("Admin"));
    options.AddPolicy("ManagerOrAdmin", p => p.RequireRole("Manager", "Admin"));
});
```

### XtraWork/Services/AuthService.cs

```csharp
// Génération de JWT analysée ligne par ligne
private string GenerateJwtToken(User user)
{
    var claims = new[]
    {
        new Claim(ClaimTypes.NameIdentifier, user.Id.ToString()),
        new Claim(ClaimTypes.Name, user.Username),
        new Claim(ClaimTypes.Role, user.Role),
        // ...
    };
    
    var token = new JwtSecurityToken(...);
    return new JwtSecurityTokenHandler().WriteToken(token);
}
```

---

**Commencez par** : [00-INTRODUCTION(COURS).md](./00-INTRODUCTION(COURS).md)

