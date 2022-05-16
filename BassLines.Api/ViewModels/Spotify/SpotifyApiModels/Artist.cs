using System.Collections.Generic;

namespace BassLines.Api.ViewModels
{
    public class Artist : SpotifEntityyRoot
    {
        public string name { get; set; }
        public ExternalUrls external_urls { get; set; }
        public string type { get; set; }
    }

    public class ArtistDetails : Artist
    {
        public Followers followers { get; set; }
        public List<string> genres { get; set; }
        public List<Image> images { get; set; }
        public int? popularity { get; set; }
    }
}