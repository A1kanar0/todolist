using Backend.Entities;
using Backend.Repositories;

namespace Backend.Services;

public class TaskItemService : ITaskItemService
{
    private readonly ITaskItemRepository _taskRepository;
    private readonly ITaskImageService _taskImageService;

    public TaskItemService(ITaskItemRepository taskRepository, ITaskImageService taskImageService)
    {
        _taskRepository = taskRepository;
        _taskImageService = taskImageService;
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

    public async Task<TaskItem?> CreateTaskAsync(TaskItem task, IEnumerable<int>? executorIds = null)
    {
        if (task == null)
            throw new ArgumentNullException(nameof(task));

        if (string.IsNullOrWhiteSpace(task.Title))
            throw new ArgumentException("Title is required");

        if (task.CategoryId.HasValue && task.CategoryId.Value <= 0)
            throw new ArgumentException("Invalid Category ID");
        
        if (task.ParentId.HasValue && task.ParentId.Value <= 0)
            throw new ArgumentException("Invalid Parent ID");

        return await _taskRepository.CreateAsync(task, executorIds);
    }

    public async Task<TaskItem?> UpdateTaskAsync(TaskItem task, IEnumerable<int>? executorIds = null)
    {
        if (task == null)
            throw new ArgumentNullException(nameof(task));

        if (task.Id <= 0)
            throw new ArgumentException("Invalid Task ID");

        if (string.IsNullOrWhiteSpace(task.Title))
            throw new ArgumentException("Title is required");

        if (task.CategoryId.HasValue && task.CategoryId.Value <= 0)
            throw new ArgumentException("Invalid Category ID");

        if (task.ParentId.HasValue && task.ParentId.Value <= 0)
            throw new ArgumentException("Invalid Parent ID");

        return await _taskRepository.UpdateAsync(task, executorIds);
    }

    public async Task<bool> DeleteTaskAsync(int id)
    {
        if (id <= 0)
            throw new ArgumentException("Invalid Task ID");

        var images = await _taskImageService.GetImagesByTaskIdAsync(id);

        var isDeleted = await _taskRepository.DeleteAsync(id);

        if (isDeleted)
        {
            _taskImageService.DeleteFiles(images);
        }

        return isDeleted;
    }

    public async Task<bool> CompleteTaskAsync(int id)
    {
        if (id <= 0)
            throw new ArgumentException("Invalid Task ID");

        return await _taskRepository.CompleteTaskAsync(id);
    }

    public async Task<IEnumerable<TaskItem>> GetFilteredTasksAsync(TaskFilter filter)
    {
        filter ??= new TaskFilter();
        return await _taskRepository.GetFilteredTasksAsync(filter);
    }
}
