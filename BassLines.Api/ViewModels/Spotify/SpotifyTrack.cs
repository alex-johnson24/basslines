using System.Collections.Generic;

namespace BassLines.Api.ViewModels
{
  public class SpotifyTrack : SongBase
  {
    public int? DurationSeconds { get; set; }
    public bool? Explicit { get; set; }
    public int? Popularity { get; set; }
    public string SpotifyId { get; set; }
    public SpotifyBase ArtistDetails { get; set; }
    public SpotifyAlbum Album { get; set; }
  }
  public class SpotifyTrackDetails : SpotifyTrack
  {
    public new SpotifyAlbumDetails Album { get; set; }
    public new SpotifyArtistDetails ArtistDetails { get; set; }
    public TrackFeatures Features { get; set; }
    public List<SpotifyAlbumTrack> RecommendedTracks { get; set; }
  }
}