using Backend.Entities;
using HotChocolate.Types;

namespace Backend.Services;

public interface INoteImageService
{
    Task<NoteImage> UploadImageAsync(int noteId, IFile file);
    Task<IEnumerable<NoteImage>> GetImagesByNoteIdAsync(int noteId);
    Task<bool> DeleteImageAsync(int imageId);
    void DeleteFiles(IEnumerable<NoteImage> images);
}
