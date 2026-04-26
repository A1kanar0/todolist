using System.Security.Cryptography;
using System.Text;
using Backend.Entities;
using Backend.Repositories;

namespace Backend.Services;

public class UserService : IUserService
{
    private readonly IUserRepository _userRepository;

    public UserService(IUserRepository userRepository)
    {
        _userRepository = userRepository;
    }

    public async Task<IEnumerable<User>> GetAllUsersAsync() =>
        await _userRepository.GetAllActiveAsync();

    public async Task<User?> GetUserByIdAsync(int id) =>
        await _userRepository.GetByIdAsync(id);

    public async Task<User?> GetUserByEmailAsync(string email) =>
        await _userRepository.GetByEmailAsync(email);

    public async Task<int> CreateUserAsync(User user)
    {
        if (user == null) throw new ArgumentNullException(nameof(user));
        if (string.IsNullOrWhiteSpace(user.Username)) throw new ArgumentException("Username is required");
        if (string.IsNullOrWhiteSpace(user.Email)) throw new ArgumentException("Email is required");
        if (string.IsNullOrWhiteSpace(user.PasswordHash)) throw new ArgumentException("Password is required");

        var existingUser = await _userRepository.GetByEmailAsync(user.Email);
        if (existingUser != null) throw new Exception("Email is already taken");

        user.PasswordHash = HashPassword(user.PasswordHash);

        return await _userRepository.CreateAsync(user);
    }

    public async Task<bool> UpdateUserAsync(User userUpdates)
    {
        if (userUpdates == null || userUpdates.Id <= 0)
            throw new ArgumentException("Invalid User ID");

        var existingUser = await _userRepository.GetByIdAsync(userUpdates.Id);
        if (existingUser == null)
            throw new Exception("User not found");

        if (!string.IsNullOrWhiteSpace(userUpdates.Username))
        {
            existingUser.Username = userUpdates.Username;
        }

        if (!string.IsNullOrWhiteSpace(userUpdates.Email) && existingUser.Email != userUpdates.Email)
        {

            var emailCheck = await _userRepository.GetByEmailAsync(userUpdates.Email);
            if (emailCheck != null) throw new Exception("This email is already taken by another user");

            existingUser.Email = userUpdates.Email;
        }

        if (!string.IsNullOrWhiteSpace(userUpdates.PasswordHash))
        {
            existingUser.PasswordHash = HashPassword(userUpdates.PasswordHash);
        }

        return await _userRepository.UpdateAsync(existingUser);
    }

    public async Task<User?> AuthenticateAsync(string email, string password)
    {
        if (string.IsNullOrWhiteSpace(email) || string.IsNullOrWhiteSpace(password))
            return null;

        var user = await _userRepository.GetByEmailAsync(email);
        if (user == null) return null;

        if (VerifyPassword(password, user.PasswordHash))
        {
            return user;
        }

        return null;
    }

    // SHA-256 + Salt

    private string HashPassword(string password)
    {
        var salt = RandomNumberGenerator.GetBytes(16);
        var hash = HashPasswordWithSalt(password, salt);
        return $"{Convert.ToBase64String(salt)}:{hash}";
    }

    private bool VerifyPassword(string password, string storedHash)
    {
        var parts = storedHash.Split(':');
        if (parts.Length != 2) return false;

        var salt = Convert.FromBase64String(parts[0]);
        var expectedHash = parts[1];

        var actualHash = HashPasswordWithSalt(password, salt);
        return actualHash == expectedHash;
    }

    private string HashPasswordWithSalt(string password, byte[] salt)
    {
        using var sha256 = SHA256.Create();
        var passwordBytes = Encoding.UTF8.GetBytes(password);

        var combinedBytes = new byte[salt.Length + passwordBytes.Length];
        Buffer.BlockCopy(salt, 0, combinedBytes, 0, salt.Length);
        Buffer.BlockCopy(passwordBytes, 0, combinedBytes, salt.Length, passwordBytes.Length);

        var hashBytes = sha256.ComputeHash(combinedBytes);
        return Convert.ToHexString(hashBytes).ToLower();
    }
}
