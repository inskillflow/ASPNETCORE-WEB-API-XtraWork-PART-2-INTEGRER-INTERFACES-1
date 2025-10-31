# Module 4 - Validation des Tokens et Claims

## Comment ASP.NET Core valide les JWT

Quand une requête arrive avec un JWT, voici ce qui se passe automatiquement :

```
1. Requête HTTP avec header : Authorization: Bearer eyJhbG...
   ↓
2. Middleware Authentication (UseAuthentication) intercepte
   ↓
3. JwtBearer handler extrait le token du header
   ↓
4. Validation selon TokenValidationParameters :
   - Signature valide ? (avec la clé secrète)
   - Issuer correct ?
   - Audience correcte ?
   - Pas expiré ? (exp claim < maintenant)
   ↓
5. Si valide → Créer un ClaimsPrincipal
   - User.Identity.IsAuthenticated = true
   - User.Claims = tous les claims du token
   ↓
6. Si invalide → HTTP 401 Unauthorized
```

**Tout est automatique ! Vous n'avez rien à coder.**

---

## Protéger un endpoint avec [Authorize]

### Exemple simple

```csharp
[ApiController]
[Route("api/[controller]")]
[Authorize]  // ← Nécessite un JWT valide
public class EmployeeController : ControllerBase
{
    [HttpGet]
    public async Task<ActionResult> GetAll()
    {
        // Ce code s'exécute SEULEMENT si le JWT est valide
        var employees = await _employeeService.GetAll();
        return Ok(employees);
    }
}
```

**Comportement** :
- Requête sans token → HTTP 401 Unauthorized
- Requête avec token invalide → HTTP 401
- Requête avec token expiré → HTTP 401
- Requête avec token valide → Exécution de la méthode

---

## Accéder aux Claims dans un Controller

### User.Claims

Quand le JWT est valide, vous pouvez accéder aux claims via `User` :

```csharp
[HttpGet("me")]
[Authorize]
public async Task<ActionResult> GetCurrentUser()
{
    // Récupérer l'ID de l'utilisateur depuis le claim
    var userId = User.FindFirst(ClaimTypes.NameIdentifier)?.Value;
    
    // Récupérer le nom d'utilisateur
    var username = User.FindFirst(ClaimTypes.Name)?.Value;
    
    // Récupérer le rôle
    var role = User.FindFirst(ClaimTypes.Role)?.Value;
    
    // Récupérer un claim personnalisé
    var firstName = User.FindFirst("FirstName")?.Value;
    
    return Ok(new { userId, username, role, firstName });
}
```

**Dans XtraWork/AuthController.cs** :
```csharp
[HttpGet("me")]
[Authorize]
public async Task<ActionResult<UserResponse>> GetCurrentUser()
{
    var userId = User.FindFirst(ClaimTypes.NameIdentifier)?.Value;
    
    if (string.IsNullOrEmpty(userId))
    {
        return Unauthorized();
    }
    
    var user = await _authService.GetCurrentUserAsync(userId);
    return Ok(user);
}
```

---

## Autorisation basée sur les rôles

### [Authorize(Roles = "...")]

```csharp
// Accessible seulement par les Admins
[HttpPost]
[Authorize(Roles = "Admin")]
public async Task<ActionResult> CreateTitle([FromBody] TitleRequest request)
{
    var title = await _titleService.Create(request);
    return CreatedAtAction(nameof(Get), new { id = title.Id }, title);
}
```

**Comportement** :
- Token avec role = "Admin" → OK
- Token avec role = "Manager" → HTTP 403 Forbidden
- Token avec role = "User" → HTTP 403 Forbidden
- Pas de token → HTTP 401 Unauthorized

---

### [Authorize(Policy = "...")]

Policies définies dans Program.cs :

```csharp
builder.Services.AddAuthorization(options =>
{
    options.AddPolicy("AdminOnly", p => p.RequireRole("Admin"));
    options.AddPolicy("ManagerOrAdmin", p => p.RequireRole("Manager", "Admin"));
});
```

Utilisation :

```csharp
// Accessible par Manager OU Admin
[HttpDelete("{id}")]
[Authorize(Policy = "ManagerOrAdmin")]
public async Task<ActionResult> Delete(Guid id)
{
    await _employeeService.Delete(id);
    return NoContent();
}
```

**Avantage des policies** : Logique de permission centralisée et réutilisable.

---

## ClaimsPrincipal et ClaimsIdentity

### Hiérarchie

```
User (ClaimsPrincipal)
 └─ Identity (ClaimsIdentity)
     └─ Claims (collection de Claim)
```

**User.Identity.IsAuthenticated** :
- `true` si JWT valide
- `false` sinon

**User.IsInRole("Admin")** :
- `true` si le claim Role = "Admin"
- `false` sinon

**User.Claims** :
- Collection de tous les claims du token

---

## Exemples pratiques dans XtraWork

### Vérifier le rôle

```csharp
if (User.IsInRole("Admin"))
{
    // Code exécuté seulement pour les Admins
}
```

### Récupérer l'ID utilisateur

```csharp
var userId = User.FindFirst(ClaimTypes.NameIdentifier)?.Value;
```

### Vérifier l'authentification

```csharp
if (User.Identity?.IsAuthenticated == true)
{
    // Utilisateur connecté
}
```

---

## Ordre du middleware (rappel important)

```csharp
app.UseCors("NextJsPolicy");  // 1. CORS en premier

app.UseAuthentication();      // 2. Valider le JWT
app.UseAuthorization();       // 3. Vérifier les permissions

app.MapControllers();         // 4. Exécuter les controllers
```

**Si vous inversez UseAuthentication et UseAuthorization** :
L'autorisation ne fonctionnera pas car les claims ne seront pas encore extraits !

---

## Status codes HTTP

### 401 Unauthorized

**Quand** : Token manquant, invalide, ou expiré

**Message** : "Vous devez être connecté"

**Dans XtraWork** : Retourné automatiquement par le middleware

---

### 403 Forbidden

**Quand** : Token valide mais pas les permissions

**Message** : "Vous n'avez pas la permission"

**Exemple** :
```csharp
[Authorize(Roles = "Admin")]  // User avec role "User" → 403
```

---

## Résumé

La validation JWT dans ASP.NET Core est automatique :

1. Middleware Authentication extrait et valide le token
2. Si valide → Crée un ClaimsPrincipal avec tous les claims
3. `[Authorize]` vérifie l'authentification
4. `[Authorize(Roles)]` ou `[Authorize(Policy)]` vérifient les permissions
5. Dans le Controller, `User.Claims` contient toutes les informations

**Dans XtraWork** :
- Configuration dans `Program.cs`
- Policies "AdminOnly" et "ManagerOrAdmin"
- Utilisation dans TitleController et EmployeeController

---

**Prochain module** : [05-SECURITE-REFRESH(COURS).md](./05-SECURITE-REFRESH(COURS).md)

