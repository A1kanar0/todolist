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
                  SET title = @Title, content = @Content, author_id = @AuthorId
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
    
    public async Task<IEnumerable<Note>> GetByTagIdAsync(int tagId)
    {
        using var connection = _context.CreateConnection();
        var sql = """
                  SELECT n.* FROM notes n
                  JOIN note_tags nt ON n.Id = nt.note_id
                  WHERE nt.tag_id = @TagId
                  """;

        return await connection.QueryAsync<Note>(sql, new { TagId = tagId });
    }
    public async Task<bool> AddTagAsync(int noteId, int tagId)
    {
        using var connection = _context.CreateConnection();
        var sql = "INSERT INTO note_tags (note_id, tag_id) VALUES (@NoteId, @TagId) ON CONFLICT DO NOTHING";
        var affectedRows = await connection.ExecuteAsync(sql, new { NoteId = noteId, TagId = tagId });
        return affectedRows > 0;
    }

    public async Task<bool> RemoveTagAsync(int noteId, int tagId)
    {
        using var connection = _context.CreateConnection();
        var sql = "DELETE FROM note_tags WHERE note_id = @NoteId AND tag_id = @TagId";
        var affectedRows = await connection.ExecuteAsync(sql, new { NoteId = noteId, TagId = tagId });
        return affectedRows > 0;
    }
    
    public async Task SyncTagsAsync(int noteId, List<int> tagIds)
    {
        using var connection = _context.CreateConnection();
        connection.Open();
        using var transaction = connection.BeginTransaction();

        try
        {
            await connection.ExecuteAsync(
                "DELETE FROM note_tags WHERE note_id = @NoteId", 
                new { NoteId = noteId }, 
                transaction);

            if (tagIds != null && tagIds.Any())
            {
                var sql = "INSERT INTO note_tags (note_id, tag_id) VALUES (@NoteId, @TagId)";
                var parameters = tagIds.Select(id => new { NoteId = noteId, TagId = id });
                await connection.ExecuteAsync(sql, parameters, transaction);
            }

            transaction.Commit();
        }
        catch
        {
            transaction.Rollback();
            throw;
        }
    }
}
