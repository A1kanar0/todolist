using SixLabors.ImageSharp;
using SixLabors.ImageSharp.Processing;
using SixLabors.ImageSharp.Formats.Jpeg;
using Backend.Entities;

namespace Backend.Services;
public class FileService : IFileService
{
    private readonly IWebHostEnvironment _env;
    private const int MaxWidth = 1024;
    private const int Quality = 75;

    public FileService(IWebHostEnvironment env) => _env = env;

    public async Task<string> SaveFileAsync(IFile file, string subFolder)
    {
        var uploadPath = System.IO.Path.Combine(_env.WebRootPath, "uploads", subFolder);
        if (!Directory.Exists(uploadPath)) Directory.CreateDirectory(uploadPath);

        var fileName = $"{Guid.NewGuid()}.jpg"; 
        var filePath = System.IO.Path.Combine(uploadPath, fileName);

        using var stream = file.OpenReadStream();
        using var image = await Image.LoadAsync(stream);
        
        if (image.Width > MaxWidth)
        {
            image.Mutate(x => x.Resize(new ResizeOptions
            {
                Size = new Size(MaxWidth, 0),
                Mode = ResizeMode.Max
            }));
        }
        
        var encoder = new JpegEncoder { Quality = Quality };
        await image.SaveAsync(filePath, encoder);

        return System.IO.Path.Combine("uploads", subFolder, fileName).Replace("\\", "/");
    }

    public void DeleteFile(string? filePath)
    {
        if (string.IsNullOrEmpty(filePath)) return;
        
        var fullPath = System.IO.Path.Combine(_env.WebRootPath, filePath);
        if (File.Exists(fullPath)) File.Delete(fullPath);
    }
}
