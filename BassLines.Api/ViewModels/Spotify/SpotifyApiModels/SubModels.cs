using System.Collections.Generic;

namespace BassLines.Api.ViewModels
{
    public class SearchRoot<T>
    {
        public string href { get; set; }
        public List<T> items { get; set; }
        public int? limit { get; set; }
        public string next { get; set; }
        public int? offset { get; set; }
        public object previous { get; set; }
        public int? total { get; set; }
    }

    public class SearchResponse
    {
        public SearchRoot<TrackDetails> tracks { get; set; }
        public SearchRoot<ArtistDetails> artists { get; set; }
    }

    public class MultipleEntityResponse
    {
        public List<TrackDetails> tracks { get; set; } = new List<TrackDetails>();
        public List<ArtistDetails> artists { get; set; } = new List<ArtistDetails>();
    }

    public class RecommendationsResponse
    {
        public List<Seed> seeds { get; set; }
        public List<Track> tracks { get; set; }
    }

public class Copyright
    {
        public string text { get; set; }
        public string type { get; set; }
    }

    public class ExternalIds
    {
        public string upc { get; set; }
    }

    public class ExternalUrls
    {
        public string spotify { get; set; }
    }

    public class Image
    {
        public int? height { get; set; }
        public string url { get; set; }
        public int? width { get; set; }
    }

    public class Item
    {
        public List<Artist> artists { get; set; }
        public List<string> available_markets { get; set; }
        public int disc_number { get; set; }
        public int duration_ms { get; set; }
        public bool @explicit { get; set; }
        public ExternalUrls external_urls { get; set; }
        public string href { get; set; }
        public string id { get; set; }
        public bool is_local { get; set; }
        public string name { get; set; }
        public string preview_url { get; set; }
        public int track_number { get; set; }
        public string type { get; set; }
        public string uri { get; set; }
    }
        public class Seed
    {
        public int? afterFilteringSize { get; set; }
        public int? afterRelinkingSize { get; set; }
        public string href { get; set; }
        public string id { get; set; }
        public int? initialPoolSize { get; set; }
        public string type { get; set; }
    }

    

    public class LinkedFrom
    {
        public ExternalUrls external_urls { get; set; }
        public string href { get; set; }
        public string id { get; set; }
        public string type { get; set; }
        public string uri { get; set; }
    }

    public class Restrictions
    {
        public string reason { get; set; }
    }

    public class ExplicitContent
    {
        public bool filter_enabled { get; set; }
        public bool filter_locked { get; set; }
    }

    public class Followers
    {
        public object href { get; set; }
        public int? total { get; set; }
    }
 
    public class GenreSeeds
    {
        public List<string> genres { get; set; }
    }
}