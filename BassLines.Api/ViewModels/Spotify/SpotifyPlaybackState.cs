using System.Collections.Generic;
using System.Text.Json.Serialization;

namespace BassLines.Api.ViewModels
{
  public class SpotifyPlaybackState
  {
    public Device device { get; set; }
    public string repeat_state { get; set; }
    public bool shuffle_state { get; set; }
    public Context context { get; set; }
    public long? timestamp { get; set; }
    public long? progress_ms { get; set; }
    public bool is_playing { get; set; }
    public string currently_playing_type { get; set; }
    public Actions actions { get; set; }
    public TrackDetails item { get; set; }
  }

  public class Context
  {
    public string type { get; set; }
    public string href { get; set; }
    public ExternalUrls external_urls { get; set; }
    public string uri { get; set; }
  }

  public class Actions
  {
    public bool interrupting_playback { get; set; }
    public bool pausing { get; set; }
    public bool resuming { get; set; }
    public bool seeking { get; set; }
    public bool skipping_next { get; set; }
    public bool skipping_prev { get; set; }
    public bool toggling_repeat_context { get; set; }
    public bool toggling_shuffle { get; set; }
    public bool toggling_repeat_track { get; set; }
    public bool transferring_playback { get; set; }
  }
}