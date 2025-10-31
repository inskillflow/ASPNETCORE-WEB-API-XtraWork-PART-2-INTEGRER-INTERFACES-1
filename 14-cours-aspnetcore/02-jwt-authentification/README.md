# Cours 2 - JWT Authentification

## Description

Ce cours couvre l'authentification JWT en profondeur : anatomie d'un token, génération, validation, claims, refresh tokens, et sécurité. Basé sur l'implémentation réelle du projet XtraWork.

---

## Contenu

### Modules de cours (6 modules)

1. **Introduction** - Authentification moderne et JWT
2. **Anatomie JWT** - header.payload.signature décortiqué
3. **Configuration ASP.NET** - AddAuthentication, JwtBearer
4. **Génération de tokens** - JwtSecurityTokenHandler
5. **Validation et Claims** - [Authorize], ClaimsPrincipal, Roles
6. **Sécurité** - Bonnes pratiques et refresh tokens

---

## Évaluation

### Quiz (OBLIGATOIRE)

**30 questions à choix multiple**

**Barème** : 1 point par bonne réponse / 30 points total

**Seuil de réussite** : 22/30 (73%)

---

### Exercices (OPTIONNEL)

**6 exercices pratiques**

1. Décoder un JWT manuellement
2. Générer un token custom
3. Implémenter un refresh token
4. Créer des policies personnalisées
5. Sécuriser un endpoint avec des Claims
6. Implémenter la déconnexion avec blacklist

---

## Durée

**Total** : 5-6 heures

- Lecture des modules : 4-5 heures
- Quiz : 30-40 minutes
- Exercices optionnels : 1-2 heures

---

## Objectifs d'apprentissage

À la fin de ce cours, vous serez capable de :

- Expliquer l'anatomie d'un JWT
- Configurer l'authentification JWT dans ASP.NET Core
- Générer des tokens avec claims personnalisés
- Valider les tokens et extraire les claims
- Implémenter des policies basées sur les rôles
- Sécuriser votre API avec les bonnes pratiques JWT

---

## Prérequis

- Avoir terminé le Cours 1 (Fondations ASP.NET Core)
- Comprendre les bases de HTTP
- Connaître les concepts d'authentification de base

---

## Lien avec le projet XtraWork

Ce cours analyse en détail :

```
XtraWork/
├── Program.cs                      ← Configuration JWT
├── Services/
│   └── AuthService.cs             ← Génération de tokens
├── Controllers/
│   └── AuthController.cs          ← Login, Register, Logout
└── Entities/
    └── User.cs                    ← Modèle utilisateur
```

---

**Commencez maintenant** : [INDEX.md](./INDEX.md)

