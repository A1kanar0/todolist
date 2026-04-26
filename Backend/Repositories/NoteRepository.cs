using Dapper;
using Backend.Entities;
using Backend.Data;

namespace Backend.Repositories;

public class NoteRepository : INoteRepository
{
    private readonly DatabaseContext _context;

    public NoteRepository(DatabaseContext context)
    {
        _context = context;
    }

    public async Task<IEnumerable<Note>> GetAllAsync()
    {
        using var connection = _context.CreateConnection();
        var sql = "SELECT * FROM notes";
        
        return await connection.QueryAsync<Note>(sql);
    }

    public async Task<Note> CreateAsync(Note note)
    {
        using var connection = _context.CreateConnection();
        var sql = """
                  INSERT INTO notes (author_id, title, content) 
                  VALUES (@AuthorId, @Title, @Content) 
                  RETURNING id;
                  """;

        note.Id = await connection.ExecuteScalarAsync<int>(sql, note);
        return note;
    }

    public async Task<Note> UpdateAsync(Note note)
    {
        using var connection = _context.CreateConnection();
        var sql = """
                  UPDATE notes 
                  SET title = @Title, content = @Content
                  WHERE id = @Id;
                  """;

        await connection.ExecuteAsync(sql, note);
        return note;
    }

    public async Task<bool> DeleteAsync(int id)
    {
        using var connection = _context.CreateConnection();
        var sql = "DELETE FROM notes WHERE id = @Id";

        var affectedRows = await connection.ExecuteAsync(sql, new { Id = id });
        return affectedRows > 0;
    }
}
