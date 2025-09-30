using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using System.Security.Claims;
using XtraWork.Requests;
using XtraWork.Responses;
using XtraWork.Services;

namespace XtraWork.Controllers;

[ApiController]
[Route("api/[controller]")]
[Produces("application/json")]
public class AuthController : ControllerBase
{
    private readonly IAuthService _authService;

    public AuthController(IAuthService authService)
    {
        _authService = authService;
    }

    /// <summary>
    /// Connexion utilisateur
    /// </summary>
    /// <param name="request">Identifiants de connexion</param>
    /// <returns>Token JWT et informations utilisateur</returns>
    [HttpPost("login")]
    [ProducesResponseType(StatusCodes.Status200OK)]
    [ProducesResponseType(StatusCodes.Status401Unauthorized)]
    public async Task<ActionResult<AuthResponse>> Login([FromBody] LoginRequest request)
    {
        try
        {
            var response = await _authService.LoginAsync(request);
            return Ok(response);
        }
        catch (UnauthorizedAccessException ex)
        {
            return Unauthorized(new { message = ex.Message });
        }
    }

    /// <summary>
    /// Inscription nouvel utilisateur
    /// </summary>
    /// <param name="request">Données d'inscription</param>
    /// <returns>Token JWT et informations utilisateur</returns>
    [HttpPost("register")]
    [ProducesResponseType(StatusCodes.Status201Created)]
    [ProducesResponseType(StatusCodes.Status400BadRequest)]
    public async Task<ActionResult<AuthResponse>> Register([FromBody] RegisterRequest request)
    {
        try
        {
            var response = await _authService.RegisterAsync(request);
            return CreatedAtAction(nameof(GetCurrentUser), new { }, response);
        }
        catch (InvalidOperationException ex)
        {
            return BadRequest(new { message = ex.Message });
        }
    }

    /// <summary>
    /// Récupère les informations de l'utilisateur connecté
    /// </summary>
    /// <returns>Informations utilisateur</returns>
    [HttpGet("me")]
    [Authorize]
    [ProducesResponseType(StatusCodes.Status200OK)]
    [ProducesResponseType(StatusCodes.Status401Unauthorized)]
    public async Task<ActionResult<UserResponse>> GetCurrentUser()
    {
        var userId = User.FindFirst(ClaimTypes.NameIdentifier)?.Value;

        if (string.IsNullOrEmpty(userId))
        {
            return Unauthorized();
        }

        var user = await _authService.GetCurrentUserAsync(userId);
        return Ok(user);
    }

    /// <summary>
    /// Validation d'un token JWT
    /// </summary>
    /// <param name="token">Token à valider</param>
    /// <returns>Statut de validation</returns>
    [HttpPost("validate")]
    [ProducesResponseType(StatusCodes.Status200OK)]
    [ProducesResponseType(StatusCodes.Status400BadRequest)]
    public async Task<ActionResult<object>> ValidateToken([FromBody] string token)
    {
        var isValid = await _authService.ValidateTokenAsync(token);

        return Ok(new { isValid, timestamp = DateTime.UtcNow });
    }

    /// <summary>
    /// Déconnexion (invalidation côté client)
    /// </summary>
    /// <returns>Confirmation de déconnexion</returns>
    [HttpPost("logout")]
    [Authorize]
    [ProducesResponseType(StatusCodes.Status200OK)]
    public ActionResult Logout()
    {
        // En JWT, la déconnexion se fait côté client en supprimant le token
        // Ici on peut logger l'événement
        var username = User.FindFirst(ClaimTypes.Name)?.Value;

        return Ok(new
        {
            message = "Déconnexion réussie",
            user = username,
            timestamp = DateTime.UtcNow
        });
    }
}
