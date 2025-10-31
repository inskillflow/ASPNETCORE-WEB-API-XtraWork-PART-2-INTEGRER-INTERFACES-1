# Introduction - Swagger et Documentation

## Qu'est-ce que Swagger ?

Swagger (OpenAPI) genere automatiquement la documentation de votre API et fournit une interface pour la tester.

---

## Dans XtraWork

URL : https://localhost:7033/swagger

Interface qui montre :
- Tous les endpoints
- Parametres requis
- Reponses possibles
- Possibilite de tester directement

---

## Configuration

```csharp
builder.Services.AddSwaggerGen(c =>
{
    c.SwaggerDoc("v1", new()
    {
        Title = "XtraWork API",
        Version = "v1"
    });
    
    // Support JWT
    c.AddSecurityDefinition("Bearer", ...);
});

app.UseSwagger();
app.UseSwaggerUI();
```

---

**Suite** : Quiz et exercices

