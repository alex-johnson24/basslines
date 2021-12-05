using System.Collections.Generic;
using System;
using ChaggarCharts.Api.ViewModels;

namespace ChaggarCharts.Api.Interfaces
{
    public interface ISongRepository
    {
        IEnumerable<SongModel> GetSongs();

        IEnumerable<SongModel> GetSongsByDate(DateTime submitDate);
        IEnumerable<SongModel> SongSearch(string search);
        SongModel SubmitSong(SongModel song);
        SongModel UpdateSong(SongModel song);
        SongModel RateSong(Guid songId, decimal rating);
    }
}