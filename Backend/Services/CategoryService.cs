using Backend.Entities;
using Backend.Repositories;

namespace Backend.Services;

public class CategoryService : ICategoryService
{
    private readonly ICategoryRepository _categoryRepository;

    public CategoryService(ICategoryRepository categoryRepository)
    {
        _categoryRepository = categoryRepository;
    }

    public async Task<IEnumerable<Category>> GetAllCategoriesAsync() =>
        await _categoryRepository.GetAllAsync();

    public async Task<Category> CreateCategoryAsync(Category category)
    {
        if (category == null) 
            throw new ArgumentNullException(nameof(category));
            
        if (string.IsNullOrWhiteSpace(category.Name)) 
            throw new ArgumentException("Name is required");

        return await _categoryRepository.CreateAsync(category);
    }

    public async Task<Category> UpdateCategoryAsync(Category categoryUpdates)
    {
        if (categoryUpdates == null || categoryUpdates.Id <= 0)
            throw new ArgumentException("Invalid Category ID");

        if (string.IsNullOrWhiteSpace(categoryUpdates.Name))
            throw new ArgumentException("Name cannot be empty");

        return await _categoryRepository.UpdateAsync(categoryUpdates);
    }

    public async Task<bool> DeleteCategoryAsync(int id)
    {
        if (id <= 0) 
            throw new ArgumentException("Invalid Category ID");

        return await _categoryRepository.DeleteAsync(id);
    }
}
