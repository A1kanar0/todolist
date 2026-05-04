using Backend.Entities;

namespace Backend.Services;

public interface IUserService
{
    Task<IEnumerable<User>> GetAllUsersAsync();
    Task<User?> GetUserByIdAsync(int id);
    Task<User?> GetUserByEmailAsync(string email);
    Task<int> CreateUserAsync(User user);
    Task<bool> UpdateUserAsync(User user);
    Task<User?> AuthenticateAsync(string email, string password);
    string GenerateJwtToken(User user);
    Task<IEnumerable<User>> GetUsersByTaskIdAsync(int taskId);
}
