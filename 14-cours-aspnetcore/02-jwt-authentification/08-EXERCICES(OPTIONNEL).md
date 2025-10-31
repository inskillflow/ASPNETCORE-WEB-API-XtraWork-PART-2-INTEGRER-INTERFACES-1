# Exercices Optionnels - JWT Authentification

## Exercice 1 : Decoder un JWT manuellement

### Enonce

Prenez un JWT genere par XtraWork et decodez-le manuellement pour comprendre sa structure.

### Instructions

1. Lancez XtraWork : `cd XtraWork && dotnet run`
2. Testez login dans Swagger : https://localhost:7033/swagger
3. Copiez le token retourne
4. Allez sur https://jwt.io
5. Collez le token

### Questions

**Q1** : Quels sont les 3 parties visibles ?
**Q2** : Quels claims voyez-vous dans le payload ?
**Q3** : Le token est-il valide sur jwt.io ? Pourquoi ?

### Solution

**Q1** : Header, Payload, Signature (separes visuellement sur jwt.io)

**Q2** : Vous devriez voir :
- nameidentifier (ID utilisateur)
- name (username)
- emailaddress
- role
- FirstName et LastName
- exp (expiration)
- iss (issuer)
- aud (audience)

**Q3** : Non valide car jwt.io n'a pas votre cle secrete. La signature ne peut pas etre verifiee. C'est normal et securise.

---

## Exercice 2 : Generer un token custom

### Enonce

Creez une methode qui genere un JWT avec des claims personnalises.

### Code starter

```csharp
private string GenerateCustomToken(User user, string customClaim)
{
    // A completer
}
```

### Solution

```csharp
private string GenerateCustomToken(User user, string department)
{
    var key = new SymmetricSecurityKey(
        Encoding.UTF8.GetBytes(_configuration["Jwt:Key"]!)
    );
    
    var credentials = new SigningCredentials(
        key, 
        SecurityAlgorithms.HmacSha256
    );
    
    var claims = new[]
    {
        new Claim(ClaimTypes.NameIdentifier, user.Id.ToString()),
        new Claim(ClaimTypes.Name, user.Username),
        new Claim(ClaimTypes.Role, user.Role),
        new Claim("Department", department),  // Claim custom
        new Claim("GeneratedAt", DateTime.UtcNow.ToString("o"))
    };
    
    var token = new JwtSecurityToken(
        issuer: _configuration["Jwt:Issuer"],
        audience: _configuration["Jwt:Audience"],
        claims: claims,
        expires: DateTime.UtcNow.AddHours(1),
        signingCredentials: credentials
    );
    
    return new JwtSecurityTokenHandler().WriteToken(token);
}
```

**Utilisation** :
```csharp
var token = GenerateCustomToken(user, "IT Department");
```

---

## Exercice 3 : Implementer un Refresh Token

### Enonce

Ajoutez le support des refresh tokens au projet XtraWork.

### Etapes

**1. Creer l'entite RefreshToken**

```csharp
// Entities/RefreshToken.cs
public class RefreshToken
{
    public Guid Id { get; set; }
    public Guid UserId { get; set; }
    public string Token { get; set; } = string.Empty;
    public DateTime ExpiresAt { get; set; }
    public bool IsRevoked { get; set; }
    
    public User User { get; set; } = null!;
}
```

**2. Ajouter DbSet dans XtraWorkContext**

```csharp
public DbSet<RefreshToken> RefreshTokens { get; set; }
```

**3. Creer la migration**

```bash
dotnet ef migrations add AddRefreshTokens
dotnet ef database update
```

**4. Creer RefreshTokenRepository**

```csharp
public class RefreshTokenRepository
{
    private readonly XtraWorkContext _context;
    
    public RefreshTokenRepository(XtraWorkContext context)
    {
        _context = context;
    }
    
    public async Task<RefreshToken> CreateAsync(RefreshToken token)
    {
        _context.RefreshTokens.Add(token);
        await _context.SaveChangesAsync();
        return token;
    }
    
    public async Task<RefreshToken?> GetByTokenAsync(string token)
    {
        return await _context.RefreshTokens
            .FirstOrDefaultAsync(rt => rt.Token == token && !rt.IsRevoked);
    }
}
```

