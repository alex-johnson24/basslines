using System.Collections.Generic;
using System.Linq;
using AutoMapper;
using ChaggarCharts.Api.Interfaces;
using ChaggarCharts.Api.Models;
using ChaggarCharts.Api.ViewModels;
using Microsoft.EntityFrameworkCore;
using System;

namespace ChaggarCharts.Api.Repositories
{
    public class SongRepository : ISongRepository
    {
        private readonly ChaggarChartsContext _ctx;
        private readonly IMapper _mapper;
        public SongRepository(IDbContextFactory<ChaggarChartsContext> ctxFactory, IMapper mapper)
        {
            _ctx = ctxFactory.CreateDbContext();
            _mapper = mapper;
        }

        public IEnumerable<SongModel> GetSongs()
        {
            return _ctx.Set<Song>()
                    .AsNoTracking()
                    .Include(i => i.Genre)
                    .Include(i => i.User)
                    .Include(i => i.Likes)
                    .Select(s => _mapper.Map<SongModel>(s));
        }

        public IEnumerable<SongModel> GetSongsByDate(DateTime submitDate)
        {
            return _ctx.Set<Song>()
                    .AsNoTracking()
                    .Include(i => i.Genre)
                    .Include(i => i.User)
                    .Include(i => i.Likes)
                    .ThenInclude(i => i.User)
                    .Where(w => w.Submitteddate == submitDate)
                    .Select(s => _mapper.Map<SongModel>(s));
        }

        public IEnumerable<SongModel> SongSearch(string search)
        {
            return _ctx.Set<Song>()
                .AsNoTracking()
                .Include(i => i.Genre)
                .Include(i => i.User)
                .Where(w => (w.Title.ToLower() + w.Artist.ToLower()).Contains(search) && w.Rating.HasValue)
                .Select(s => _mapper.Map<SongModel>(s));
        }

        public SongModel SubmitSong(SongModel song)
        {
            _ctx.Set<Song>().Add(
                new Song
                {
                    Title = song.Title,
                    Artist = song.Artist,
                    Userid = song.User.Id,
                    Genreid = song.Genre.Id,
                    Link = song.Link,
                    Submitteddate = DateTime.Now
                }
            );

            if (_ctx.SaveChanges() == 0) return null;

            return song;
        }

        public SongModel UpdateSong(SongModel song)
        {
            var toUpdate = _ctx.Set<Song>().Where(w => w.Id == song.Id).FirstOrDefault();

            if (toUpdate == null) return null;

            toUpdate.Title = song.Title;
            toUpdate.Artist = song.Artist;
            toUpdate.Genreid = song.Genre.Id;
            toUpdate.Link = song.Link;

            var likes = _ctx.Set<Like>().Where(w => w.Songid == song.Id);

            _ctx.RemoveRange(likes);

            _ctx.Songs.Attach(toUpdate);

            _ctx.Entry(toUpdate).State = EntityState.Modified;

            if (_ctx.SaveChanges() == 0) return null;

            return song;
        }

        public SongModel RateSong(Guid songId, decimal rating)
        {
            var toUpdate = _ctx.Set<Song>().Where(w => w.Id == songId).FirstOrDefault();

            if (toUpdate == null) return null;

            toUpdate.Rating = rating;

            if (_ctx.SaveChanges() == 0) return null;

            return _mapper.Map<SongModel>(toUpdate);
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