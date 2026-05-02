using Backend.Entities;
namespace Backend.Services;

public interface IFileService
{
    Task<string> SaveFileAsync(IFile file, string subFolder);
    void DeleteFile(string filePath);
}
