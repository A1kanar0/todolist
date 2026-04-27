using Dapper;
using Backend.Data;

namespace Backend.Repositories;

public class TagRepository : ITagRepository
{
    private readonly DatabaseContext _context;

    public TagRepository(DatabaseContext context)
    {
        _context = context;
    }

    public async Task<IEnumerable<Backend.Entities.Tag>> GetAllAsync()
    {
        using var connection = _context.CreateConnection();
        var sql = "SELECT * FROM tags";
        
        return await connection.QueryAsync<Backend.Entities.Tag>(sql);
    }

    public async Task<Backend.Entities.Tag> CreateAsync(Backend.Entities.Tag tag)
    {
        using var connection = _context.CreateConnection();
        var sql = """
                  INSERT INTO tags (name, color) 
                  VALUES (@Name, @Color) 
                  RETURNING id;
                  """;

        tag.Id = await connection.ExecuteScalarAsync<int>(sql, tag);
        return tag;
    }

    public async Task<Backend.Entities.Tag> UpdateAsync(Backend.Entities.Tag tag)
    {
        using var connection = _context.CreateConnection();
        var sql = """
                  UPDATE tags 
                  SET name = @Name, color = @Color 
                  WHERE id = @Id;
                  """;

        await connection.ExecuteAsync(sql, tag);
        return tag;
    }

    public async Task<bool> DeleteAsync(int id)
    {
        using var connection = _context.CreateConnection();
        var sql = "DELETE FROM tags WHERE id = @Id";

        var affectedRows = await connection.ExecuteAsync(sql, new { Id = id });
        return affectedRows > 0;
    }
    public async Task<IEnumerable<Backend.Entities.Tag>> GetByNoteIdAsync(int noteId)
    {
        using var connection = _context.CreateConnection();
        var sql = """
                  SELECT t.* FROM tags t
                  JOIN note_tags nt ON t.Id = nt.tag_id
                  WHERE nt.note_id = @NoteId
                  """;

        return await connection.QueryAsync<Backend.Entities.Tag>(sql, new { NoteId = noteId });
    }
}
