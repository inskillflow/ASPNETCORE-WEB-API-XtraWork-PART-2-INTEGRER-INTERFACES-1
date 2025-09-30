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
public class EmployeeController : ControllerBase
{
    private readonly EmployeeService _employeeService;

    public EmployeeController(EmployeeService employeeService)
    {
        _employeeService = employeeService;
    }

    /// <summary>
    /// Récupère tous les employés
    /// </summary>
    [HttpGet]
    [ProducesResponseType(StatusCodes.Status200OK)]
    [ProducesResponseType(StatusCodes.Status401Unauthorized)]
    public async Task<ActionResult<List<EmployeeResponse>>> GetAll()
    {
        var response = await _employeeService.GetAll();
        return Ok(response);
    }

    /// <summary>
    /// Récupère un employé par ID
    /// </summary>
    [HttpGet("{id}")]
    [ProducesResponseType(StatusCodes.Status200OK)]
    [ProducesResponseType(StatusCodes.Status404NotFound)]
    [ProducesResponseType(StatusCodes.Status401Unauthorized)]
    public async Task<ActionResult<EmployeeResponse>> Get(Guid id)
    {
        try
        {
            var response = await _employeeService.Get(id);
            return Ok(response);
        }
        catch (NotFoundException ex)
        {
            return NotFound(new { message = ex.Message });
        }
    }

    /// <summary>
    /// Crée un nouvel employé
    /// </summary>
    [HttpPost]
    [ProducesResponseType(StatusCodes.Status201Created)]
    [ProducesResponseType(StatusCodes.Status400BadRequest)]
    [ProducesResponseType(StatusCodes.Status401Unauthorized)]
    public async Task<ActionResult<EmployeeResponse>> Create([FromBody] EmployeeRequest request)
    {
        try
        {
            var response = await _employeeService.Create(request);
            return CreatedAtAction(nameof(Get), new { id = response.Id }, response);
        }
        catch (NotFoundException ex)
        {
            return BadRequest(new { message = ex.Message });
        }
    }

    /// <summary>
    /// Met à jour un employé
    /// </summary>
    [HttpPut("{id}")]
    [ProducesResponseType(StatusCodes.Status200OK)]
    [ProducesResponseType(StatusCodes.Status404NotFound)]
    [ProducesResponseType(StatusCodes.Status401Unauthorized)]
    public async Task<ActionResult<EmployeeResponse>> Update(Guid id, [FromBody] EmployeeRequest request)
    {
        try
        {
            var response = await _employeeService.Update(id, request);
            return Ok(response);
        }
        catch (NotFoundException ex)
        {
            return NotFound(new { message = ex.Message });
        }
    }

    /// <summary>
    /// Supprime un employé (Admin ou Manager)
    /// </summary>
    [HttpDelete("{id}")]
    [Authorize(Policy = "ManagerOrAdmin")]
    [ProducesResponseType(StatusCodes.Status204NoContent)]
    [ProducesResponseType(StatusCodes.Status404NotFound)]
    [ProducesResponseType(StatusCodes.Status403Forbidden)]
    public async Task<ActionResult> Delete(Guid id)
    {
        try
        {
            await _employeeService.Delete(id);
            return NoContent();
        }
        catch (NotFoundException ex)
        {
            return NotFound(new { message = ex.Message });
        }
    }
}
