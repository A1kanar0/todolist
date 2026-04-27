using System.Collections.Generic;
using System.Threading.Tasks;
using Backend.Entities;
using Backend.Services;
using HotChocolate;
using HotChocolate.Types;

namespace Backend.GraphQL.Queries;

[ExtendObjectType("Query")]
public class NoteQueries
{
    public async Task<IEnumerable<Note>> GetNotesAsync([Service] INoteService noteService)
    {
        return await noteService.GetAllNotesAsync();
    }
    public async Task<IEnumerable<Note>> GetNotesByTagAsync(int tagId, [Service] INoteService noteService)
    {
        return await noteService.GetNotesByTagIdAsync(tagId)
               ?? throw new GraphQLException("Нотатки за цим тегом не знайдені");
    }
}
