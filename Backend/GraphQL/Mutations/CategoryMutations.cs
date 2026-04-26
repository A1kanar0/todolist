using Backend.Entities;
using Backend.Services;

namespace Backend.GraphQL.Mutations;

public record CreateCategoryInput(string Name);
public record UpdateCategoryInput(int Id, string Name);

[ExtendObjectType("Mutation")]
public class CategoryMutations
{
    public async Task<Category> CreateCategoryAsync(CreateCategoryInput input, [Service] ICategoryService categoryService)
    {
        var newCategory = new Category
        {
            Name = input.Name
        };

        return await categoryService.CreateCategoryAsync(newCategory)
               ?? throw new GraphQLException("Помилка при створенні категорії");
    }

    public async Task<Category> UpdateCategoryAsync(UpdateCategoryInput input, [Service] ICategoryService categoryService)
    {
        var categoryUpdates = new Category
        {
            Id = input.Id,
            Name = input.Name ?? string.Empty
        };

        return await categoryService.UpdateCategoryAsync(categoryUpdates)
               ?? throw new GraphQLException("Не вдалося оновити категорію");
    }

    public async Task<bool> DeleteCategoryAsync(int id, [Service] ICategoryService categoryService)
    {
        var isDeleted = await categoryService.DeleteCategoryAsync(id);
        
        if (!isDeleted)
        {
            throw new GraphQLException("Не вдалося видалити категорію або її не знайдено");
        }

        return true;
    }
}
