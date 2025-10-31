# Module 3 - Génération de Tokens JWT

## Flow de génération dans XtraWork

Quand un utilisateur se connecte, voici ce qui se passe :

```
1. POST /api/auth/login
   Body: { "username": "admin", "password": "Admin123!" }
   ↓
2. AuthController.Login() reçoit la requête
   ↓
3. AuthService.LoginAsync() est appelé
   ↓
4. Vérification du mot de passe avec BCrypt
   ↓
5. Génération du JWT avec GenerateJwtToken()
   ↓
6. Retour du token au client
```

---

## Code complet : AuthService.LoginAsync()

```csharp
public async Task<AuthResponse> LoginAsync(LoginRequest request)
{
    // 1. Récupérer l'utilisateur depuis la DB
    var user = await _userRepository.GetByUsernameAsync(request.Username);
    
    // 2. Vérifier le mot de passe avec BCrypt
    if (user == null || !BCrypt.Net.BCrypt.Verify(request.Password, user.PasswordHash))
    {
        throw new UnauthorizedAccessException("Nom d'utilisateur ou mot de passe incorrect");
    }
    
    // 3. Vérifier que le compte est actif
    if (!user.IsActive)
    {
        throw new UnauthorizedAccessException("Compte utilisateur désactivé");
    }
    
    // 4. Mettre à jour la dernière connexion
    user.LastLoginAt = DateTime.UtcNow;
    await _userRepository.UpdateAsync(user);
    
    // 5. GÉNÉRER LE JWT
    var token = GenerateJwtToken(user);
    
    // 6. Retourner le token et les infos utilisateur
    return new AuthResponse
    {
        Token = token,
        User = new UserResponse
        {
            Id = user.Id,
            Username = user.Username,
            Email = user.Email,
            FirstName = user.FirstName,
            LastName = user.LastName,
            Role = user.Role
        }
    };
}
```

---

## Code détaillé : GenerateJwtToken()

### Méthode complète

```csharp
private string GenerateJwtToken(User user)
{
    // 1. Créer la clé de signature
    var key = new SymmetricSecurityKey(
        Encoding.UTF8.GetBytes(_configuration["Jwt:Key"]!)
    );
    
    // 2. Créer les credentials (algorithme + clé)
    var credentials = new SigningCredentials(key, SecurityAlgorithms.HmacSha256);
    
    // 3. Définir les claims (informations utilisateur)
    var claims = new[]
    {
        new Claim(ClaimTypes.NameIdentifier, user.Id.ToString()),
        new Claim(ClaimTypes.Name, user.Username),
        new Claim(ClaimTypes.Email, user.Email),
        new Claim(ClaimTypes.Role, user.Role),
        new Claim("FirstName", user.FirstName),
        new Claim("LastName", user.LastName)
    };
    
    // 4. Créer le token
    var token = new JwtSecurityToken(
        issuer: _configuration["Jwt:Issuer"],
        audience: _configuration["Jwt:Audience"],
        claims: claims,
        expires: DateTime.UtcNow.AddHours(24),
        signingCredentials: credentials
    );
    
    // 5. Sérialiser le token en string
    return new JwtSecurityTokenHandler().WriteToken(token);
}
```

---

## Explication étape par étape

### 1. Créer la clé de signature

```csharp
var key = new SymmetricSecurityKey(
    Encoding.UTF8.GetBytes(_configuration["Jwt:Key"]!)
);
```

**Ce qu'on fait** :
- Lire la clé depuis appsettings.json
- Convertir la string en bytes
- Créer une `SymmetricSecurityKey` (même clé pour signer et vérifier)

---

### 2. Créer les credentials

```csharp
var credentials = new SigningCredentials(key, SecurityAlgorithms.HmacSha256);
```

**Ce qu'on fait** :
- Combiner la clé avec l'algorithme HMAC-SHA256
- Ces credentials seront utilisés pour signer le token

---

### 3. Définir les claims

```csharp
var claims = new[]
{
    new Claim(ClaimTypes.NameIdentifier, user.Id.ToString()),  // ID utilisateur
    new Claim(ClaimTypes.Name, user.Username),                  // Username
    new Claim(ClaimTypes.Email, user.Email),                    // Email
    new Claim(ClaimTypes.Role, user.Role),                      // Rôle (User/Manager/Admin)
    new Claim("FirstName", user.FirstName),                     // Claim custom
    new Claim("LastName", user.LastName)                        // Claim custom
};
```

