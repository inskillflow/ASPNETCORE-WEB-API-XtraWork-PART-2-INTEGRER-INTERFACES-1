# Module 2 - Swashbuckle dans ASP.NET Core

## Qu'est-ce que Swashbuckle ?

Swashbuckle est une bibliothèque qui génère automatiquement la documentation Swagger/OpenAPI pour ASP.NET Core.

---

## Installation

```bash
dotnet add package Swashbuckle.AspNetCore
```

---

## Configuration dans Program.cs

```csharp
// 1. Enregistrer les services
builder.Services.AddEndpointsApiExplorer();
builder.Services.AddSwaggerGen(c =>
{
    c.SwaggerDoc("v1", new()
    {
        Title = "XtraWork API",
        Version = "v1",
        Description = "API de gestion des employés avec authentification JWT"
    });
});

// 2. Activer le middleware
app.UseSwagger();      // Génère swagger.json
app.UseSwaggerUI();    // Interface UI
```

---

## Support JWT dans Swagger

Pour tester les endpoints protégés dans Swagger UI :

```csharp
builder.Services.AddSwaggerGen(c =>
{
    c.SwaggerDoc("v1", new() { Title = "XtraWork API", Version = "v1" });
    
    // Définir le schéma de sécurité JWT
    var securityScheme = new OpenApiSecurityScheme
    {
        Name = "Authorization",
        Description = "JWT Authorization header using Bearer scheme",
        In = ParameterLocation.Header,
        Type = SecuritySchemeType.Http,
        Scheme = "bearer",
        BearerFormat = "JWT",
        Reference = new OpenApiReference
        {
            Type = ReferenceType.SecurityScheme,
            Id = "Bearer"
        }
    };
    
    c.AddSecurityDefinition("Bearer", securityScheme);
    c.AddSecurityRequirement(new OpenApiSecurityRequirement
    {
        { securityScheme, Array.Empty<string>() }
    });
});
```

**Résultat** : Bouton "Authorize" dans Swagger UI pour entrer le JWT.

---

## Utiliser Swagger UI

1. Ouvrir https://localhost:7033/swagger
2. Cliquer "Authorize"
3. Entrer : `Bearer {votre_token}`
4. Tester les endpoints protégés

---

**Prochain** : [03-DOCUMENTER-ENDPOINTS(COURS).md](./03-DOCUMENTER-ENDPOINTS(COURS).md)

