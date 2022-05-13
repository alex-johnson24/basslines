using System.Collections.Generic;

namespace BassLines.Api.ViewModels
{
    /* THESE MODELS MIRROR THE RESPONSES COMING DIRECTLY FROM SPOTIFY */
    public class SpotifEntityyRoot
    {
        public string id { get; set; }
        public string href { get; set; }
        public string uri { get; set; }
    }

    public class Track : SpotifEntityyRoot
    {
        public string name { get; set; }
        public List<Artist> artists { get; set; }
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

    public class SpotifyUserProfile : SpotifEntityyRoot
    {
        public string name { get; set; }
        public string country { get; set; }
        public string display_name { get; set; }
        public string email { get; set; }
        public ExplicitContent explicit_content { get; set; }
        public ExternalUrls external_urls { get; set; }
        public Followers followers { get; set; }
        public List<Image> images { get; set; }
        public string product { get; set; }
        public string type { get; set; }
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
        public int height { get; set; }
        public string url { get; set; }
        public int width { get; set; }
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

    public class AlbumDetails : AlbumRoot
    {
        public List<Copyright> copyrights { get; set; }
        public ExternalIds external_ids { get; set; }
        public List<object> genres { get; set; }
        public string label { get; set; }
        public int popularity { get; set; }
        public Tracks tracks { get; set; }
    }

    public class Tracks
    {
        public string href { get; set; }
        public List<Item> items { get; set; }
        public int limit { get; set; }
        public object next { get; set; }
        public int offset { get; set; }
        public object previous { get; set; }
        public int total { get; set; }
    }

    public class SearchRoot
    {
        public string href { get; set; }
        public List<TrackDetails> items { get; set; }
        public int? limit { get; set; }
        public string next { get; set; }
        public int? offset { get; set; }
        public object previous { get; set; }
        public int? total { get; set; }
    }

    public class SearchResponse
    {
        public SearchRoot tracks { get; set; }
    }

    public class RecommendationsResponse
    {
        public List<Seed> seeds { get; set; }
        public List<Track> tracks { get; set; }
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

    public class TrackFeatures
    {
        public double? danceability { get; set; }
        public double? energy { get; set; }
        public int? key { get; set; }
        public double? loudness { get; set; }
        public int? mode { get; set; }
        public double? speechiness { get; set; }
        public double? acousticness { get; set; }
        public double? instrumentalness { get; set; }
        public double? liveness { get; set; }
        public double? valence { get; set; }
        public double? tempo { get; set; }
        public string type { get; set; }
        public string id { get; set; }
        public string uri { get; set; }
        public string track_href { get; set; }
        public string analysis_url { get; set; }
        public int? duration_ms { get; set; }
        public int? time_signature { get; set; }
    }
 
    public class GenreSeeds
    {
        public List<string> genres { get; set; }
    }
}
