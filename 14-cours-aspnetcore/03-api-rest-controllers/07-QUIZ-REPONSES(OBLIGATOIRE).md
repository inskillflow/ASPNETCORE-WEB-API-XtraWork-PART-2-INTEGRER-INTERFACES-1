# Reponses Quiz - API REST et Controllers

## Corrections (1 point par bonne reponse / 25 total)

### Question 1: b) Representational State Transfer
REST signifie Representational State Transfer. Style d'architecture pour API web.

### Question 2: b) GET
GET recupere des donnees sans les modifier.

### Question 3: c) POST
POST cree une nouvelle ressource.

### Question 4: b) Active comportements automatiques
[ApiController] active validation automatique, model binding ameliore, et erreurs automatiques.

### Question 5: a) [Route("api/[controller]")]
Attribut sur la classe controller.

### Question 6: b) Le nom du controller sans "Controller"
EmployeeController devient employee.

### Question 7: a) [FromBody]
Indique que les donnees viennent du body JSON.

### Question 8: b) [FromRoute]
Parametre d'URL {id}.

### Question 9: a) [FromQuery]
Parametres de query string.

### Question 10: b) 201 Created
Convention REST pour creation de ressource.

### Question 11: c) 204 No Content
Suppression reussie sans donnees a retourner.

### Question 12: b) Ok()
Retourne 200 OK avec donnees.

### Question 13: b) NotFound()
Retourne 404 Not Found.

### Question 14: b) Retourne 201 Created avec header Location
CreatedAtAction genere l'URL de la ressource creee.

### Question 15: b) 400 Bad Request automatique
Avec [ApiController], validation automatique.

### Question 16: b) FluentValidation
XtraWork utilise FluentValidation pour validation avancee.

### Question 17: b) Dans Program.cs
builder.Services.AddFluentValidationAutoValidation()

### Question 18: a) Rend la propriete obligatoire pour validation
DataAnnotation pour validation.

### Question 19: a) 400 Bad Request
Donnees client invalides.

### Question 20: b) 401 = pas authentifie, 403 = pas autorise
401 = login requis, 403 = permissions insuffisantes.

### Question 21: b) Middleware UseExceptionHandler
Gestion globale des exceptions.

### Question 22: b) Documente les reponses possibles pour Swagger
Annotations pour documentation.

### Question 23: b) NotFoundException
Exception personnalisee dans XtraWork/Exceptions/.

### Question 24: b) GET
GET est idempotente (meme resultat si repetee).

### Question 25: b) Des noms de ressources
REST utilise noms (employees) pas verbes (getEmployees).

---

Bareme:
23-25: Excellent
18-22: Bien
13-17: Passable
<13: Insuffisant

