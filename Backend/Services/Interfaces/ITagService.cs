
namespace Backend.Services;

public interface ITagService
{
    Task<IEnumerable<Backend.Entities.Tag>> GetAllTagsAsync();
    
    Task<Backend.Entities.Tag> CreateTagAsync(Backend.Entities.Tag tag);
    
    Task<Backend.Entities.Tag> UpdateTagAsync(Backend.Entities.Tag tag);
    
    Task<bool> DeleteTagAsync(int id);
    Task<IEnumerable<Backend.Entities.Tag>> GetTagsByNoteIdAsync(int noteId);
}
