using Backend.Services;

namespace Backend.GraphQL.Mutations;

public record CreateTagInput(string Name, string Color);
public record UpdateTagInput(int Id, string Name, string Color);

[ExtendObjectType("Mutation")]
public class TagMutations
{
    public async Task<Backend.Entities.Tag> CreateTagAsync(
        CreateTagInput input, 
        [Service] ITagService tagService)
    {
        var newTag = new Backend.Entities.Tag
        {
            Name = input.Name,
            Color = input.Color
        };

        return await tagService.CreateTagAsync(newTag);
    }

    public async Task<Backend.Entities.Tag> UpdateTagAsync(
        UpdateTagInput input, 
        [Service] ITagService tagService)
    {
        var tagUpdates = new Backend.Entities.Tag
        {
            Id = input.Id,
            Name = input.Name,
            Color = input.Color
        };

        return await tagService.UpdateTagAsync(tagUpdates);
    }

    public async Task<bool> DeleteTagAsync(
        int id, 
        [Service] ITagService tagService)
    {
        return await tagService.DeleteTagAsync(id);
    }
}
