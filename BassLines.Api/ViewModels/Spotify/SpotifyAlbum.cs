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

  public class SpotifyAlbumDetails : SpotifyAlbum
  {
    public List<SpotifyAlbumTrack> Tracks { get; set; }
  }

  public class SpotifyAlbumTrack : SongBase
  {
    public string SpotifyId { get; set; }
    public int? DurationSeconds { get; set; }
    public bool Explicit { get; set; }

  }
}