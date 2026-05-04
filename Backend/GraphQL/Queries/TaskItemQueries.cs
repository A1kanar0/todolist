using Backend.Entities;
using Backend.Services;

namespace Backend.GraphQL.Queries;

[ExtendObjectType("Query")]
public class TaskItemQueries
{
    public async Task<IEnumerable<TaskItem>> GetTasksAsync([Service] ITaskItemService taskService)
    {
        return await taskService.GetAllTasksAsync();
    }

    public async Task<TaskItem?> GetTaskByIdAsync(int id, [Service] ITaskItemService taskService)
    {
        return await taskService.GetTaskByIdAsync(id);
    }
    public async Task<IEnumerable<TaskItem>> GetTasksByCategoryIdAsync(int categoryId, [Service] ITaskItemService taskService)
    {
        return await taskService.GetTasksByCategoryIdAsync(categoryId);
    }
}
