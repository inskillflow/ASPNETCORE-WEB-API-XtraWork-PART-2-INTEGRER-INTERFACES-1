# Module 4 - CI/CD avec GitHub Actions

## Pipeline de déploiement automatique

Créer `.github/workflows/deploy.yml` :

```yaml
name: Deploy to Azure

on:
  push:
    branches: [ main ]

jobs:
  build-and-deploy:
    runs-on: ubuntu-latest
    
    steps:
    - uses: actions/checkout@v3
    
    - name: Setup .NET
      uses: actions/setup-dotnet@v3
      with:
        dotnet-version: '8.0.x'
    
    - name: Restore
      run: dotnet restore
    
    - name: Build
      run: dotnet build --configuration Release --no-restore
    
    - name: Test
      run: dotnet test --no-build --verbosity normal
    
    - name: Publish
      run: dotnet publish -c Release -o ./publish
    
    - name: Deploy to Azure
      uses: azure/webapps-deploy@v2
      with:
        app-name: 'xtrawork-api'
        publish-profile: ${{ secrets.AZURE_PUBLISH_PROFILE }}
        package: ./publish
```

---

## Secrets GitHub

Dans Settings → Secrets :
- `AZURE_PUBLISH_PROFILE`
- `JWT_SECRET_KEY`

---

**Prochain** : [05-MONITORING(COURS).md](./05-MONITORING(COURS).md)

