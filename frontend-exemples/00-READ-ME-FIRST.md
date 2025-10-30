# LIRE EN PREMIER - Exemples Frontend XtraWork

## Bienvenue dans les exemples Frontend

Ce dossier contient **9 exemples différents** de frontends qui consomment tous la même API ASP.NET Core XtraWork.

Chaque exemple est **indépendant** et **fonctionnel**.

---

## Organisation des dossiers

Les dossiers sont numérotés **par ordre de complexité croissante** :

```
frontend-exemples/
├── 00-READ-ME-FIRST.md              # Ce fichier
├── README.md                         # Documentation complète
│
├── 01-html-vanilla-simple/          # Le plus simple - HTML pur
├── 02-html-vanilla-complet/         # HTML pur avec toutes fonctionnalités
│
├── 03-react-vite-simple/            # React basique
├── 04-react-vite-complet/           # React avec tout
│
├── 05-vuejs-simple/                 # Vue.js basique
├── 06-vuejs-complet/                # Vue.js avec tout
│
├── 07-nextjs-reference/             # Next.js (référence production)
├── 08-angular/                      # Angular
└── 09-blazor-wasm/                  # Blazor WebAssembly
```

---

## Par où commencer ?

### Pour les débutants

**1. Commencez par** : `01-html-vanilla-simple/`
- Le plus simple possible
- HTML + CSS + JavaScript pur
- Aucune installation nécessaire
- Double-clic sur index.html et c'est parti !

**2. Ensuite** : `02-html-vanilla-complet/`
- Toutes les fonctionnalités CRUD
- Comprendre les bases avant d'utiliser un framework

### Pour les intermédiaires

**3. Choisissez** :
- `03-react-vite-simple/` - Si vous voulez apprendre React
- `05-vuejs-simple/` - Si vous voulez quelque chose de plus simple

**4. Puis la version complète** :
- `04-react-vite-complet/`
- `06-vuejs-complet/`

### Pour les avancés

**5. Explorez** :
- `07-nextjs-reference/` - Application production complète (déjà implémentée)
- `08-angular/` - Framework complet
- `09-blazor-wasm/` - Pour les développeurs .NET

---

## Prérequis généraux

### Pour tous les exemples

**1. Backend en cours d'exécution**
```bash
cd XtraWork
dotnet run
```
L'API doit tourner sur : https://localhost:7033

**2. Accepter le certificat SSL**
- Ouvrir https://localhost:7033 dans le navigateur
- Cliquer "Avancé" puis "Continuer"

### Pour les exemples HTML (01, 02)

Aucune installation nécessaire !
- Double-clic sur les fichiers .html
- OU utiliser Live Server dans VS Code

### Pour les exemples avec frameworks (03-09)

**Node.js installé** (version 18 ou supérieure)
```bash
node --version
npm --version
```

Installation : https://nodejs.org/

---

## Démarrage rapide par exemple

### 01-html-vanilla-simple

```bash
# Ouvrir dans le navigateur
start 01-html-vanilla-simple/index.html

# OU avec Live Server dans VS Code
# Clic droit > Open with Live Server
```

### 03-react-vite-simple

```bash
cd 03-react-vite-simple
npm install
npm run dev
```
Ouvrir : http://localhost:5173

### 05-vuejs-simple

```bash
cd 05-vuejs-simple
npm install
npm run dev
```
Ouvrir : http://localhost:5173

### 07-nextjs-reference

```bash
cd 07-nextjs-reference
npm install
npm run dev
```
Ouvrir : http://localhost:3000

---

## Credentials de test

Pour tous les exemples :
- **Username** : admin
- **Password** : Admin123!

---

## Structure de chaque dossier

Chaque exemple contient :

```
XX-nom-exemple/
├── README.md                  # Instructions spécifiques
├── DEMARRAGE-RAPIDE.txt      # Commandes essentielles
├── EXPLICATIONS.md           # Explications pédagogiques
└── [fichiers du projet]
```

---

## Objectifs pédagogiques

### Exemple 01 : HTML Vanilla Simple
**Objectif** : Comprendre les fondamentaux
- Fetch API
- Authentification JWT
- Manipulation du DOM

### Exemple 02 : HTML Vanilla Complet
**Objectif** : Application complète sans framework
- CRUD complet
- Gestion de l'état
- Routing manuel

