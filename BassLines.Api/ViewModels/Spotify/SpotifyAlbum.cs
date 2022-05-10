using System;
using System.Collections.Generic;

namespace BassLines.Api.ViewModels
{
  public class SpotifyAlbum : SpotifyBase
  {
    public List<Image> Images { get; set; }
    public SpotifyBase Artist { get; set; }
    public DateTime? ReleaseDate { get; set; }
    public int? TrackCount { get; set; }
  }
}