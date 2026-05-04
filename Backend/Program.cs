using System.Data;
using Npgsql;
using DbUp;  
using System.Reflection;
using DotNetEnv;
using System.Text;
using Microsoft.AspNetCore.Authentication.JwtBearer;
using Microsoft.IdentityModel.Tokens;
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

builder.Services.AddHttpContextAccessor();

// GraphQL
builder.Services
    .AddGraphQLServer()
    .AddType<UploadType>()
    .AddQueryType(q => q.Name("Query"))
    .AddMutationType(m => m.Name("Mutation"))

    .AddTypeExtension<UserQueries>()
    .AddTypeExtension<NoteQueries>()
    .AddTypeExtension<CategoryQueries>()
    .AddTypeExtension<TagQueries>()
    .AddTypeExtension<TaskItemQueries>()

    .AddTypeExtension<UserMutations>()
    .AddTypeExtension<NoteMutations>()
    .AddTypeExtension<CategoryMutations>()
    .AddTypeExtension<TagMutations>()
    .AddTypeExtension<TaskItemMutations>()
    .AddTypeExtension<NoteImageMutations>()
    .AddTypeExtension<TaskImageMutations>()

    .AddType<UserType>()
    .AddType<NoteType>()
    .AddType<CategoryType>()
    .AddType<TagType>()
    .AddType<TaskItemType>()
    .ModifyRequestOptions(opt => opt.IncludeExceptionDetails = builder.Environment.IsDevelopment()) // УБРАТЬ НАХУЙ З ПРОДА
    .AddAuthorization();
    

// JWT
var jwtSettings = builder.Configuration.GetSection("Jwt");
var key = Encoding.ASCII.GetBytes(jwtSettings["Key"]!);

builder.Services.AddAuthentication(x =>
{
    x.DefaultAuthenticateScheme = JwtBearerDefaults.AuthenticationScheme;
    x.DefaultChallengeScheme = JwtBearerDefaults.AuthenticationScheme;
})
.AddJwtBearer(x =>
{
    x.RequireHttpsMetadata = false;
    x.SaveToken = true;
    x.TokenValidationParameters = new TokenValidationParameters
    {
        ValidateIssuerSigningKey = true,
        IssuerSigningKey = new SymmetricSecurityKey(key),
        ValidateIssuer = true,
        ValidIssuer = jwtSettings["Issuer"],
        ValidateAudience = true,
        ValidAudience = jwtSettings["Audience"],
        ValidateLifetime = true, 
        ClockSkew = TimeSpan.Zero
    };
    x.Events = new JwtBearerEvents
    {
        OnMessageReceived = context =>
        {
            var token = context.Request.Cookies["X-Access-Token"];
            if (!string.IsNullOrEmpty(token))
            {
                context.Token = token;
            }
            return Task.CompletedTask;
        }
    };
});

builder.Services.AddAuthorization();

// DI
builder.Services.AddHttpContextAccessor();
builder.Services.AddSingleton<DatabaseContext>();
builder.Services.AddScoped<IUserRepository, UserRepository>();
builder.Services.AddScoped<IUserService, UserService>();
builder.Services.AddScoped<INoteRepository, NoteRepository>();
builder.Services.AddScoped<INoteService, NoteService>();
builder.Services.AddScoped<ICurrentUserService, CurrentUserService>();
builder.Services.AddScoped<ICategoryRepository, CategoryRepository>();
builder.Services.AddScoped<ICategoryService, CategoryService>();
builder.Services.AddScoped<ITagRepository, TagRepository>();
builder.Services.AddScoped<ITagService, TagService>();
builder.Services.AddScoped<ITaskItemRepository, TaskItemRepository>();
builder.Services.AddScoped<ITaskItemService, TaskItemService>();
builder.Services.AddScoped<INoteImageRepository, NoteImageRepository>();
builder.Services.AddScoped<INoteImageService, NoteImageService>();
builder.Services.AddScoped<ITaskImageRepository, TaskImageRepository>();
builder.Services.AddScoped<ITaskImageService, TaskImageService>();
builder.Services.AddScoped<IFileService, FileService>();

var app = builder.Build();
app.UseAuthentication();
app.UseAuthorization();
app.UseStaticFiles();

app.MapGraphQL();

app.Run();
