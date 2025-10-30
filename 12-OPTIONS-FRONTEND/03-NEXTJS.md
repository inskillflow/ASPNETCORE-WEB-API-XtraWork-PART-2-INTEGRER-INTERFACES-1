# Next.js - Frontend pour API ASP.NET Core

## Introduction

**Next.js** est un framework React avec des fonctionnalités avancées comme le Server-Side Rendering (SSR), le Static Site Generation (SSG), et le routing intégré. C'est la solution recommandée pour les applications React en production.

**IMPORTANT** : Une application Next.js complète est **DEJA IMPLEMENTEE** dans le dossier `frontend/` de ce projet !

### Caractéristiques principales

- **SSR/SSG** : Rendu côté serveur ou génération statique
- **App Router** : Routing moderne basé sur le système de fichiers
- **API Routes** : Backend intégré possible
- **Performance** : Optimisations automatiques
- **TypeScript** : Support first-class
- **SEO** : Excellent pour le référencement

---

## Application déjà implémentée

### Localisation

```
frontend/               # Dossier Next.js existant
├── src/
│   ├── app/           # Pages (App Router)
│   ├── services/      # Communication API
│   ├── store/         # State management (Zustand)
│   ├── hooks/         # Custom hooks
│   ├── types/         # Types TypeScript
│   └── lib/           # Utilitaires
├── package.json
├── next.config.mjs
└── tsconfig.json
```

### Fonctionnalités implémentées

- [x] Authentification JWT complète
- [x] Login / Register / Logout
- [x] Dashboard utilisateur
- [x] Liste des employés
- [x] Protection des routes
- [x] State management avec Zustand
- [x] Client API Axios configuré
- [x] Types TypeScript complets
- [x] Design responsive TailwindCSS

### Comment l'utiliser

```bash
# Aller dans le dossier frontend
cd frontend

# Installer les dépendances (première fois)
npm install

# Lancer en développement
npm run dev

# L'application sera disponible sur http://localhost:3000
```

### Pages disponibles

- **/** : Page d'accueil
- **/auth/login** : Page de connexion
- **/auth/register** : Page d'inscription
- **/dashboard** : Dashboard (protégé)
- **/dashboard/employees** : Liste des employés (protégé)

### Compte de test

```
Username: admin
Password: Admin123!
```

---

## Architecture de l'application existante

### Structure des fichiers

```
frontend/src/
├── app/
│   ├── layout.tsx                    # Layout racine
│   ├── page.tsx                      # Page d'accueil
│   ├── globals.css                   # Styles globaux
│   ├── auth/
│   │   ├── login/page.tsx           # Page de login
│   │   └── register/page.tsx        # Page d'inscription
│   └── dashboard/
│       ├── page.tsx                 # Dashboard principal
│       └── employees/page.tsx       # Liste des employés
│
├── services/                         # Communication API
│   ├── auth.service.ts              # Service authentification
│   ├── employee.service.ts          # Service employés
│   ├── title.service.ts             # Service titres
│   └── index.ts                     # Export centralisé
│
├── store/
│   └── auth.store.ts                # Store Zustand pour auth
│
├── hooks/
│   └── useAuth.ts                   # Hook authentification
│
├── lib/
│   ├── api-client.ts                # Client Axios configuré
│   └── utils.ts                     # Fonctions utilitaires
│
└── types/
    └── index.ts                     # Types TypeScript
```

---

## Concepts clés de Next.js

### 1. App Router (Next.js 14)

Le routing est basé sur la structure des dossiers dans `app/` :

```
app/
├── page.tsx                    →  /
├── auth/
│   ├── login/
│   │   └── page.tsx           →  /auth/login
│   └── register/
│       └── page.tsx           →  /auth/register
└── dashboard/
    ├── page.tsx               →  /dashboard
    └── employees/
        └── page.tsx           →  /dashboard/employees
```

### 2. Server Components vs Client Components

**Server Components** (par défaut)
- Rendus côté serveur
- Pas d'interactivité
- Meilleur pour le SEO
- Plus légers

