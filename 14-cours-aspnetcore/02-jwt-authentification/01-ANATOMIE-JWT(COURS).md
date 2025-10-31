# Module 1 - Anatomie d'un JWT

## Structure d'un JWT

Un JWT est composé de **3 parties** séparées par des points :

```
header.payload.signature
```

Exemple réel du projet XtraWork :
```
eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJodHRwOi8vc2NoZW1hcy54bWxzb2FwLm9yZy93cy8yMDA1LzA1L2lkZW50aXR5L2NsYWltcy9uYW1laWRlbnRpZmllciI6IjNmYTg1ZjY0LTU3MTctNDU2Mi1iM2ZjLTJjOTYzZjY2YWZhNiIsImh0dHA6Ly9zY2hlbWFzLnhtbHNvYXAub3JnL3dzLzIwMDUvMDUvaWRlbnRpdHkvY2xhaW1zL25hbWUiOiJhZG1pbiIsImh0dHA6Ly9zY2hlbWFzLnhtbHNvYXAub3JnL3dzLzIwMDUvMDUvaWRlbnRpdHkvY2xhaW1zL2VtYWlsYWRkcmVzcyI6ImFkbWluQHh0cmF3b3JrLmNvbSIsImh0dHA6Ly9zY2hlbWFzLm1pY3Jvc29mdC5jb20vd3MvMjAwOC8wNi9pZGVudGl0eS9jbGFpbXMvcm9sZSI6IkFkbWluIiwiZXhwIjoxNzMwNDc2ODAwLCJpc3MiOiJYdHJhV29yay1Jc3N1ZXIiLCJhdWQiOiJYdHJhV29yay1BdWRpZW5jZSJ9.AbCdEfGhIjKlMnOpQrStUvWxYz1234567890
```

---

## Partie 1 : Header (En-tête)

### Encodé

```
eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9
```

### Décodé (Base64)

```json
{
  "alg": "HS256",
  "typ": "JWT"
}
```

### Explication

**alg** : Algorithme de signature
- `HS256` = HMAC avec SHA-256
- Signature symétrique (même clé pour signer et vérifier)
- Autres possibles : RS256 (asymétrique), ES256, etc.

**typ** : Type de token
- `JWT` = JSON Web Token
- Standard

---

## Partie 2 : Payload (Données)

### Encodé

```
eyJodHRwOi8vc2NoZW1hcy54bWxzb2FwLm9yZy93cy8yMDA1LzA1L2lkZW50aXR5L2NsYWltcy9uYW1laWRlbnRpZmllciI6IjNmYTg1ZjY0...
```

### Décodé (Base64)

```json
{
  "http://schemas.xmlsoap.org/ws/2005/05/identity/claims/nameidentifier": "3fa85f64-5717-4562-b3fc-2c963f66afa6",
  "http://schemas.xmlsoap.org/ws/2005/05/identity/claims/name": "admin",
  "http://schemas.xmlsoap.org/ws/2005/05/identity/claims/emailaddress": "admin@xtrawork.com",
  "http://schemas.microsoft.com/ws/2008/06/identity/claims/role": "Admin",
  "FirstName": "Admin",
  "LastName": "User",
  "exp": 1730476800,
  "iss": "XtraWork-Issuer",
  "aud": "XtraWork-Audience"
}
```

### Explication des Claims

**Claims** = Paires clé-valeur contenant des informations sur l'utilisateur

**Claims standards** :
- `nameidentifier` (sub) : ID unique de l'utilisateur (Guid)
- `name` : Nom d'utilisateur
- `emailaddress` : Email
- `role` : Rôle (User, Manager, Admin)
- `exp` : Expiration (timestamp Unix)
- `iss` : Issuer (qui a émis le token)
- `aud` : Audience (pour qui le token est destiné)

**Claims personnalisés** :
- `FirstName` : Prénom
- `LastName` : Nom de famille

**Important** : Le payload n'est PAS chiffré, juste encodé en Base64. N'importe qui peut le décoder et lire les claims ! C'est la signature qui garantit l'intégrité.

---

## Partie 3 : Signature

### Encodée

```
AbCdEfGhIjKlMnOpQrStUvWxYz1234567890
```

### Comment elle est créée

```
Signature = HMACSHA256(
    base64UrlEncode(header) + "." + base64UrlEncode(payload),
    secret_key
)
```

### Explication

La signature prouve que :
1. Le token a été émis par votre serveur (seul lui a la clé secrète)
2. Le token n'a pas été modifié (changer une lettre invalide la signature)

**Clé secrète dans XtraWork** :
```json
// appsettings.json
{
  "Jwt": {
    "Key": "7e6da5d9e5514ce288683845e6068df782a23f6c15fb43cd92e19b4147d8ce95"
  }
}
```

