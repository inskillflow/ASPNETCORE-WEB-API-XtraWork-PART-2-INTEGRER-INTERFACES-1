# Module 1 - Configuration Production

## appsettings par environnement

### appsettings.json (base)

```json
{
  "ConnectionStrings": {
    "XtraWork": "Server=.;Database=XtraWork;..."
  }
}
```

---

### appsettings.Production.json

```json
{
  "ConnectionStrings": {
    "XtraWork": "Server=prod-server;Database=XtraWork;User=sa;Password=..."
  },
  "Jwt": {
    "Key": "#{JWT_SECRET_KEY}#"
  }
}
```

**Variables d'environnement** : Remplacer les secrets

---

## Variables d'environnement

```bash
export JWT_SECRET_KEY="votre-cle-secrete"
export ConnectionStrings__XtraWork="Server=..."
```

---

## Azure Key Vault

```csharp
builder.Configuration.AddAzureKeyVault(
    new Uri("https://votre-keyvault.vault.azure.net/"),
    new DefaultAzureCredential()
);
```

Stockage sécurisé des secrets en production.

---

**Prochain** : Quiz

