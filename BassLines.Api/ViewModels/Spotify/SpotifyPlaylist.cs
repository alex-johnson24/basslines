using System;
using System.Collections.Generic;

namespace BassLines.Api.ViewModels
{
  public class SpotifyPlaylist
  {
    public bool collaborative { get; set; }
    public string description { get; set; }
    public ExternalUrls external_urls { get; set; }
    public string href { get; set; }
    public string id { get; set; }
    public List<Image> images { get; set; }
    public string name { get; set; }
    public PlaylistOwner owner { get; set; }
    public object primary_color { get; set; }
    public bool @public { get; set; }
    public string snapshot_id { get; set; }
    public TrackListReference tracks { get; set; }
    public string type { get; set; }
    public string uri { get; set; }

  }

  public class TrackListReference
  {
    public string href { get; set; }
    public int total { get; set; }
  }

  public class PlaylistOwner
  {
    public string display_name { get; set; }
    public ExternalUrls external_urls { get; set; }
    public string href { get; set; }
    public string id { get; set; }
    public string type { get; set; }
    public string uri { get; set; }
  }

  public class AddedBy
  {
      public ExternalUrls external_urls { get; set; }
      public string href { get; set; }
      public string id { get; set; }
      public string type { get; set; }
      public string uri { get; set; }
  }

  public class Album
  {
      public string album_type { get; set; }
      public List<Artist> artists { get; set; }
      public List<string> available_markets { get; set; }
      public ExternalUrls external_urls { get; set; }
      public string href { get; set; }
      public string id { get; set; }
      public List<Image> images { get; set; }
      public string name { get; set; }
      public string release_date { get; set; }
      public string release_date_precision { get; set; }
      public int total_tracks { get; set; }
      public string type { get; set; }
      public string uri { get; set; }
  }

  public class PlaylistTrack
  {
      public DateTime added_at { get; set; }
      public AddedBy added_by { get; set; }
      public bool is_local { get; set; }
      public object primary_color { get; set; }
      public TrackDetails track { get; set; }
      public VideoThumbnail video_thumbnail { get; set; }
  }

  public class VideoThumbnail
    {
        public object url { get; set; }
    }
}