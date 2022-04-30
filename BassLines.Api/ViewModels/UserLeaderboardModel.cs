namespace BassLines.Api.ViewModels
{
    public partial class UserLeaderboardModel
    {
        //Calc place on frontend
        public string Name { get; set; }
        public decimal? Average { get; set; }
        public int UniqueGenres { get; set; }
        public string HighestRatedSong { get; set; }
        public decimal? HighestRating { get; set; }
        public string LowestRatedSong { get; set; }
        public decimal? LowestRating { get; set; }
        public int DaysWon { get; set; }
        public string MostLikedSong { get; set; }
        public int? LikesOnMostLikedSong { get; set; }
        public int NumberOfLikes { get; set; }
        public int SongsAdded { get; set; }
        public int SubmissionsCount { get; set; }
    }
}