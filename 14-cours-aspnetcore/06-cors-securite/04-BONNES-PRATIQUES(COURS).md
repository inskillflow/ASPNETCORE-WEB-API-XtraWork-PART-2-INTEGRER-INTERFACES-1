# Module 4 - Bonnes Pratiques Sécurité

## Checklist sécurité pour API

### 1. HTTPS partout

**Production** : HTTPS obligatoire
**Développement** : HTTPS même en local

---

### 2. Validation serveur

**Ne jamais faire confiance au client**

Même si le frontend valide, toujours valider côté serveur :
- FluentValidation
- DataAnnotations
- Validation métier dans Services

---

### 3. JWT sécurisés

- Clé de 64 caractères minimum
- Expiration courte (15 min - 1h)
- Refresh tokens pour renouveler
- HTTPS pour le transport

---

### 4. CORS restrictif

**Mauvais** :
```csharp
policy.AllowAnyOrigin()  // Trop permissif
```

**Bon** :
```csharp
policy.WithOrigins("https://app.production.com")  // Spécifique
```

---

### 5. Pas de données sensibles exposées

**Mauvais** :
```csharp
return Ok(new { user, passwordHash });  // Exposer le hash
```

**Bon** :
```csharp
return Ok(new UserResponse { Id, Username, Email });  // Seulement nécessaire
```

---

### 6. Logging sans données sensibles

**Mauvais** :
```csharp
_logger.LogInfo("Login: {username} {password}", user, pwd);
```

**Bon** :
```csharp
_logger.LogInfo("Login attempt: {username}", user);
```

---

### 7. Rate limiting

Limiter 100 requêtes/minute par IP.

---

### 8. Health checks

```csharp
builder.Services.AddHealthChecks()
    .AddDbContextCheck<XtraWorkContext>();

app.MapHealthChecks("/health");
```

---

**Prochain** : [05-QUIZ-QUESTIONS(OBLIGATOIRE).md](./05-QUIZ-QUESTIONS(OBLIGATOIRE).md)

