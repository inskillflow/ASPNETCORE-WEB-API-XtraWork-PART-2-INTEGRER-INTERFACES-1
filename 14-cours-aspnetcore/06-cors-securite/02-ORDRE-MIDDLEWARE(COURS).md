# Module 2 - Ordre du Middleware

## Pipeline de middleware dans XtraWork

```csharp
app.UseExceptionHandler(...);      // 1. Gestion erreurs
app.UseSerilogRequestLogging();    // 2. Logging HTTP

app.UseSwagger();                  // 3. Documentation
app.UseSwaggerUI();

app.UseCors("NextJsPolicy");       // 4. CORS - IMPORTANT : Avant Auth

app.UseHttpsRedirection();         // 5. Redirection HTTPS
app.UseAuthentication();           // 6. Valider JWT
app.UseAuthorization();            // 7. Vérifier permissions

app.MapHealthChecks("/health");    // 8. Health checks
app.MapControllers();              // 9. Controllers
```

---

## Ordre CRUCIAL

### CORS doit venir AVANT Authentication

**Pourquoi ?**

Les requêtes preflight (OPTIONS) ne contiennent pas de token JWT. Si UseAuthentication vient avant UseCors, les preflight sont rejetées.

**Bon ordre** :
```csharp
app.UseCors("NextJsPolicy");  // Gère OPTIONS sans auth
app.UseAuthentication();      // Puis valide JWT
```

**Mauvais ordre** :
```csharp
app.UseAuthentication();      // OPTIONS rejetée (pas de JWT)
app.UseCors("NextJsPolicy");  // Jamais atteint
```

---

## Requête preflight

Quand le frontend fait POST avec Authorization header, le navigateur envoie d'abord OPTIONS :

```
OPTIONS /api/employees
Origin: http://localhost:3000
Access-Control-Request-Method: POST
Access-Control-Request-Headers: authorization, content-type
```

Le serveur répond :
```
200 OK
Access-Control-Allow-Origin: http://localhost:3000
Access-Control-Allow-Methods: POST
Access-Control-Allow-Headers: authorization, content-type
```

Puis le vrai POST est envoyé.

**Si CORS après Auth** : OPTIONS → 401 Unauthorized → Le POST n'est jamais envoyé.

---

**Prochain** : [03-HTTPS-SECURITE(COURS).md](./03-HTTPS-SECURITE(COURS).md)

