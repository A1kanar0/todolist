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
        if (noteId <= 0)
        {
            throw new GraphQLException("Недійсний ID нотатки.");
        }

        if (file == null)
        {
            throw new GraphQLException("Файл є обов'язковим і не може бути порожнім.");
        }

        try
        {
            return await noteImageService.UploadImageAsync(noteId, file)
                   ?? throw new GraphQLException("Помилка при завантаженні зображення.");
        }
        catch (Exception ex)
        {
            throw new GraphQLException($"Помилка завантаження зображення: {ex.Message}");
        }
    }
    
    [Authorize]
    public async Task<bool> DeleteNoteImageAsync(
        int id,
        [Service] INoteImageService noteImageService)
    {
        if (id <= 0)
        {
            throw new GraphQLException("Недійсний ID зображення.");
        }

        try
        {
            var isDeleted = await noteImageService.DeleteImageAsync(id);

            if (!isDeleted)
            {
                throw new GraphQLException("Не вдалося видалити зображення нотатки або його не знайдено.");
            }

            return true;
        }
        catch (Exception ex)
        {
            throw new GraphQLException($"Помилка видалення: {ex.Message}");
        }
    }

    public async Task<TaskImage> UploadTaskImageAsync(
        int taskId,
        IFile file,
        [Service] ITaskImageService taskImageService)
    {
        if (taskId <= 0)
        {
            throw new GraphQLException("Недійсний ID завдання.");
        }

        if (file == null)
        {
            throw new GraphQLException("Файл є обов'язковим і не може бути порожнім.");
        }

        try
        {
            return await taskImageService.UploadImageAsync(taskId, file)
                   ?? throw new GraphQLException("Помилка при завантаженні зображення.");
        }
        catch (Exception ex)
        {
            throw new GraphQLException($"Помилка завантаження зображення: {ex.Message}");
        }
    }

    public async Task<bool> DeleteTaskImageAsync(
        int id, 
        [Service] ITaskImageService taskImageService)
    {
        if (id <= 0)
        {
            throw new GraphQLException("Недійсний ID зображення.");
        }

        try
        {
            var isDeleted = await taskImageService.DeleteImageAsync(id);

            if (!isDeleted)
            {
                throw new GraphQLException("Не вдалося видалити зображення завдання або його не знайдено.");
            }

            return true;
        }
        catch (Exception ex)
        {
            throw new GraphQLException($"Помилка видалення: {ex.Message}");
        }
    }
}
