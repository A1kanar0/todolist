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
}
