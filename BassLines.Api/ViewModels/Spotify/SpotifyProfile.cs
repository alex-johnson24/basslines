using System.Collections.Generic;

namespace BassLines.Api.ViewModels
{
  public class SpotifyProfile : SpotifyBase
  {
    public int Followers { get; set; }
    public string PhotoUrl { get; set; }
  }
}