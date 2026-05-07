using Backend.Entities;
using Backend.Services;
using HotChocolate.Authorization;

namespace Backend.GraphQL.Mutations;

public record CreateNoteInput(int AuthorId, string Title, string Content, List<int> TagIds);
public record UpdateNoteInput(int Id, int AuthorId, string Title, string Content, List<int> TagIds);

[ExtendObjectType("Mutation")]
public class NoteMutations
{
    [Authorize]
    public async Task<Note> CreateNoteAsync(CreateNoteInput input, [Service] INoteService noteService, [Service] ICurrentUserService currentUserService)
    {
        var userId = currentUserService.UserId
                     ?? throw new GraphQLException("Користувача не ідентифіковано");

        if (string.IsNullOrWhiteSpace(input.Title))
        {
            throw new GraphQLException("Поле Title є обов'язковим і не може бути порожнім.");
        }

        if (string.IsNullOrWhiteSpace(input.Content))
        {
            throw new GraphQLException("Поле Content є обов'язковим і не може бути порожнім.");
        }

        if (input.TagIds == null)
        {
            throw new GraphQLException("Поле TagIds є обов'язковим.");
        }

        var newNote = new Note
        {
            AuthorId = userId,
            Title = input.Title,
            Content = input.Content
        };

        try
        {
            return await noteService.CreateNoteAsync(newNote, input.TagIds) 
                   ?? throw new GraphQLException("Помилка при створенні нотатки");
        }
        catch (Exception ex)
        {
            throw new GraphQLException($"Помилка створення: {ex.Message}");
        }
    }

    [Authorize]
    public async Task<Note> UpdateNoteAsync(UpdateNoteInput input, [Service] INoteService noteService, [Service] ICurrentUserService currentUserService)
    {
        var userId = currentUserService.UserId
                     ?? throw new GraphQLException("Користувача не ідентифіковано");

        if (input.Id <= 0)
        {
            throw new GraphQLException("Недійсний ID нотатки.");
        }

        if (string.IsNullOrWhiteSpace(input.Title))
        {
            throw new GraphQLException("Поле Title є обов'язковим і не може бути порожнім.");
        }

        if (string.IsNullOrWhiteSpace(input.Content))
        {
            throw new GraphQLException("Поле Content є обов'язковим і не може бути порожнім.");
        }

        if (input.TagIds == null)
        {
            throw new GraphQLException("Поле TagIds є обов'язковим.");
        }

        var noteUpdates = new Note
        {
            Id = input.Id,
            AuthorId = input.AuthorId,
            Title = input.Title,
            Content = input.Content
        };

        try
        {
            return await noteService.UpdateNoteAsync(noteUpdates, input.TagIds) 
                   ?? throw new GraphQLException("Не вдалося оновити нотатку");
        }
        catch (Exception ex)
        {
            throw new GraphQLException($"Помилка оновлення: {ex.Message}");
        }
    }

    [Authorize]
    public async Task<bool> DeleteNoteAsync(int id, [Service] INoteService noteService)
    {
        if (id <= 0)
        {
            throw new GraphQLException("Недійсний ID нотатки.");
        }

        var isDeleted = await noteService.DeleteNoteAsync(id);
        
        if (!isDeleted)
        {
            throw new GraphQLException("Не вдалося видалити нотатку або її не знайдено");
        }

        return true;
    }
    
    public async Task<bool> AddTagToNoteAsync(int noteId, int tagId, [Service] INoteService noteService)
    {
        if (noteId <= 0 || tagId <= 0)
        {
            throw new GraphQLException("Недійсні ID нотатки або тегу.");
        }

        var result = await noteService.AddTagToNoteAsync(noteId, tagId);
        
        if (!result)
        {
            throw new GraphQLException("Не вдалося додати тег до нотатки");
        }
        
        return true;
    }
    
    public async Task<bool> RemoveTagFromNoteAsync(int noteId, int tagId, [Service] INoteService noteService)
    {
        if (noteId <= 0 || tagId <= 0)
        {
            throw new GraphQLException("Недійсні ID нотатки або тегу.");
        }

        var result = await noteService.RemoveTagFromNoteAsync(noteId, tagId);
        
        if (!result)
        {
            throw new GraphQLException("Не вдалося видалити тег з нотатки");
        }
        
        return true;
    }
}
