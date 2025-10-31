# Introduction - CORS et Securite

## Qu'est-ce que CORS ?

CORS (Cross-Origin Resource Sharing) permet a un frontend sur un domaine d'appeler une API sur un autre domaine.

---

## Same-Origin Policy

Par defaut, les navigateurs bloquent les requetes entre origines differentes.

**Meme origine** :
- https://app.com:443 → https://app.com:443/api ✓

**Origines differentes** :
- http://localhost:3000 → https://localhost:7033/api ✗ (ports differents)
- https://app.com → https://api.app.com ✗ (sous-domaines)

---

## CORS dans XtraWork

Le frontend (localhost:3000) appelle le backend (localhost:7033).

**Sans CORS** : Erreur dans la console navigateur.

**Avec CORS** : Configuration dans Program.cs pour autoriser.

```csharp
builder.Services.AddCors(options =>
{
    options.AddPolicy("NextJsPolicy", policy =>
    {
        policy.WithOrigins("http://localhost:3000")
              .AllowAnyHeader()
              .AllowAnyMethod()
              .AllowCredentials();
    });
});

app.UseCors("NextJsPolicy");
```

**Ordre crucial** : UseCors AVANT UseAuthentication

---

**Prochain** : Quiz et exercices

