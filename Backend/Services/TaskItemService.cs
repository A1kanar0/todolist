using Backend.Entities;
using Backend.Repositories;

namespace Backend.Services;

public class TaskItemService : ITaskItemService
{
    private readonly ITaskItemRepository _taskRepository;

    public TaskItemService(ITaskItemRepository taskRepository)
    {
        _taskRepository = taskRepository;
    }

    public async Task<TaskItem?> GetTaskByIdAsync(int id)
    {
        if (id <= 0)
            throw new ArgumentException("Invalid Task ID");

        return await _taskRepository.GetByIdAsync(id);
    }

    public async Task<IEnumerable<TaskItem>> GetAllTasksAsync()
    {
        return await _taskRepository.GetAllAsync();
    }

    public async Task<TaskItem?> CreateTaskAsync(TaskItem task)
    {
        if (task == null)
            throw new ArgumentNullException(nameof(task));

        if (string.IsNullOrWhiteSpace(task.Title))
            throw new ArgumentException("Title is required");

        if (task.CategoryId <= 0)
            throw new ArgumentException("Invalid Category ID");
        
        if (task.Deadline == null)
            throw new ArgumentException("Deadline is required");

        if (task.ParentId.HasValue && task.ParentId.Value <= 0)
            throw new ArgumentException("Invalid Parent ID");

        return await _taskRepository.CreateAsync(task);
    }

    public async Task<TaskItem?> UpdateTaskAsync(TaskItem task)
    {
        if (task == null)
            throw new ArgumentNullException(nameof(task));

        if (task.Id <= 0)
            throw new ArgumentException("Invalid Task ID");

        if (string.IsNullOrWhiteSpace(task.Title))
            throw new ArgumentException("Title is required");

        if (task.CategoryId <= 0)
            throw new ArgumentException("Invalid Category ID");

        if (task.ParentId.HasValue && task.ParentId.Value <= 0)
            throw new ArgumentException("Invalid Parent ID");

        return await _taskRepository.UpdateAsync(task);
    }

    public async Task<bool> DeleteTaskAsync(int id)
    {
        if (id <= 0)
            throw new ArgumentException("Invalid Task ID");

        return await _taskRepository.DeleteAsync(id);
    }

    public async Task<bool> CompleteTaskAsync(int id)
    {
        if (id <= 0)
            throw new ArgumentException("Invalid Task ID");

        return await _taskRepository.CompleteTaskAsync(id);
    }
}
