using System.Collections.Generic;

namespace BassLines.Api.ViewModels
{
  public class SpotifyUserProfile : SpotifEntityyRoot
  {
    public string country { get; set; }
    public string display_name { get; set; }
    public string email { get; set; }
    public ExplicitContent explicit_content { get; set; }
    public ExternalUrls external_urls { get; set; }
    public Followers followers { get; set; }
    public List<Image> images { get; set; }
    public string product { get; set; }
    public string type { get; set; }
  }
}