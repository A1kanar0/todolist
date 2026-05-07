using Backend.Entities;
using Backend.Services;
using HotChocolate.Authorization;
using Backend.GraphQL.Types;

namespace Backend.GraphQL.Mutations;

public record CreateUserInput(string Username, string Email, string Password);
public record UpdateUserInput(string Username, string Email, string Password);
public record LoginInput(string Email, string Password);

[ExtendObjectType("Mutation")]
public class UserMutations
{
    public async Task<User> CreateUserAsync(CreateUserInput input, [Service] IUserService userService)
    {
        if (string.IsNullOrWhiteSpace(input.Username))
        {
            throw new GraphQLException("Поле Username є обов'язковим і не може бути порожнім.");
        }

        if (string.IsNullOrWhiteSpace(input.Email))
        {
            throw new GraphQLException("Поле Email є обов'язковим і не може бути порожнім.");
        }

        if (string.IsNullOrWhiteSpace(input.Password))
        {
            throw new GraphQLException("Поле Password є обов'язковим і не може бути порожнім.");
        }

        var newUser = new User
        {
            Username = input.Username,
            Email = input.Email,
            PasswordHash = input.Password
        };

        try
        {
            var id = await userService.CreateUserAsync(newUser);

            return await userService.GetUserByIdAsync(id)
                   ?? throw new GraphQLException("Помилка при отриманні створеного користувача.");
        }
        catch (Exception ex)
        {
            throw new GraphQLException($"Помилка створення: {ex.Message}");
        }
    }

    [Authorize]
    public async Task<User> UpdateUserAsync(UpdateUserInput input, [Service] IUserService userService, [Service] ICurrentUserService currentUserService)
    {
        var userId = currentUserService.UserId
                     ?? throw new GraphQLException("Користувача не ідентифіковано.");

        if (string.IsNullOrWhiteSpace(input.Username))
        {
            throw new GraphQLException("Поле Username є обов'язковим і не може бути порожнім.");
        }

        if (string.IsNullOrWhiteSpace(input.Email))
        {
            throw new GraphQLException("Поле Email є обов'язковим і не може бути порожнім.");
        }

        if (string.IsNullOrWhiteSpace(input.Password))
        {
            throw new GraphQLException("Поле Password є обов'язковим і не може бути порожнім.");
        }

        var userUpdates = new User
        {
            Id = userId,
            Username = input.Username,
            Email = input.Email,
            PasswordHash = input.Password
        };

        try
        {
            var isUpdated = await userService.UpdateUserAsync(userUpdates);
            
            if (!isUpdated)
            {
                throw new GraphQLException("Не вдалося оновити дані користувача.");
            }

            return await userService.GetUserByIdAsync(userId)
                   ?? throw new GraphQLException("Користувача не знайдено після оновлення.");
        }
        catch (Exception ex)
        {
            throw new GraphQLException($"Помилка оновлення: {ex.Message}");
        }
    }

    public async Task<LoginResponse> LoginAsync(LoginInput input, [Service] IUserService userService, [Service] ICurrentUserService currentUserService)
    {
        if (string.IsNullOrWhiteSpace(input.Email))
        {
            throw new GraphQLException("Поле Email є обов'язковим і не може бути порожнім.");
        }

        if (string.IsNullOrWhiteSpace(input.Password))
        {
            throw new GraphQLException("Поле Password є обов'язковим і не може бути порожнім.");
        }

        try
        {
            var user = await userService.AuthenticateAsync(input.Email, input.Password);

            if (user == null)
            {
                throw new GraphQLException("Неправильний Email або пароль.");
            }

            var token = userService.GenerateJwtToken(user);
            currentUserService.SetAuthCookie(token);
            
            return new LoginResponse(user, token);
        }
        catch (Exception ex)
        {
            throw new GraphQLException($"Помилка авторизації: {ex.Message}");
        }
    }
    
    [Authorize]
    public bool Logout([Service] ICurrentUserService currentUserService)
    {
        try
        {
            currentUserService.ClearAuthCookie();
            return true;
        }
        catch (Exception ex)
        {
            throw new GraphQLException($"Помилка виходу з системи: {ex.Message}");
        }
    }
    
    [Authorize]
    public async Task<bool> DeleteUserAsync(
        int targetUserId, 
        [Service] IUserService userService, 
        [Service] ICurrentUserService currentUserService)
    {
        var currentUserId = currentUserService.UserId 
                            ?? throw new GraphQLException("Ви не авторизовані.");

        if (targetUserId <= 0)
        {
            throw new GraphQLException("Недійсний ID користувача.");
        }

        try
        {
            var isDeleted = await userService.SoftDeleteUserAsync(targetUserId);

            if (!isDeleted)
            {
                throw new GraphQLException("Не вдалося видалити користувача (можливо, його не існує).");
            }
            
            if (currentUserId == targetUserId)
            {
                currentUserService.ClearAuthCookie();
            }

            return true;
        }
        catch (Exception ex)
        {
            throw new GraphQLException($"Помилка видалення: {ex.Message}");
        }
    }
}
