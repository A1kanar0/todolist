using Backend.Entities;

namespace Backend.Repositories;

public interface INoteRepository
{
    Task<IEnumerable<Note>> GetAllAsync();
    
    Task<Note?> GetByIdAsync(int id); 
    
    Task<Note> CreateAsync(Note note);
    
    Task<Note> UpdateAsync(Note note);
    
    Task<bool> DeleteAsync(int id);
}
