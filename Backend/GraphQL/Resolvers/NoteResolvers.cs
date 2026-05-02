using System.Collections.Generic;
using System.Threading.Tasks;
using Backend.Entities;
using Backend.Services;
using HotChocolate;

namespace Backend.GraphQL.Resolvers;

public class NoteResolvers
{
    public async Task<IEnumerable<Backend.Entities.Tag>> GetTagsForNoteAsync(
        [Parent] Note note, 
        [Service] ITagService tagService)
    {
        return await tagService.GetTagsByNoteIdAsync(note.Id);
    }
     public async Task<User?> GetAuthorAsync(
        [Parent] Note note,
        [Service] IUserService userService)
    {
        return await userService.GetUserByIdAsync(note.AuthorId);
    }
        
    public async Task<IEnumerable<NoteImage>> GetImagesAsync([Parent] Note note, [Service] INoteImageService service)
    {
        return await service.GetImagesByNoteIdAsync(note.Id);
    }
}

