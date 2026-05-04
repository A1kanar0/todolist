using Backend.Entities;

namespace Backend.Repositories;

public interface IUserRepository
{
    Task<IEnumerable<User>> GetAllActiveAsync();
    Task<User?> GetByIdAsync(int id);
    Task<User?> GetByEmailAsync(string email);
    Task<int> CreateAsync(User user);
    Task<bool> UpdateAsync(User user);
    Task<bool> SoftDeleteAsync(int id);
    Task<IEnumerable<User>> GetUsersByTaskIdAsync(int taskId);
}
