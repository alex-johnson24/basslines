using System;
using ChaggarCharts.Api.Interfaces;
using ChaggarCharts.Api.ViewModels;
using ChaggarCharts.Api.Models;
using System.Collections.Generic;
using System.Linq;

namespace ChaggarCharts.Api.Services
{
    public static class UserUtils
    {
        public static void setName(this User usr, UserLeaderboardModel ldr)
        {
            ldr.Name = $"{usr.Firstname} {usr.Lastname}";
        }

        public static void setAverage(this User usr, UserLeaderboardModel ldr)
        {
            ldr.Average = Math.Round(usr.Songs.Select(s => s.Rating).Average() ?? 0, 2);
        }

        public static void setUniqueGenres(this User usr, UserLeaderboardModel ldr)
        {
            ldr.UniqueGenres = usr.Songs.Select(s => s.Genre).Distinct().Count();
        }
        public static void setHighestRatedSong(this User usr, UserLeaderboardModel ldr)
        {
            ldr.HighestRatedSong = usr.Songs.Where(s => s.Rating != null).Select(s => new
            {
                SongName = s.Title,
                Rating = s.Rating
            }).OrderByDescending(x => x.Rating)
                .FirstOrDefault()?.SongName;
        }

        public static void setHighestRating(this User usr, UserLeaderboardModel ldr)
        {
            ldr.HighestRating = usr.Songs.Where(s => s.Rating != null).Select(s => new
            {
                Rating = s.Rating
            }).OrderByDescending(x => x.Rating)
            .FirstOrDefault()?.Rating;
        }

        public static void setLowestRatedSong(this User usr, UserLeaderboardModel ldr)
        {
            ldr.LowestRatedSong = usr.Songs.Where(s => s.Rating != null).Select(s => new
            {
                SongName = s.Title,
                Rating = s.Rating
            }).OrderByDescending(x => x.Rating).LastOrDefault()?.SongName;
        }

        public static void setLowestRating(this User usr, UserLeaderboardModel ldr)
        {
            ldr.LowestRating = usr.Songs.Where(s => s.Rating != null).Select(s => new
            {
                Rating = s.Rating
            }).OrderByDescending(x => x.Rating).LastOrDefault()?.Rating;
        }
        //fix this
        public static void setDailyWins(this User usr, UserLeaderboardModel ldr, IEnumerable<UserDailyWinsModel> userWinCounts)
        {
            ldr.DaysWon = userWinCounts.FirstOrDefault(s => s.UserID == usr.Id)?.Wins ?? 0;
        }
        //fix this
        public static void setMostLikedSong(this User usr, UserLeaderboardModel ldr)
        {
            ldr.MostLikedSong = usr.Songs.Select(s => new
            {
                SongName = s.Title,
                Likes = s.Likes
            }).OrderByDescending(x => x.Likes.Count)
            .FirstOrDefault()?.SongName;
        }

        public static void setNumberOfLikes(this User usr, UserLeaderboardModel ldr)
        {
            ldr.NumberOfLikes = usr.Songs.Sum(o => o.Likes.Count);
        }

        public static void setSongsAdded(this User usr, UserLeaderboardModel ldr)
        {
            ldr.SongsAdded = usr.Songs.Count(o => o.Rating >= 7.0m);
        }

        public static void setSubmissionsCount(this User usr, UserLeaderboardModel ldr)
        {
            ldr.SubmissionsCount = usr.Songs.Count;
        }

        public static void setLikesOnMostLikedSong(this User usr, UserLeaderboardModel ldr)
        {
            ldr.LikesOnMostLikedSong = usr.Songs.Select(s => new
            {
                Likes = s.Likes.Count
            }).OrderByDescending(o => o.Likes)
            .FirstOrDefault()?.Likes;
        }
    }

    public class LeaderboardService : ILeaderboardService
    {
        private readonly IUserRepository _userRepo;
        private readonly ISongRepository _songRepo;
        public LeaderboardService(IUserRepository userRepo, ISongRepository songRepo)
        {
            _userRepo = userRepo;
            _songRepo = songRepo;
        }

        public IEnumerable<UserLeaderboardModel> GetLeaderboardMetrics()
        {
            var users = _userRepo.GetLeaderboardUsers();
            var UsersDailyWins = _songRepo.GetUserDailyWins();

            return users.Select(s =>
            {
                var ldr = new UserLeaderboardModel();
                s.setName(ldr);
                s.setAverage(ldr);
                s.setHighestRatedSong(ldr);
                s.setHighestRating(ldr);
                s.setLowestRatedSong(ldr);
                s.setLowestRating(ldr);
                s.setDailyWins(ldr, UsersDailyWins);
                s.setMostLikedSong(ldr);
                s.setNumberOfLikes(ldr);
                s.setSongsAdded(ldr);
                s.setSubmissionsCount(ldr);
                s.setLikesOnMostLikedSong(ldr);
                s.setUniqueGenres(ldr);

                return ldr;
            }).Where(x => x.SubmissionsCount >= 10);
        }
    }
}