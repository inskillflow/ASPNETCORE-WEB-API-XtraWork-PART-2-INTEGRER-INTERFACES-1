# Reponses Quiz - JWT Authentification

## Corrections (1 point par bonne reponse / 30 points total)

### Question 1: b) JSON Web Token
JWT signifie JSON Web Token. Standard RFC 7519.

### Question 2: c) 3
header.payload.signature

### Question 3: b) Les claims sur l'utilisateur
Le payload contient les informations utilisateur.

### Question 4: c) Non, seulement encode en Base64
Le payload est LISIBLE par tous. Ne jamais mettre de donnees sensibles.

### Question 5: b) Prouver authenticite
La signature garantit que le token n'a pas ete modifie.

### Question 6: c) AuthService
AuthService.GenerateJwtToken() cree les tokens.

### Question 7: c) 24 heures
DateTime.UtcNow.AddHours(24)

### Question 8: a) HS256
HMAC-SHA256

### Question 9: b) Dans appsettings.json
Jwt:Key

### Question 10: b) builder.Services.AddAuthentication()
Configure l'authentification.

### Question 11: a) app.UseAuthentication()
Middleware de validation JWT.

### Question 12: b) UseAuthentication puis UseAuthorization
Ordre crucial.

### Question 13: b) Necessite un JWT valide
Protection de l'endpoint.

### Question 14: b) [Authorize(Roles = "Admin")]
Verifie le role.

### Question 15: b) Paire cle-valeur
Information sur l'utilisateur.

### Question 16: b) User.FindFirst(ClaimTypes.NameIdentifier)?.Value
Extraction du claim.

### Question 17: a) 401 = pas authentifie, 403 = pas autorise
Difference importante.

### Question 18: b) Token long duree pour renouveler access token
Refresh token concept.

### Question 19: b) Le payload n'est PAS chiffre
Encodage Base64, pas chiffrement.

### Question 20: c) 32 caracteres
Minimum 256 bits.

### Question 21: c) Dans le header Authorization
Authorization: Bearer token

### Question 22: c) Authorization: Bearer {token}
Format standard.

### Question 23: b) Verifie si role Admin
Helper method.

### Question 24: b) L'objet User avec tous les claims
ClaimsPrincipal.

### Question 25: b) Pour chiffrer le token pendant transport
HTTPS obligatoire.

### Question 26: b) User.Identity.IsAuthenticated
Propriete d'authentification.

### Question 27: b) Regle d'autorisation reutilisable
Policy concept.

### Question 28: b) "ManagerOrAdmin"
Policy dans XtraWork.

### Question 29: b) Timestamp d'expiration
Claim exp.

### Question 30: b) Microsoft.AspNetCore.Authentication.JwtBearer
Package NuGet.

---

**Bareme:**
27-30: Excellent
22-26: Bien
17-21: Passable
<17: Insuffisant

