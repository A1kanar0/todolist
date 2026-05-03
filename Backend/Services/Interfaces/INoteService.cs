using Backend.Entities;

namespace Backend.Services;

public interface INoteService
{
    Task<IEnumerable<Note>> GetAllNotesAsync();

    Task<Note?> GetNoteByIdAsync(int id);

    Task<Note> CreateNoteAsync(Note note, List<int>? tagIds = null);

    Task<Note> UpdateNoteAsync(Note noteUpdates, List<int>? tagIds = null);

    Task<bool> DeleteNoteAsync(int id);

    Task<IEnumerable<Note>> GetNotesByTagIdAsync(int tagId);

    Task<bool> AddTagToNoteAsync(int noteId, int tagId);

    Task<bool> RemoveTagFromNoteAsync(int noteId, int tagId);
}
