using System.Collections.Generic;

namespace BassLines.Api.ViewModels
{
    public class UserMetricsModel
    {
        public List<DailyRatingModel> DailyRatings { get; set; }
        public List<GenreCountModel> TopGenres { get; set; }
        public List<DailyRatingModel> TopSongs { get; set; }
        public List<ArtistCountModel> TopArtists { get; set; }
        public decimal? AverageRating { get; set; }
        public int SongSubmissionCount { get; set; }
        public int UniqueArtistCount { get; set; }
        public int UniqueGenreCount { get; set; }
        public List<SpotifyLinkReference> SpotifySongs { get; set; }
    }
}