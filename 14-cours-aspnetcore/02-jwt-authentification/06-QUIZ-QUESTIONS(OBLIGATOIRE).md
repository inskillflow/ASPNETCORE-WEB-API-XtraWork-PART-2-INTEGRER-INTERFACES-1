# Quiz - JWT Authentification

## Instructions

**Durée** : 30-40 minutes
**Barème** : 1 point par bonne réponse / 30 points total
**Seuil de réussite** : 22/30 (73%)

---

## Questions

### Question 1
Que signifie JWT ?

a) Java Web Token
b) JSON Web Token  
c) JavaScript Web Token
d) JSON Web Template

---

### Question 2
Combien de parties compose un JWT ?

a) 1
b) 2
c) 3
d) 4

---

### Question 3
Qu'est-ce que le payload d'un JWT contient ?

a) Le mot de passe de l'utilisateur
b) Les claims (informations) sur l'utilisateur
c) La clé secrète
d) La signature

---

### Question 4
Le payload d'un JWT est-il chiffré ?

a) Oui, chiffré avec AES-256
b) Oui, chiffré avec la clé secrète
c) Non, seulement encodé en Base64
d) Oui, chiffré avec RSA

---

### Question 5
À quoi sert la signature d'un JWT ?

a) Chiffrer les données
b) Prouver que le token est authentique et n'a pas été modifié
c) Compresser le token
d) Stocker le mot de passe

---

### Question 6
Dans XtraWork, quelle classe génère les tokens JWT ?

a) EmployeeController
b) AuthController
c) AuthService
d) UserRepository

---

### Question 7
Quelle est la durée de validité d'un JWT dans XtraWork ?

a) 15 minutes
b) 1 heure
c) 24 heures
d) 30 jours

---

### Question 8
Quel algorithme de signature utilise XtraWork ?

a) HS256 (HMAC-SHA256)
b) RS256 (RSA-SHA256)
c) ES256 (ECDSA-SHA256)
d) None

---

### Question 9
Où est stockée la clé secrète JWT dans XtraWork ?

a) Dans le code source
b) Dans appsettings.json
c) Dans la base de données
d) Dans le JWT lui-même

---

### Question 10
Quelle méthode ASP.NET Core configure l'authentification JWT ?

a) builder.Services.AddJwt()
b) builder.Services.AddAuthentication()
c) builder.Services.ConfigureJwt()
d) builder.Services.UseJwtBearer()

---

### Question 11
Quel middleware vérifie automatiquement les JWT ?

a) app.UseAuthentication()
b) app.UseJwt()
c) app.ValidateToken()
d) app.CheckJwt()

---

### Question 12
Dans quel ordre doivent être les middlewares ?

a) UseAuthorization puis UseAuthentication
b) UseAuthentication puis UseAuthorization
c) L'ordre n'a pas d'importance
d) UseAuthentication seulement

---

### Question 13
Que fait l'attribut `[Authorize]` sur un controller ?

a) Autorise tous les utilisateurs
b) Nécessite un JWT valide pour accéder
c) Génère un JWT
d) Vérifie le mot de passe

---

### Question 14
Comment spécifier qu'un endpoint est accessible seulement aux Admins ?

a) [Authorize]
b) [Authorize(Roles = "Admin")]
c) [AdminOnly]
d) [RequireRole("Admin")]

---

### Question 15
Qu'est-ce qu'un Claim ?

a) Une demande d'authentification
b) Une paire clé-valeur contenant une information sur l'utilisateur
c) Un type de token
d) Une erreur de validation

---

### Question 16
Comment récupérer l'ID utilisateur depuis le JWT dans un controller ?

a) User.Id
b) User.FindFirst(ClaimTypes.NameIdentifier)?.Value
c) Request.UserId
d) HttpContext.UserId

---

### Question 17
Quelle est la différence entre HTTP 401 et HTTP 403 ?

a) 401 = pas authentifié, 403 = pas autorisé
b) 401 = erreur serveur, 403 = erreur client
c) Pas de différence
d) 401 = token expiré, 403 = token invalide

---

### Question 18
Qu'est-ce qu'un Refresh Token ?

a) Un token pour actualiser la page
b) Un token long durée pour obtenir un nouveau access token
c) Un token pour rafraîchir la base de données
d) La même chose qu'un access token

---

### Question 19
Pourquoi ne pas stocker le mot de passe dans un JWT ?

a) C'est trop long
b) Le payload n'est PAS chiffré, juste encodé
c) C'est interdit par la loi
d) Ça ralentit l'application

---

### Question 20
Quelle longueur minimum pour une clé secrète JWT ?

a) 8 caractères
b) 16 caractères
c) 32 caractères
d) 64 caractères

---

### Question 21
Dans XtraWork, où le frontend envoie-t-il le JWT ?

a) Dans l'URL
b) Dans le body de la requête
c) Dans le header Authorization
d) Dans un cookie

---

### Question 22
Quel format pour le header Authorization ?

a) Authorization: {token}
b) Authorization: JWT {token}
c) Authorization: Bearer {token}
d) Bearer: {token}

---

### Question 23
Que fait `User.IsInRole("Admin")` ?

a) Ajoute le rôle Admin à l'utilisateur
b) Vérifie si l'utilisateur a le rôle Admin
c) Crée un nouveau rôle
d) Supprime le rôle Admin

---

### Question 24
Qu'est-ce que ClaimsPrincipal ?

a) Le claim le plus important
b) L'objet User dans un controller qui contient tous les claims
c) Le premier claim du JWT
d) Un type de token

---

### Question 25
Pourquoi utiliser HTTPS avec JWT ?

a) C'est obligatoire par la loi
b) Pour chiffrer le token pendant le transport
c) Pour accélérer les requêtes
d) Pour compresser les données

---

### Question 26
Quelle propriété indique qu'un utilisateur est authentifié ?

a) User.IsAuthenticated
b) User.Identity.IsAuthenticated
c) User.HasToken
d) User.LoggedIn

---

### Question 27
Qu'est-ce qu'une Policy dans ASP.NET Core ?

a) Un document légal
b) Une règle d'autorisation réutilisable
c) Un type de token
d) Une configuration CORS

---

### Question 28
Dans XtraWork, quelle policy permet à Manager et Admin d'accéder ?

a) "AdminOnly"
b) "ManagerOrAdmin"
c) "ManagerAndAdmin"
d) "AllRoles"

---

### Question 29
Que contient le claim `exp` dans un JWT ?

a) L'expérience de l'utilisateur
b) Le timestamp d'expiration du token
c) Le nombre d'utilisations restantes
d) La date de création

---

### Question 30
Quel package NuGet est utilisé pour JWT dans ASP.NET Core ?

a) System.IdentityModel.Tokens
b) Microsoft.AspNetCore.Authentication.JwtBearer
c) System.Security.JWT
d) Microsoft.JWT

---

## Barème

| Score | Appréciation |
|-------|--------------|
| 27-30 | Excellent |
| 22-26 | Bien (seuil de réussite) |
| 17-21 | Passable |
| < 17  | Insuffisant |

---

**Vérifier vos réponses** : [07-QUIZ-REPONSES(OBLIGATOIRE).md](./07-QUIZ-REPONSES(OBLIGATOIRE).md)

