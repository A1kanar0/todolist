using Backend.Entities;
using Backend.Services;
using HotChocolate;
using HotChocolate.Types;
using System;
using System.Threading.Tasks;

namespace Backend.GraphQL.Mutations;

public record CreateNoteInput(int AuthorId, string Title, string Content);
public record UpdateNoteInput(int Id, int AuthorId, string Title, string Content);

[ExtendObjectType("Mutation")]
public class NoteMutations
{
    public async Task<Note> CreateNoteAsync(CreateNoteInput input, [Service] INoteService noteService)
    {
        var newNote = new Note
        {
            AuthorId = input.AuthorId,
            Title = input.Title,
            Content = input.Content
        };

        return await noteService.CreateNoteAsync(newNote)
               ?? throw new GraphQLException("Помилка при створенні нотатки");
    }

    public async Task<Note> UpdateNoteAsync(UpdateNoteInput input, [Service] INoteService noteService)
    {
        var noteUpdates = new Note
        {
            Id = input.Id,
            AuthorId = input.AuthorId,
            Title = input.Title ?? string.Empty,
            Content = input.Content ?? string.Empty
        };

        return await noteService.UpdateNoteAsync(noteUpdates)
               ?? throw new GraphQLException("Не вдалося оновити нотатку");
    }

    public async Task<bool> DeleteNoteAsync(int id, [Service] INoteService noteService)
    {
        var isDeleted = await noteService.DeleteNoteAsync(id);
        
        if (!isDeleted)
        {
            throw new GraphQLException("Не вдалося видалити нотатку або її не знайдено");
        }

        return true;
    }
}
