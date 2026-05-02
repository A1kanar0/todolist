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

    public async Task<TaskItem> CreateAsync(TaskItem task)
    {
        using var connection = _context.CreateConnection();
        var sql = """
                  INSERT INTO tasks (parent_id, category_id, title, content, is_completed, created_at, deadline) 
                  VALUES (@ParentId, @CategoryId, @Title, @Content, @IsCompleted, @CreatedAt, @Deadline) 
                  RETURNING *;
                  """;
                  
        return await connection.QuerySingleAsync<TaskItem>(sql, task);
    }

    public async Task<TaskItem?> UpdateAsync(TaskItem task)
    {
        using var connection = _context.CreateConnection();
        var sql = """
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
                  
        return await connection.QueryFirstOrDefaultAsync<TaskItem>(sql, task);
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
