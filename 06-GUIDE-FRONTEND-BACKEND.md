# 🔗 Guide de Liaison Frontend Next.js ↔️ Backend ASP.NET Core

Guide complet pour comprendre et maintenir la liaison entre votre frontend Next.js et votre backend XtraWork ASP.NET Core.

---

## 📋 Table des matières

- [Vue d'ensemble](#-vue-densemble)
- [Configuration](#-configuration)
- [Communication API](#-communication-api)
- [Authentification JWT](#-authentification-jwt)
- [Gestion des erreurs](#-gestion-des-erreurs)
- [Best Practices](#-best-practices)

---

## 🌐 Vue d'ensemble

### Architecture

```
┌─────────────────────────────────────────────────────────┐
│                  FRONTEND (Next.js)                     │
│                  http://localhost:3000                  │
├─────────────────────────────────────────────────────────┤
│  • React Components (UI)                                │
│  • Zustand Store (State Management)                     │
│  • Services (API Calls)                                 │
│  • Axios Client (HTTP)                                  │
└────────────────────┬────────────────────────────────────┘
                     │
                     │ HTTP/HTTPS + JWT Token
                     │
┌────────────────────▼────────────────────────────────────┐
│               BACKEND (ASP.NET Core)                    │
│              https://localhost:7033/api                 │
├─────────────────────────────────────────────────────────┤
│  • Controllers (Endpoints)                              │
│  • Services (Business Logic)                            │
│  • Repositories (Data Access)                           │
│  • Entity Framework (ORM)                               │
│  • SQL Server (Database)                                │
└─────────────────────────────────────────────────────────┘
```

---

## ⚙️ Configuration

### 1. Configuration Backend (CORS)

**Fichier :** `XtraWork/Program.cs`

```csharp
// Configuration CORS pour accepter les requêtes du frontend
builder.Services.AddCors(options =>
{
    options.AddPolicy("NextJsPolicy", policy =>
    {
        policy.WithOrigins(
            "http://localhost:3000",  // Frontend en développement
            "https://localhost:3000"
        )
        .AllowAnyHeader()             // Accepter tous les headers
        .AllowAnyMethod()             // GET, POST, PUT, DELETE, etc.
        .AllowCredentials();          // Autoriser les credentials (JWT)
    });
});

// Activer CORS dans le pipeline (AVANT l'authentification)
app.UseCors("NextJsPolicy");
app.UseAuthentication();
app.UseAuthorization();
```

✅ **Déjà configuré dans votre backend !**

### 2. Configuration Frontend

**Fichier :** `frontend/.env.local`

```env
# URL de base de l'API backend
NEXT_PUBLIC_API_URL=https://localhost:7033/api

# Désactiver la vérification SSL en développement
NODE_TLS_REJECT_UNAUTHORIZED=0
```

**Fichier :** `frontend/src/lib/api-client.ts`

```typescript
const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL || 'https://localhost:7033/api';

const apiClient = axios.create({
  baseURL: API_BASE_URL,
  headers: {
    'Content-Type': 'application/json',
  },
  timeout: 10000,
});
```

---

## 🔌 Communication API

### Flow de Requête

```
┌──────────────┐
│  Component   │  1. Appel fonction service
└──────┬───────┘
       │
       ▼
┌──────────────┐
│   Service    │  2. Appel helper (get/post/put/del)
└──────┬───────┘
       │
       ▼
┌──────────────┐
│  api-client  │  3. Requête Axios avec token JWT
└──────┬───────┘
       │
       ▼
┌──────────────┐
│  Controller  │  4. Réception + validation
└──────┬───────┘
       │
       ▼
┌──────────────┐
│   Service    │  5. Logique métier
└──────┬───────┘
       │
       ▼
┌──────────────┐
│  Repository  │  6. Accès base de données
└──────┬───────┘
       │
       ▼
     Response
```

### Exemple Complet : Récupérer les employés

#### 1. Frontend - Composant

```tsx
// frontend/src/app/dashboard/employees/page.tsx
import { employeeService } from '@/services';

const [employees, setEmployees] = useState([]);

useEffect(() => {
  const loadEmployees = async () => {
    const data = await employeeService.getAll();
    setEmployees(data);
  };
  loadEmployees();
}, []);
```

#### 2. Frontend - Service

```typescript
// frontend/src/services/employee.service.ts
import { get } from '@/lib/api-client';

export const employeeService = {
  async getAll(): Promise<EmployeeResponse[]> {
    return await get<EmployeeResponse[]>('/employees');
  },
};
```

#### 3. Frontend - API Client

```typescript
// frontend/src/lib/api-client.ts
export async function get<T>(url: string): Promise<T> {
  const response = await apiClient.get<T>(url);
  return response.data;
}

// Intercepteur pour ajouter le token JWT
apiClient.interceptors.request.use((config) => {
  const token = localStorage.getItem('token');
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});
```

#### 4. Backend - Controller

```csharp
// XtraWork/Controllers/EmployeeController.cs
[HttpGet]
[Authorize]
public async Task<ActionResult<List<EmployeeResponse>>> GetAll()
{
    var response = await _employeeService.GetAll();
    return Ok(response);
}
```

#### 5. Backend - Service

```csharp
// XtraWork/Services/EmployeeService.cs
public async Task<List<EmployeeResponse>> GetAll()
{
    var employees = await _employeeRepository.GetAll();
    return employees.Select(MapToResponse).ToList();
}
```

#### 6. Backend - Repository

```csharp
// XtraWork/Repositories/EmployeeRepository.cs
public async Task<List<Employee>> GetAll()
{
    return await _context.Employees
        .Include(e => e.Title)
        .ToListAsync();
}
```

---

## 🔐 Authentification JWT

### Flow d'Authentification Complet

```
┌──────────────────────────────────────────────────────┐
│ 1. LOGIN                                             │
│                                                      │
│  Frontend                          Backend          │
│  ────────                          ───────          │
│                                                      │
│  POST /auth/login        ────►     AuthController   │
│  {                                      │            │
│    username: "admin",                   ▼            │
│    password: "Admin123!"           AuthService      │
│  }                                      │            │
│                                         ▼            │
│                            Vérification mot de passe│
│                            Génération JWT Token     │
│                                         │            │
│                           ◄─────     Return Token   │
│  {                                                   │
│    token: "eyJhbG...",                               │
│    userId: "...",                                    │
│    role: "Admin",                                    │
│    ...                                               │
│  }                                                   │
│                                                      │
│  Stockage localStorage:                             │
│  - token                                             │
│  - user info                                         │
│                                                      │
└──────────────────────────────────────────────────────┘

┌──────────────────────────────────────────────────────┐
│ 2. REQUÊTES AUTHENTIFIÉES                            │
│                                                      │
│  Toutes les requêtes suivantes :                    │
│                                                      │
│  GET /employees          ────►     EmployeeController│
│  Headers:                                │           │
│    Authorization: Bearer eyJhbG...       ▼           │
│                                    Middleware JWT    │
│                                          │           │
│                                    Validation Token  │
│                                          │           │
│                                    Extract Claims    │
│                                    (UserId, Role)    │
│                                          │           │
│                           ◄─────     Authorized     │
│                                                      │
│  Accès aux données autorisé                         │
│                                                      │
└──────────────────────────────────────────────────────┘
```

### Implémentation Frontend

**1. Login (Store Zustand)**

```typescript
// frontend/src/store/auth.store.ts
export const useAuthStore = create<AuthState>((set) => ({
  login: async (credentials) => {
    // 1. Appel API
    const response = await authService.login(credentials);
    
    // 2. Stockage
    localStorage.setItem('token', response.token);
    localStorage.setItem('user', JSON.stringify(response));
    
    // 3. Mise à jour état
    set({
      user: response,
      token: response.token,
      isAuthenticated: true,
    });
  },
}));
```

**2. Intercepteur Axios (Ajout automatique du token)**

```typescript
// frontend/src/lib/api-client.ts
apiClient.interceptors.request.use((config) => {
  const token = localStorage.getItem('token');
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});
```

**3. Protection des routes**

```typescript
// frontend/src/hooks/useAuth.ts
export function useRequireAuth() {
  const router = useRouter();
  const { isAuthenticated } = useAuthStore();

  useEffect(() => {
    if (!isAuthenticated) {
      router.push('/auth/login');
    }
  }, [isAuthenticated, router]);
}
```

### Implémentation Backend

**1. Configuration JWT**

```csharp
// XtraWork/Program.cs
builder.Services.AddAuthentication(JwtBearerDefaults.AuthenticationScheme)
    .AddJwtBearer(opt =>
    {
        opt.TokenValidationParameters = new TokenValidationParameters
        {
            ValidateIssuer = true,
            ValidIssuer = jwt["Issuer"],
            ValidateAudience = true,
            ValidAudience = jwt["Audience"],
            ValidateLifetime = true,
            ValidateIssuerSigningKey = true,
            IssuerSigningKey = new SymmetricSecurityKey(Encoding.UTF8.GetBytes(key)),
        };
    });
```

**2. Génération Token**

```csharp
// XtraWork/Services/AuthService.cs
private string GenerateJwtToken(User user)
{
    var claims = new[]
    {
        new Claim(ClaimTypes.NameIdentifier, user.Id.ToString()),
        new Claim(ClaimTypes.Name, user.Username),
        new Claim(ClaimTypes.Email, user.Email),
        new Claim(ClaimTypes.Role, user.Role),
    };

    var key = new SymmetricSecurityKey(Encoding.UTF8.GetBytes(_jwtKey));
    var creds = new SigningCredentials(key, SecurityAlgorithms.HmacSha256);

    var token = new JwtSecurityToken(
        issuer: _jwtIssuer,
        audience: _jwtAudience,
        claims: claims,
        expires: DateTime.UtcNow.AddDays(1),
        signingCredentials: creds
    );

    return new JwtSecurityTokenHandler().WriteToken(token);
}
```

**3. Protection des Controllers**

```csharp
// XtraWork/Controllers/EmployeeController.cs
[ApiController]
[Route("api/[controller]")]
[Authorize]  // ← Nécessite un token JWT valide
public class EmployeeController : ControllerBase
{
    [HttpDelete("{id}")]
    [Authorize(Policy = "ManagerOrAdmin")]  // ← Nécessite rôle Manager ou Admin
    public async Task<ActionResult> Delete(Guid id)
    {
        // ...
    }
}
```

---

## 🚨 Gestion des Erreurs

### Frontend - Intercepteur d'erreurs

```typescript
// frontend/src/lib/api-client.ts
apiClient.interceptors.response.use(
  (response) => response,
  (error: AxiosError<ApiError>) => {
    if (error.response) {
      const apiError: ApiError = {
        message: error.response.data?.message || 'Erreur',
        statusCode: error.response.status,
      };

      // Si 401 → Redirection login
      if (error.response.status === 401) {
        localStorage.removeItem('token');
        window.location.href = '/auth/login';
      }

      return Promise.reject(apiError);
    }
    
    return Promise.reject({
      message: 'Impossible de contacter le serveur',
    });
  }
);
```

### Backend - Gestion globale des erreurs

```csharp
// XtraWork/Program.cs
app.UseExceptionHandler(options =>
{
    options.Run(async http =>
    {
        var ex = http.Features.Get<IExceptionHandlerFeature>()?.Error;
        if (ex != null)
        {
            http.Response.StatusCode = (int)HttpStatusCode.InternalServerError;
            http.Response.ContentType = "application/json";
            await http.Response.WriteAsJsonAsync(new { message = ex.Message });
        }
    });
});
```

---

## ✅ Best Practices

### 1. Typage Strict

✅ **Frontend - Types correspondant au backend**

```typescript
// frontend/src/types/index.ts
export interface EmployeeResponse {
  id: string;              // Guid → string
  firstName: string;
  lastName: string;
  birthDate: string;       // DateTime → string ISO
  salary: number;          // decimal → number
  // ...
}
```

### 2. Séparation des Responsabilités

✅ **Frontend**
- **Components** : UI uniquement
- **Services** : Logique API
- **Store** : State management
- **Hooks** : Logique réutilisable

✅ **Backend**
- **Controllers** : Endpoints API
- **Services** : Business logic
- **Repositories** : Data access
- **Entities** : Modèles de données

### 3. Sécurité

✅ **À faire**
- Utiliser HTTPS en production
- Valider toutes les entrées (frontend + backend)
- Ne jamais exposer les clés JWT
- Implémenter un refresh token
- Logs des tentatives de connexion

❌ **À éviter**
- Stocker des données sensibles en localStorage
- Désactiver la validation SSL en production
- Exposer des erreurs détaillées à l'utilisateur

### 4. Performance

✅ **Frontend**
- Utiliser le cache React Query/SWR
- Lazy loading des composants
- Optimiser les images
- Pagination des listes

✅ **Backend**
- Utiliser `Include()` pour éviter N+1
- Pagination côté serveur
- Cache avec Redis
- Compression des réponses

---

## 🔍 Debugging

### Vérifier la communication

**1. Backend en cours d'exécution ?**

```bash
curl -k https://localhost:7033/health
```

**2. CORS configuré ?**

Ouvrir la console navigateur (F12) et vérifier les erreurs CORS.

**3. Token JWT valide ?**

```typescript
// Dans la console navigateur
console.log(localStorage.getItem('token'));
```

Décoder sur [jwt.io](https://jwt.io)

**4. Logs backend**

```bash
# Logs en temps réel
tail -f XtraWork/logs/xtrawork-*.txt
```

---

## 📚 Ressources

- [Next.js Docs](https://nextjs.org/docs)
- [ASP.NET Core Docs](https://docs.microsoft.com/aspnet/core)
- [JWT.io](https://jwt.io)
- [CORS MDN](https://developer.mozilla.org/docs/Web/HTTP/CORS)

---

**Bonne liaison Frontend ↔️ Backend ! 🚀**

