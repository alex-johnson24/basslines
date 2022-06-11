using System.Collections.Generic;
using System;
using BassLines.Api.Models;
using BassLines.Api.ViewModels;

namespace BassLines.Api.Interfaces
{
    public interface ISongRepository : IBaseRepository
    {
        IEnumerable<Song> GetSongs(Guid studioId);
        Song GetSongById(Guid id);
        IEnumerable<Song> GetSongsByDate(DateTime submitDate, Guid studioId);
        IEnumerable<Song> SongSearch(string search, Guid studioId);
        void SubmitSong(Song song);
        void UpdateSong(Song song);
        IEnumerable<UserDailyWinsModel> GetUserDailyWins(Guid studioId);
        IEnumerable<UserMedalsEarnedModel> GetUserMedalsEarned(Guid studioId);
    }
}