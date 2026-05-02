using Backend.Entities;

namespace Backend.Services;

public interface ITaskItemService
{
    Task<TaskItem?> GetTaskByIdAsync(int id);
    Task<IEnumerable<TaskItem>> GetAllTasksAsync();
    Task<TaskItem?> CreateTaskAsync(TaskItem task);
    Task<TaskItem?> UpdateTaskAsync(TaskItem task);
    Task<bool> DeleteTaskAsync(int id);
    Task<bool> CompleteTaskAsync(int id);
}
