# Module 2 - Docker et Containerisation

## Dockerfile pour XtraWork

```dockerfile
FROM mcr.microsoft.com/dotnet/aspnet:8.0 AS base
WORKDIR /app
EXPOSE 80
EXPOSE 443

FROM mcr.microsoft.com/dotnet/sdk:8.0 AS build
WORKDIR /src
COPY ["XtraWork.csproj", "./"]
RUN dotnet restore
COPY . .
RUN dotnet build -c Release -o /app/build

FROM build AS publish
RUN dotnet publish -c Release -o /app/publish

FROM base AS final
WORKDIR /app
COPY --from=publish /app/publish .
ENTRYPOINT ["dotnet", "XtraWork.dll"]
```

---

## Construire l'image

```bash
docker build -t xtrawork-api .
```

---

## Lancer le container

```bash
docker run -p 8080:80 -e ConnectionStrings__XtraWork="Server=..." xtrawork-api
```

---

## docker-compose.yml

```yaml
version: '3.8'
services:
  api:
    build: .
    ports:
      - "8080:80"
    environment:
      - ConnectionStrings__XtraWork=Server=db;Database=XtraWork;...
    depends_on:
      - db
  
  db:
    image: mcr.microsoft.com/mssql/server:2022-latest
    environment:
      - ACCEPT_EULA=Y
      - SA_PASSWORD=YourStrong@Password
```

---

**Prochain** : [03-AZURE(COURS).md](./03-AZURE(COURS).md)

