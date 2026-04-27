using Backend.Entities;

namespace Backend.Repositories;

public interface ICategoryRepository
{
    Task<IEnumerable<Category>> GetAllAsync();
    
    Task<Category> CreateAsync(Category category);
    
    Task<Category> UpdateAsync(Category category);
    
    Task<bool> DeleteAsync(int id);
}
