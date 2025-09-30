using Microsoft.EntityFrameworkCore;
using XtraWork.Entities;

namespace XtraWork.Repositories;

public class EmployeeRepository
{
    private readonly XtraWorkContext _context;

    public EmployeeRepository(XtraWorkContext context)
    {
        _context = context;
    }

    public async Task<List<Employee>> GetAllAsync()
    {
        return await _context.Employees
            .Include(e => e.Title)
            .OrderBy(e => e.LastName)
            .ThenBy(e => e.FirstName)
            .ToListAsync();
    }

    public async Task<Employee?> GetByIdAsync(Guid id)
    {
        return await _context.Employees
            .Include(e => e.Title)
            .FirstOrDefaultAsync(e => e.Id == id);
    }

    public async Task<Employee> CreateAsync(Employee employee)
    {
        _context.Employees.Add(employee);
        await _context.SaveChangesAsync();
        return employee;
    }

    public async Task<Employee> UpdateAsync(Employee employee)
    {
        _context.Employees.Update(employee);
        await _context.SaveChangesAsync();
        return employee;
    }

    public async Task DeleteAsync(Guid id)
    {
        var employee = await GetByIdAsync(id);
        if (employee != null)
        {
            _context.Employees.Remove(employee);
            await _context.SaveChangesAsync();
        }
    }

    public async Task<bool> ExistsAsync(Guid id)
    {
        return await _context.Employees.AnyAsync(e => e.Id == id);
    }

    public async Task<List<Employee>> GetByTitleIdAsync(Guid titleId)
    {
        return await _context.Employees
            .Include(e => e.Title)
            .Where(e => e.TitleId == titleId)
            .ToListAsync();
    }
}
