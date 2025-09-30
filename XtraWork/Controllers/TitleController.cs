using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using XtraWork.Exceptions;
using XtraWork.Requests;
using XtraWork.Responses;
using XtraWork.Services;

namespace XtraWork.Controllers;

[ApiController]
[Route("api/[controller]")]
[Authorize]
[Produces("application/json")]
public class TitleController : ControllerBase
{
    private readonly TitleService _titleService;

    public TitleController(TitleService titleService)
    {
        _titleService = titleService;
    }

    /// <summary>
    /// Récupère tous les titres
    /// </summary>
    [HttpGet]
    [ProducesResponseType(StatusCodes.Status200OK)]
    [ProducesResponseType(StatusCodes.Status401Unauthorized)]
    public async Task<ActionResult<List<TitleResponse>>> GetAll()
    {
        var response = await _titleService.GetAll();
        return Ok(response);
    }

    /// <summary>
    /// Récupère un titre par ID
    /// </summary>
    [HttpGet("{id}")]
    [ProducesResponseType(StatusCodes.Status200OK)]
    [ProducesResponseType(StatusCodes.Status404NotFound)]
    [ProducesResponseType(StatusCodes.Status401Unauthorized)]
    public async Task<ActionResult<TitleResponse>> Get(Guid id)
    {
        try
        {
            var response = await _titleService.Get(id);
            return Ok(response);
        }
        catch (NotFoundException ex)
        {
            return NotFound(new { message = ex.Message });
        }
    }

    /// <summary>
    /// Crée un nouveau titre (Admin seulement)
    /// </summary>
    [HttpPost]
    [Authorize(Roles = "Admin")]
    [ProducesResponseType(StatusCodes.Status201Created)]
    [ProducesResponseType(StatusCodes.Status400BadRequest)]
    [ProducesResponseType(StatusCodes.Status403Forbidden)]
    public async Task<ActionResult<TitleResponse>> Create([FromBody] TitleRequest request)
    {
        var response = await _titleService.Create(request);
        return CreatedAtAction(nameof(Get), new { id = response.Id }, response);
    }

    /// <summary>
    /// Met à jour un titre (Admin ou Manager)
    /// </summary>
    [HttpPut("{id}")]
    [Authorize(Policy = "ManagerOrAdmin")]
    [ProducesResponseType(StatusCodes.Status200OK)]
    [ProducesResponseType(StatusCodes.Status404NotFound)]
    [ProducesResponseType(StatusCodes.Status403Forbidden)]
    public async Task<ActionResult<TitleResponse>> Update(Guid id, [FromBody] TitleRequest request)
    {
        try
        {
            var response = await _titleService.Update(id, request);
            return Ok(response);
        }
        catch (NotFoundException ex)
        {
            return NotFound(new { message = ex.Message });
        }
    }

    /// <summary>
    /// Supprime un titre (Admin seulement)
    /// </summary>
    [HttpDelete("{id}")]
    [Authorize(Roles = "Admin")]
    [ProducesResponseType(StatusCodes.Status204NoContent)]
    [ProducesResponseType(StatusCodes.Status404NotFound)]
    [ProducesResponseType(StatusCodes.Status403Forbidden)]
    public async Task<ActionResult> Delete(Guid id)
    {
        try
        {
            await _titleService.Delete(id);
            return NoContent();
        }
        catch (NotFoundException ex)
        {
            return NotFound(new { message = ex.Message });
        }
    }
}
