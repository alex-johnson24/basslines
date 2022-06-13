using System;
using BassLines.Api.Interfaces;
using BassLines.Api.ViewModels;
using BassLines.Api.Models;
using System.Collections.Generic;
using System.Linq;

namespace BassLines.Api.Services
{
    public static class UserUtils
    {
        public static void setName(this User usr, UserLeaderboardModel ldr)
        {
            ldr.Name = $"{usr.Firstname} {usr.Lastname}";
        }

        public static void setAverage(this User usr, UserLeaderboardModel ldr)
        {
            ldr.Average = Math.Round(usr.SongUsers.Select(s => s.Rating).Average() ?? 0, 2);
        }

        public static void setUniqueGenres(this User usr, UserLeaderboardModel ldr)
        {
            ldr.UniqueGenres = usr.SongUsers.Select(s => s.Genre).Distinct().Count();
        }
        public static void setHighestRatedSong(this User usr, UserLeaderboardModel ldr)
        {
            ldr.HighestRatedSong = usr.SongUsers.Where(s => s.Rating != null).Select(s => new
            {
                SongName = s.Title,
                Rating = s.Rating
            }).OrderByDescending(x => x.Rating)
                .FirstOrDefault()?.SongName;
        }

        public static void setHighestRating(this User usr, UserLeaderboardModel ldr)
        {
            ldr.HighestRating = usr.SongUsers.Where(s => s.Rating != null).Select(s => new
            {
                Rating = s.Rating
            }).OrderByDescending(x => x.Rating)
            .FirstOrDefault()?.Rating;
        }

        public static void setLowestRatedSong(this User usr, UserLeaderboardModel ldr)
        {
            ldr.LowestRatedSong = usr.SongUsers.Where(s => s.Rating != null).Select(s => new
            {
                SongName = s.Title,
                Rating = s.Rating
            }).OrderByDescending(x => x.Rating).LastOrDefault()?.SongName;
        }

        public static void setLowestRating(this User usr, UserLeaderboardModel ldr)
        {
            ldr.LowestRating = usr.SongUsers.Where(s => s.Rating != null).Select(s => new
            {
                Rating = s.Rating
            }).OrderByDescending(x => x.Rating).LastOrDefault()?.Rating;
        }

        public static void setDailyWins(this User usr, UserLeaderboardModel ldr, IEnumerable<UserDailyWinsModel> userWinCounts)
        {
            ldr.DaysWon = userWinCounts.FirstOrDefault(s => s.UserID == usr.Id)?.Wins ?? 0;
        }

        public static void setMedalsEarned(this User usr, UserLeaderboardModel ldr, IEnumerable<UserMedalsEarnedModel> userMedalsEarned)
        {
            ldr.MedalsEarned = userMedalsEarned.FirstOrDefault(s => s.UserID == usr.Id)?.Medals ?? 0;
        }

        public static void setMostLikedSong(this User usr, UserLeaderboardModel ldr)
        {
            ldr.MostLikedSong = usr.SongUsers.Select(s => new
            {
                SongName = s.Title,
                Likes = s.Likes
            }).OrderByDescending(x => x.Likes.Count)
            .FirstOrDefault()?.SongName;
        }

        public static void setNumberOfLikes(this User usr, UserLeaderboardModel ldr)
        {
            ldr.NumberOfLikes = usr.SongUsers.Sum(s => s.Likes.Count);
        }

        public static void setSubmissionsCount(this User usr, UserLeaderboardModel ldr)
        {
            ldr.SubmissionsCount = usr.SongUsers.Count;
        }

        public static void setLikesOnMostLikedSong(this User usr, UserLeaderboardModel ldr)
        {
            ldr.LikesOnMostLikedSong = usr.SongUsers.Select(s => new
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
        private readonly IMetricsRepository _metricsRepo;
        public LeaderboardService(IUserRepository userRepo, ISongRepository songRepo, IMetricsRepository metricsRepo)
        {
            _userRepo = userRepo;
            _songRepo = songRepo;
            _metricsRepo = metricsRepo;
        }

        public IEnumerable<UserLeaderboardModel> GetLeaderboardMetrics(Guid studioId)
        {
            var users = _userRepo.GetLeaderboardUsers(studioId);
            var UsersDailyWins = _songRepo.GetUserDailyWins(studioId);
            var UsersMedalsEarned = _songRepo.GetUserMedalsEarned(studioId);
            var bayesianAvgs = _metricsRepo.GetBayesianAverages(studioId);

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
                s.setMedalsEarned(ldr, UsersMedalsEarned);
                s.setMostLikedSong(ldr);
                s.setNumberOfLikes(ldr);
                s.setSubmissionsCount(ldr);
                s.setLikesOnMostLikedSong(ldr);
                s.setUniqueGenres(ldr);
                ldr.BayesianAverage = bayesianAvgs.FirstOrDefault(f => f.Key == s.Username).Value;

                return ldr;
            });
        }
    }
}