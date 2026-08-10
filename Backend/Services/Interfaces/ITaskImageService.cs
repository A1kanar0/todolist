using Backend.Entities;

namespace Backend.Services;

public interface ITaskImageService
{
    Task<TaskImage> UploadImageAsync(int taskId, HotChocolate.Types.IFile file);
    Task<IEnumerable<TaskImage>> GetImagesByTaskIdAsync(int taskId);
    Task<IEnumerable<TaskImage>> GetImagesByTaskIdArrayAsync(IEnumerable<int> taskIds);
    Task<bool> DeleteImageAsync(int id);
    void DeleteFiles(IEnumerable<TaskImage> images);
}
