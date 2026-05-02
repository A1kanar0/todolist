using Backend.Entities;

namespace Backend.Repositories;

public interface INoteImageRepository
{
    Task<int> AddImageAsync(NoteImage image);
    Task<IEnumerable<NoteImage>> GetByNoteIdAsync(int noteId);
    Task<NoteImage?> GetByIdAsync(int id);
    Task<bool> DeleteAsync(int id);
}
