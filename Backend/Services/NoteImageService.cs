using Backend.Entities;
using Backend.Repositories;
using HotChocolate.Types;

namespace Backend.Services;

public class NoteImageService : INoteImageService
{
    private readonly INoteImageRepository _repository;
    private readonly IFileService _fileService;

    public NoteImageService(INoteImageRepository repository, IFileService fileService)
    {
        _repository = repository;
        _fileService = fileService;
    }

    public async Task<NoteImage> UploadImageAsync(int noteId, IFile file)
    {
        var filePath = await _fileService.SaveFileAsync(file, "notes");
        
        var noteImage = new NoteImage
        {
            NoteId = noteId,
            FilePath = filePath,
            FileName = file.Name
        };
        
        var id = await _repository.AddImageAsync(noteImage);
        noteImage.Id = id;

        return noteImage;
    }

    public async Task<IEnumerable<NoteImage>> GetImagesByNoteIdAsync(int noteId)
    {
        return await _repository.GetByNoteIdAsync(noteId);
    }

    public void DeleteFiles(IEnumerable<NoteImage> images)
    {
        foreach (var img in images)
        {
            _fileService.DeleteFile(img.FilePath);
        }
    }

    public async Task<bool> DeleteImageAsync(int imageId)
    {
        var image = await _repository.GetByIdAsync(imageId);
        if (image == null)
        {
            return false;
        }
        
        var isDeletedFromDb = await _repository.DeleteAsync(imageId);
        
        if (isDeletedFromDb)
        {
            _fileService.DeleteFile(image.FilePath);
            return true;
        }

        return false;
    }
}
