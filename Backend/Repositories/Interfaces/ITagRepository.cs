
namespace Backend.Repositories;

public interface ITagRepository
{
    Task<IEnumerable<Backend.Entities.Tag>> GetAllAsync();
    
    Task<Backend.Entities.Tag> CreateAsync(Backend.Entities.Tag tag);
    
    Task<Backend.Entities.Tag> UpdateAsync(Backend.Entities.Tag tag);
    
    Task<bool> DeleteAsync(int id);
    Task<IEnumerable<Backend.Entities.Tag>> GetByNoteIdAsync(int noteId);
}
