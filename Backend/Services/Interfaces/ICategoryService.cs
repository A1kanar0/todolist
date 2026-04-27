using Backend.Entities;

namespace Backend.Services;

public interface ICategoryService
{
    Task<IEnumerable<Category>> GetAllCategoriesAsync();
    
    Task<Category> CreateCategoryAsync(Category category);
    
    Task<Category> UpdateCategoryAsync(Category category);
    
    Task<bool> DeleteCategoryAsync(int id);
}
