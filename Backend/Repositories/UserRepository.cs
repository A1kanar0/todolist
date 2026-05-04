using Dapper;
using Backend.Entities;
using Backend.Data;

namespace Backend.Repositories;

public class UserRepository : IUserRepository
{
    private readonly DatabaseContext _context;

    public UserRepository(DatabaseContext context)
    {
        _context = context;
    }

    public async Task<IEnumerable<User>> GetAllActiveAsync()
    {
        using var connection = _context.CreateConnection();
        var sql = "SELECT * FROM users WHERE is_deleted = false";
        return await connection.QueryAsync<User>(sql);
    }

    public async Task<User?> GetByIdAsync(int id)
    {
        using var connection = _context.CreateConnection();
        var sql = "SELECT * FROM users WHERE id = @Id AND is_deleted = false";
        return await connection.QuerySingleOrDefaultAsync<User>(sql, new { Id = id });
    }

    public async Task<User?> GetByEmailAsync(string email)
    {
        using var connection = _context.CreateConnection();
        var sql = "SELECT * FROM users WHERE email = @Email AND is_deleted = false";
        return await connection.QuerySingleOrDefaultAsync<User>(sql, new { Email = email });
    }

    public async Task<int> CreateAsync(User user)
    {
        using var connection = _context.CreateConnection();
        var sql = """
            INSERT INTO users (username, email, password_hash) 
            VALUES (@Username, @Email, @PasswordHash) 
            RETURNING id;
            """;

        return await connection.ExecuteScalarAsync<int>(sql, user);
    }

    public async Task<bool> UpdateAsync(User user)
    {
        using var connection = _context.CreateConnection();
        var sql = """
            UPDATE users 
            SET username = @Username, email = @Email, password_hash = @PasswordHash 
            WHERE id = @Id AND is_deleted = false;
            """;

        var affectedRows = await connection.ExecuteAsync(sql, user);
        return affectedRows > 0;
    }

    public async Task<bool> SoftDeleteAsync(int id)
    {
        using var connection = _context.CreateConnection();
        var sql = "UPDATE users SET is_deleted = true WHERE id = @Id";

        var affectedRows = await connection.ExecuteAsync(sql, new { Id = id });
        return affectedRows > 0;
    }

    public async Task<IEnumerable<User>> GetUsersByTaskIdAsync(int taskId)
    {
        using var connection = _context.CreateConnection();
        var sql = """
            SELECT u.* 
            FROM users u
            INNER JOIN task_executors te ON u.id = te.user_id
            WHERE te.task_id = @TaskId AND u.is_deleted = false;
            """;
        
        return await connection.QueryAsync<User>(sql, new { TaskId = taskId });
    }
}
