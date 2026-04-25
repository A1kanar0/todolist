using Dapper;
using System.Data;

namespace Backend.GraphQL;

public class Query
{
    // Приклад запиту через Dapper
    public async Task<IEnumerable<dynamic>> GetHealthCheck([Service] IDbConnection db)
    {
        return await db.QueryAsync("SELECT 1 as status");
    }
}