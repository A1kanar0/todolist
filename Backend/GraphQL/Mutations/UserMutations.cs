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
			   ?? throw new Exception("Помилка при отриманні створеного користувача");
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
			throw new Exception("Не вдалося оновити дані користувача");
		}

		return await userService.GetUserByIdAsync(userId)
			   ?? throw new Exception("Користувача не знайдено після оновлення");
	}

	public async Task<LoginResponse> LoginAsync(LoginInput input, [Service] IUserService userService)
	{
		var user = await userService.AuthenticateAsync(input.Email, input.Password);

		if (user == null)
			throw new GraphQLException("Неправильний Email або пароль");

		var token = userService.GenerateJwtToken(user);

		return new LoginResponse(user, token);
	}
}
