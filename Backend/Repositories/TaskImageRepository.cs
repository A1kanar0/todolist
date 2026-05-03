using Backend.Data;
using Backend.Entities;
using Dapper;

namespace Backend.Repositories;

public class TaskImageRepository : ITaskImageRepository
{
    private readonly DatabaseContext _context;

    public TaskImageRepository(DatabaseContext context)
    {
        _context = context;
    }

    public async Task<int> AddImageAsync(TaskImage taskImage)
    {
        using var connection = _context.CreateConnection();
        var sql = """
                  INSERT INTO task_images (file_path, file_name, task_id) 
                  VALUES (@FilePath, @FileName, @TaskId) 
                  RETURNING id;
                  """;

        return await connection.QuerySingleAsync<int>(sql, taskImage);
    }

    public async Task<IEnumerable<TaskImage>> GetByTaskIdAsync(int taskId)
    {
        using var connection = _context.CreateConnection();
        var sql = "SELECT id, file_path as FilePath, file_name as FileName, task_id as TaskId FROM task_images WHERE task_id = @TaskId";
        return await connection.QueryAsync<TaskImage>(sql, new { TaskId = taskId });
    }

    public async Task<TaskImage?> GetByIdAsync(int id)
    {
        using var connection = _context.CreateConnection();
        var sql = "SELECT id, file_path as FilePath, file_name as FileName, task_id as TaskId FROM task_images WHERE id = @Id";
        return await connection.QueryFirstOrDefaultAsync<TaskImage>(sql, new { Id = id });
    }

    public async Task<bool> DeleteAsync(int id)
    {
        using var connection = _context.CreateConnection();
        var sql = "DELETE FROM task_images WHERE id = @Id";
        var affectedRows = await connection.ExecuteAsync(sql, new { Id = id });
        return affectedRows > 0;
    }
}
