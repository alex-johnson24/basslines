using System.Collections.Generic;
using System.Linq;
using ChaggarCharts.Api.Interfaces;
using ChaggarCharts.Api.Models;
using Microsoft.EntityFrameworkCore;
using System;
using ChaggarCharts.Api.ViewModels;

namespace ChaggarCharts.Api.Repositories
{
    public class SongRepository : BaseRepository, ISongRepository
    {
        public SongRepository(IDbContextFactory<ChaggarChartsContext> ctxFactory) : base(ctxFactory)
        { }

        public IEnumerable<Song> GetSongs()
        {
            return _ctx.Set<Song>()
                    .AsNoTracking()
                    .Include(i => i.Genre)
                    .Include(i => i.User)
                    .Include(i => i.Likes);
        }

        public Song GetSongById(Guid id)
        {
            return _ctx.Set<Song>()
                    .AsNoTracking()
                    .Include(i => i.Genre)
                    .Include(i => i.User)
                    .Include(i => i.Likes)
                    .FirstOrDefault(w => w.Id == id);
        }

        public IEnumerable<Song> GetSongsByDate(DateTime submitDate)
        {
            return _ctx.Set<Song>()
                    .AsNoTracking()
                    .Include(i => i.Genre)
                    .Include(i => i.User)
                    .Include(i => i.Likes)
                    .ThenInclude(i => i.User)
                    .Where(w => w.Submitteddate == submitDate);
        }

        public IEnumerable<Song> SongSearch(string search)
        {
            return _ctx.Set<Song>()
                .AsNoTracking()
                .Include(i => i.Genre)
                .Include(i => i.User)
                .Where(w => (w.Title.ToLower() + w.Artist.ToLower()).Contains(search) && w.Rating.HasValue);
        }

        public void SubmitSong(Song song)
        {
            // get us a submitted date
            // add the genre to the context to let the db know it exists
            // do the same for the submitting user
            song.Submitteddate = DateTime.Now;
            _ctx.Attach(song.Genre);
            _ctx.Attach(song.User);

            _ctx.Set<Song>().Add(song);
        }

        public void UpdateSong(Song song)
        {
            // If we're updating the song before it's rated, reset the like count
            if (!song.Rating.HasValue)
            {
                var likes = _ctx.Set<Like>().Where(w => w.Songid == song.Id);
                _ctx.RemoveRange(likes);
            }

            _ctx.Attach(song.User);
            _ctx.Attach(song.Genre);

            _ctx.Songs.Update(song);
        }

        public IEnumerable<UserDailyWinsModel> GetUserDailyWins()
        {
            return _ctx.Songs
                .AsEnumerable()
                .GroupBy(x => x.Submitteddate)
                .SelectMany(g => g.Where(p => p.Rating == g.Max(h => h.Rating)))
                .GroupBy(u => u.Userid,
                (key, g) => new UserDailyWinsModel
                {
                    UserID = key,
                    Wins = g.Count()
                });
        }
    }
}