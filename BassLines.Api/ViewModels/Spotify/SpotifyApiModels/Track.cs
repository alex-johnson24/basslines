using System.Collections.Generic;

namespace BassLines.Api.ViewModels
{
    public class Track : SpotifEntityyRoot
    {
        public string name { get; set; }
        public List<ArtistDetails> artists { get; set; }
        public List<string> available_markets { get; set; }
        public int? disc_number { get; set; }
        public int? duration_ms { get; set; }
        public bool @explicit { get; set; }
        public ExternalUrls external_urls { get; set; }
        public bool is_playable { get; set; }
        public LinkedFrom linked_from { get; set; }
        public Restrictions restrictions { get; set; }
        public string preview_url { get; set; }
        public int? track_number { get; set; }
        public string type { get; set; }
        public bool is_local { get; set; }
    }
    
    public class TrackDetails : Track
    {
        public AlbumRoot album { get; set; }
        public ExternalIds external_ids { get; set; }
        public int? popularity { get; set; }
    }
  }