**5. Modifier AuthService.LoginAsync**

```csharp
public async Task<AuthResponse> LoginAsync(LoginRequest request)
{
    // ... verification mot de passe ...
    
    var accessToken = GenerateJwtToken(user);
    var refreshToken = await GenerateRefreshToken(user);
    
    return new AuthResponse
    {
        Token = accessToken,
        RefreshToken = refreshToken,  // Nouveau
        User = MapToResponse(user)
    };
}

private async Task<string> GenerateRefreshToken(User user)
{
    var randomBytes = new byte[64];
    using var rng = RandomNumberGenerator.Create();
    rng.GetBytes(randomBytes);
    var token = Convert.ToBase64String(randomBytes);
    
    var refreshToken = new RefreshToken
    {
        Id = Guid.NewGuid(),
        UserId = user.Id,
        Token = token,
        ExpiresAt = DateTime.UtcNow.AddDays(30),
        IsRevoked = false
    };
    
    await _refreshTokenRepository.CreateAsync(refreshToken);
    return token;
}
```

**6. Ajouter endpoint refresh**

```csharp
[HttpPost("refresh")]
public async Task<ActionResult<AuthResponse>> RefreshToken([FromBody] string refreshToken)
{
    var storedToken = await _refreshTokenRepository.GetByTokenAsync(refreshToken);
    
    if (storedToken == null || storedToken.ExpiresAt < DateTime.UtcNow)
    {
        return Unauthorized();
    }
    
    var user = await _userRepository.GetByIdAsync(storedToken.UserId);
    var newAccessToken = GenerateJwtToken(user);
    
    return Ok(new { token = newAccessToken });
}
```

---

## Exercice 4 : Creer une Policy personnalisee

### Enonce

Creez une policy qui autorise seulement les utilisateurs dont le prenom commence par "A".

### Solution

**1. Creer un requirement**

```csharp
public class FirstNameStartsWithRequirement : IAuthorizationRequirement
{
    public string Letter { get; }
    
    public FirstNameStartsWithRequirement(string letter)
    {
        Letter = letter;
    }
}
```

**2. Creer un handler**

```csharp
public class FirstNameStartsWithHandler : AuthorizationHandler<FirstNameStartsWithRequirement>
{
    protected override Task HandleRequirementAsync(
        AuthorizationHandlerContext context,
        FirstNameStartsWithRequirement requirement)
    {
        var firstNameClaim = context.User.FindFirst("FirstName");
        
        if (firstNameClaim != null && 
            firstNameClaim.Value.StartsWith(requirement.Letter, StringComparison.OrdinalIgnoreCase))
        {
            context.Succeed(requirement);
        }
        
        return Task.CompletedTask;
    }
}
```

**3. Enregistrer dans Program.cs**

```csharp
builder.Services.AddSingleton<IAuthorizationHandler, FirstNameStartsWithHandler>();

builder.Services.AddAuthorization(options =>
{
    options.AddPolicy("FirstNameA", policy => 
        policy.Requirements.Add(new FirstNameStartsWithRequirement("A")));
});
```

**4. Utiliser**

```csharp
[HttpGet("special")]
[Authorize(Policy = "FirstNameA")]
public ActionResult SpecialEndpoint()
{
    return Ok("Accessible seulement si prenom commence par A");
}
```

---

## Exercice 5 : Securiser avec Claims specifiques

### Enonce

Creez un endpoint accessible seulement si l'utilisateur a un claim "Department" = "IT".

### Solution

**1. Ajouter le claim lors de la generation**

