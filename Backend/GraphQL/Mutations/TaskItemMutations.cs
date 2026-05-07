using Backend.Entities;
using Backend.Services;

namespace Backend.GraphQL.Mutations;

public record CreateTaskInput(
    string Title, 
    string Content, 
    DateTime? Deadline = null,
    int? CategoryId = null, 
    int? ParentId = null,
    List<int>? ExecutorIds = null
);

public record UpdateTaskInput(
    int Id, 
    string Title, 
    bool IsCompleted, 
    int? CategoryId = null, 
    int? ParentId = null, 
    string? Content = null, 
    DateTime? Deadline = null,
    List<int>? ExecutorIds = null
);

[ExtendObjectType("Mutation")]
public class TaskItemMutations
{
    public async Task<TaskItem> CreateTaskAsync(CreateTaskInput input, [Service] ITaskItemService taskService)
    {
        var task = new TaskItem
        {
            CategoryId = input.CategoryId,
            ParentId = input.ParentId,
            Title = input.Title,
            Content = input.Content,
            Deadline = input.Deadline,
            CreatedAt = DateTime.UtcNow,
            IsCompleted = false
        };

        return await taskService.CreateTaskAsync(task, input.ExecutorIds) 
               ?? throw new GraphQLException("Не вдалося створити завдання");
    }

    public async Task<TaskItem> UpdateTaskAsync(UpdateTaskInput input, [Service] ITaskItemService taskService)
    {
        var task = new TaskItem
        {
            Id = input.Id,
            CategoryId = input.CategoryId,
            ParentId = input.ParentId,
            Title = input.Title,
            Content = input.Content,
            IsCompleted = input.IsCompleted,
            Deadline = input.Deadline
        };

        return await taskService.UpdateTaskAsync(task, input.ExecutorIds) 
               ?? throw new GraphQLException("Не вдалося оновити завдання");
    }

    public async Task<bool> DeleteTaskAsync(int id, [Service] ITaskItemService taskService)
    {
        var isDeleted = await taskService.DeleteTaskAsync(id);
        
        if (!isDeleted)
        {
            throw new GraphQLException("Не вдалося видалити завдання");
        }
        
        return true;
    }
    
    public async Task<bool> DeleteSingleTaskAsync(int id, [Service] ITaskItemService taskService)
    {
        var isDeleted = await taskService.DeleteSingleTaskAsync(id);
    
        if (!isDeleted)
        {
            throw new GraphQLException("Не вдалося видалити завдання (можливо, його не існує)");
        }
    
        return true;
    }

    public async Task<bool> CompleteTaskAsync(int id, [Service] ITaskItemService taskService)
    {
        var isCompleted = await taskService.CompleteTaskAsync(id);
        
        if (!isCompleted)
        {
            throw new GraphQLException("Не вдалося змінити статус виконання завдання");
        }
        
        return true;
    }
}
