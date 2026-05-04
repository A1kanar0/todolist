using Backend.Entities;
using Backend.Services;

namespace Backend.GraphQL.Queries;

[ExtendObjectType("Query")]
public class TaskItemQueries
{
    public async Task<IEnumerable<TaskItem>> GetTasksAsync(
    TaskFilter? filter,
    [Service] ITaskItemService taskService)
    {
        return await taskService.GetFilteredTasksAsync(filter ?? new TaskFilter());
    }

    public async Task<TaskItem?> GetTaskByIdAsync(int id, [Service] ITaskItemService taskService)
    {
        return await taskService.GetTaskByIdAsync(id);
    }
}
