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
    
    public async Task<Note?> GetNoteByIdAsync(int id, [Service] INoteService noteService)
    {
        return await noteService.GetNoteByIdAsync(id);
    }
}
