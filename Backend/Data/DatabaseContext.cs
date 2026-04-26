using System.Data;
using Npgsql;

namespace Backend.Data;

public class DatabaseContext
{
    private readonly string _connectionString;

    public DatabaseContext(IConfiguration configuration)
    {
        _connectionString = configuration.GetConnectionString("DefaultConnection")
                            ?? throw new ArgumentNullException("Connection string is missing");
    }

    public IDbConnection CreateConnection() => new NpgsqlConnection(_connectionString);
}
