# Quiz - API REST et Controllers

## Instructions

Duree : 30 minutes
Bareme : 1 point par bonne reponse / 25 points total
Seuil de reussite : 18/25 (72%)

---

## Questions

### Question 1
Que signifie REST ?
a) Rapid Exchange State Transfer
b) Representational State Transfer
c) Remote Execution State Transfer
d) Resource Exchange Standard Transfer

### Question 2
Quelle methode HTTP utilise-t-on pour recuperer des donnees ?
a) POST
b) GET
c) PUT
d) FETCH

### Question 3
Quelle methode HTTP utilise-t-on pour creer une ressource ?
a) GET
b) CREATE
c) POST
d) INSERT

### Question 4
Que fait l'attribut [ApiController] ?
a) Cree une API automatiquement
b) Active des comportements automatiques (validation, model binding)
c) Genere de la documentation
d) Rien, c'est optionnel

### Question 5
Comment definir la route de base d'un controller ?
a) [Route("api/[controller]")]
b) [BaseRoute("api/employee")]
c) [Url("api/employee")]
d) Dans appsettings.json

### Question 6
Que signifie [controller] dans [Route("api/[controller]")] ?
a) Le mot "controller"
b) Le nom du controller sans "Controller"
c) Le namespace du controller
d) Le nom complet du controller

### Question 7
Comment recuperer un parametre du body JSON ?
a) [FromBody]
b) [FromJson]
c) [BodyParameter]
d) Automatique

### Question 8
Comment recuperer un parametre de l'URL /api/employees/123 ?
a) [FromUrl]
b) [FromRoute]
c) [FromPath]
d) [UrlParameter]

### Question 9
Comment recuperer un parametre de query string ?page=2 ?
a) [FromQuery]
b) [FromQueryString]
c) [QueryParameter]
d) [FromUrl]

### Question 10
Quel status code retourner apres avoir cree une ressource ?
a) 200 OK
b) 201 Created
c) 202 Accepted
d) 204 No Content

### Question 11
Quel status code retourner apres une suppression reussie ?
a) 200 OK
b) 201 Created
c) 204 No Content
d) 202 Accepted

### Question 12
Quelle methode retourne HTTP 200 OK avec des donnees ?
a) Success()
b) Ok()
c) Return()
d) Data()

### Question 13
Quelle methode retourne HTTP 404 Not Found ?
a) Missing()
b) NotFound()
c) Error404()
d) ResourceNotFound()

### Question 14
Que fait CreatedAtAction() ?
a) Cree une nouvelle action
b) Retourne 201 Created avec header Location
c) Genere une route
d) Cree un controller

### Question 15
Avec [ApiController], que se passe-t-il si ModelState.IsValid est false ?
a) Exception levee
b) 400 Bad Request automatique
c) Execution continue
d) 500 Internal Server Error

### Question 16
Quelle bibliotheque de validation utilise XtraWork ?
a) DataAnnotations
b) FluentValidation
c) System.ComponentModel.DataAnnotations
d) ValidationHelper

### Question 17
Ou configure-t-on FluentValidation dans XtraWork ?
a) Dans chaque controller
b) Dans Program.cs avec AddFluentValidationAutoValidation()
c) Dans appsettings.json
d) Dans le DbContext

### Question 18
Que fait [Required] sur une propriete de DTO ?
a) Rend la propriete obligatoire pour la validation
b) Cree un index en base de donnees
c) Genere automatiquement une valeur
d) Rien

### Question 19
Quel status code pour des donnees invalides ?
a) 400 Bad Request
b) 422 Unprocessable Entity
c) 500 Internal Server Error
d) 404 Not Found

### Question 20
Quelle est la difference entre 401 et 403 ?
a) Pas de difference
b) 401 = pas authentifie, 403 = pas autorise
c) 401 = erreur client, 403 = erreur serveur
d) 401 = token invalide, 403 = token expire

### Question 21
Comment ASP.NET Core gere les exceptions non gerees ?
a) Crash de l'application
b) Middleware UseExceptionHandler
c) Automatiquement en 404
d) Ignore l'erreur

### Question 22
Que fait [ProducesResponseType] ?
a) Produit une reponse
b) Documente les reponses possibles pour Swagger
c) Genere du code
d) Valide la reponse

### Question 23
Dans XtraWork, quelle exception est levee si une ressource n'existe pas ?
a) ResourceNotFoundException
b) NotFoundException
c) EntityNotFoundException
d) MissingException

### Question 24
Quelle methode HTTP est idempotente ?
a) POST
b) GET
c) PATCH
d) CREATE

### Question 25
Dans une API REST, les URLs doivent contenir :
a) Des verbes (getEmployees, createEmployee)
b) Des noms de ressources (employees, titles)
c) Des actions (retrieve, insert)
d) Peu importe

---

## Fin du quiz

Total : 25 questions

Bareme :
- 23-25 points : Excellent
- 18-22 points : Bien
- 13-17 points : Passable
- < 13 points : Insuffisant

---

**Verifier vos reponses** : [07-QUIZ-REPONSES(OBLIGATOIRE).md](./07-QUIZ-REPONSES(OBLIGATOIRE).md)

