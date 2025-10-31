# Module 5 - Sécurité et Refresh Tokens

## Bonnes pratiques de sécurité JWT

### 1. Clé secrète forte

**❌ MAUVAIS** :
```json
{
  "Jwt": {
    "Key": "mysecret"  // Trop court !
  }
}
```

**✅ BON** :
```json
{
  "Jwt": {
    "Key": "7e6da5d9e5514ce288683845e6068df782a23f6c15fb43cd92e19b4147d8ce95"
  }
}
```

**Minimum** : 32 caractères (256 bits)
**Recommandé** : 64 caractères (512 bits)

---

### 2. HTTPS obligatoire

**❌ MAUVAIS** :
```
http://api.xtrawork.com  // Token envoyé en clair !
```

**✅ BON** :
```
https://api.xtrawork.com  // Token chiffré dans le transport
```

En production, TOUJOURS utiliser HTTPS. Le JWT dans le header Authorization peut être intercepté sur HTTP.

---

### 3. Expiration courte

**❌ MAUVAIS** :
```csharp
expires: DateTime.UtcNow.AddDays(365)  // 1 an !
```

**✅ BON** :
```csharp
expires: DateTime.UtcNow.AddMinutes(15)  // 15 minutes pour access token
expires: DateTime.UtcNow.AddHours(1)     // 1 heure acceptable
```

**XtraWork utilise 24h** pour simplicité pédagogique, mais en production :
- Access token : 15 min - 1 heure
- Refresh token : 7-30 jours

---

### 4. Ne jamais stocker de données sensibles

**❌ MAUVAIS** :
```csharp
new Claim("Password", user.Password),            // JAMAIS !
new Claim("CreditCard", user.CreditCardNumber),  // JAMAIS !
new Claim("SSN", user.SocialSecurityNumber)      // JAMAIS !
```

**✅ BON** :
```csharp
new Claim(ClaimTypes.NameIdentifier, user.Id.ToString()),  // ID OK
new Claim(ClaimTypes.Name, user.Username),                  // Username OK
new Claim(ClaimTypes.Role, user.Role),                      // Role OK
```

**Rappel** : Le payload du JWT est encodé en Base64, PAS chiffré. Tout le monde peut le lire !

---

### 5. Valider issuer et audience

**❌ MAUVAIS** :
```csharp
ValidateIssuer = false,    // Accepte n'importe quel issuer !
ValidateAudience = false   // Accepte n'importe quelle audience !
```

**✅ BON** :
```csharp
ValidateIssuer = true,
ValidIssuer = "XtraWork-Issuer",
ValidateAudience = true,
ValidAudience = "XtraWork-Audience"
```

Empêche l'utilisation de tokens générés par d'autres applications.

---

## Refresh Tokens : Concept

### Problème

Avec un access token court (15 min), l'utilisateur doit se reconnecter toutes les 15 minutes. Pas pratique !

### Solution : Refresh Tokens

**2 tokens** :
1. **Access token** : Court (15 min), utilisé pour les requêtes API
2. **Refresh token** : Long (7-30 jours), utilisé pour obtenir un nouveau access token

```
Login → Access Token (15 min) + Refresh Token (30 jours)
        ↓
Après 15 min → Access token expiré
        ↓
POST /api/auth/refresh avec Refresh Token
        ↓
Nouveau Access Token (15 min)
```

---

## Implémentation Refresh Tokens

### 1. Modèle RefreshToken

```csharp
public class RefreshToken
{
    public Guid Id { get; set; }
    public Guid UserId { get; set; }
    public string Token { get; set; } = string.Empty;
    public DateTime ExpiresAt { get; set; }
    public DateTime CreatedAt { get; set; }
    public bool IsRevoked { get; set; }
    
    public User User { get; set; } = null!;
}
```

---

### 2. Générer un refresh token

```csharp
private async Task<string> GenerateRefreshToken(User user)
{
    // Générer un token aléatoire sécurisé
    var randomBytes = new byte[64];
    using var rng = RandomNumberGenerator.Create();
    rng.GetBytes(randomBytes);
    var token = Convert.ToBase64String(randomBytes);
    
    // Sauvegarder dans la DB
    var refreshToken = new RefreshToken
    {
        Id = Guid.NewGuid(),
        UserId = user.Id,
        Token = token,
        ExpiresAt = DateTime.UtcNow.AddDays(30),
        CreatedAt = DateTime.UtcNow,
        IsRevoked = false
    };
    
    await _refreshTokenRepository.CreateAsync(refreshToken);
    
    return token;
}
```

---

### 3. Endpoint de refresh

```csharp
[HttpPost("refresh")]
public async Task<ActionResult<AuthResponse>> RefreshToken([FromBody] string refreshToken)
{
    // 1. Récupérer le refresh token de la DB
    var storedToken = await _refreshTokenRepository.GetByTokenAsync(refreshToken);
    
    // 2. Valider
    if (storedToken == null || storedToken.IsRevoked)
    {
        return Unauthorized(new { message = "Refresh token invalide" });
    }
    
    if (storedToken.ExpiresAt < DateTime.UtcNow)
    {
        return Unauthorized(new { message = "Refresh token expiré" });
    }
    
    // 3. Récupérer l'utilisateur
    var user = await _userRepository.GetByIdAsync(storedToken.UserId);
    
    // 4. Générer un nouveau access token
    var newAccessToken = GenerateJwtToken(user);
    
    // 5. (Optionnel) Générer un nouveau refresh token
    var newRefreshToken = await GenerateRefreshToken(user);
    
    // 6. Révoquer l'ancien refresh token
    storedToken.IsRevoked = true;
    await _refreshTokenRepository.UpdateAsync(storedToken);
    
    // 7. Retourner les nouveaux tokens
    return Ok(new AuthResponse
    {
        Token = newAccessToken,
        RefreshToken = newRefreshToken,
        User = MapUserToResponse(user)
    });
}
```

