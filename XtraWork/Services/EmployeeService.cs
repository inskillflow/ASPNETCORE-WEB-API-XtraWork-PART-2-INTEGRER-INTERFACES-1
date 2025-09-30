using XtraWork.Entities;
using XtraWork.Exceptions;
using XtraWork.Repositories;
using XtraWork.Requests;
using XtraWork.Responses;

namespace XtraWork.Services;

public class EmployeeService
{
    private readonly EmployeeRepository _employeeRepository;
    private readonly TitleRepository _titleRepository;

    public EmployeeService(EmployeeRepository employeeRepository, TitleRepository titleRepository)
    {
        _employeeRepository = employeeRepository;
        _titleRepository = titleRepository;
    }

    public async Task<List<EmployeeResponse>> GetAll()
    {
        var employees = await _employeeRepository.GetAllAsync();
        return employees.Select(e => new EmployeeResponse
        {
            Id = e.Id,
            FirstName = e.FirstName,
            LastName = e.LastName,
            BirthDate = e.BirthDate,
            Gender = e.Gender,
            TitleId = e.TitleId,
            TitleDescription = e.Title.Description,
            CreatedAt = e.CreatedAt
        }).ToList();
    }

    public async Task<EmployeeResponse> Get(Guid id)
    {
        var employee = await _employeeRepository.GetByIdAsync(id);
        if (employee == null)
        {
            throw new NotFoundException($"Employé avec l'ID {id} non trouvé");
        }

        return new EmployeeResponse
        {
            Id = employee.Id,
            FirstName = employee.FirstName,
            LastName = employee.LastName,
            BirthDate = employee.BirthDate,
            Gender = employee.Gender,
            TitleId = employee.TitleId,
            TitleDescription = employee.Title.Description,
            CreatedAt = employee.CreatedAt
        };
    }

    public async Task<EmployeeResponse> Create(EmployeeRequest request)
    {
        // Vérifier que le titre existe
        var titleExists = await _titleRepository.ExistsAsync(request.TitleId);
        if (!titleExists)
        {
            throw new NotFoundException($"Titre avec l'ID {request.TitleId} non trouvé");
        }

        var employee = new Employee
        {
            Id = Guid.NewGuid(),
            FirstName = request.FirstName,
            LastName = request.LastName,
            BirthDate = request.BirthDate,
            Gender = request.Gender,
            TitleId = request.TitleId,
            CreatedAt = DateTime.UtcNow
        };

        var createdEmployee = await _employeeRepository.CreateAsync(employee);

        // Récupérer l'employé avec le titre pour la réponse
        var employeeWithTitle = await _employeeRepository.GetByIdAsync(createdEmployee.Id);

        return new EmployeeResponse
        {
            Id = employeeWithTitle!.Id,
            FirstName = employeeWithTitle.FirstName,
            LastName = employeeWithTitle.LastName,
            BirthDate = employeeWithTitle.BirthDate,
            Gender = employeeWithTitle.Gender,
            TitleId = employeeWithTitle.TitleId,
            TitleDescription = employeeWithTitle.Title.Description,
            CreatedAt = employeeWithTitle.CreatedAt
        };
    }

    public async Task<EmployeeResponse> Update(Guid id, EmployeeRequest request)
    {
        var employee = await _employeeRepository.GetByIdAsync(id);
        if (employee == null)
        {
            throw new NotFoundException($"Employé avec l'ID {id} non trouvé");
        }

        // Vérifier que le titre existe
        var titleExists = await _titleRepository.ExistsAsync(request.TitleId);
        if (!titleExists)
        {
            throw new NotFoundException($"Titre avec l'ID {request.TitleId} non trouvé");
        }

        employee.FirstName = request.FirstName;
        employee.LastName = request.LastName;
        employee.BirthDate = request.BirthDate;
        employee.Gender = request.Gender;
        employee.TitleId = request.TitleId;

        var updatedEmployee = await _employeeRepository.UpdateAsync(employee);

        // Récupérer l'employé avec le titre pour la réponse
        var employeeWithTitle = await _employeeRepository.GetByIdAsync(updatedEmployee.Id);

        return new EmployeeResponse
        {
            Id = employeeWithTitle!.Id,
            FirstName = employeeWithTitle.FirstName,
            LastName = employeeWithTitle.LastName,
            BirthDate = employeeWithTitle.BirthDate,
            Gender = employeeWithTitle.Gender,
            TitleId = employeeWithTitle.TitleId,
            TitleDescription = employeeWithTitle.Title.Description,
            CreatedAt = employeeWithTitle.CreatedAt
        };
    }

    public async Task Delete(Guid id)
    {
        var exists = await _employeeRepository.ExistsAsync(id);
        if (!exists)
        {
            throw new NotFoundException($"Employé avec l'ID {id} non trouvé");
        }

        await _employeeRepository.DeleteAsync(id);
    }
}
