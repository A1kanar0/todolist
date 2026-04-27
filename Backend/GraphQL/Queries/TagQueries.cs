using Backend.Services;

namespace Backend.GraphQL.Queries;

[ExtendObjectType("Query")]
public class TagQueries
{
    public async Task<IEnumerable<Backend.Entities.Tag>> GetTagsAsync(
        [Service] ITagService tagService)
    {
        return await tagService.GetAllTagsAsync();
    }
}
