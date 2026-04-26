using Dapper;
using Backend.Entities;
using Backend.Data;

namespace Backend.Repositories;

public class CategoryRepository : ICategoryRepository
{
    private readonly DatabaseContext _context;

    public CategoryRepository(DatabaseContext context)
    {
        _context = context;
    }

    public async Task<IEnumerable<Category>> GetAllAsync()
    {
        using var connection = _context.CreateConnection();
        var sql = "SELECT * FROM categories";
        
        return await connection.QueryAsync<Category>(sql);
    }

    public async Task<Category> CreateAsync(Category category)
    {
        using var connection = _context.CreateConnection();
        var sql = """
                  INSERT INTO categories (name) 
                  VALUES (@Name) 
                  RETURNING id;
                  """;

        category.Id = await connection.ExecuteScalarAsync<int>(sql, category);
        return category;
    }

    public async Task<Category> UpdateAsync(Category category)
    {
        using var connection = _context.CreateConnection();
        var sql = """
                  UPDATE categories 
                  SET name = @Name 
                  WHERE id = @Id;
                  """;

        await connection.ExecuteAsync(sql, category);
        return category;
    }

    public async Task<bool> DeleteAsync(int id)
    {
        using var connection = _context.CreateConnection();
        var sql = "DELETE FROM categories WHERE id = @Id";

        var affectedRows = await connection.ExecuteAsync(sql, new { Id = id });
        return affectedRows > 0;
    }
}
