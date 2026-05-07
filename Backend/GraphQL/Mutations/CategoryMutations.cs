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
        if (string.IsNullOrWhiteSpace(input.Name))
        {
            throw new GraphQLException("Поле Name є обов'язковим і не може бути порожнім.");
        }

        var newCategory = new Category
        {
            Name = input.Name
        };

        try
        {
            return await categoryService.CreateCategoryAsync(newCategory)
                   ?? throw new GraphQLException("Помилка при створенні категорії");
        }
        catch (Exception ex)
        {
            throw new GraphQLException($"Помилка створення: {ex.Message}");
        }
    }

    public async Task<Category> UpdateCategoryAsync(UpdateCategoryInput input, [Service] ICategoryService categoryService)
    {
        if (input.Id <= 0)
        {
            throw new GraphQLException("Недійсний ID категорії.");
        }

        if (string.IsNullOrWhiteSpace(input.Name))
        {
            throw new GraphQLException("Поле Name є обов'язковим і не може бути порожнім.");
        }

        var categoryUpdates = new Category
        {
            Id = input.Id,
            Name = input.Name
        };

        try
        {
            return await categoryService.UpdateCategoryAsync(categoryUpdates)
                   ?? throw new GraphQLException("Не вдалося оновити категорію");
        }
        catch (Exception ex)
        {
            throw new GraphQLException($"Помилка оновлення: {ex.Message}");
        }
    }

    public async Task<bool> DeleteCategoryAsync(int id, [Service] ICategoryService categoryService)
    {
        if (id <= 0)
        {
            throw new GraphQLException("Недійсний ID категорії.");
        }

        try
        {
            var isDeleted = await categoryService.DeleteCategoryAsync(id);
            
            if (!isDeleted)
            {
                throw new GraphQLException("Не вдалося видалити категорію або її не знайдено");
            }

            return true;
        }
        catch (Exception ex)
        {
            throw new GraphQLException($"Помилка видалення: {ex.Message}");
        }
    }
}
