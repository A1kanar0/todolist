namespace Backend.Entities;

public class TaskImage
{
	public int Id { get; set; }
	public string FilePath { get; set; } = string.Empty;
	public string FileName { get; set; } = string.Empty;
	public int TaskId { get; set; }
}
