using XtraWork.Entities;
using XtraWork.Exceptions;
using XtraWork.Repositories;
using XtraWork.Requests;
using XtraWork.Responses;

namespace XtraWork.Services;

public class TitleService
{
    private readonly TitleRepository _titleRepository;

    public TitleService(TitleRepository titleRepository)
    {
        _titleRepository = titleRepository;
    }

    public async Task<List<TitleResponse>> GetAll()
    {
        var titles = await _titleRepository.GetAllAsync();
        return titles.Select(t => new TitleResponse
        {
            Id = t.Id,
            Description = t.Description,
            CreatedAt = t.CreatedAt
        }).ToList();
    }

    public async Task<TitleResponse> Get(Guid id)
    {
        var title = await _titleRepository.GetByIdAsync(id);
        if (title == null)
        {
            throw new NotFoundException($"Titre avec l'ID {id} non trouvé");
        }

        return new TitleResponse
        {
            Id = title.Id,
            Description = title.Description,
            CreatedAt = title.CreatedAt
        };
    }

    public async Task<TitleResponse> Create(TitleRequest request)
    {
        var title = new Title
        {
            Id = Guid.NewGuid(),
            Description = request.Description,
            CreatedAt = DateTime.UtcNow
        };

        var createdTitle = await _titleRepository.CreateAsync(title);

        return new TitleResponse
        {
            Id = createdTitle.Id,
            Description = createdTitle.Description,
            CreatedAt = createdTitle.CreatedAt
        };
    }

    public async Task<TitleResponse> Update(Guid id, TitleRequest request)
    {
        var title = await _titleRepository.GetByIdAsync(id);
        if (title == null)
        {
            throw new NotFoundException($"Titre avec l'ID {id} non trouvé");
        }

        title.Description = request.Description;
        var updatedTitle = await _titleRepository.UpdateAsync(title);

        return new TitleResponse
        {
            Id = updatedTitle.Id,
            Description = updatedTitle.Description,
            CreatedAt = updatedTitle.CreatedAt
        };
    }

    public async Task Delete(Guid id)
    {
        var exists = await _titleRepository.ExistsAsync(id);
        if (!exists)
        {
            throw new NotFoundException($"Titre avec l'ID {id} non trouvé");
        }

        await _titleRepository.DeleteAsync(id);
    }
}