Cette clé DOIT rester secrète ! Si quelqu'un l'obtient, il peut générer des tokens valides.

---

## Visualisation complète

```
┌─────────────────────────────────────────────────────────────┐
│ HEADER                                                      │
│ { "alg": "HS256", "typ": "JWT" }                           │
│ ↓                                                           │
│ Base64Url encode                                           │
│ ↓                                                           │
│ eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9                       │
└─────────────────────────────────────────────────────────────┘
                            .
┌─────────────────────────────────────────────────────────────┐
│ PAYLOAD                                                     │
│ {                                                           │
│   "sub": "user-id",                                        │
│   "name": "admin",                                         │
│   "role": "Admin",                                         │
│   "exp": 1730476800                                        │
│ }                                                           │
│ ↓                                                           │
│ Base64Url encode                                           │
│ ↓                                                           │
│ eyJzdWIiOiJ1c2VyLWlkIiwibmFtZSI6ImFkbWluIi4uLg          │
└─────────────────────────────────────────────────────────────┘
                            .
┌─────────────────────────────────────────────────────────────┐
│ SIGNATURE                                                   │
│ HMACSHA256(                                                │
│   header + "." + payload,                                  │
│   secret_key                                               │
│ )                                                           │
│ ↓                                                           │
│ AbCdEfGhIjKlMnOpQrStUvWxYz1234567890                      │
└─────────────────────────────────────────────────────────────┘
```

**Résultat final** : `header.payload.signature`

---

## Décoder un JWT

Vous pouvez décoder n'importe quel JWT sur https://jwt.io

### Exemple avec un JWT XtraWork

1. Connectez-vous à l'application
2. Ouvrez DevTools (F12) → Application → localStorage
3. Copiez le token
4. Allez sur https://jwt.io
5. Collez le token

Vous verrez :
- Le header décodé
- Le payload décodé avec tous vos claims
- La signature (non décodable car c'est un hash)

**Important** : Le payload est LISIBLE par tous ! Ne mettez jamais de mot de passe ou données sensibles dans un JWT.

---

## JWT vs Sessions : Comparaison

| Aspect | Sessions | JWT |
|--------|----------|-----|
| **Stockage serveur** | Oui (Redis, DB, mémoire) | Non |
| **Scalabilité** | Difficile (état partagé) | Facile (stateless) |
| **Taille** | Petit cookie (~50 bytes) | Grand token (~500-1000 bytes) |
| **Révocation** | Facile (supprimer la session) | Difficile (blacklist requise) |
| **Expiration** | Configurable côté serveur | Dans le token (exp claim) |
| **Cas d'usage** | Apps monolithiques | APIs, microservices, SPAs |

---

## Dans le projet XtraWork

### Génération

**AuthService.cs** génère le JWT au login :
```csharp
var token = new JwtSecurityToken(
    issuer: "XtraWork-Issuer",
    audience: "XtraWork-Audience",
    claims: claims,
    expires: DateTime.UtcNow.AddHours(24),
    signingCredentials: credentials
);

return new JwtSecurityTokenHandler().WriteToken(token);
```

### Validation

**Middleware Authentication** valide le JWT automatiquement :
```csharp
// Program.cs
app.UseAuthentication();  // Vérifie le JWT
app.UseAuthorization();   // Vérifie les permissions
```

---

## Cycle de vie d'un JWT dans XtraWork

```
1. Utilisateur entre username/password
   ↓
2. POST /api/auth/login
   ↓
3. AuthService vérifie avec BCrypt
   ↓
4. AuthService génère JWT (24h de validité)
   ↓
5. Frontend stocke JWT dans localStorage
   ↓
6. Chaque requête inclut : Authorization: Bearer {jwt}
   ↓
7. Middleware Authentication décode et valide
   ↓
8. Si valide → User.Identity.IsAuthenticated = true
   ↓
9. Controller peut accéder à User.Claims
   ↓
10. Après 24h → Token expiré
    ↓
11. Frontend doit redemander un nouveau token (re-login)
```

---

## Résumé

Un JWT est un token auto-contenu composé de :
- **Header** : Algorithme de signature
- **Payload** : Claims (informations utilisateur)
- **Signature** : Preuve d'authenticité

**Avantages** :
- Stateless (pas de stockage serveur)
- Scalable
- Parfait pour les API REST

**Dans XtraWork** :
- AuthService génère les JWT au login
- Middleware Authentication les valide automatiquement
- Durée de vie : 24 heures

---

**Prochain module** : [02-CONFIGURATION-ASPNET(COURS).md](./02-CONFIGURATION-ASPNET(COURS).md)

