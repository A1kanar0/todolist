namespace Backend.GraphQL.Types;
using Backend.Entities;

public record LoginResponse(User User, string Token);
