namespace BassLines.Api.Models
{
    public class SpotifySettings
    {
        public string ClientId { get; set; }
        public string ClientSecret { get; set; }
        public string RedirectUri { get; set; }
        public string AuthUrl { get; set; }
        public string PlaylistPrefix = "@basslines:";
    }
}