**Client Components** (avec `'use client'`)
- Rendus côté client
- Interactivité (useState, useEffect, etc.)
- Nécessaires pour les événements

**Exemple dans le projet** :

```typescript
// app/dashboard/page.tsx
'use client';  // Nécessaire pour useState, useRouter, etc.

import { useAuth } from '@/hooks/useAuth';
import { useRouter } from 'next/navigation';

export default function DashboardPage() {
    const { user } = useAuth();
    const router = useRouter();
    // ...
}
```

### 3. Protection des routes

**Implémenté avec useEffect** :

```typescript
// Dans chaque page protégée
const { isAuthenticated } = useAuth();
const router = useRouter();

useEffect(() => {
    if (!isAuthenticated) {
        router.push('/auth/login');
    }
}, [isAuthenticated, router]);
```

**Alternative avec middleware** (non implémenté mais possible) :

```typescript
// middleware.ts
export function middleware(request: NextRequest) {
    const token = request.cookies.get('token');
    if (!token) {
        return NextResponse.redirect(new URL('/auth/login', request.url));
    }
}

export const config = {
    matcher: ['/dashboard/:path*']
};
```

---

## Communication avec l'API

### Client API Axios

**Fichier** : `src/lib/api-client.ts`

```typescript
import axios from 'axios';

const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL || 'https://localhost:7033/api';

const apiClient = axios.create({
    baseURL: API_BASE_URL,
    headers: {
        'Content-Type': 'application/json',
    },
    timeout: 10000,
});

// Intercepteur : Ajouter le token JWT automatiquement
apiClient.interceptors.request.use(config => {
    if (typeof window !== 'undefined') {
        const token = localStorage.getItem('token');
        if (token) {
            config.headers.Authorization = `Bearer ${token}`;
        }
    }
    return config;
});

// Intercepteur : Gérer les erreurs
apiClient.interceptors.response.use(
    response => response,
    error => {
        if (error.response?.status === 401) {
            localStorage.removeItem('token');
            localStorage.removeItem('user');
            window.location.href = '/auth/login';
        }
        return Promise.reject(error);
    }
);
```

**Note importante** : `typeof window !== 'undefined'` est nécessaire car Next.js fait du rendu côté serveur où `window` n'existe pas.

---

## State Management avec Zustand

**Fichier** : `src/store/auth.store.ts`

```typescript
import { create } from 'zustand';

export const useAuthStore = create<AuthState>((set) => ({
    user: null,
    token: null,
    isAuthenticated: false,
    
    login: async (credentials) => {
        const response = await authService.login(credentials);
        set({
            user: response,
            token: response.token,
            isAuthenticated: true,
        });
    },
    
    logout: () => {
        authService.logout();
        set({
            user: null,
            token: null,
            isAuthenticated: false,
        });
    }
}));
```

**Utilisation dans un composant** :

```typescript
import { useAuthStore } from '@/store/auth.store';

export default function SomeComponent() {
    const { user, logout } = useAuthStore();
    // ...
}
```

---

## Avantages de Next.js

### Performance

**Optimisations automatiques** :
- Code splitting automatique
- Image optimization (next/image)
- Font optimization
- Script optimization

**Exemple** :
```typescript
import Image from 'next/image';

<Image 
    src="/logo.png" 
    alt="Logo"
    width={100}
    height={100}
    priority
/>
```

### SEO

**Metadata** :
```typescript
// app/page.tsx
export const metadata = {
    title: 'XtraWork - Dashboard',
    description: 'Application de gestion des employés'
};
```

### Developer Experience

- Hot reload rapide
- Erreurs claires
- TypeScript intégré
- ESLint configuré

---

## Configuration

### Variables d'environnement

**Fichier** : `.env.local`

```env
NEXT_PUBLIC_API_URL=https://localhost:7033/api
NODE_TLS_REJECT_UNAUTHORIZED=0  # Dev uniquement
```

**Important** : Les variables commençant par `NEXT_PUBLIC_` sont accessibles côté client.

