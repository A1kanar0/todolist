namespace Backend.Entities;

public class Note
{
    public int Id { get; set; }
    public int AuthorId { get; set; }
    public string Title { get; set; } = string.Empty;
    public string Content { get; set; } = string.Empty;
    public DateTime CreatedAt { get; set; }
    
    public IEnumerable<NoteImage> Images { get; set; } = new List<NoteImage>();
}
