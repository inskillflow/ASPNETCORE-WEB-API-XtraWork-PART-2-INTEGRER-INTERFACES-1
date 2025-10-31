# Introduction - JWT Authentification

## Qu'est-ce que l'authentification ?

L'authentification est le processus de **vérifier l'identité** d'un utilisateur. En d'autres termes : "Qui êtes-vous ?"

L'autorisation est différente : "Qu'est-ce que vous pouvez faire ?"

---

## Évolution de l'authentification web

### 1. Sessions traditionnelles (2000s)

```
Client → Envoie username/password
Serveur → Vérifie, crée une session, stocke en mémoire
         → Retourne un cookie avec l'ID de session
Client → Envoie le cookie à chaque requête
Serveur → Retrouve la session en mémoire
```

**Problèmes** :
- Session stockée côté serveur (mémoire)
- Difficile à scaler (plusieurs serveurs)
- Nécessite un stockage partagé (Redis)

---

### 2. JWT (2010s - Aujourd'hui)

```
Client → Envoie username/password
Serveur → Vérifie, génère un JWT
         → Retourne le JWT
Client → Stocke le JWT (localStorage)
       → Envoie le JWT dans Authorization header
Serveur → Vérifie la signature du JWT
         → Extrait les informations (claims)
         → Pas besoin de stockage serveur !
```

**Avantages** :
- Stateless (pas de stockage serveur)
- Scalable (n'importe quel serveur peut valider)
- Auto-contenu (toutes les infos dans le token)

---

## JWT : JSON Web Token

### Qu'est-ce que c'est ?

Un JWT est une chaîne encodée qui contient des informations vérifiables sur un utilisateur.

### Structure

```
eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJzdWIiOiIxMjM0NTY3ODkwIiwibmFtZSI6IkpvaG4gRG9lIiwiaWF0IjoxNTE2MjM5MDIyfQ.SflKxwRJSMeKKF2QT4fwpMeJf36POk6yJV_adQssw5c
│                                      │                                                                              │
│           Header                    │                       Payload                                                │    Signature
│       (Algorithme)                  │                   (Données utilisateur)                                      │   (Vérification)
```

**3 parties séparées par des points** :
1. **Header** : Type de token et algorithme de signature
2. **Payload** : Données (claims) sur l'utilisateur
3. **Signature** : Preuve que le token n'a pas été modifié

---

## Pourquoi JWT dans XtraWork ?

Le projet XtraWork est une **API REST** consommée par un **frontend séparé** (Next.js, React, etc.).

### Besoins

1. **Authentification** : Vérifier qui appelle l'API
2. **Stateless** : L'API ne stocke pas de sessions
3. **Scalable** : Plusieurs instances d'API possibles
4. **Frontend séparé** : Pas de cookies HttpOnly (frontend ≠ serveur)

### Solution : JWT

- Frontend obtient un JWT au login
- Frontend envoie le JWT dans chaque requête
- API valide le JWT sans stockage
- Fonctionne parfaitement pour les SPA (Single Page Applications)

---

## Flow d'authentification dans XtraWork

```
1. Frontend → POST /api/auth/login
   Body: { "username": "admin", "password": "Admin123!" }

2. AuthController.Login() reçoit la requête

3. AuthService.LoginAsync() vérifie le mot de passe
   - Récupère User depuis la DB
   - Vérifie password avec BCrypt
   
4. AuthService.GenerateJwtToken() génère le JWT
   - Crée des Claims (userId, username, role)
   - Signe le token avec la clé secrète
   - Définit l'expiration (24 heures)

5. AuthController retourne { token, user }

6. Frontend stocke le token (localStorage)

7. Requêtes suivantes → Frontend envoie :
   Header: Authorization: Bearer {token}

8. Middleware Authentication vérifie le token
   - Vérifie la signature
   - Vérifie l'expiration
   - Extrait les Claims
   
9. Si valide → Requête autorisée
   Si invalide → HTTP 401 Unauthorized
```

---

## Ce que vous allez apprendre

### Module 1 : Anatomie d'un JWT

Décortiquer un JWT réel du projet XtraWork pour comprendre chaque partie.

### Module 2 : Configuration

Analyser `Program.cs` ligne par ligne pour comprendre la configuration JWT.

### Module 3 : Génération

Étudier `AuthService.cs` pour voir comment créer un JWT avec claims.

### Module 4 : Validation

Comprendre comment ASP.NET Core vérifie automatiquement les JWT.

### Module 5 : Sécurité

Les bonnes pratiques et les refresh tokens pour renouveler les sessions.

---

## Prérequis

- Cours 1 (Fondations ASP.NET Core) terminé
- Comprendre HTTP et les headers
- Avoir le projet XtraWork fonctionnel

---

**Commencez maintenant** : [00-INTRODUCTION(COURS).md](./00-INTRODUCTION(COURS).md)

