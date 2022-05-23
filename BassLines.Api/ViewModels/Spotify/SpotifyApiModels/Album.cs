using System.Collections.Generic;

namespace BassLines.Api.ViewModels
{
    /* THESE MODELS MIRROR THE RESPONSES COMING DIRECTLY FROM SPOTIFY */
    public class AlbumRoot : SpotifEntityyRoot
    {
        public string name { get; set; }
        public string album_type { get; set; }
        public List<Artist> artists { get; set; }
        public List<string> available_markets { get; set; }
        public ExternalUrls external_urls { get; set; }
        public List<Image> images { get; set; }
        public string release_date { get; set; }
        public string release_date_precision { get; set; }
        public int? total_tracks { get; set; }
        public string type { get; set; }
    }

    public class AlbumDetails : AlbumRoot
    {
        public List<Copyright> copyrights { get; set; }
        public ExternalIds external_ids { get; set; }
        public List<object> genres { get; set; }
        public string label { get; set; }
        public int popularity { get; set; }
        public SearchRoot<Track> tracks { get; set; }
    }
}
