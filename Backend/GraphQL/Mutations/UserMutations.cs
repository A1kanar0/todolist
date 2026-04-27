using Backend.Entities;
using Backend.Services;
using HotChocolate;
using HotChocolate.Types;

namespace Backend.GraphQL.Mutations;

public record CreateUserInput(string Username, string Email, string Password);
public record UpdateUserInput(int Id, string? Username, string? Email, string? Password);
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
			   ?? throw new GraphQLException("Помилка при отриманні створеного користувача");
	}

	public async Task<User> UpdateUserAsync(UpdateUserInput input, [Service] IUserService userService)
	{
		var userUpdates = new User
		{
			Id = input.Id,
			Username = input.Username ?? string.Empty,
			Email = input.Email ?? string.Empty,
			PasswordHash = input.Password ?? string.Empty
		};

		var isUpdated = await userService.UpdateUserAsync(userUpdates);
		if (!isUpdated)
		{
			throw new GraphQLException("Не вдалося оновити дані користувача");
		}

		return await userService.GetUserByIdAsync(input.Id)
			   ?? throw new GraphQLException("Користувача не знайдено після оновлення");
	}

	public async Task<User> LoginAsync(LoginInput input, [Service] IUserService userService)
	{
		var user = await userService.AuthenticateAsync(input.Email, input.Password);

		if (user == null)
		{
			throw new GraphQLException("Неправильний Email або пароль");
		}

		return user;
	}
}
