using Backend.Entities;
using Backend.Services;
using HotChocolate.Types;
using HotChocolate.Authorization;

namespace Backend.GraphQL.Queries;

[ExtendObjectType("Query")]
public class UserQueries
{
    public async Task<IEnumerable<User>> GetUsersAsync([Service] IUserService userService)
    {
        return await userService.GetAllUsersAsync();
    }
    public async Task<User?> GetUserByIdAsync(int id, [Service] IUserService userService)
    {
        return await userService.GetUserByIdAsync(id);
    }
    public async Task<User?> GetUserByEmailAsync(string email, [Service] IUserService userService)
    {
        return await userService.GetUserByEmailAsync(email);
    }

    public async Task<IEnumerable<User>> GetUsersByTaskIdAsync(int taskId, [Service] IUserService userService)
    {
        return await userService.GetUsersByTaskIdAsync(taskId);
    }
}
