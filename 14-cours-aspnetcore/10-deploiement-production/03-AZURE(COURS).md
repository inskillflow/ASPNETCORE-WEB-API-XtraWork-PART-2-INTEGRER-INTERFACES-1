# Module 3 - Déploiement Azure

## Services Azure nécessaires

**Azure App Service** : Héberger l'API
**Azure SQL Database** : Base de données
**Azure Key Vault** : Secrets (JWT Key, connection strings)

---

## Déployer sur App Service

### 1. Créer les ressources

```bash
az group create --name XtraWork-RG --location westeurope
az appservice plan create --name XtraWork-Plan --resource-group XtraWork-RG --sku B1
az webapp create --name xtrawork-api --resource-group XtraWork-RG --plan XtraWork-Plan
```

---

### 2. Configurer les variables

Dans le portail Azure → Configuration → Application settings :

```
ConnectionStrings__XtraWork = Server=...;Database=...
Jwt__Key = votre-cle-secrete-64-caracteres
Jwt__Issuer = XtraWork-Issuer
Jwt__Audience = XtraWork-Audience
```

---

### 3. Déployer

```bash
dotnet publish -c Release
az webapp deployment source config-zip --resource-group XtraWork-RG --name xtrawork-api --src publish.zip
```

---

## Azure SQL Database

```bash
az sql server create --name xtrawork-sql --resource-group XtraWork-RG
az sql db create --server xtrawork-sql --name XtraWork --service-objective S0
```

---

**Prochain** : [04-CI-CD(COURS).md](./04-CI-CD(COURS).md)

