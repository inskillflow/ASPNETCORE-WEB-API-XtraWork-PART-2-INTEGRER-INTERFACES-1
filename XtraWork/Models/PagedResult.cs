namespace XtraWork.Models;

public class PagedResult<T>
{
    public List<T> Data { get; set; } = new();
    public int TotalCount { get; set; }
    public int Page { get; set; }
    public int PageSize { get; set; }
    public int TotalPages => (int)Math.Ceiling((double)TotalCount / PageSize);
    public bool HasNextPage => Page < TotalPages;
    public bool HasPreviousPage => Page > 1;
}

public class PagedRequest
{
    public int Page { get; set; } = 1;
    public int PageSize { get; set; } = 10;
    public string? SortBy { get; set; }
    public string? SortDirection { get; set; } = "asc";
    public string? SearchTerm { get; set; }
}

public class EmployeeFilterRequest : PagedRequest
{
    public string? Gender { get; set; }
    public Guid? TitleId { get; set; }
    public int? MinAge { get; set; }
    public int? MaxAge { get; set; }
    public DateTime? HiredAfter { get; set; }
    public DateTime? HiredBefore { get; set; }
}
