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
    string Content,
    bool IsCompleted, 
    int? CategoryId = null, 
    int? ParentId = null, 
    DateTime? Deadline = null,
    List<int>? ExecutorIds = null
);

[ExtendObjectType("Mutation")]
public class TaskItemMutations
{
    public async Task<TaskItem> CreateTaskAsync(CreateTaskInput input, [Service] ITaskItemService taskService)
    {
        if (string.IsNullOrWhiteSpace(input.Title))
        {
            throw new GraphQLException("Поле Title є обов'язковим і не може бути порожнім.");
        }

        if (string.IsNullOrWhiteSpace(input.Content))
        {
            throw new GraphQLException("Поле Content є обов'язковим і не може бути порожнім.");
        }

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

        try
        {
            return await taskService.CreateTaskAsync(task, input.ExecutorIds) 
                   ?? throw new GraphQLException("Не вдалося створити завдання.");
        }
        catch (Exception ex)
        {
            throw new GraphQLException($"Помилка створення: {ex.Message}");
        }
    }

    public async Task<TaskItem> UpdateTaskAsync(UpdateTaskInput input, [Service] ITaskItemService taskService)
    {
        if (input.Id <= 0)
        {
            throw new GraphQLException("Недійсний ID завдання.");
        }

        if (string.IsNullOrWhiteSpace(input.Title))
        {
            throw new GraphQLException("Поле Title є обов'язковим і не може бути порожнім.");
        }

        if (string.IsNullOrWhiteSpace(input.Content))
        {
            throw new GraphQLException("Поле Content є обов'язковим і не може бути порожнім.");
        }

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

        try
        {
            var updatedTask = await taskService.UpdateTaskAsync(task, input.ExecutorIds);
            
            if (updatedTask == null)
            {
                throw new GraphQLException("Не вдалося оновити завдання. Перевірте, чи існує завдання з таким ID.");
            }
            
            return updatedTask;
        }
        catch (Exception ex)
        {
            throw new GraphQLException($"Помилка оновлення: {ex.Message}");
        }
    }

    public async Task<bool> DeleteTaskAsync(int id, [Service] ITaskItemService taskService)
    {
        if (id <= 0)
        {
            throw new GraphQLException("Недійсний ID завдання.");
        }

        var isDeleted = await taskService.DeleteTaskAsync(id);
        
        if (!isDeleted)
        {
            throw new GraphQLException("Не вдалося видалити завдання.");
        }
        
        return true;
    }

    public async Task<bool> CompleteTaskAsync(int id, [Service] ITaskItemService taskService)
    {
        if (id <= 0)
        {
            throw new GraphQLException("Недійсний ID завдання.");
        }

        var isCompleted = await taskService.CompleteTaskAsync(id);
        
        if (!isCompleted)
        {
            throw new GraphQLException("Не вдалося змінити статус виконання завдання.");
        }
        
        return true;
    }
}
