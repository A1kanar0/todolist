using Backend.Entities;

namespace Backend.Repositories;

public interface ITaskItemRepository
{
    Task<TaskItem?> GetByIdAsync(int id);
    Task<IEnumerable<TaskItem>> GetAllAsync();
    Task<TaskItem> CreateAsync(TaskItem task, IEnumerable<int>? executorIds = null);
    Task<TaskItem?> UpdateAsync(TaskItem task, IEnumerable<int>? executorIds = null);
    Task<bool> DeleteAsync(int id);
    Task<int> UnlinkChildrenAsync(int parentId);
    Task<bool> CompleteTaskAsync(int id);
    Task<IEnumerable<int>> GetAllTaskAndDescendantIdsAsync(int taskId);
    Task<IEnumerable<TaskItem>> GetFilteredTasksAsync(TaskFilter filter);
}
