using Backend.Entities;
using Backend.Services;
using HotChocolate;
using HotChocolate.Types;
using System;
using System.Threading.Tasks;

namespace Backend.GraphQL.Mutations;

public record CreateNoteInput(int AuthorId, string Title, string Content, List<int>? TagIds);
public record UpdateNoteInput(int Id, int? AuthorId, string? Title, string? Content, List<int>? TagIds);

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

        return await noteService.CreateNoteAsync(newNote, input.TagIds) 
               ?? throw new GraphQLException("Помилка при створенні нотатки");
    }

    public async Task<Note> UpdateNoteAsync(UpdateNoteInput input, [Service] INoteService noteService)
    {
        var noteUpdates = new Note
        {
            Id = input.Id,
            AuthorId = input.AuthorId ?? 0,
            Title = input.Title ?? string.Empty,
            Content = input.Content ??  string.Empty
        };

        return await noteService.UpdateNoteAsync(noteUpdates, input.TagIds) 
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
    public async Task<bool> AddTagToNoteAsync(int noteId, int tagId, [Service] INoteService noteService)
    {
        var result = await noteService.AddTagToNoteAsync(noteId, tagId);
        
        if (!result)
        {
            throw new GraphQLException("Не вдалося додати тег до нотатки");
        }
        
        return true;
    }
    public async Task<bool> RemoveTagFromNoteAsync(int noteId, int tagId, [Service] INoteService noteService)
    {
        var result = await noteService.RemoveTagFromNoteAsync(noteId, tagId);
        
        if (!result)
        {
            throw new GraphQLException("Не вдалося видалити тег з нотатки");
        }
        
        return true;
    }
    
    
}
