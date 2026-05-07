using Backend.Entities;
using Backend.Services;
using HotChocolate;
using HotChocolate.Types;
using HotChocolate.Authorization;
using Backend.GraphQL.Types;

namespace Backend.GraphQL.Mutations;

public record CreateUserInput(string Username, string Email, string Password);
public record UpdateUserInput(string? Username, string? Email, string? Password);
public record LoginInput(string Email, string Password);

[ExtendObjectType("Mutation")]
public class UserMutations
{
	// [Authorize]
	public async Task<User> CreateUserAsync(CreateUserInput input, [Service] IUserService userService)
	{
		var newUser = new User
		{
			Username = input.Username,
			Email = input.Email,
			PasswordHash = input.Password
		};

		var id = await userService.CreateUserAsync(newUser);

		return await userService.GetUserByIdAsync(id)
			   ?? throw new GraphQLException("Помилка при отриманні створеного користувача");
	}
	[Authorize]
	public async Task<User> UpdateUserAsync(UpdateUserInput input, [Service] IUserService userService, [Service] ICurrentUserService currentUserService)
	{

		var userId = currentUserService.UserId
					 ?? throw new GraphQLException("Користувача не ідентифіковано");

		var userUpdates = new User
		{
			Id = userId,
			Username = input.Username ?? string.Empty,
			Email = input.Email ?? string.Empty,
			PasswordHash = input.Password ?? string.Empty
		};

		var isUpdated = await userService.UpdateUserAsync(userUpdates);
		if (!isUpdated)
		{
			throw new GraphQLException("Не вдалося оновити дані користувача");
		}

		return await userService.GetUserByIdAsync(userId)
			   ?? throw new GraphQLException("Користувача не знайдено після оновлення");
	}

	public async Task<LoginResponse> LoginAsync(LoginInput input, [Service] IUserService userService, [Service] ICurrentUserService currentUserService)
	{
		var user = await userService.AuthenticateAsync(input.Email, input.Password);

		if (user == null)
			throw new GraphQLException("Неправильний Email або пароль");

		var token = userService.GenerateJwtToken(user);
		currentUserService.SetAuthCookie(token);
		
		return new LoginResponse(user, token);
	}
	
	[Authorize]
	public bool Logout([Service] ICurrentUserService currentUserService)
	{
		currentUserService.ClearAuthCookie();
		return true;
	}
	
	[Authorize]
	public async Task<bool> DeleteUserAsync(
		int targetUserId, 
		[Service] IUserService userService, 
		[Service] ICurrentUserService currentUserService)
	{
		var currentUserId = currentUserService.UserId 
		                    ?? throw new GraphQLException("Ви не авторизовані");

		// --- SAFETY CAR ---
		// var allowedAdminIds = new[] { 1, 2 }; // Впиши сюди ID юзерів, яким можна все
		// if (currentUserId != targetUserId && !allowedAdminIds.Contains(currentUserId)) 
		// {
		//     throw new GraphQLException("Доступ заборонено. Ви можете видалити лише себе.");
		// }
		// -----------------------------------------

		var isDeleted = await userService.SoftDeleteUserAsync(targetUserId);

		if (!isDeleted)
		{
			throw new GraphQLException("Не вдалося видалити користувача (можливо, його не існує)");
		}
		
		if (currentUserId == targetUserId)
		{
			currentUserService.ClearAuthCookie();
		}

		return true;
	}
}
