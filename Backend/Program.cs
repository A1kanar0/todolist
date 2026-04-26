using System.Data;
using Npgsql;
using DbUp;  
using System.Reflection;
using DotNetEnv;
using Backend.Repositories;
using Backend.Services;
using Backend.Data;
using Backend.GraphQL.Types;
using Backend.GraphQL.Queries;
using Backend.GraphQL.Mutations;

Env.Load();

var builder = WebApplication.CreateBuilder(args);
builder.Configuration.AddEnvironmentVariables();

var connectionString = builder.Configuration.GetConnectionString("DefaultConnection");

// DBUP migrations
var upgrader = DeployChanges.To
    .PostgresqlDatabase(connectionString)
    .WithScriptsEmbeddedInAssembly(Assembly.GetExecutingAssembly())
    .LogToConsole()
    .Build();

if (upgrader.IsUpgradeRequired())
{
    var result = upgrader.PerformUpgrade();
    if (!result.Successful)
    {
        Console.ForegroundColor = ConsoleColor.Red;
        Console.WriteLine("Performing migrations error!");
        Console.WriteLine(result.Error);
        Console.ResetColor();
        return;
    }

    Console.ForegroundColor = ConsoleColor.Green;
    Console.WriteLine("Database migration completed successfully!");
    Console.ResetColor();
}
// dapper
builder.Services.AddScoped<IDbConnection>(sp =>
    new NpgsqlConnection(connectionString));
Dapper.DefaultTypeMap.MatchNamesWithUnderscores = true;

// GraphQL
builder.Services
    .AddGraphQLServer()
    .AddQueryType(q => q.Name("Query"))
    .AddMutationType(m => m.Name("Mutation"))

    .AddTypeExtension<UserQueries>()
    .AddTypeExtension<NoteQueries>()
    .AddTypeExtension<UserMutations>()
    .AddTypeExtension<NoteMutations>()

    .AddType<UserType>()
    .AddType<NoteType>();

// DI
builder.Services.AddSingleton<DatabaseContext>();
builder.Services.AddScoped<IUserRepository, UserRepository>();
builder.Services.AddScoped<IUserService, UserService>();
builder.Services.AddScoped<INoteRepository, NoteRepository>();
builder.Services.AddScoped<INoteService, NoteService>();

var app = builder.Build();

app.MapGraphQL();

app.Run();
