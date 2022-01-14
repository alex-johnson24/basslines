using System;
using ChaggarCharts.Api.Models;

namespace ChaggarCharts.Api.ViewModels
{
    public partial class UserLeaderboardModel
    {
        //Calc place on frontend
        public string Name { get; set; }
        public decimal? Average { get; set; }
        public string FavGenre { get; set; }
        public string HighestRatedSong { get; set; }
        public decimal? HighestRating { get; set; }
        public string LowestRatedSong { get; set; }
        public decimal? LowestRating { get; set; }
        public int DaysWon { get; set; }
        public string MostLikedSong { get; set; }
        public int NumberOfLikes { get; set; }
        public int SongsAdded { get; set; }
        public int SubmissionsCount { get; set; }
    }
}