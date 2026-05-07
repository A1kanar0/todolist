using Backend.Services;

namespace Backend.GraphQL.Mutations;

public record CreateTagInput(string Name, string Color);
public record UpdateTagInput(int Id, string Name, string Color);

[ExtendObjectType("Mutation")]
public class TagMutations
{
    public async Task<Backend.Entities.Tag> CreateTagAsync(CreateTagInput input, [Service] ITagService tagService)
    {
        if (string.IsNullOrWhiteSpace(input.Name))
        {
            throw new GraphQLException("Поле Name є обов'язковим і не може бути порожнім.");
        }

        if (string.IsNullOrWhiteSpace(input.Color))
        {
            throw new GraphQLException("Поле Color є обов'язковим і не може бути порожнім.");
        }

        var newTag = new Backend.Entities.Tag
        {
            Name = input.Name,
            Color = input.Color
        };

        try
        {
            return await tagService.CreateTagAsync(newTag) 
                   ?? throw new GraphQLException("Помилка при створенні тегу");
        }
        catch (Exception ex)
        {
            throw new GraphQLException($"Помилка створення: {ex.Message}");
        }
    }

    public async Task<Backend.Entities.Tag> UpdateTagAsync(UpdateTagInput input, [Service] ITagService tagService)
    {
        if (input.Id <= 0)
        {
            throw new GraphQLException("Недійсний ID тегу.");
        }

        if (string.IsNullOrWhiteSpace(input.Name))
        {
            throw new GraphQLException("Поле Name є обов'язковим і не може бути порожнім.");
        }

        if (string.IsNullOrWhiteSpace(input.Color))
        {
            throw new GraphQLException("Поле Color є обов'язковим і не може бути порожнім.");
        }

        var tagUpdates = new Backend.Entities.Tag
        {
            Id = input.Id,
            Name = input.Name,
            Color = input.Color
        };

        try
        {
            return await tagService.UpdateTagAsync(tagUpdates) 
                   ?? throw new GraphQLException("Не вдалося оновити тег");
        }
        catch (Exception ex)
        {
            throw new GraphQLException($"Помилка оновлення: {ex.Message}");
        }
    }

    public async Task<bool> DeleteTagAsync(int id, [Service] ITagService tagService)
    {
        if (id <= 0)
        {
            throw new GraphQLException("Недійсний ID тегу.");
        }

        try
        {
            var isDeleted = await tagService.DeleteTagAsync(id);
            
            if (!isDeleted)
            {
                throw new GraphQLException("Не вдалося видалити тег або його не знайдено");
            }

            return true;
        }
        catch (Exception ex)
        {
            throw new GraphQLException($"Помилка видалення: {ex.Message}");
        }
    }
}
