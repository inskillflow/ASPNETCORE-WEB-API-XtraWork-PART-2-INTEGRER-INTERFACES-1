using System.Net;
using System.Text;
using Microsoft.AspNetCore.Authentication.JwtBearer;
using Microsoft.AspNetCore.Diagnostics;
using Microsoft.EntityFrameworkCore;
using Microsoft.IdentityModel.Tokens;
using FluentValidation;
using FluentValidation.AspNetCore;
using Serilog;

using XtraWork.Repositories;
using XtraWork.Services;
using XtraWork.Validators;

var builder = WebApplication.CreateBuilder(args);

// Configuration Serilog (AVANT builder.Build)
builder.Host.UseSerilog((ctx, cfg) =>
{
    cfg.ReadFrom.Configuration(ctx.Configuration)
       .WriteTo.Console(outputTemplate: "[{Timestamp:HH:mm:ss} {Level:u3}] {Message:lj} {Properties:j}{NewLine}{Exception}")
       .WriteTo.File(
           path: "logs/xtrawork-.txt",
           rollingInterval: RollingInterval.Day,
           retainedFileCountLimit: 30,
           outputTemplate: "[{Timestamp:yyyy-MM-dd HH:mm:ss.fff zzz} {Level:u3}] {Message:lj} {Properties:j}{NewLine}{Exception}")
       .Enrich.FromLogContext()
       .Enrich.WithProperty("Application", "XtraWork API");
});

// DB
var connectionString = builder.Configuration.GetConnectionString("XtraWork");
builder.Services.AddDbContext<XtraWorkContext>(opt => opt.UseSqlServer(connectionString));

// Repos & Services
builder.Services.AddScoped<TitleRepository>();
builder.Services.AddScoped<EmployeeRepository>();
builder.Services.AddScoped<UserRepository>();     // <- n'oublie pas d'implémenter UserRepository
builder.Services.AddScoped<TitleService>();
builder.Services.AddScoped<EmployeeService>();
builder.Services.AddScoped<IAuthService, AuthService>();

// MVC + Validation
builder.Services.AddControllers();
builder.Services.AddFluentValidationAutoValidation();
builder.Services.AddFluentValidationClientsideAdapters();
builder.Services.AddValidatorsFromAssemblyContaining<TitleRequestValidator>();
builder.Services.AddValidatorsFromAssemblyContaining<EmployeeRequestValidator>();

// Auth JWT
var jwt = builder.Configuration.GetSection("Jwt");
var key = jwt["Key"] ?? throw new InvalidOperationException("Jwt:Key manquant");
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
            ClockSkew = TimeSpan.FromMinutes(2)
        };
    });

builder.Services.AddAuthorization(options =>
{
    options.AddPolicy("AdminOnly", p => p.RequireRole("Admin"));
    options.AddPolicy("ManagerOrAdmin", p => p.RequireRole("Manager", "Admin"));
});

// Health checks
builder.Services.AddHealthChecks()
    .AddDbContextCheck<XtraWorkContext>("database");

// Swagger (+ JWT)
builder.Services.AddEndpointsApiExplorer();
builder.Services.AddSwaggerGen(c =>
{
    c.SwaggerDoc("v1", new()
    {
        Title = "XtraWork API",
        Version = "v1",
        Description = "API de gestion des employés avec authentification JWT",
        Contact = new() { Name = "Support", Email = "support@xtrawork.com" }
    });

    var s = new Microsoft.OpenApi.Models.OpenApiSecurityScheme
    {
        Name = "Authorization",
        Description = "JWT Authorization header using the Bearer scheme. Example: \"Authorization: Bearer {token}\"",
        In = Microsoft.OpenApi.Models.ParameterLocation.Header,
        Type = Microsoft.OpenApi.Models.SecuritySchemeType.Http,
        Scheme = "bearer",
        BearerFormat = "JWT",
        Reference = new Microsoft.OpenApi.Models.OpenApiReference
        {
            Type = Microsoft.OpenApi.Models.ReferenceType.SecurityScheme,
            Id = "Bearer"
        }
    };
    c.AddSecurityDefinition("Bearer", s);
    c.AddSecurityRequirement(new Microsoft.OpenApi.Models.OpenApiSecurityRequirement { { s, Array.Empty<string>() } });
});

var app = builder.Build();

// DB ensure
using (var scope = app.Services.CreateScope())
{
    var ctx = scope.ServiceProvider.GetRequiredService<XtraWorkContext>();
    ctx.Database.EnsureCreated();
}

// Errors → JSON
app.UseExceptionHandler(options =>
{
    options.Run(async http =>
    {
        var ex = http.Features.Get<IExceptionHandlerFeature>()?.Error;
        if (ex != null)
        {
            http.Response.StatusCode = (int)HttpStatusCode.InternalServerError;
            http.Response.ContentType = "application/json";
            await http.Response.WriteAsJsonAsync(new { message = ex.GetBaseException().Message });
        }
    });
});

// Logs HTTP
app.UseSerilogRequestLogging(options =>
{
    options.MessageTemplate = "HTTP {RequestMethod} {RequestPath} responded {StatusCode} in {Elapsed:0.0000} ms";
});

app.UseSwagger();
app.UseSwaggerUI();

app.UseHttpsRedirection();
app.UseAuthentication();   // IMPORTANT
app.UseAuthorization();

app.MapHealthChecks("/health");
app.MapControllers();

app.Run();