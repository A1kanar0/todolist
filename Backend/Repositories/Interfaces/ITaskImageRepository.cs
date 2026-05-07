using Backend.Entities;

namespace Backend.Repositories;

public interface ITaskImageRepository
{
    Task<int> AddImageAsync(TaskImage taskImage);
    Task<IEnumerable<TaskImage>> GetByTaskIdAsync(int taskId);
    Task<IEnumerable<TaskImage>> GetImagesByTaskIdArrayAsync(IEnumerable<int> taskIds);
    Task<TaskImage?> GetByIdAsync(int id);
    Task<bool> DeleteAsync(int id);
}
