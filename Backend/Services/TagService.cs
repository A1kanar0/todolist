using Backend.Repositories;

namespace Backend.Services;

public class TagService : ITagService
{
    private readonly ITagRepository _tagRepository;

    public TagService(ITagRepository tagRepository)
    {
        _tagRepository = tagRepository;
    }

    public async Task<IEnumerable<Backend.Entities.Tag>> GetAllTagsAsync() =>
        await _tagRepository.GetAllAsync();

    public async Task<Backend.Entities.Tag> CreateTagAsync(Backend.Entities.Tag tag)
    {
        if (tag == null) 
            throw new ArgumentNullException(nameof(tag));
            
        if (string.IsNullOrWhiteSpace(tag.Name)) 
            throw new ArgumentException("Tag name is required");
            
        if (string.IsNullOrWhiteSpace(tag.Color)) 
            throw new ArgumentException("Tag color is required");

        return await _tagRepository.CreateAsync(tag);
    }

    public async Task<Backend.Entities.Tag> UpdateTagAsync(Backend.Entities.Tag tagUpdates)
    {
        if (tagUpdates == null || tagUpdates.Id <= 0)
            throw new ArgumentException("Invalid Tag ID");

        if (string.IsNullOrWhiteSpace(tagUpdates.Name))
            throw new ArgumentException("Tag name cannot be empty");

        if (string.IsNullOrWhiteSpace(tagUpdates.Color))
            throw new ArgumentException("Tag color cannot be empty");

        return await _tagRepository.UpdateAsync(tagUpdates);
    }

    public async Task<bool> DeleteTagAsync(int id)
    {
        if (id <= 0) 
            throw new ArgumentException("Invalid Tag ID");

        return await _tagRepository.DeleteAsync(id);
    }
}
