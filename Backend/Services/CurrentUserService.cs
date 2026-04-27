using System.Security.Claims;

namespace Backend.Services;

public class CurrentUserService : ICurrentUserService
{
    private readonly IHttpContextAccessor _httpContextAccessor;

    public CurrentUserService(IHttpContextAccessor httpContextAccessor)
    {
        _httpContextAccessor = httpContextAccessor;
    }

    public int? UserId
    {
        get
        {
            var idClaim = _httpContextAccessor.HttpContext?.User?.FindFirst(ClaimTypes.NameIdentifier)?.Value;
            return idClaim != null ? int.Parse(idClaim) : null;
        }
    }

    public void SetAuthCookie(string token)
    {
        var cookieOptions = new CookieOptions
        {
            HttpOnly = true,
            Secure = false, // In prod - true
            SameSite = SameSiteMode.Strict,
            Expires = DateTime.UtcNow.AddDays(7)
        };
        

        _httpContextAccessor.HttpContext?.Response.Cookies.Append("X-Access-Token", token, cookieOptions);
    }

    public void ClearAuthCookie()
    {
        _httpContextAccessor.HttpContext?.Response.Cookies.Delete("X-Access-Token");
    }
}