**Claims standards** (ClaimTypes) :
- `NameIdentifier` : ID unique de l'utilisateur
- `Name` : Nom d'utilisateur
- `Email` : Email
- `Role` : Rôle (important pour l'autorisation)

**Claims personnalisés** :
- `FirstName` : Prénom
- `LastName` : Nom de famille

**Important** : Ces claims seront lisibles par le client ! Ne jamais mettre de mot de passe ou données sensibles.

---

### 4. Créer le token

```csharp
var token = new JwtSecurityToken(
    issuer: _configuration["Jwt:Issuer"],           // "XtraWork-Issuer"
    audience: _configuration["Jwt:Audience"],       // "XtraWork-Audience"
    claims: claims,                                  // Les 6 claims définis
    expires: DateTime.UtcNow.AddHours(24),          // Expiration dans 24h
    signingCredentials: credentials                  // Clé + algorithme
);
```

**Paramètres** :

**issuer** : Qui a émis ce token
- Doit correspondre à `ValidIssuer` dans la configuration

**audience** : Pour qui ce token est destiné
- Doit correspondre à `ValidAudience` dans la configuration

**claims** : Toutes les informations de l'utilisateur

**expires** : Quand le token expire
- `DateTime.UtcNow.AddHours(24)` = 24 heures
- Après ce délai, le token est invalide

**signingCredentials** : Comment signer le token
- Utilise HMAC-SHA256

---

### 5. Sérialiser en string

```csharp
return new JwtSecurityTokenHandler().WriteToken(token);
```

**Ce qu'on fait** :
- Convertir l'objet `JwtSecurityToken` en string
- Résultat : `header.payload.signature` encodé en Base64

**Exemple de résultat** :
```
eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJodHRwOi8vc2NoZW1hcy54bWxzb2FwLm9yZy93cy8yMDA1LzA1L2lkZW50aXR5L2NsYWltcy9uYW1laWRlbnRpZmllciI6IjNmYTg1ZjY0LTU3MTctNDU2Mi1iM2ZjLTJjOTYzZjY2YWZhNiIsImh0dHA6Ly9zY2hlbWFzLnhtbHNvYXAub3JnL3dzLzIwMDUvMDUvaWRlbnRpdHkvY2xhaW1zL25hbWUiOiJhZG1pbiIsImh0dHA6Ly9zY2hlbWFzLnhtbHNvYXAub3JnL3dzLzIwMDUvMDUvaWRlbnRpdHkvY2xhaW1zL2VtYWlsYWRkcmVzcyI6ImFkbWluQHh0cmF3b3JrLmNvbSIsImh0dHA6Ly9zY2hlbWFzLm1pY3Jvc29mdC5jb20vd3MvMjAwOC8wNi9pZGVudGl0eS9jbGFpbXMvcm9sZSI6IkFkbWluIiwiRmlyc3ROYW1lIjoiQWRtaW4iLCJMYXN0TmFtZSI6IlVzZXIiLCJleHAiOjE3MzA0NzY4MDAsImlzcyI6Ilh0cmFXb3JrLUlzc3VlciIsImF1ZCI6Ilh0cmFXb3JrLUF1ZGllbmNlIn0.SflKxwRJSMeKKF2QT4fwpMeJf36POk6yJV_adQssw5c
```

Ce string est ensuite envoyé au client dans `AuthResponse.Token`.

---

## Utilisation dans le Controller

```csharp
[HttpPost("login")]
public async Task<ActionResult<AuthResponse>> Login([FromBody] LoginRequest request)
{
    try
    {
        var response = await _authService.LoginAsync(request);
        return Ok(response);  // { token: "eyJ...", user: {...} }
    }
    catch (UnauthorizedAccessException ex)
    {
        return Unauthorized(new { message = ex.Message });
    }
}
```

**Résultat JSON** :
```json
{
  "token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...",
  "user": {
    "id": "3fa85f64-5717-4562-b3fc-2c963f66afa6",
    "username": "admin",
    "email": "admin@xtrawork.com",
    "firstName": "Admin",
    "lastName": "User",
    "role": "Admin"
  }
}
```

---

## Personnalisation des claims

Vous pouvez ajouter n'importe quel claim personnalisé :

```csharp
var claims = new[]
{
    new Claim(ClaimTypes.NameIdentifier, user.Id.ToString()),
    new Claim(ClaimTypes.Name, user.Username),
    new Claim(ClaimTypes.Role, user.Role),
    
    // Claims personnalisés
    new Claim("Department", user.Department),
    new Claim("EmployeeLevel", user.Level.ToString()),
    new Claim("CanApprove", user.CanApprove.ToString()),
    
    // Tout ce dont vous avez besoin !
};
```

**Usage** : Ces claims seront disponibles dans tous les controllers via `User.Claims`.

---

## Durée de vie du token

### Configuration dans XtraWork

```csharp
expires: DateTime.UtcNow.AddHours(24)  // 24 heures
```

**Options courantes** :
- Access token court : 15 minutes - 1 heure
- Access token moyen : 1-8 heures
- Access token long : 24 heures (XtraWork)
- Refresh token : 7-30 jours

**Trade-off** :
- Court = Plus sécurisé mais moins pratique (login fréquent)
- Long = Plus pratique mais moins sécurisé (token valide longtemps si volé)

**Best practice** :
- Access token : 15 min - 1 heure
- Refresh token : 7-30 jours
- XtraWork utilise 24h pour simplicité (exemple pédagogique)

---

## Résumé

Pour générer un JWT dans ASP.NET Core :

1. Créer une `SymmetricSecurityKey` avec la clé secrète
2. Créer des `SigningCredentials` (clé + algorithme)
3. Définir les `Claims` (informations utilisateur)
4. Créer un `JwtSecurityToken` avec issuer, audience, claims, expiration
5. Sérialiser avec `JwtSecurityTokenHandler.WriteToken()`

**Dans XtraWork** :
- `AuthService.GenerateJwtToken()` fait tout ça
- Retourne un string JWT prêt à être envoyé au client
- Durée de vie : 24 heures

---

**Prochain module** : [04-VALIDATION-CLAIMS(COURS).md](./04-VALIDATION-CLAIMS(COURS).md)

