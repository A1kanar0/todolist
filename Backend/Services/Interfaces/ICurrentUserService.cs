public interface ICurrentUserService
{
    int? UserId { get; }
    void SetAuthCookie(string token);
    void ClearAuthCookie();
}
