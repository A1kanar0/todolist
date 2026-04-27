using Backend.Entities;
using Backend.Services;

namespace Backend.GraphQL.Queries;

[ExtendObjectType("Query")]
public class CategoryQueries
{
    public async Task<IEnumerable<Category>> GetCategoriesAsync([Service] ICategoryService categoryService)
    {
        return await categoryService.GetAllCategoriesAsync();
    }
}
