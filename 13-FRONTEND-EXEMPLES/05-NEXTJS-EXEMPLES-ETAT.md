# État des Exemples Next.js

## Exemples Next.js créés

### 07 - Next.js 15 Simple

**Statut** : 🔨 Structure de base créée (60%)

**Fichiers créés** :
- ✅ package.json (Next.js 15, Tailwind v3)
- ✅ Configuration (next.config, tailwind.config, tsconfig)
- ✅ Types TypeScript
- ✅ Services (auth, employee)
- ✅ Client API
- ✅ Pages (Home, Login, Dashboard, Employees)

**À finaliser** :
- Documentation complète (EXPLICATIONS.md)
- Tests
- Composants additionnels

---

### 08 - Next.js 15 Complet avec shadcn/ui

**Statut** : 🔨 Infrastructure créée (50%)

**Fichiers créés** :
- ✅ package.json (Next.js 15, shadcn/ui, Tailwind v3.4.1)
- ✅ Configuration shadcn (components.json)
- ✅ Tailwind config avec variables CSS
- ✅ globals.css avec variables shadcn
- ✅ Composants shadcn/ui de base :
  - Button
  - Input
  - Card
  - Label
- ✅ lib/utils.ts (fonction cn())
- ✅ Services complets

**À créer** :
- Pages complètes (Login, Register, Dashboard, CRUD)
- Composants shadcn additionnels (Dialog, Toast)
- Documentation

---

## Technologies utilisées

### Next.js 15 Simple

- Next.js 15.0.3
- React 18.3.1
- Tailwind CSS 3.4.1 (stable)
- TypeScript 5.3
- Axios

**Approche** : Tailwind pur, pas de bibliothèque de composants

---

### Next.js 15 Complet

- Next.js 15.0.3
- React 18.3.1
- Tailwind CSS 3.4.1 (stable)
- **shadcn/ui** (composants)
- TypeScript 5.3
- Axios
- React Hook Form
- Zod
- Radix UI (via shadcn)

**Approche** : shadcn/ui pour composants professionnels

---

## shadcn/ui - Composants installés

### Déjà créés

- ✅ Button - Boutons avec variants
- ✅ Input - Champs de formulaire
- ✅ Card - Cartes de contenu
- ✅ Label - Labels de formulaire

### À ajouter

- ⏳ Dialog - Modales de confirmation
- ⏳ Toast - Notifications
- ⏳ Select - Sélecteurs
- ⏳ Form - Wrapper formulaire

---

## Tailwind CSS v3.4.1

**Version stable** utilisée dans les deux exemples.

**Configuration** :
- Variables CSS pour shadcn (exemple 08)
- Classes utilitaires personnalisées
- Dark mode prêt
- Responsive design

**Classes personnalisées** :
```css
@layer components {
  .btn { @apply px-4 py-2 rounded-md font-semibold; }
  .card { @apply bg-white rounded-lg shadow-md p-6; }
  .form-input { @apply w-full px-3 py-2 border rounded-md; }
}
```

---

## Comparaison des deux exemples Next.js

| Aspect | 07-Simple | 08-Complet |
|--------|-----------|------------|
| **Next.js** | 15.0.3 | 15.0.3 |
| **Tailwind** | 3.4.1 | 3.4.1 |
| **UI Library** | Aucune | shadcn/ui |
| **Formulaires** | useState | React Hook Form |
| **Validation** | Basique | Zod |
| **Composants** | Custom | shadcn/ui |
| **Complexité** | Simple | Avancée |
| **Production** | Oui | Oui (optimal) |

---

## Installation

### 07 - Next.js Simple

```bash
cd frontend-exemples/07-nextjs-simple
npm install
npm run dev
```

**URL** : http://localhost:3000

---

### 08 - Next.js Complet

```bash
cd frontend-exemples/08-nextjs-complet
npm install
npm run dev
```

**URL** : http://localhost:3000

**Note** : Utiliser des ports différents si les deux tournent en même temps :
```bash
npm run dev -- -p 3001
```

---

## shadcn/ui - Avantages

### Pourquoi shadcn/ui ?

**1. Pas une dépendance**
- Code copié dans votre projet
- Vous possédez le code
- Personnalisable à 100%

**2. Composants accessibles**
- Basé sur Radix UI
- ARIA compliant
- Keyboard navigation

**3. Styled avec Tailwind**
- Cohérent avec votre design
- Personnalisable
- Pas de CSS-in-JS

**4. Production ready**
- Utilisé par des milliers de projets
- Bien maintenu
- Documentation excellente

---

## Exemple de code shadcn/ui

### Avant (Tailwind pur)

```tsx
<button className="px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-md font-semibold">
  Cliquer
</button>
```

### Avec shadcn/ui

```tsx
import { Button } from '@/components/ui/button';

<Button>Cliquer</Button>
<Button variant="destructive">Supprimer</Button>
<Button variant="outline">Annuler</Button>
```

**Plus concis, plus cohérent, plus maintenable**

---

## Prochaines étapes

### Pour finaliser

**07-nextjs-simple** :
- Ajouter documentation complète
- Tester toutes les pages
- Ajuster le design

**08-nextjs-complet** :
- Créer toutes les pages avec shadcn/ui
- Ajouter Dialog et Toast shadcn
- Implémenter CRUD complet
- Documentation complète

---

## Ressources

### Next.js 15

- Doc officielle : https://nextjs.org/docs
- App Router : https://nextjs.org/docs/app
- Nouveautés v15 : https://nextjs.org/blog/next-15

### shadcn/ui

- Doc officielle : https://ui.shadcn.com
- Composants : https://ui.shadcn.com/docs/components
- Exemples : https://ui.shadcn.com/examples

### Tailwind CSS v3

- Doc officielle : https://tailwindcss.com
- V3 Release : https://tailwindcss.com/blog/tailwindcss-v3

---

**Next.js 15 avec Tailwind v3 stable - En cours de finalisation !**

