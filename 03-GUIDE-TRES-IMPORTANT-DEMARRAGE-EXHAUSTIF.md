# GUIDE DE DÉMARRAGE EXHAUSTIF - XTRAWORK

Guide ultra détaillé étape par étape pour démarrer l'application XtraWork (Backend ASP.NET Core + Frontend Next.js)

---

## TABLE DES MATIÈRES

1. [Prérequis et Vérifications](#1-prérequis-et-vérifications)
2. [Configuration de l'Environnement](#2-configuration-de-lenvironnement)
3. [Démarrage du Backend](#3-démarrage-du-backend)
4. [Installation du Frontend](#4-installation-du-frontend)
5. [Démarrage du Frontend](#5-démarrage-du-frontend)
6. [Première Connexion](#6-première-connexion)
7. [Vérification du Fonctionnement](#7-vérification-du-fonctionnement)
8. [Résolution des Problèmes](#8-résolution-des-problèmes)

---

## 1. PRÉREQUIS ET VÉRIFICATIONS

### ÉTAPE 1.1 : Vérifier .NET SDK

**Action** : Ouvrir PowerShell et exécuter :
```powershell
dotnet --version
```

**Résultat attendu** : 
```
8.0.xxx
```

**Si erreur** : 
- Télécharger .NET 8.0 SDK depuis : https://dotnet.microsoft.com/download/dotnet/8.0
- Installer et redémarrer PowerShell
- Re-vérifier la version

---

### ÉTAPE 1.2 : Vérifier Node.js

**Action** : Dans PowerShell, exécuter :
```powershell
node --version
```

**Résultat attendu** : 
```
v18.x.x ou v20.x.x
```

**Action** : Vérifier npm :
```powershell
npm --version
```

**Résultat attendu** :
```
9.x.x ou 10.x.x
```

**Si erreur** :
- Télécharger Node.js LTS depuis : https://nodejs.org/
- Installer la version LTS (Long Term Support)
- Redémarrer PowerShell
- Re-vérifier les versions

---

### ÉTAPE 1.3 : Vérifier SQL Server

**Action** : Dans PowerShell, exécuter :
```powershell
sqlcmd -S localhost -E -Q "SELECT @@VERSION"
```

**Résultat attendu** : Affichage de la version SQL Server

**Si erreur** :
- Vérifier que SQL Server est installé
- Vérifier que le service SQL Server est démarré
- Ouvrir "Services Windows" (services.msc)
- Trouver "SQL Server (MSSQLSERVER)" ou "SQL Server (SQLEXPRESS)"
- Démarrer le service si arrêté

---

### ÉTAPE 1.4 : Vérifier l'emplacement du projet

**Action** : Dans PowerShell, naviguer vers le projet :
```powershell
cd C:\Users\rehou\Downloads\2-SuiviEtudiantsEtape3\SuiviEtudiantsEtape2
```

**Action** : Lister les dossiers :
```powershell
dir
```

**Résultat attendu** : Voir les dossiers suivants :
- XtraWork
- frontend
- packages
- html

---

## 2. CONFIGURATION DE L'ENVIRONNEMENT

### ÉTAPE 2.1 : Vérifier la configuration Backend

**Action** : Ouvrir le fichier de configuration :
```powershell
notepad XtraWork\appsettings.json
```

**Vérification** : Le fichier doit contenir :
```json
{
  "ConnectionStrings": {
    "XtraWork": "Server=LAPTOP-81IAD844;Database=XtraWork;Trusted_Connection=True;Encrypt=True;TrustServerCertificate=True"
  },
  "Jwt": {
    "Issuer": "XtraWork-Issuer",
    "Audience": "XtraWork-Audience",
    "Key": "7e6da5d9e5514ce288683845e6068df782a23f6c15fb43cd92e19b4147d8ce95"
  }
}
```

**Important** : Noter le nom du serveur dans ConnectionStrings

**Si votre serveur SQL est différent** :
1. Remplacer "LAPTOP-81IAD844" par votre nom de serveur
2. Pour le trouver, exécuter :
```powershell
sqlcmd -L
```
3. Ou utiliser simplement "." pour le serveur local :
```json
"XtraWork": "Server=.;Database=XtraWork;Trusted_Connection=True;Encrypt=True;TrustServerCertificate=True"
```

**Action** : Sauvegarder et fermer le fichier

---

### ÉTAPE 2.2 : Vérifier la configuration Frontend

**Action** : Vérifier que le fichier existe :
```powershell
Test-Path frontend\.env.local
```

**Résultat attendu** : True

**Si False (fichier n'existe pas)** :
```powershell
@"
NEXT_PUBLIC_API_URL=https://localhost:7033/api
NODE_TLS_REJECT_UNAUTHORIZED=0
"@ | Out-File -FilePath frontend\.env.local -Encoding utf8
```

**Action** : Vérifier le contenu :
```powershell
Get-Content frontend\.env.local
```

**Résultat attendu** :
```
NEXT_PUBLIC_API_URL=https://localhost:7033/api
NODE_TLS_REJECT_UNAUTHORIZED=0
```

---

## 3. DÉMARRAGE DU BACKEND

### ÉTAPE 3.1 : Naviguer vers le dossier Backend

**Action** : Dans PowerShell (Terminal 1) :
```powershell
cd XtraWork
```

**Vérification** : Afficher le chemin actuel :
```powershell
pwd
```

**Résultat attendu** : 
```
Path
----
C:\Users\rehou\Downloads\2-SuiviEtudiantsEtape3\SuiviEtudiantsEtape2\XtraWork
```

---

### ÉTAPE 3.2 : Restaurer les packages NuGet

**Action** : Exécuter :
```powershell
dotnet restore
```

**Durée** : 10-30 secondes

**Résultat attendu** : Message indiquant que la restauration est terminée

**Logs attendus** :
```
  Determining projects to restore...
  Restored C:\...\XtraWork.csproj (in XXX ms).
```

**Si erreur** :
- Vérifier la connexion Internet
- Vérifier que le fichier XtraWork.csproj existe
- Essayer de nettoyer et re-restaurer :
```powershell
dotnet clean
dotnet restore
```

---

### ÉTAPE 3.3 : Créer ou mettre à jour la base de données

**Action** : Exécuter :
```powershell
dotnet ef database update
```

**Note** : Si la commande n'est pas reconnue, installer l'outil :
```powershell
dotnet tool install --global dotnet-ef
```

**Résultat attendu** : 
```
Build started...
Build succeeded.
Done.
```

**Alternative si dotnet-ef n'est pas disponible** :
Le code utilise `EnsureCreated()` donc la base sera créée automatiquement au premier démarrage.

---

### ÉTAPE 3.4 : Démarrer le Backend

**Action** : Exécuter :
```powershell
dotnet run
```

**Durée de démarrage** : 5-15 secondes

**Résultat attendu** : Voir des logs similaires à :
```
info: Microsoft.Hosting.Lifetime[14]
      Now listening on: https://localhost:7033
info: Microsoft.Hosting.Lifetime[14]
      Now listening on: http://localhost:5281
info: Microsoft.Hosting.Lifetime[0]
      Application started. Press Ctrl+C to shut down.
```

**Indicateurs de succès** :
- Aucun message d'erreur rouge
- Message "Now listening on: https://localhost:7033"
- Message "Application started"

**NE PAS FERMER CE TERMINAL** - Le backend doit rester en cours d'exécution

---

### ÉTAPE 3.5 : Vérifier que le Backend fonctionne

**Action** : Ouvrir un NOUVEAU terminal PowerShell (Terminal 2) et exécuter :
```powershell
curl -k https://localhost:7033/health
```

**Résultat attendu** :
```
Healthy
```

**Action** : Vérifier Swagger :
```powershell
start https://localhost:7033/swagger
```

**Résultat attendu** : 
- Le navigateur s'ouvre
- Page Swagger UI affichée
- Liste des endpoints visible

**Si le navigateur affiche une erreur de certificat** :
- Cliquer sur "Avancé"
- Cliquer sur "Continuer vers le site"

---

## 4. INSTALLATION DU FRONTEND

### ÉTAPE 4.1 : Ouvrir un nouveau terminal pour le Frontend

**Action** : 
- Ouvrir un NOUVEAU terminal PowerShell (Terminal 3)
- Ou utiliser le Terminal 2 si vous avez fermé la vérification

**Action** : Naviguer vers le dossier du projet :
```powershell
cd C:\Users\rehou\Downloads\2-SuiviEtudiantsEtape3\SuiviEtudiantsEtape2
```

---

### ÉTAPE 4.2 : Naviguer vers le dossier Frontend

**Action** : Exécuter :
```powershell
cd frontend
```

**Vérification** : Afficher le chemin :
```powershell
pwd
```

**Résultat attendu** :
```
Path
----
C:\Users\rehou\Downloads\2-SuiviEtudiantsEtape3\SuiviEtudiantsEtape2\frontend
```

---

### ÉTAPE 4.3 : Vérifier que package.json existe

**Action** : Exécuter :
```powershell
Test-Path package.json
```

**Résultat attendu** : True

**Action** : Afficher le contenu :
```powershell
Get-Content package.json
```

**Vérification** : Le fichier doit contenir :
- "name": "xtrawork-frontend"
- "next": "^14.2.0"
- "react": "^18.3.0"

---

### ÉTAPE 4.4 : Installer les dépendances npm

**Action** : Exécuter :
```powershell
npm install
```

**Durée** : 1-5 minutes (selon la connexion Internet)

**Progression** : Vous verrez :
```
npm WARN deprecated ...
added XXX packages in XXs
```

**Logs attendus** :
- Messages de téléchargement des packages
- Aucune erreur critique (WARN est acceptable)
- Message final "added XXX packages"

**Si erreur "cannot find module"** :
1. Supprimer node_modules si existe :
```powershell
if (Test-Path node_modules) { Remove-Item -Recurse -Force node_modules }
```
2. Supprimer package-lock.json si existe :
```powershell
if (Test-Path package-lock.json) { Remove-Item -Force package-lock.json }
```
3. Réinstaller :
```powershell
npm install
```

**Si erreur de version Node** :
- Vérifier que Node.js version 18+ est installé
- Mettre à jour Node.js si nécessaire

---

### ÉTAPE 4.5 : Vérifier l'installation

**Action** : Vérifier que node_modules existe :
```powershell
Test-Path node_modules
```

**Résultat attendu** : True

**Action** : Compter les packages installés :
```powershell
(Get-ChildItem node_modules -Directory).Count
```

**Résultat attendu** : Un nombre supérieur à 200

---

## 5. DÉMARRAGE DU FRONTEND

### ÉTAPE 5.1 : Vérifier que vous êtes dans le dossier frontend

**Action** : Exécuter :
```powershell
pwd
```

**Résultat attendu** : Le chemin doit finir par "\frontend"

---

### ÉTAPE 5.2 : Démarrer le serveur de développement Next.js

**Action** : Exécuter :
```powershell
npm run dev
```

**Durée de démarrage** : 5-20 secondes

**Progression** :
```
> xtrawork-frontend@1.0.0 dev
> next dev

   ▲ Next.js 14.x.x
   - Local:        http://localhost:3000

 ✓ Ready in XXXms
```

**Indicateurs de succès** :
- Message "Ready in XXXms"
- Aucun message d'erreur rouge
- Message indiquant "Local: http://localhost:3000"

**NE PAS FERMER CE TERMINAL** - Le frontend doit rester en cours d'exécution

---

### ÉTAPE 5.3 : Vérifier que le Frontend est accessible

**Action** : Dans un NOUVEAU terminal PowerShell (Terminal 4) :
```powershell
curl http://localhost:3000
```

**Résultat attendu** : Code HTML retourné (beaucoup de texte)

**Ou** : Ouvrir directement dans le navigateur :
```powershell
start http://localhost:3000
```

**Résultat attendu** : 
- Le navigateur s'ouvre
- Page d'accueil XtraWork affichée
- Deux boutons visibles : "Se connecter" et "Créer un compte"

---

## 6. PREMIÈRE CONNEXION

### ÉTAPE 6.1 : Ouvrir l'application dans le navigateur

**Action** : Si pas déjà ouvert, exécuter :
```powershell
start http://localhost:3000
```

**Page affichée** :
- Titre : "XtraWork"
- Sous-titre : "Système de gestion des employés"
- Bouton bleu : "Se connecter"
- Bouton gris : "Créer un compte"
- Section "Rôles disponibles" en bas

---

### ÉTAPE 6.2 : Naviguer vers la page de connexion

**Action** : Cliquer sur le bouton "Se connecter"

**Résultat** : Redirection vers http://localhost:3000/auth/login

**Page affichée** :
- Titre : "Connexion"
- Sous-titre : "Connectez-vous à votre compte XtraWork"
- Champ : "Nom d'utilisateur"
- Champ : "Mot de passe"
- Bouton bleu : "Se connecter"
- Lien : "Créer un compte"
- Encadré bleu avec compte de test

---

### ÉTAPE 6.3 : Saisir les identifiants de test

**Action** : Dans le champ "Nom d'utilisateur", saisir :
```
admin
```

**Action** : Dans le champ "Mot de passe", saisir :
```
Admin123!
```

**Important** : 
- Respecter la casse (majuscules et minuscules)
- Le mot de passe contient : A majuscule, dmin, 123, point d'exclamation

---

### ÉTAPE 6.4 : Se connecter

**Action** : Cliquer sur le bouton "Se connecter"

**Progression** :
1. Le bouton affiche "Connexion..."
2. Requête envoyée au backend
3. Redirection automatique

**Résultat attendu** : 
- Redirection vers http://localhost:3000/dashboard
- Page dashboard affichée

**Si erreur affichée** : Voir section 8 "Résolution des Problèmes"

---

### ÉTAPE 6.5 : Vérifier le Dashboard

**Page Dashboard attendue** :

**En-tête** :
- Titre : "Dashboard XtraWork"
- Message : "Bienvenue, [Prénom] [Nom]"
- Badge coloré avec le rôle (Admin/Manager/User)
- Bouton rouge : "Déconnexion"

**Carte utilisateur (bleue)** :
- Initiales dans un cercle blanc
- Nom complet
- Email
- Username et rôle

**Menu (3 cartes)** :
- Carte 1 : "Employés" avec icône
- Carte 2 : "Titres" avec icône  
- Carte 3 : "Profil" avec icône

**Statistiques (3 cartes blanches)** :
- Total Employés
- Total Titres
- Votre Rôle

**Section info bleue** :
- Guide d'utilisation

---

## 7. VÉRIFICATION DU FONCTIONNEMENT

### ÉTAPE 7.1 : Tester la navigation vers Employés

**Action** : Sur le dashboard, cliquer sur la carte "Employés"

**Résultat attendu** :
- Redirection vers http://localhost:3000/dashboard/employees
- Page "Gestion des Employés" affichée
- En-tête avec boutons "Retour" et "+ Nouvel Employé"
- Tableau des employés (peut être vide)

**Si tableau vide** : C'est normal si aucun employé n'a été créé

---

### ÉTAPE 7.2 : Vérifier la console développeur

**Action** : Appuyer sur F12 pour ouvrir les DevTools

**Onglet Console** :
- Vérifier qu'il n'y a pas d'erreurs rouges
- Les warnings (jaunes) sont acceptables

**Onglet Network** :
- Cliquer sur l'onglet "Network" ou "Réseau"
- Rafraîchir la page (F5)
- Vérifier les requêtes :
  - GET http://localhost:3000/... (200 OK)
  - GET https://localhost:7033/api/employees (200 OK)

**Si erreurs 401 Unauthorized** :
- Le token a expiré
- Se déconnecter et se reconnecter

**Si erreurs CORS** :
- Vérifier que le backend est en cours d'exécution
- Voir section 8.4

---

### ÉTAPE 7.3 : Tester les autres pages

**Action** : Cliquer sur "Retour" pour revenir au dashboard

**Action** : Cliquer sur "Titres"

**Note** : La page peut ne pas encore exister, c'est normal

**Action** : Revenir au dashboard

---

### ÉTAPE 7.4 : Tester la déconnexion

**Action** : Cliquer sur le bouton "Déconnexion" (rouge, en haut à droite)

**Résultat attendu** :
- Redirection vers http://localhost:3000/
- Page d'accueil affichée
- Vous n'êtes plus connecté

---

### ÉTAPE 7.5 : Tester la reconnexion

**Action** : Cliquer sur "Se connecter"

**Action** : Se connecter avec les mêmes identifiants :
- Username : admin
- Password : Admin123!

**Résultat attendu** :
- Connexion réussie
- Redirection vers le dashboard

---

## 8. RÉSOLUTION DES PROBLÈMES

### PROBLÈME 8.1 : Backend ne démarre pas

**Symptôme** : Erreurs lors de `dotnet run`

**Solution A** : Vérifier la connexion à la base de données
```powershell
# Tester la connexion SQL Server
sqlcmd -S localhost -E -Q "SELECT 1"
```

**Solution B** : Nettoyer et rebuilder
```powershell
dotnet clean
dotnet restore
dotnet build
dotnet run
```

**Solution C** : Vérifier le port 7033
```powershell
# Vérifier si le port est déjà utilisé
netstat -ano | findstr :7033
```

Si un processus utilise le port :
```powershell
# Trouver le PID et le tuer
Stop-Process -Id [PID] -Force
```

---

### PROBLÈME 8.2 : Frontend ne démarre pas

**Symptôme** : Erreurs lors de `npm run dev`

**Solution A** : Réinstaller les dépendances
```powershell
Remove-Item -Recurse -Force node_modules
Remove-Item -Force package-lock.json
npm install
```

**Solution B** : Vérifier la version de Node.js
```powershell
node --version
# Doit être 18.x ou 20.x
```

**Solution C** : Nettoyer le cache Next.js
```powershell
if (Test-Path .next) { Remove-Item -Recurse -Force .next }
npm run dev
```

**Solution D** : Vérifier le port 3000
```powershell
netstat -ano | findstr :3000
```

Si occupé, utiliser un autre port :
```powershell
npm run dev -- -p 3001
```

---

### PROBLÈME 8.3 : Erreur de connexion (Login)

**Symptôme** : Message d'erreur après avoir cliqué sur "Se connecter"

**Vérification 1** : Backend en cours d'exécution ?
```powershell
curl -k https://localhost:7033/health
```

Résultat attendu : "Healthy"

**Vérification 2** : Identifiants corrects ?
- Username : admin (minuscules)
- Password : Admin123! (avec majuscule A, et ! à la fin)

**Vérification 3** : Consulter les logs backend
- Regarder le terminal où le backend tourne
- Chercher des erreurs rouges

**Vérification 4** : Vérifier la console navigateur (F12)
- Onglet Console : chercher les erreurs
- Onglet Network : vérifier la requête POST /api/auth/login

---

### PROBLÈME 8.4 : Erreur CORS

**Symptôme** : Dans la console navigateur (F12), erreur contenant "CORS"

**Message typique** :
```
Access to fetch at 'https://localhost:7033/api/...' from origin 'http://localhost:3000' 
has been blocked by CORS policy
```

**Solution** : Vérifier la configuration CORS dans Program.cs

**Action** : Ouvrir XtraWork/Program.cs et chercher :
```csharp
app.UseCors("NextJsPolicy");
```

**Important** : Cette ligne doit être AVANT :
```csharp
app.UseAuthentication();
app.UseAuthorization();
```

**Si la configuration est correcte** :
1. Arrêter le backend (Ctrl+C)
2. Redémarrer :
```powershell
dotnet run
```

---

### PROBLÈME 8.5 : Token expiré / Redirection en boucle

**Symptôme** : Redirection constante vers /auth/login après connexion

**Solution** : Nettoyer le localStorage

**Action** : Dans la console navigateur (F12) :
```javascript
localStorage.clear()
```

**Action** : Rafraîchir la page (F5)

**Action** : Se reconnecter

---

### PROBLÈME 8.6 : Page blanche après connexion

**Symptôme** : Écran blanc ou erreur JavaScript

**Vérification 1** : Console navigateur (F12)
- Lire le message d'erreur complet
- Noter le nom du fichier et la ligne

**Vérification 2** : Nettoyer et redémarrer
```powershell
# Dans le terminal frontend
# Arrêter avec Ctrl+C
Remove-Item -Recurse -Force .next
npm run dev
```

---

### PROBLÈME 8.7 : Erreur "Cannot connect to database"

**Symptôme** : Backend affiche une erreur de connexion à la base de données

**Solution A** : Vérifier SQL Server
```powershell
# Vérifier que SQL Server est démarré
Get-Service | Where-Object {$_.Name -like "*SQL*"}
```

**Solution B** : Modifier la chaîne de connexion

**Action** : Ouvrir XtraWork/appsettings.json

**Action** : Remplacer le nom du serveur :
```json
{
  "ConnectionStrings": {
    "XtraWork": "Server=.;Database=XtraWork;Trusted_Connection=True;Encrypt=True;TrustServerCertificate=True"
  }
}
```

"Server=." signifie le serveur local par défaut

**Solution C** : Créer manuellement la base de données
```powershell
sqlcmd -S localhost -E -Q "CREATE DATABASE XtraWork"
```

---

### PROBLÈME 8.8 : Certificat SSL invalide

**Symptôme** : Avertissement certificat dans le navigateur

**Pour le Backend (Swagger)** :
- Cliquer sur "Avancé"
- Cliquer sur "Continuer vers le site non sécurisé"

**Pour le Frontend** :
- C'est normal en développement
- Le fichier .env.local contient `NODE_TLS_REJECT_UNAUTHORIZED=0`

---

## 9. RÉCAPITULATIF DES TERMINAUX

Après démarrage complet, vous devez avoir :

**Terminal 1 (Backend)** :
```
C:\...\XtraWork> dotnet run
Now listening on: https://localhost:7033
Application started.
```

**Terminal 2 (Frontend)** :
```
C:\...\frontend> npm run dev
Ready in XXXms
Local: http://localhost:3000
```

**Ne pas fermer ces terminaux pendant l'utilisation**

---

## 10. COMMANDES DE VÉRIFICATION RAPIDE

### Vérifier que tout fonctionne

**Terminal 3** :
```powershell
# Vérifier Backend
curl -k https://localhost:7033/health

# Vérifier Frontend
curl http://localhost:3000

# Ouvrir dans le navigateur
start http://localhost:3000
```

**Résultats attendus** :
- Backend : "Healthy"
- Frontend : Code HTML
- Navigateur : Page XtraWork affichée

---

## 11. ARRÊT DE L'APPLICATION

### Pour arrêter proprement

**Action** : Dans chaque terminal (Backend et Frontend) :
1. Appuyer sur Ctrl+C
2. Confirmer l'arrêt si demandé
3. Attendre la fin du processus
4. Fermer le terminal

**Ou** : Simplement fermer les fenêtres de terminal

---

## 12. REDÉMARRAGE RAPIDE

Si vous avez déjà tout installé et configuré :

**Terminal 1 (Backend)** :
```powershell
cd C:\Users\rehou\Downloads\2-SuiviEtudiantsEtape3\SuiviEtudiantsEtape2\XtraWork
dotnet run
```

**Terminal 2 (Frontend)** :
```powershell
cd C:\Users\rehou\Downloads\2-SuiviEtudiantsEtape3\SuiviEtudiantsEtape2\frontend
npm run dev
```

**Navigateur** :
```
http://localhost:3000
```

Durée totale : 30 secondes à 1 minute

---

## 13. VÉRIFICATIONS POST-DÉMARRAGE

### Checklist complète

- [ ] Backend affiche "Now listening on: https://localhost:7033"
- [ ] Backend affiche "Application started"
- [ ] Frontend affiche "Ready in XXXms"
- [ ] Frontend affiche "Local: http://localhost:3000"
- [ ] curl -k https://localhost:7033/health retourne "Healthy"
- [ ] Page http://localhost:3000 s'affiche dans le navigateur
- [ ] Connexion avec admin/Admin123! fonctionne
- [ ] Redirection vers dashboard après connexion
- [ ] Page employés accessible depuis le dashboard
- [ ] Aucune erreur rouge dans la console navigateur (F12)
- [ ] Aucune erreur CORS dans la console navigateur

Si tous les points sont validés : L'application fonctionne correctement.

---

## 14. PROCHAINES ÉTAPES

Maintenant que l'application fonctionne :

1. Explorer le dashboard
2. Naviguer vers la page Employés
3. Explorer le code dans l'éditeur
4. Lire la documentation dans les autres fichiers .md
5. Commencer à développer les fonctionnalités manquantes

---

## 15. CONTACT ET SUPPORT

Si vous rencontrez un problème non couvert ici :

1. Vérifier les logs dans les terminaux (Backend et Frontend)
2. Vérifier la console navigateur (F12)
3. Consulter les autres fichiers de documentation
4. Vérifier que toutes les étapes ont été suivies exactement

---

FIN DU GUIDE DE DÉMARRAGE EXHAUSTIF

