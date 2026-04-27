using Backend.Entities;

namespace Backend.Repositories;

public interface INoteRepository
{
    Task<IEnumerable<Note>> GetAllAsync();
    
    Task<Note> CreateAsync(Note note);
    
    Task<Note> UpdateAsync(Note note);
    
    Task<bool> DeleteAsync(int id);

    Task<IEnumerable<Note>> GetByTagIdAsync(int tagId);
    Task<bool> AddTagAsync(int noteId, int tagId);
    Task<bool> RemoveTagAsync(int noteId, int tagId);
    Task SyncTagsAsync(int noteId, List<int> tagIds);
}
