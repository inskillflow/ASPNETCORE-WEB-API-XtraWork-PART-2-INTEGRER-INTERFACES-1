========================================
  APPROCHE CODE FIRST
========================================

IMPORTANT : Ce projet utilise Entity Framework Code First !

Cela signifie :
- Vous N'AVEZ PAS besoin de créer les tables SQL manuellement
- Entity Framework les crée automatiquement à partir du code C#
- La ligne qui fait ça : ctx.Database.EnsureCreated(); (Program.cs ligne 115)


========================================
SOLUTION A L'ERREUR 500
========================================

PROBLEME :
- Vous avez probablement créé les tables manuellement AVANT
- Avec le mauvais type (INT au lieu de UNIQUEIDENTIFIER)
- Entity Framework ne peut pas utiliser ces tables

SOLUTION :
1. Supprimer la base de données
2. Relancer l'API
3. Entity Framework recréera TOUT automatiquement


========================================
COMMANDE RAPIDE
========================================

Ouvrir PowerShell dans le dossier XtraWork :

.\SOLUTION_CODE_FIRST.ps1

OU manuellement :

# 1. Arrêter l'API
Get-Process -Name "dotnet" -ErrorAction SilentlyContinue | Stop-Process -Force

# 2. Supprimer la base
sqlcmd -S LAPTOP-81IAD844 -E -Q "DROP DATABASE IF EXISTS XtraWork;"

# 3. Aller dans le dossier
cd C:\Users\rehou\Downloads\2-SuiviEtudiantsEtape2\SuiviEtudiantsEtape2\XtraWork

# 4. Relancer l'API (créera automatiquement la base)
dotnet run


========================================
VERIFICATION
========================================

1. Attendre que l'API démarre :
   Now listening on: https://localhost:7033

2. Ouvrir Swagger :
   https://localhost:7033/swagger/index.html

3. Tester POST /api/auth/register

Résultat attendu : Code 200 avec un token


========================================
COMMENT CA MARCHE ?
========================================

Au démarrage, l'API :

1. Lit les entités C# (User, Title, Employee)
2. Vérifie si la base "XtraWork" existe
3. Si NON : Crée la base ET les tables automatiquement
4. Si OUI : Utilise la base existante

Types générés automatiquement :
- Guid Id -> UNIQUEIDENTIFIER (SQL)
- string -> NVARCHAR
- DateTime -> DATETIME2
- etc.


========================================
NE JAMAIS FAIRE
========================================

X  Créer les tables manuellement en SQL
X  Modifier la structure des tables en SQL directement

TOUJOURS :
✓  Modifier les entités C# (User.cs, Title.cs, Employee.cs)
✓  Relancer l'API
✓  Entity Framework met à jour automatiquement


========================================
FIN
========================================
