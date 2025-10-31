# Module 1 - OpenAPI Specification

## Qu'est-ce qu'OpenAPI ?

OpenAPI (anciennement Swagger) est une **spécification standardisée** pour décrire des API REST.

---

## Structure d'une spécification OpenAPI

```json
{
  "openapi": "3.0.1",
  "info": {
    "title": "XtraWork API",
    "version": "v1"
  },
  "paths": {
    "/api/employees": {
      "get": {
        "summary": "Récupère tous les employés",
        "responses": {
          "200": {
            "description": "Success",
            "content": {
              "application/json": {
                "schema": {
                  "type": "array",
                  "items": { "$ref": "#/components/schemas/EmployeeResponse" }
                }
              }
            }
          }
        }
      }
    }
  },
  "components": {
    "schemas": {
      "EmployeeResponse": {
        "type": "object",
        "properties": {
          "id": { "type": "string", "format": "uuid" },
          "firstName": { "type": "string" },
          "lastName": { "type": "string" }
        }
      }
    }
  }
}
```

---

## Avantages

**Documentation automatique** : Générée depuis le code
**Cohérence** : Toujours à jour avec l'API
**Génération de clients** : Outils peuvent générer du code TypeScript, C#, etc.
**Tests** : Swagger UI permet de tester directement

---

## Dans XtraWork

URL : https://localhost:7033/swagger

Le fichier JSON est disponible sur :
https://localhost:7033/swagger/v1/swagger.json

---

**Prochain** : [02-SWASHBUCKLE(COURS).md](./02-SWASHBUCKLE(COURS).md)