```csharp
var claims = new[]
{
    new Claim(ClaimTypes.NameIdentifier, user.Id.ToString()),
    new Claim(ClaimTypes.Name, user.Username),
    new Claim(ClaimTypes.Role, user.Role),
    new Claim("Department", user.Department ?? "Unknown")  // Nouveau
};
```

**2. Creer la policy**

```csharp
builder.Services.AddAuthorization(options =>
{
    options.AddPolicy("ITDepartment", policy =>
        policy.RequireClaim("Department", "IT"));
});
```

**3. Utiliser**

```csharp
[HttpGet("it-only")]
[Authorize(Policy = "ITDepartment")]
public ActionResult ITOnly()
{
    return Ok("Accessible seulement au departement IT");
}
```

---

## Exercice 6 : Implementer blacklist de tokens

### Enonce

Implementez un systeme de blacklist pour revoquer immediatement les tokens au logout.

### Solution

**1. Creer l'entite**

```csharp
public class RevokedToken
{
    public Guid Id { get; set; }
    public string Token { get; set; } = string.Empty;
    public DateTime RevokedAt { get; set; }
    public DateTime ExpiresAt { get; set; }
}
```

**2. Creer le repository**

```csharp
public class RevokedTokenRepository
{
    private readonly XtraWorkContext _context;
    
    public RevokedTokenRepository(XtraWorkContext context)
    {
        _context = context;
    }
    
    public async Task AddAsync(RevokedToken token)
    {
        _context.RevokedTokens.Add(token);
        await _context.SaveChangesAsync();
    }
    
    public async Task<bool> IsRevokedAsync(string token)
    {
        return await _context.RevokedTokens
            .AnyAsync(rt => rt.Token == token && rt.ExpiresAt > DateTime.UtcNow);
    }
    
    public async Task CleanupExpiredAsync()
    {
        var expired = await _context.RevokedTokens
            .Where(rt => rt.ExpiresAt < DateTime.UtcNow)
            .ToListAsync();
        
        _context.RevokedTokens.RemoveRange(expired);
        await _context.SaveChangesAsync();
    }
}
```

**3. Modifier le logout**

```csharp
[HttpPost("logout")]
[Authorize]
public async Task<ActionResult> Logout()
{
    var token = Request.Headers["Authorization"].ToString().Replace("Bearer ", "");
    
    // Decoder pour obtenir l'expiration
    var handler = new JwtSecurityTokenHandler();
    var jwtToken = handler.ReadJwtToken(token);
    var exp = jwtToken.ValidTo;
    
    // Ajouter a la blacklist
    await _revokedTokenRepository.AddAsync(new RevokedToken
    {
        Id = Guid.NewGuid(),
        Token = token,
        RevokedAt = DateTime.UtcNow,
        ExpiresAt = exp
    });
    
    return Ok(new { message = "Token revoque avec succes" });
}
```

**4. Verifier la blacklist**

```csharp
// Dans Program.cs - Ajouter un evenement OnTokenValidated
builder.Services.AddAuthentication(JwtBearerDefaults.AuthenticationScheme)
    .AddJwtBearer(opt =>
    {
        opt.TokenValidationParameters = new TokenValidationParameters { ... };
        
        opt.Events = new JwtBearerEvents
        {
            OnTokenValidated = async context =>
            {
                var token = context.Request.Headers["Authorization"].ToString().Replace("Bearer ", "");
                var revokedRepo = context.HttpContext.RequestServices
                    .GetRequiredService<RevokedTokenRepository>();
                
                if (await revokedRepo.IsRevokedAsync(token))
                {
                    context.Fail("Token revoque");
                }
            }
        };
    });
```

---

## Conclusion

Ces exercices vous ont permis de :
- Decoder et comprendre un JWT reel
- Generer des tokens avec claims personnalises
- Implementer des refresh tokens
- Creer des policies avancees
- Securiser avec des claims specifiques
- Implementer une blacklist de tokens

**Vous maitrisez maintenant JWT dans ASP.NET Core.**

**Cours suivant** : 03-api-rest-controllers

