using Backend.Entities;
using Backend.Services;
using HotChocolate.Authorization;

namespace Backend.GraphQL.Mutations;

[ExtendObjectType("Mutation")]
public class ImageMutations
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
        int id,
        [Service] INoteImageService noteImageService)
    {
        var isDeleted = await noteImageService.DeleteImageAsync(id);

        if (!isDeleted)
        {
            throw new GraphQLException("Не вдалося видалити зображення завдання або його не знайдено.");
        }

        return true;
    }

    public async Task<TaskImage> UploadTaskImageAsync(
        int taskId,
        IFile file,
        [Service] ITaskImageService taskImageService)
    {
        return await taskImageService.UploadImageAsync(taskId, file);
    }

    public async Task<bool> DeleteTaskImageAsync(
        int id, 
        [Service] ITaskImageService taskImageService)
    {
        var isDeleted = await taskImageService.DeleteImageAsync(id);

        if (!isDeleted)
        {
            throw new GraphQLException("Не вдалося видалити зображення завдання або його не знайдено.");
        }

        return true;
    }
}