### Configuration Next.js

**Fichier** : `next.config.mjs`

```javascript
/** @type {import('next').NextConfig} */
const nextConfig = {
    reactStrictMode: true,
    images: {
        domains: ['localhost'],
    },
};

export default nextConfig;
```

### Configuration TailwindCSS

**Fichier** : `tailwind.config.ts`

```typescript
import type { Config } from 'tailwindcss'

const config: Config = {
    content: [
        './src/pages/**/*.{js,ts,jsx,tsx,mdx}',
        './src/components/**/*.{js,ts,jsx,tsx,mdx}',
        './src/app/**/*.{js,ts,jsx,tsx,mdx}',
    ],
    theme: {
        extend: {},
    },
    plugins: [],
}
export default config
```

---

## Améliorations possibles

### 1. Ajouter un middleware pour la protection des routes

**Fichier** : `src/middleware.ts`

```typescript
import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';

export function middleware(request: NextRequest) {
    const token = request.cookies.get('token')?.value;
    
    if (!token && request.nextUrl.pathname.startsWith('/dashboard')) {
        return NextResponse.redirect(new URL('/auth/login', request.url));
    }
    
    return NextResponse.next();
}

export const config = {
    matcher: ['/dashboard/:path*']
};
```

### 2. Implémenter React Query pour le cache

```bash
npm install @tanstack/react-query
```

```typescript
// app/providers.tsx
'use client';

import { QueryClient, QueryClientProvider } from '@tanstack/react-query';

const queryClient = new QueryClient();

export function Providers({ children }: { children: React.ReactNode }) {
    return (
        <QueryClientProvider client={queryClient}>
            {children}
        </QueryClientProvider>
    );
}
```

### 3. Ajouter des tests

```bash
npm install --save-dev @testing-library/react @testing-library/jest-dom jest jest-environment-jsdom
```

---

## Commandes utiles

```bash
# Développement
npm run dev

# Build production
npm run build

# Démarrer en production
npm start

# Linter
npm run lint

# Vérifier les types TypeScript
npm run type-check
```

---

## Déploiement

### Vercel (Recommandé)

Next.js est fait par Vercel, donc le déploiement est optimisé :

```bash
# Installer Vercel CLI
npm install -g vercel

# Déployer
vercel

# Déployer en production
vercel --prod
```

### Autres plateformes

- **Netlify** : Support Next.js
- **AWS Amplify** : Support Next.js
- **Docker** : Dockerfile inclus possible

---

## Comparaison avec React pur

| Aspect | React (CRA) | Next.js |
|--------|------------|---------|
| SSR | Non | Oui |
| Routing | React Router | Intégré |
| SEO | Moyen | Excellent |
| Setup | Simple | Moyen |
| Performance | Bonne | Excellente |
| Image optimization | Manuel | Automatique |
| API Routes | Non | Oui |
| Déploiement | Standard | Optimisé (Vercel) |

---

## Ressources

### Documentation officielle
- Next.js : https://nextjs.org
- App Router : https://nextjs.org/docs/app
- Déploiement : https://nextjs.org/docs/deployment

### Tutoriels
- Next.js Learn : https://nextjs.org/learn
- Vercel Templates : https://vercel.com/templates

### Communauté
- Discord Next.js
- GitHub Discussions
- Stack Overflow

---

## Conclusion

### Pourquoi Next.js pour ce projet

1. **Production-ready** : Optimisé pour la production
2. **SEO** : Important pour les applications web
3. **DX** : Excellente expérience développeur
4. **TypeScript** : Support natif complet
5. **Évolutif** : Peut grandir avec le projet

### Quand utiliser Next.js

**Oui** :
- Applications nécessitant du SEO
- Projets visant la production
- Applications complexes
- Besoin de performance maximale

**Non** :
- Prototypes simples (utiliser HTML Vanilla)
- Premiers pas en React (commencer par React pur)
- Applications purement internes (React suffit)

---

**L'application Next.js de ce projet est un excellent point de départ pour comprendre une architecture moderne et professionnelle !**

