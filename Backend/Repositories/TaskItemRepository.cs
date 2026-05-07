using Backend.Entities;
using Backend.Data;
using Dapper;

namespace Backend.Repositories;

public class TaskItemRepository : ITaskItemRepository
{
    private readonly DatabaseContext _context;

    public TaskItemRepository(DatabaseContext context)
    {
        _context = context;
    }

    public async Task<TaskItem?> GetByIdAsync(int id)
    {
        using var connection = _context.CreateConnection();
        var sql = "SELECT * FROM tasks WHERE Id = @Id";
        
        return await connection.QueryFirstOrDefaultAsync<TaskItem>(sql, new { Id = id });
    }

    public async Task<IEnumerable<TaskItem>> GetAllAsync()
    {
        using var connection = _context.CreateConnection();
        var sql = "SELECT * FROM tasks";
        
        return await connection.QueryAsync<TaskItem>(sql);
    }

    public async Task<TaskItem> CreateAsync(TaskItem task, IEnumerable<int>? executorIds = null)
    {
        using var connection = _context.CreateConnection();
        connection.Open();
        using var transaction = connection.BeginTransaction();

        try
        {
            var sqlTask = """
                          INSERT INTO tasks (parent_id, category_id, title, content, is_completed, created_at, deadline) 
                          VALUES (@ParentId, @CategoryId, @Title, @Content, @IsCompleted, @CreatedAt, @Deadline) 
                          RETURNING *;
                          """;
                          
            var createdTask = await connection.QuerySingleAsync<TaskItem>(sqlTask, task, transaction);

            if (executorIds != null && executorIds.Any())
            {
                var sqlExecutors = "INSERT INTO task_executors (task_id, user_id) VALUES (@TaskId, @UserId);";
                
                var executorParams = executorIds.Select(userId => new 
                { 
                    TaskId = createdTask.Id, 
                    UserId = userId 
                });
                
                await connection.ExecuteAsync(sqlExecutors, executorParams, transaction);
            }

            transaction.Commit();
            return createdTask;
        }
        catch
        {
            transaction.Rollback();
            throw;
        }
    }

    public async Task<TaskItem?> UpdateAsync(TaskItem task, IEnumerable<int>? executorIds = null)
    {
        using var connection = _context.CreateConnection();
        connection.Open();
        using var transaction = connection.BeginTransaction();

        try
        {
            var sqlTask = """
                          UPDATE tasks 
                          SET parent_id = @ParentId,
                              category_id = @CategoryId,
                              title = @Title,
                              content = @Content,
                              is_completed = @IsCompleted,
                              deadline = @Deadline
                          WHERE id = @Id
                          RETURNING *;
                          """;
                      
            var updatedTask = await connection.QueryFirstOrDefaultAsync<TaskItem>(sqlTask, task, transaction);

            if (updatedTask != null && executorIds != null)
            {
                var sqlDeleteExecutors = "DELETE FROM task_executors WHERE task_id = @Id";
                await connection.ExecuteAsync(sqlDeleteExecutors, new { Id = task.Id }, transaction);

                if (executorIds.Any())
                {
                    var sqlInsertExecutors = "INSERT INTO task_executors (task_id, user_id) VALUES (@TaskId, @UserId)";
                
                    var executorParams = executorIds.Select(userId => new 
                    { 
                        TaskId = task.Id, 
                        UserId = userId 
                    });
                
                    await connection.ExecuteAsync(sqlInsertExecutors, executorParams, transaction);
                }
            }

            transaction.Commit();
            return updatedTask;
        }
        catch
        {
            transaction.Rollback();
            throw;
        }
    }

    public async Task<bool> DeleteAsync(int id)
    {
        using var connection = _context.CreateConnection();
        var sql = "DELETE FROM tasks WHERE id = @Id";
        
        var affectedRows = await connection.ExecuteAsync(sql, new { Id = id });
        return affectedRows > 0;
    }

    public async Task<bool> CompleteTaskAsync(int id)
    {
        using var connection = _context.CreateConnection();
        var sql = "UPDATE tasks SET is_completed = true WHERE id = @Id";
        
        var affectedRows = await connection.ExecuteAsync(sql, new { Id = id });
        return affectedRows > 0;
    }
    
    public async Task<IEnumerable<int>> GetAllTaskAndDescendantIdsAsync(int taskId)
    {
        using var connection = _context.CreateConnection();
        var sql = """
                  WITH RECURSIVE task_tree AS (
                      SELECT id FROM tasks WHERE id = @Id
                      UNION ALL
                      SELECT t.id FROM tasks t
                      INNER JOIN task_tree tt ON t.parent_id = tt.id
                  )
                  SELECT id FROM task_tree;
                  """;

        return await connection.QueryAsync<int>(sql, new { Id = taskId });
    }

    public async Task<IEnumerable<TaskItem>> GetFilteredTasksAsync(TaskFilter filter)
    {
        using var connection = _context.CreateConnection();

        var sqlBuilder = new System.Text.StringBuilder("""
          SELECT t.*, 
                 EXISTS(
                     SELECT 1 FROM tasks child 
                     WHERE child.parent_id = t.id AND child.is_completed = false
                 ) AS HasUncompletedChildren
          FROM tasks t
          WHERE 1=1
          """);

        var parameters = new DynamicParameters();

        if (filter.CategoryId.HasValue)
        {
            sqlBuilder.Append(" AND t.category_id = @CategoryId");
            parameters.Add("CategoryId", filter.CategoryId.Value);
        }

        if (filter.IsCompleted.HasValue)
        {
            sqlBuilder.Append(" AND t.is_completed = @IsCompleted");
            parameters.Add("IsCompleted", filter.IsCompleted.Value);
        }

        if (filter.DeadlineFrom.HasValue)
        {
            sqlBuilder.Append(" AND t.deadline >= @DeadlineFrom");
            parameters.Add("DeadlineFrom", filter.DeadlineFrom.Value);
        }

        if (filter.DeadlineTo.HasValue)
        {
            sqlBuilder.Append(" AND t.deadline <= @DeadlineTo");
            parameters.Add("DeadlineTo", filter.DeadlineTo.Value);
        }

        if (filter.ExecutorIds != null && filter.ExecutorIds.Any())
        {
            sqlBuilder.Append(" AND EXISTS (SELECT 1 FROM task_executors te WHERE te.task_id = t.id AND te.user_id = ANY(@ExecutorIds))");
            parameters.Add("ExecutorIds", filter.ExecutorIds);
        }

        if (filter.SortByDeadlineAscending.HasValue)
        {
            sqlBuilder.Append(filter.SortByDeadlineAscending.Value
                ? " ORDER BY t.deadline ASC NULLS LAST"
                : " ORDER BY t.deadline DESC NULLS LAST");
        }
        else if (filter.SortByCreatedAtAscending.HasValue)
        {
            sqlBuilder.Append(filter.SortByCreatedAtAscending.Value
                ? " ORDER BY t.created_at ASC"
                : " ORDER BY t.created_at DESC");
        }
        else
        {
            sqlBuilder.Append(" ORDER BY t.created_at DESC");
        }

        return await connection.QueryAsync<TaskItem>(sqlBuilder.ToString(), parameters);
    }
}
