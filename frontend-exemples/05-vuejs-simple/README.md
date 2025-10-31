# 05 - Vue.js 3 Simple

## Description

Introduction à Vue.js 3 - Framework JavaScript progressif pour créer des interfaces utilisateur. Plus simple à apprendre que React.

---

## Technologies

- Vue.js 3
- Vite
- Vue Router
- Axios
- Composition API

---

## Fonctionnalités

- Login avec JWT
- Dashboard
- Liste des employés
- Composants Vue réutilisables
- Réactivité automatique

---

## Installation

```bash
cd frontend-exemples/05-vuejs-simple
npm install
npm run dev
```

URL : http://localhost:5173

---

## Structure

```
05-vuejs-simple/
├── src/
│   ├── components/
│   │   └── Navbar.vue
│   ├── views/
│   │   ├── LoginView.vue
│   │   ├── DashboardView.vue
│   │   └── EmployeesView.vue
│   ├── services/
│   │   ├── api.js
│   │   └── authService.js
│   ├── router/
│   │   └── index.js
│   └── App.vue
├── package.json
└── vite.config.js
```

---

## Concepts Vue.js

**Template** : HTML-like dans <template>
**Script** : JavaScript dans <script setup>
**Style** : CSS dans <style scoped>

**Réactivité** : ref() et reactive()
**Directives** : v-if, v-for, v-model

---

**Credentials** : admin / Admin123!

