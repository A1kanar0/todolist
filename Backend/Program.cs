using System.Data;
using Npgsql;
using DbUp;  
using System.Reflection;
using DotNetEnv;

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

// GraphQL
builder.Services
    .AddGraphQLServer()
    .AddQueryType<Backend.GraphQL.Query>();

var app = builder.Build();

app.MapGraphQL();

app.Run();