namespace BassLines.Api.Models
{
    public class AuthSettings
    {
        public string ValidIssuer { get; set; }
        public string ValidAudience { get; set; }
        public string SecretKey { get; set; }
    }
}