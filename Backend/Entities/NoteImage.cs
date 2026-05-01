namespace Backend.Entities;

public class NoteImage
{
    public int Id { get; set; }
    public string FilePath { get; set; } = string.Empty;
    public string FileName { get; set; } = string.Empty;
    public int NoteId { get; set; }
}
