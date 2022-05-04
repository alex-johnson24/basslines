using System.Collections.Generic;
using System;
using BassLines.Api.Models;
using BassLines.Api.ViewModels;

namespace BassLines.Api.Interfaces
{
    public interface ISongRepository : IBaseRepository
    {
        IEnumerable<Song> GetSongs();
        Song GetSongById(Guid id);
        IEnumerable<Song> GetSongsByDate(DateTime submitDate);
        IEnumerable<Song> SongSearch(string search);
        void SubmitSong(Song song);
        void UpdateSong(Song song);
        IEnumerable<UserDailyWinsModel> GetUserDailyWins();
        IEnumerable<UserMedalsEarnedModel> GetUserMedalsEarned();
    }
}