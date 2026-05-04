using Backend.Entities;

namespace Backend.Services;

public interface ITaskItemService
{
    Task<TaskItem?> GetTaskByIdAsync(int id);
    Task<IEnumerable<TaskItem>> GetAllTasksAsync();
    Task<TaskItem?> CreateTaskAsync(TaskItem task, IEnumerable<int>? executorIds = null);
    Task<TaskItem?> UpdateTaskAsync(TaskItem task, IEnumerable<int>? executorIds = null);
    Task<bool> DeleteTaskAsync(int id);
    Task<bool> CompleteTaskAsync(int id);
    Task<IEnumerable<TaskItem>> GetTasksByCategoryIdAsync(int categoryId);
}
