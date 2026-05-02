using Dapper;
using Backend.Entities;
using Backend.Data;

namespace Backend.Repositories;

public class NoteImageRepository : INoteImageRepository
{
    private readonly DatabaseContext _context;

    public NoteImageRepository(DatabaseContext context)
    {
        _context = context;
    }
    public async Task<int> AddImageAsync(NoteImage image)
    {
        var sql = "INSERT INTO note_images (file_path, file_name, note_id) VALUES (@FilePath, @FileName, @NoteId) RETURNING id";
        
        using var connection = _context.CreateConnection(); 
        return await connection.ExecuteScalarAsync<int>(sql, image);
    }

    public async Task<IEnumerable<NoteImage>> GetByNoteIdAsync(int noteId)
    {
        var sql = "SELECT * FROM note_images WHERE note_id = @noteId";
    
        using var connection = _context.CreateConnection();
        return await connection.QueryAsync<NoteImage>(sql, new { noteId });
    }
    
    public async Task<NoteImage?> GetByIdAsync(int id)
    {
        using var connection = _context.CreateConnection();
        var sql = "SELECT * FROM note_images WHERE id = @Id";
        return await connection.QueryFirstOrDefaultAsync<NoteImage>(sql, new { Id = id });
    }

    public async Task<bool> DeleteAsync(int id)
    {
        using var connection = _context.CreateConnection();
        var sql = "DELETE FROM note_images WHERE id = @Id";
        var affectedRows = await connection.ExecuteAsync(sql, new { Id = id });
        return affectedRows > 0;
    }
}
