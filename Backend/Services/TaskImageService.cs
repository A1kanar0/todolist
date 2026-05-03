using Backend.Entities;
using Backend.Repositories;


namespace Backend.Services;

public class TaskImageService : ITaskImageService
{
    private readonly ITaskImageRepository _repository;
    private readonly IFileService _fileService;

    public TaskImageService(ITaskImageRepository repository, IFileService fileService)
    {
        _repository = repository;
        _fileService = fileService;
    }

    public async Task<TaskImage> UploadImageAsync(int taskId, HotChocolate.Types.IFile file)
    {
        var filePath = await _fileService.SaveFileAsync(file, "tasks");

        var taskImage = new TaskImage
        {
            TaskId = taskId,
            FilePath = filePath,
            FileName = file.Name
        };

        var id = await _repository.AddImageAsync(taskImage);
        taskImage.Id = id;

        return taskImage;
    }

    public async Task<IEnumerable<TaskImage>> GetImagesByTaskIdAsync(int taskId)
    {
        return await _repository.GetByTaskIdAsync(taskId);
    }

    public async Task<bool> DeleteImageAsync(int id)
    {
        var image = await _repository.GetByIdAsync(id);
        if (image == null) return false;

        var isDeleted = await _repository.DeleteAsync(id);
        if (isDeleted)
        {
            _fileService.DeleteFile(image.FilePath);
        }

        return isDeleted;
    }

    public void DeleteFiles(IEnumerable<TaskImage> images)
    {
        foreach (var img in images)
        {
            _fileService.DeleteFile(img.FilePath);
        }
    }
}
