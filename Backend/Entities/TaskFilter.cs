namespace Backend.Entities;

public class TaskFilter
{
    public int? CategoryId { get; set; }
    public bool? IsCompleted { get; set; }
    public DateTime? DeadlineFrom { get; set; }
    public DateTime? DeadlineTo { get; set; }
    public bool? SortByDeadlineAscending { get; set; }
    public bool? SortByCreatedAtAscending { get; set; }
    public List<int>? ExecutorIds { get; set; }
}