### Exemple 03-04 : React
**Objectif** : Composants réutilisables
- JSX
- Hooks (useState, useEffect)
- Context API

### Exemple 05-06 : Vue.js
**Objectif** : Framework progressif
- Templates
- Réactivité
- Pinia (state management)

### Exemple 07 : Next.js
**Objectif** : Application production
- SSR/SSG
- Optimisations automatiques
- TypeScript

### Exemple 08 : Angular
**Objectif** : Framework complet
- TypeScript obligatoire
- Structure stricte
- RxJS

### Exemple 09 : Blazor
**Objectif** : Développement en C#
- WebAssembly
- Pas de JavaScript
- Écosystème .NET

---

## Comparaison rapide

| Exemple | Complexité | Installation | Temps démarrage | Idéal pour |
|---------|------------|--------------|-----------------|------------|
| 01 | Très facile | Aucune | 1 min | Apprendre les bases |
| 02 | Facile | Aucune | 1 min | Comprendre CRUD |
| 03 | Moyenne | npm | 5 min | Débuter React |
| 04 | Moyenne | npm | 5 min | React complet |
| 05 | Moyenne | npm | 5 min | Débuter Vue.js |
| 06 | Moyenne | npm | 5 min | Vue.js complet |
| 07 | Élevée | npm | 10 min | Production |
| 08 | Élevée | npm | 15 min | Enterprise |
| 09 | Moyenne | dotnet | 10 min | Dev .NET |

---

## Ordre d'apprentissage recommandé

### Parcours Débutant (8 semaines)
1. Semaines 1-2 : Exemple 01
2. Semaines 3-4 : Exemple 02
3. Semaines 5-6 : Exemple 03 ou 05
4. Semaines 7-8 : Exemple 04 ou 06

### Parcours Intermédiaire (6 semaines)
1. Semaines 1-2 : Exemple 02 (révision rapide)
2. Semaines 3-4 : Exemple 03 ou 05
3. Semaines 5-6 : Exemple 07

### Parcours Avancé (4 semaines)
1. Semaines 1-2 : Exemple 07 (analyse approfondie)
2. Semaines 3-4 : Exemple 08 (comparaison)

---

## Résolution de problèmes

### L'API ne répond pas

**Vérifier** :
```bash
# Est-ce que l'API tourne ?
curl https://localhost:7033/api/titles
```

**Solution** :
```bash
cd XtraWork
dotnet run
```

### Erreur de certificat SSL

**Accepter le certificat** :
1. Ouvrir https://localhost:7033 dans le navigateur
2. Cliquer "Avancé"
3. Cliquer "Continuer vers le site"

### Port déjà utilisé

**React/Vue/Svelte** (port 5173) :
```bash
npm run dev -- --port 5174
```

**Next.js** (port 3000) :
```bash
npm run dev -- -p 3001
```

### npm install échoue

**Solution** :
```bash
# Nettoyer le cache
npm cache clean --force

# Supprimer node_modules
rm -rf node_modules

# Réinstaller
npm install
```

---

## Documentation complète

Pour plus de détails, consultez :

**Dans ce dossier** :
- `README.md` - Documentation complète

**Documentation générale** :
- `../12-OPTIONS-FRONTEND/` - Guide complet de toutes les options
- `../12-OPTIONS-FRONTEND/13-CONNEXION-FRONTEND-BACKEND-GUIDE-PRATIQUE.md` - Guide de connexion détaillé

---

## Support

### En cas de problème

1. Lire le README.md de l'exemple spécifique
2. Consulter `../12-OPTIONS-FRONTEND/`
3. Vérifier que l'API tourne
4. Vérifier le certificat SSL

### Ressources

- Swagger API : https://localhost:7033/swagger
- Documentation : `../12-OPTIONS-FRONTEND/`

---

## Prochaines étapes

Après avoir exploré les exemples :

1. **Choisir votre technologie préférée**
2. **Construire votre propre application**
3. **Ajouter des fonctionnalités** :
   - Recherche et filtres
   - Pagination
   - Upload de fichiers
   - Graphiques et statistiques

4. **Déployer en production**

---

**Bon apprentissage et bon développement !**

---

**Date de création** : 30 octobre 2025
**Version** : 1.0
**Projet** : XtraWork - Exemples Frontend Pédagogiques

