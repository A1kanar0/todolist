using Backend.Entities;
using Backend.Services;
using HotChocolate.Authorization;

namespace Backend.GraphQL.Mutations;

[ExtendObjectType("Mutation")]
public class NoteImageMutations
{
    [Authorize]
    public async Task<NoteImage> UploadNoteImageAsync(
        int noteId,
        IFile file,
        [Service] INoteImageService noteImageService)
    {
        return await noteImageService.UploadImageAsync(noteId, file);
    }
    
    [Authorize]
    public async Task<bool> DeleteNoteImageAsync(
        int imageId,
        [Service] INoteImageService noteImageService)
    {
        return await noteImageService.DeleteImageAsync(imageId);
    }
}
