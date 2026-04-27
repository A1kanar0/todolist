using Backend.Entities;

namespace Backend.Services;

public interface INoteService
{
    Task<IEnumerable<Note>> GetAllNotesAsync();
    Task<Note> CreateNoteAsync(Note note);
    Task<Note> UpdateNoteAsync(Note note);
    Task<bool> DeleteNoteAsync(int id);
    Task<IEnumerable<Note>> GetNotesByTagIdAsync(int tagId);
    Task<bool> AddTagToNoteAsync(int noteId, int tagId);
    Task<bool> RemoveTagFromNoteAsync(int noteId, int tagId);
    Task<Note> CreateNoteAsync(Note note, List<int>? tagIds);
    Task<Note> UpdateNoteAsync(Note note, List<int>? tagIds);
}
