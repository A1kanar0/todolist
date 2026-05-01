namespace Backend.Entities;

public class TaskItem
{
    public int Id { get; set; }
    public int? ParentId { get; set; }
    public int CategoryId { get; set; }
    public string Title { get; set; } = string.Empty;
    public string? Content { get; set; }
    public bool IsCompleted { get; set; }
    public DateTime CreatedAt { get; set; }
    public DateTime? Deadline { get; set; }
}
