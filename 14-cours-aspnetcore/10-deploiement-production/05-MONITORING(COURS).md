# Module 5 - Monitoring et Logs Production

## Logging avec Serilog

XtraWork utilise Serilog pour les logs structurés.

---

## Configuration production

```csharp
builder.Host.UseSerilog((ctx, cfg) =>
{
    cfg.ReadFrom.Configuration(ctx.Configuration)
       .WriteTo.Console()
       .WriteTo.File("logs/xtrawork-.txt", rollingInterval: RollingInterval.Day)
       .WriteTo.ApplicationInsights(telemetryConfiguration, TelemetryConverter.Traces)
       .Enrich.FromLogContext()
       .Enrich.WithProperty("Environment", ctx.HostingEnvironment.EnvironmentName);
});
```

---

## Application Insights (Azure)

```bash
dotnet add package Microsoft.ApplicationInsights.AspNetCore
```

```csharp
builder.Services.AddApplicationInsightsTelemetry();
```

**Dashboard Azure** : Visualiser les requêtes, erreurs, performance.

---

## Health Checks

```csharp
builder.Services.AddHealthChecks()
    .AddDbContextCheck<XtraWorkContext>("database");

app.MapHealthChecks("/health");
```

**Monitoring** : GET /health retourne l'état de l'API et de la DB.

---

**Prochain** : [06-QUIZ-QUESTIONS(OBLIGATOIRE).md](./06-QUIZ-QUESTIONS(OBLIGATOIRE).md)

