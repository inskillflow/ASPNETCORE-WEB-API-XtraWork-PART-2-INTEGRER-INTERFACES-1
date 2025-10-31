# Module 1 - Configuration CORS

## CORS dans XtraWork/Program.cs

```csharp
builder.Services.AddCors(options =>
{
    options.AddPolicy("NextJsPolicy", policy =>
    {
        policy.WithOrigins("http://localhost:3000", "https://localhost:3000")
              .AllowAnyHeader()
              .AllowAnyMethod()
              .AllowCredentials();
    });
});

// Dans le pipeline
app.UseCors("NextJsPolicy");  // AVANT UseAuthentication
app.UseAuthentication();
app.UseAuthorization();
```

---

## Explications

**WithOrigins** : Autorise ces origines
**AllowAnyHeader** : Autorise tous les headers (Authorization, Content-Type, etc.)
**AllowAnyMethod** : Autorise GET, POST, PUT, DELETE
**AllowCredentials** : Autorise les cookies et Authorization header

---

## Ordre crucial

```csharp
app.UseCors("NextJsPolicy");  // 1. CORS en premier
app.UseAuthentication();      // 2. Puis Auth
app.UseAuthorization();       // 3. Puis Authz
```

**Pourquoi ?** : Les requêtes preflight (OPTIONS) doivent passer CORS avant tout.

---

**Prochain** : Quiz

