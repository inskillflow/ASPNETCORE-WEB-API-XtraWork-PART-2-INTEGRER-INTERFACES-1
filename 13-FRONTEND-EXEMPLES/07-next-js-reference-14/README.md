# 09 - RÉFÉRENCE Next.js 14 (Application Production)

## IMPORTANT

Ce dossier est une **référence** vers l'application Next.js 14 de production qui existe déjà dans le projet.

**Localisation de l'application réelle** : `../../frontend/`

---

## Pourquoi ce dossier ?

Pour maintenir la cohérence pédagogique, ce dossier documente l'application Next.js 14 qui est déjà dans votre projet.

---

## Où trouver le code source

```
ASPNETCORE-WEB-API-XtraWork-PART-2-NEXT/
│
├── frontend/              ← CODE SOURCE ICI (Next.js 14)
│   ├── src/
│   │   ├── app/
│   │   ├── components/
│   │   ├── services/
│   │   ├── store/
│   │   └── types/
│   ├── package.json
│   ├── next.config.mjs
│   └── README.md
│
└── frontend-exemples/
    └── 09-reference-next-14/  ← Vous êtes ici (documentation)
        └── README.md
```

---

## Utilisation de l'application réelle

### Installation

```bash
# Aller dans le dossier frontend (racine du projet)
cd ../../frontend

# Installer les dépendances
npm install

# Lancer en développement
npm run dev
```

**URL** : http://localhost:3000

**Credentials** :
- Username : `admin`
- Password : `Admin123!`

---

## Technologies utilisées (Frontend production)

### Core

- **Next.js** : 14.2.0
- **React** : 18.3.0
- **TypeScript** : 5.4.0

### State Management

- **Zustand** : 4.5.0

### HTTP Client

- **Axios** : 1.7.0

### UI

- **TailwindCSS** : 3.4.0
- Custom components

### Autres

- React Hook Form
- Zod (validation)

---

## Fonctionnalités

### Authentification

- [x] Login avec JWT
- [x] Register
- [x] Logout
- [x] Protection des routes
- [x] Store Zustand pour auth

### CRUD

- [x] Liste des employés
- [x] Dashboard utilisateur
- [x] Design responsive

### Architecture

- [x] App Router (Next.js 14)
- [x] Server Components
- [x] Client Components
- [x] Middleware
- [x] API Routes

---

## Différence avec les exemples pédagogiques

| Aspect | 09-reference-next-14<br/>(Production) | 07-nextjs-15-simple<br/>(Pédagogique) | 08-nextjs-15-shadcn<br/>(Pédagogique) |
|--------|--------------------------------------|---------------------------------------|---------------------------------------|
| **Version** | Next.js 14 | Next.js 15 | Next.js 15 |
| **Objectif** | Application réelle | Apprentissage | Apprentissage avancé |
| **Complexité** | Production | Simple | Complète |
| **State** | Zustand | useState/Context | React Hook Form |
| **UI** | Custom | Tailwind pur | shadcn/ui |
| **Complet** | Oui (production) | Basique | CRUD complet |

---

## Quand utiliser chaque version

### 09-reference-next-14 (../../frontend/)

**UTILISER pour** :
- Application de production
- Référence de code professionnel
- Déploiement réel

**NE PAS utiliser pour** :
- Premier apprentissage (trop complexe)
- Exercices pédagogiques

---

### 07-nextjs-15-simple

**UTILISER pour** :
- Apprendre Next.js 15
- Comprendre les bases
- Premier projet Next.js

---

### 08-nextjs-15-shadcn

**UTILISER pour** :
- Apprendre shadcn/ui
- Application moderne
- Best practices 2025

---

## Structure de l'application production (frontend/)

```
frontend/src/
├── app/
│   ├── layout.tsx
│   ├── page.tsx
│   ├── auth/
│   │   ├── login/page.tsx
│   │   └── register/page.tsx
│   └── dashboard/
│       ├── page.tsx
│       └── employees/page.tsx
│
├── services/
│   ├── auth.service.ts
│   ├── employee.service.ts
│   └── title.service.ts
│
├── store/
│   └── auth.store.ts        ← Zustand
│
├── types/
│   └── index.ts
│
└── lib/
    └── api-client.ts
```

---

## Commandes (Application production)

```bash
# Développement
cd ../../frontend
npm run dev

# Build production
npm run build

# Démarrer production
npm start

# Linter
npm run lint
```

---

## Documentation de l'application production

**README complet** : `../../frontend/README.md`

**Documentation du projet** :
- `../../02-README.md` - Vue d'ensemble
- `../../06-GUIDE-FRONTEND-BACKEND.md` - Architecture

---

## Résumé pour vos étudiants

### Vous avez accès à 3 applications Next.js

**1. Application de production (../../frontend/)**
- Next.js 14
- Complète et fonctionnelle
- Zustand pour state
- À étudier comme référence professionnelle

**2. Exemple simple (07-nextjs-15-simple/)**
- Next.js 15
- Version simplifiée
- Pour apprendre les bases

**3. Exemple complet (08-nextjs-15-shadcn/)**
- Next.js 15
- shadcn/ui
- Pour maîtriser les meilleures pratiques

---

## Ordre d'apprentissage recommandé

### Débutant Next.js

1. Apprendre React d'abord (exemples 03-04)
2. Puis Next.js simple (07)
3. Puis Next.js avec shadcn (08)
4. Analyser le code production (../../frontend/)

### Avancé

1. Étudier le code production (../../frontend/)
2. Comparer avec les exemples (07-08)
3. Comprendre les différences
4. Créer votre propre application

---

**Le frontend production Next.js 14 est déjà là et fonctionne parfaitement !**

**Localisation** : `../../frontend/` (2 niveaux au-dessus)

