using Microsoft.EntityFrameworkCore;
using XtraWork.Entities;

namespace XtraWork.Repositories;

public class TitleRepository
{
    private readonly XtraWorkContext _context;

    public TitleRepository(XtraWorkContext context)
    {
        _context = context;
    }

    public async Task<List<Title>> GetAllAsync()
    {
        return await _context.Titles
            .OrderBy(t => t.Description)
            .ToListAsync();
    }

    public async Task<Title?> GetByIdAsync(Guid id)
    {
        return await _context.Titles
            .Include(t => t.Employees)
            .FirstOrDefaultAsync(t => t.Id == id);
    }

    public async Task<Title> CreateAsync(Title title)
    {
        _context.Titles.Add(title);
        await _context.SaveChangesAsync();
        return title;
    }

    public async Task<Title> UpdateAsync(Title title)
    {
        _context.Titles.Update(title);
        await _context.SaveChangesAsync();
        return title;
    }

    public async Task DeleteAsync(Guid id)
    {
        var title = await GetByIdAsync(id);
        if (title != null)
        {
            _context.Titles.Remove(title);
            await _context.SaveChangesAsync();
        }
    }

    public async Task<bool> ExistsAsync(Guid id)
    {
        return await _context.Titles.AnyAsync(t => t.Id == id);
    }
}
