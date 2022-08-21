namespace BassLines.Api.ViewModels
{
    public class CreatePlaylistRequest : AddTracksToPlaylistRequest
    {
        public string Name { get; set; }
        public bool? Public { get; set; }
        public bool? Collaborative { get; set; }
        public string Description { get; set; }
    }

    public class AddTracksToPlaylistRequest
    {
      public string Id { get; set; } // only used when adding tracks, not creating
      public string[] TrackUris { get; set; }
      public string UserId { get; set; }
    }
}