# Module 2 - Configuration JWT dans ASP.NET Core

## Configuration dans Program.cs

La configuration JWT dans XtraWork se fait en 2 étapes : **Authentication** puis **Authorization**.

---

## Étape 1 : Configuration de l'authentification

### Code dans XtraWork/Program.cs

```csharp
// Lire la configuration JWT depuis appsettings.json
var jwt = builder.Configuration.GetSection("Jwt");
var key = jwt["Key"] ?? throw new InvalidOperationException("Jwt:Key manquant");

// Configurer l'authentification JWT
builder.Services.AddAuthentication(JwtBearerDefaults.AuthenticationScheme)
    .AddJwtBearer(opt =>
    {
        opt.TokenValidationParameters = new TokenValidationParameters
        {
            ValidateIssuer = true,
            ValidIssuer = jwt["Issuer"],
            
            ValidateAudience = true,
            ValidAudience = jwt["Audience"],
            
            ValidateLifetime = true,
            
            ValidateIssuerSigningKey = true,
            IssuerSigningKey = new SymmetricSecurityKey(Encoding.UTF8.GetBytes(key)),
            
            ClockSkew = TimeSpan.FromMinutes(2)
        };
    });
```

### Explication ligne par ligne

**AddAuthentication(JwtBearerDefaults.AuthenticationScheme)** :
- Configure l'authentification
- `JwtBearerDefaults.AuthenticationScheme` = "Bearer"
- Indique qu'on utilise des tokens Bearer

**TokenValidationParameters** : Règles de validation

**ValidateIssuer = true** :
- Vérifie que le token a été émis par nous
- `ValidIssuer = "XtraWork-Issuer"` 
- Doit correspondre au `iss` claim dans le token

**ValidateAudience = true** :
- Vérifie que le token est destiné à nous
- `ValidAudience = "XtraWork-Audience"`
- Doit correspondre au `aud` claim

**ValidateLifetime = true** :
- Vérifie que le token n'est pas expiré
- Compare `exp` claim avec l'heure actuelle

**ValidateIssuerSigningKey = true** :
- Vérifie la signature avec la clé
- `IssuerSigningKey` = La clé secrète pour vérifier

**ClockSkew = TimeSpan.FromMinutes(2)** :
- Tolérance pour décalages d'horloge serveurs
- Token expiré depuis 2 min est encore accepté

---

## Étape 2 : Configuration de l'autorisation

### Code dans XtraWork/Program.cs

```csharp
builder.Services.AddAuthorization(options =>
{
    options.AddPolicy("AdminOnly", p => p.RequireRole("Admin"));
    options.AddPolicy("ManagerOrAdmin", p => p.RequireRole("Manager", "Admin"));
});
```

### Explication

**AddAuthorization** : Configure les policies (politiques d'accès)

**Policy "AdminOnly"** :
- Nécessite le rôle "Admin"
- Utilisé avec `[Authorize(Policy = "AdminOnly")]`

**Policy "ManagerOrAdmin"** :
- Nécessite le rôle "Manager" OU "Admin"
- Utilisé avec `[Authorize(Policy = "ManagerOrAdmin")]`

---

## Étape 3 : Activer dans le pipeline

### Code dans XtraWork/Program.cs

```csharp
app.UseCors("NextJsPolicy");  // CORS avant auth !

app.UseAuthentication();   // Vérifier le JWT
app.UseAuthorization();    // Vérifier les permissions

app.MapControllers();      // Activer les controllers
```

### Ordre CRUCIAL

```
1. UseCors         → Gérer les requêtes OPTIONS (preflight)
2. UseAuthentication → Décoder et valider le JWT
3. UseAuthorization  → Vérifier si l'utilisateur a les permissions
4. MapControllers   → Exécuter les controllers
```

**Si l'ordre est mauvais** : L'authentification ne fonctionne pas !

---

## Configuration dans appsettings.json

```json
{
  "Jwt": {
    "Issuer": "XtraWork-Issuer",
    "Audience": "XtraWork-Audience",
    "Key": "7e6da5d9e5514ce288683845e6068df782a23f6c15fb43cd92e19b4147d8ce95"
  }
}
```

### Explication

**Issuer** : Qui émet le token
- Identifie votre application
- Peut être un domaine : "https://api.xtrawork.com"

**Audience** : Pour qui le token est destiné
- Identifie les consommateurs autorisés
- Peut être un domaine : "https://app.xtrawork.com"

**Key** : Clé secrète de signature
- Minimum 32 caractères (64 recommandé)
- DOIT être gardée secrète
- En production : Azure Key Vault ou variables d'environnement

---

## Sécurité de la clé

### ⚠️ MAUVAIS (Ne jamais faire)

```csharp
var key = "mysecret";  // Trop court, trop simple
```

### ✅ BON

```csharp
// En développement : appsettings.json (OK)
"Key": "7e6da5d9e5514ce288683845e6068df782a23f6c15fb43cd92e19b4147d8ce95"

// En production : Variables d'environnement ou Key Vault
var key = Environment.GetEnvironmentVariable("JWT_KEY");
// ou
var key = builder.Configuration["AzureKeyVault:JwtKey"];
```

### Générer une clé sécurisée

```csharp
// C# - Générer une clé aléatoire
var key = Convert.ToBase64String(RandomNumberGenerator.GetBytes(64));
```

```bash
# PowerShell - Générer une clé
[Convert]::ToBase64String((1..64 | ForEach-Object { Get-Random -Minimum 0 -Maximum 256 }))
```

---

## Résumé

La configuration JWT dans ASP.NET Core nécessite :

1. **AddAuthentication** avec `JwtBearerDefaults.AuthenticationScheme`
2. **TokenValidationParameters** pour définir les règles
3. **AddAuthorization** pour les policies basées sur les rôles
4. **UseAuthentication** et **UseAuthorization** dans le bon ordre
5. **appsettings.json** avec Issuer, Audience, et Key secrète

**Dans XtraWork** :
- Configuration complète dans `Program.cs`
- Clé secrète dans `appsettings.json`
- Policies "AdminOnly" et "ManagerOrAdmin" définies

---

**Prochain module** : [03-GENERATION-TOKENS(COURS).md](./03-GENERATION-TOKENS(COURS).md)

