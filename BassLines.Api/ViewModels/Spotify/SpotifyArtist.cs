using System.Collections.Generic;

namespace BassLines.Api.ViewModels
{
  public class SpotifyArtistDetails : SpotifyBase
  {
    public List<string> Genres { get; set; }
    public int? Popularity { get; set; }
    public List<Image> Images { get; set; }
    public int? Followers { get; set; }

  }

}