---

## Déconnexion (Logout)

### Problème avec JWT

Les JWT sont stateless. Une fois émis, ils sont valides jusqu'à expiration. On ne peut pas les "annuler" facilement.

### Solution 1 : Déconnexion côté client (XtraWork actuel)

```csharp
[HttpPost("logout")]
[Authorize]
public ActionResult Logout()
{
    // JWT : La déconnexion se fait côté client en supprimant le token
    var username = User.FindFirst(ClaimTypes.Name)?.Value;
    
    return Ok(new
    {
        message = "Déconnexion réussie",
        user = username,
        timestamp = DateTime.UtcNow
    });
}
```

**Frontend supprime le token** :
```javascript
localStorage.removeItem('token');
```

**Limitation** : Le token est toujours techniquement valide jusqu'à expiration.

---

### Solution 2 : Blacklist de tokens

Pour révoquer un token immédiatement :

**1. Créer une table de tokens révoqués** :
```csharp
public class RevokedToken
{
    public string Token { get; set; } = string.Empty;
    public DateTime RevokedAt { get; set; }
    public DateTime ExpiresAt { get; set; }
}
```

**2. Ajouter à la blacklist au logout** :
```csharp
[HttpPost("logout")]
[Authorize]
public async Task<ActionResult> Logout()
{
    var token = Request.Headers["Authorization"].ToString().Replace("Bearer ", "");
    
    // Ajouter à la blacklist
    await _revokedTokenRepository.AddAsync(new RevokedToken
    {
        Token = token,
        RevokedAt = DateTime.UtcNow,
        ExpiresAt = GetTokenExpiration(token)  // Garder jusqu'à expiration
    });
    
    return Ok();
}
```

**3. Vérifier la blacklist à chaque requête** :
```csharp
// Dans un middleware ou événement OnTokenValidated
app.Use(async (context, next) =>
{
    var token = context.Request.Headers["Authorization"];
    if (await _revokedTokenRepository.IsRevokedAsync(token))
    {
        context.Response.StatusCode = 401;
        return;
    }
    await next();
});
```

**Inconvénient** : Perd l'avantage stateless du JWT.

---

## Stockage du token côté client

### Options

**localStorage** (XtraWork actuel) :
```javascript
localStorage.setItem('token', jwt);
```
- ✅ Persiste après fermeture du navigateur
- ❌ Accessible par JavaScript (risque XSS)

**sessionStorage** :
```javascript
sessionStorage.setItem('token', jwt);
```
- ✅ Moins accessible que localStorage
- ❌ Perdu à la fermeture de l'onglet

**Cookie httpOnly** :
```csharp
Response.Cookies.Append("token", jwt, new CookieOptions
{
    HttpOnly = true,  // Pas accessible en JavaScript
    Secure = true,    // HTTPS seulement
    SameSite = SameSiteMode.Strict
});
```
- ✅ Plus sécurisé (pas accessible en JS)
- ❌ Nécessite même domaine frontend/backend

---

## Vulnérabilités JWT

### 1. Algorithme "none"

**Attaque** : Modifier le header pour `"alg": "none"` et supprimer la signature.

**Protection** : ASP.NET Core rejette automatiquement les tokens avec alg=none.

---

### 2. Clé faible

**Attaque** : Brute-force de la clé secrète.

**Protection** : Utiliser une clé de 64 caractères minimum (512 bits).

---

### 3. Token volé

**Attaque** : Intercepter le token (MITM, XSS).

**Protection** :
- HTTPS obligatoire
- Expiration courte
- httpOnly cookies si possible
- Content Security Policy (CSP)

---

### 4. JWT dans l'URL

**❌ MAUVAIS** :
```
GET /api/employees?token=eyJhbG...
```

Les URLs sont loggées partout (serveur, proxy, historique navigateur).

**✅ BON** :
```
GET /api/employees
Authorization: Bearer eyJhbG...
```

Headers ne sont pas loggés dans les URLs.

---

## Checklist sécurité JWT

- [ ] Clé secrète de 64 caractères minimum
- [ ] Clé stockée dans variables d'environnement (production)
- [ ] HTTPS obligatoire en production
- [ ] ValidateIssuer = true
- [ ] ValidateAudience = true
- [ ] ValidateLifetime = true
- [ ] ValidateIssuerSigningKey = true
- [ ] Expiration courte (15 min - 1h pour access token)
- [ ] Refresh tokens implémentés
- [ ] Pas de données sensibles dans les claims
- [ ] Token dans Authorization header (pas dans URL)

---

## Résumé

**Sécurité JWT** :
- Clé forte et secrète
- HTTPS obligatoire
- Expiration courte
- Validation complète (issuer, audience, lifetime, signature)
- Pas de données sensibles dans le payload

**Refresh Tokens** :
- Access token court + Refresh token long
- Améliore UX sans compromettre la sécurité
- Nécessite stockage DB

**Dans XtraWork** :
- Sécurité de base implémentée
- Refresh tokens non implémentés (version simple)
- À ajouter en production

---

**Prochain** : [06-QUIZ-QUESTIONS(OBLIGATOIRE).md](./06-QUIZ-QUESTIONS(OBLIGATOIRE).md)

