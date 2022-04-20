using System.Collections.Generic;
using System;
using ChaggarCharts.Api.Models;
using ChaggarCharts.Api.ViewModels;

namespace ChaggarCharts.Api.Interfaces
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
    }
}