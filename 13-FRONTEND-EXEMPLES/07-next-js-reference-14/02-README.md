# 🚀 XtraWork Frontend - Next.js 14

Frontend moderne construit avec Next.js 14, TypeScript, TailwindCSS et Zustand pour le backend XtraWork ASP.NET Core.

## 📋 Table des matières

- [Fonctionnalités](#-fonctionnalités)
- [Technologies](#-technologies)
- [Prérequis](#-prérequis)
- [Installation](#-installation)
- [Démarrage](#-démarrage)
- [Structure du projet](#-structure-du-projet)
- [Configuration](#-configuration)
- [Utilisation](#-utilisation)
- [Best Practices](#-best-practices)

---

## ✨ Fonctionnalités

### ✅ Authentification
- **Connexion/Inscription** avec JWT
- **Protection des routes** automatique
- **Gestion des rôles** (User, Manager, Admin)
- **Stockage sécurisé** du token et des infos utilisateur

### ✅ Interface Utilisateur
- **Design moderne** avec TailwindCSS
- **Responsive** sur tous les écrans
- **Navigation intuitive** avec App Router
- **Loading states** et messages d'erreur

### ✅ Gestion des Données
- **CRUD complet** pour Employés et Titres
- **Recherche et filtrage** en temps réel
- **Validation côté client** avant envoi
- **Gestion d'état** avec Zustand

---

## 🛠️ Technologies

| Technologie | Version | Usage |
|------------|---------|-------|
| **Next.js** | 14.2+ | Framework React avec App Router |
| **React** | 18.3+ | Library UI |
| **TypeScript** | 5.4+ | Type safety |
| **TailwindCSS** | 3.4+ | Styling |
| **Axios** | 1.7+ | HTTP client |
| **Zustand** | 4.5+ | State management |
| **React Hook Form** | 7.51+ | Formulaires |
| **Zod** | 3.23+ | Validation |

---

## 📦 Prérequis

- **Node.js** 18.0+ ou 20.0+
- **npm** 9.0+ ou **yarn** 1.22+
- **Backend XtraWork** en cours d'exécution sur `https://localhost:7033`

---

## 🚀 Installation

### 1. Installer les dépendances

```bash
cd frontend
npm install
```

### 2. Configurer les variables d'environnement

Le fichier `.env.local` est déjà créé avec :

```env
NEXT_PUBLIC_API_URL=https://localhost:7033/api
NODE_TLS_REJECT_UNAUTHORIZED=0
```

⚠️ **Note** : `NODE_TLS_REJECT_UNAUTHORIZED=0` est pour le développement uniquement (certificats SSL auto-signés).

---

## 🎯 Démarrage

### Mode développement

```bash
npm run dev
```

L'application sera accessible sur : **http://localhost:3000**

### Mode production

```bash
npm run build
npm start
```

### Vérification des types

```bash
npm run type-check
```

---

## 📁 Structure du projet

```
frontend/
├── src/
│   ├── app/                    # App Router (Next.js 14)
│   │   ├── layout.tsx          # Layout principal
│   │   ├── page.tsx            # Page d'accueil
│   │   ├── globals.css         # Styles globaux
│   │   ├── auth/               # Pages d'authentification
│   │   │   ├── login/
│   │   │   └── register/
│   │   └── dashboard/          # Pages protégées
│   │       ├── page.tsx        # Dashboard principal
│   │       ├── employees/      # Gestion employés
│   │       └── titles/         # Gestion titres
│   │
│   ├── components/             # Composants réutilisables
│   │   └── ui/                 # Composants UI de base
│   │
│   ├── services/               # Services API
│   │   ├── auth.service.ts     # Service authentification
│   │   ├── employee.service.ts # Service employés
│   │   └── title.service.ts    # Service titres
│   │
│   ├── types/                  # Types TypeScript
│   │   └── index.ts            # Types globaux
│   │
│   ├── lib/                    # Utilitaires
│   │   ├── api-client.ts       # Client Axios configuré
│   │   └── utils.ts            # Fonctions utilitaires
│   │
│   ├── hooks/                  # Custom hooks
│   │   └── useAuth.ts          # Hook d'authentification
│   │
│   └── store/                  # State management
│       └── auth.store.ts       # Store Zustand auth
│
├── public/                     # Fichiers statiques
├── package.json
├── tsconfig.json
├── tailwind.config.ts
├── next.config.mjs
└── README.md
```

---

## ⚙️ Configuration

### API Backend

Le frontend communique avec l'API backend via `NEXT_PUBLIC_API_URL`.

**Endpoints utilisés :**

| Endpoint | Méthode | Description |
|----------|---------|-------------|
| `/auth/login` | POST | Connexion |
| `/auth/register` | POST | Inscription |
| `/auth/me` | GET | Info utilisateur |
| `/auth/logout` | POST | Déconnexion |
| `/employees` | GET | Liste employés |
| `/employees/{id}` | GET | Détail employé |
| `/employees` | POST | Créer employé |
| `/employees/{id}` | PUT | Modifier employé |
| `/employees/{id}` | DELETE | Supprimer employé |
| `/titles` | GET | Liste titres |
| `/titles/{id}` | GET | Détail titre |
| `/titles` | POST | Créer titre |
| `/titles/{id}` | PUT | Modifier titre |
| `/titles/{id}` | DELETE | Supprimer titre |

### CORS Backend

Le backend **doit** avoir CORS activé pour `http://localhost:3000` :

```csharp
// XtraWork/Program.cs
builder.Services.AddCors(options =>
{
    options.AddPolicy("NextJsPolicy", policy =>
    {
        policy.WithOrigins("http://localhost:3000", "https://localhost:3000")
              .AllowAnyHeader()
              .AllowAnyMethod()
              .AllowCredentials();
    });
});

// Plus tard dans le pipeline
app.UseCors("NextJsPolicy");
```

✅ **Déjà configuré** dans votre backend !

---

## 📱 Utilisation

### 1. Démarrer le backend

```bash
cd XtraWork
dotnet run
```

Backend accessible sur : `https://localhost:7033`

### 2. Démarrer le frontend

```bash
cd frontend
npm run dev
```

Frontend accessible sur : `http://localhost:3000`

### 3. Se connecter

1. Aller sur **http://localhost:3000**
2. Cliquer sur **"Se connecter"**
3. Utiliser les identifiants de test :
   - Username : `admin`
   - Password : `Admin123!`

### 4. Explorer l'application

- **Dashboard** : Vue d'ensemble
- **Employés** : Liste, création, modification
- **Titres** : Gestion des postes
- **Profil** : Informations utilisateur

---

## 🎨 Best Practices Implémentées

### ✅ Architecture

- **App Router** (Next.js 14) pour le routing moderne
- **Server Components** par défaut, Client Components quand nécessaire
- **Séparation des préoccupations** (services, types, hooks)
- **Composition de composants** pour la réutilisabilité

### ✅ TypeScript

- **Types stricts** pour toutes les entités
- **Interfaces** pour les DTOs backend
- **Type safety** dans tous les fichiers
- **No any** sauf pour les erreurs

### ✅ State Management

- **Zustand** pour l'état global (auth)
- **React state** pour l'état local
- **Pas de prop drilling** excessif

### ✅ Sécurité

- **JWT** stocké en localStorage (considérer httpOnly cookies en prod)
- **Token** ajouté automatiquement aux requêtes
- **Redirection automatique** si non authentifié
- **Protection des routes** par rôle

### ✅ Performance

- **Code splitting** automatique avec Next.js
- **Lazy loading** des composants
- **Optimisation des images** avec next/image
- **Memoization** où nécessaire

### ✅ UX/UI

- **Loading states** sur toutes les requêtes
- **Messages d'erreur** clairs et en français
- **Responsive design** mobile-first
- **Feedback visuel** immédiat

---

## 🔒 Gestion de l'authentification

### Flow d'authentification

1. **Connexion** → Token JWT + infos utilisateur
2. **Stockage** → localStorage (token + user)
3. **Interceptor Axios** → Ajout automatique du token
4. **Vérification** → Redirection si token invalide/expiré
5. **Déconnexion** → Suppression token + redirection

### Protéger une page

```tsx
'use client';

import { useRequireAuth } from '@/hooks/useAuth';

export default function ProtectedPage() {
  useRequireAuth(); // Redirige si non authentifié

  return <div>Contenu protégé</div>;
}
```

### Protéger par rôle

```tsx
'use client';

import { useRequireRole } from '@/hooks/useAuth';

export default function AdminPage() {
  useRequireRole(['Admin']); // Redirige si pas Admin

  return <div>Page admin</div>;
}
```

---

## 🛠️ Développement

### Ajouter un nouveau service

1. Créer le service dans `src/services/`
2. Définir les types dans `src/types/`
3. Utiliser les helpers `get`, `post`, `put`, `del` de `api-client`

```typescript
// src/services/example.service.ts
import { get, post } from '@/lib/api-client';

export const exampleService = {
  async getAll() {
    return await get('/examples');
  },
  
  async create(data: any) {
    return await post('/examples', data);
  },
};
```

### Ajouter une nouvelle page

1. Créer le fichier dans `src/app/`
2. Utiliser `'use client'` si nécessaire
3. Implémenter la logique

```tsx
// src/app/example/page.tsx
'use client';

export default function ExamplePage() {
  return <div>Example</div>;
}
```

---

## 🐛 Troubleshooting

### Erreur CORS

**Problème** : Erreur CORS lors des requêtes

**Solution** :
- Vérifier que le backend est lancé
- Vérifier la configuration CORS dans `Program.cs`
- Vérifier `NEXT_PUBLIC_API_URL` dans `.env.local`

### Token expiré

**Problème** : Redirection constante vers login

**Solution** :
- Supprimer localStorage : `localStorage.clear()`
- Se reconnecter

### Backend SSL

**Problème** : Erreur SSL certificate

**Solution** :
- En développement : `NODE_TLS_REJECT_UNAUTHORIZED=0` dans `.env.local`
- En production : Utiliser des certificats valides

### Port déjà utilisé

**Problème** : Port 3000 déjà utilisé

**Solution** :
```bash
# Changer le port
npm run dev -- -p 3001
```

---

## 📚 Ressources

- [Next.js Documentation](https://nextjs.org/docs)
- [React Documentation](https://react.dev)
- [TailwindCSS Documentation](https://tailwindcss.com/docs)
- [TypeScript Documentation](https://www.typescriptlang.org/docs)
- [Zustand Documentation](https://zustand-demo.pmnd.rs/)

---

## 🎯 Prochaines étapes

- [ ] Ajouter des composants UI (shadcn/ui)
- [ ] Implémenter la recherche/filtrage avancé
- [ ] Ajouter la pagination
- [ ] Créer des formulaires de création/modification
- [ ] Ajouter des graphiques et statistiques
- [ ] Implémenter le refresh token
- [ ] Tests unitaires avec Jest/Vitest
- [ ] Tests E2E avec Playwright
- [ ] Dockerisation
- [ ] CI/CD Pipeline

---

## 👨‍💻 Auteur

XtraWork Frontend - Application de gestion des employés

---

**Bon développement ! 🚀**

