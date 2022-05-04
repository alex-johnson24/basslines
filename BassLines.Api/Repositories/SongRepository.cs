using System.Collections.Generic;
using System.Linq;
using BassLines.Api.Interfaces;
using BassLines.Api.Models;
using Microsoft.EntityFrameworkCore;
using System;
using BassLines.Api.ViewModels;

namespace BassLines.Api.Repositories
{
    public class SongRepository : BaseRepository, ISongRepository
    {
        public SongRepository(IDbContextFactory<BassLinesContext> ctxFactory) : base(ctxFactory)
        { }

        public IEnumerable<Song> GetSongs()
        {
            return _ctx.Set<Song>()
                    .AsNoTracking()
                    .Include(i => i.Genre)
                    .Include(i => i.User)
                    .Include(i => i.Reviewer)
                    .Include(i => i.Likes)
                    .ThenInclude(t => t.User);
        }

        public Song GetSongById(Guid id)
        {
            return _ctx.Set<Song>()
                    .AsNoTracking()
                    .Include(i => i.Genre)
                    .Include(i => i.User)
                    .Include(i => i.Reviewer)
                    .Include(i => i.Likes)
                    .ThenInclude(t => t.User)
                    .FirstOrDefault(w => w.Id == id);
        }

        public IEnumerable<Song> GetSongsByDate(DateTime submitDate)
        {
            return _ctx.Set<Song>()
                    .AsNoTracking()
                    .Include(i => i.Genre)
                    .Include(i => i.User)
                    .Include(i => i.Reviewer)
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
                .Include(i => i.Reviewer)
                .Where(w => (w.Title.ToLower() + w.Artist.ToLower()).Contains(search) && w.Rating.HasValue);
        }

        public void SubmitSong(Song song)
        {
            // get us a submitted date
            // add the genre to the context to let the db know it exists
            // do the same for the submitting user
            song.Submitteddate = DateTime.Now;
            _ctx.Genres.Attach(song.Genre);
            _ctx.Users.Attach(song.User);

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

            if (song.Genre != null) _ctx.Genres.Attach(song.Genre);

            if (song.Reviewer != null) _ctx.Entry(song.Reviewer).State = EntityState.Unchanged;

            _ctx.Entry<Song>(song).State = EntityState.Modified;
            _ctx.Entry<Song>(song).Reference(p => p.User).IsModified = false;
            _ctx.Entry<Song>(song).Property(p => p.Userid).IsModified = false;
            _ctx.Entry<Song>(song).Property(p => p.Createdatetime).IsModified = false;
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

        public IEnumerable<UserMedalsEarnedModel> GetUserMedalsEarned()
        {
            return _ctx.Set<Song>()
                .GroupBy(songDay => songDay.Submitteddate, songDay => songDay, (k, g) => new { Key = k, Songs = g.ToList() })
                .AsEnumerable().Select(s => new { s.Key, Songs = s.Songs, dRatings = s.Songs.Select(s => s.Rating).Distinct().OrderByDescending(u => u).Take(3) })
                .Select(s => s.Songs.Where(w => s.dRatings.Contains(w.Rating)))
                .SelectMany(s => s.Select(s => new { s.Userid, s.Id }))
                .GroupBy(g => g.Userid, (key, g) => new UserMedalsEarnedModel { UserID = key, Medals = g.Count() });
        }
    }
}