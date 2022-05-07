namespace BassLines.Api.ViewModels
{
  public class SpotifyClientAuth
  {
    public string AccessToken { get; set; }
    public long ExpiryTime { get; set; }
    public string RefreshToken { get; set; }
  }

  public class SpotifyTokenResponse
  {
    public string access_token { get; set; }
    public string refresh_token { get; set; }
    public int expires_in { get; set; }
    public string token_type { get; set; }
    public string scope { get; set; }
  }
}
