using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;
using AutoMapper;
using BassLines.Api.Interfaces;
using BassLines.Api.Models;
using BassLines.Api.ViewModels;
using Microsoft.EntityFrameworkCore;

namespace BassLines.Api.Repositories
{
    public class MetricsRepository : IMetricsRepository
    {
        private readonly IMapper _mapper;
        private readonly IDbContextFactory<BassLinesContext> _ctxFactory;
        public MetricsRepository(IMapper mapper, IDbContextFactory<BassLinesContext> ctxFactory)
        {
            _mapper = mapper;
            _ctxFactory = ctxFactory;
        }

        public async Task<List<DailyRatingModel>> GetRecentRatings(Guid userId)
        {
            using (var asyncCtx = _ctxFactory.CreateDbContext())
            {
                return await asyncCtx.Songs
                                .Where(w => w.Userid == userId && w.Rating.HasValue)
                                .OrderByDescending(o => o.Submitteddate)
                                .Take(5)
                                .OrderBy(o => o.Submitteddate)
                                .Select(s => new DailyRatingModel 
                                    { 
                                        SubmittedDate = s.Submitteddate.Value, 
                                        Rating = s.Rating, 
                                        Title = s.Title, 
                                        Artist = s.Artist,
                                        Link = s.Link
                                    })
                                .ToListAsync();
            }
        }

        public async Task<List<GenreCountModel>> GetTopGenres(Guid userId)
        {
            using (var asyncCtx = _ctxFactory.CreateDbContext())
            {
                return await asyncCtx.Songs
                                .Where(w => w.Userid == userId)
                                .Join(asyncCtx.Genres, s => s.Genreid, g => g.Id, (song, genre) => new 
                                    { 
                                        songId = song.Id, 
                                        genreName = genre.Name, 
                                        link = song.Link 
                                    })
                                .GroupBy(g => g.genreName)
                                .Select(s => new GenreCountModel 
                                    { 
                                        Genre = s.Key, 
                                        Count = s.Count(), 
                                        SpotifyLinks = s
                                            .Where(s => s.link != null && s.link.Contains("spotify.com/track"))
                                            .Select(t => t.link)
                                            .ToList()
                                    })
                                .OrderByDescending(o => o.Count)
                                .Take(5)
                                .ToListAsync();
            }
        }

        public async Task<List<DailyRatingModel>> GetTopSongs(Guid userId)
        {
            using (var asyncCtx = _ctxFactory.CreateDbContext())
            {
                return await asyncCtx.Songs
                                .Where(w => w.Userid == userId && w.Rating.HasValue)
                                .OrderByDescending(o => o.Rating)
                                .Take(5)
                                .Select(s => new DailyRatingModel 
                                    { 
                                        SubmittedDate = s.Submitteddate.Value, 
                                        Rating = s.Rating, 
                                        Title = s.Title, 
                                        Artist = s.Artist, 
                                        Link = s.Link 
                                    })
                                .ToListAsync();
            }
        }

        public async Task<List<ArtistCountModel>> GetTopArtists(Guid userId)
        {
            using (var asyncCtx = _ctxFactory.CreateDbContext())
            {
                return await asyncCtx.Songs
                                .Where(w => w.Userid == userId)
                                .GroupBy(g => g.Artist)
                                .Select(s => new ArtistCountModel 
                                    { 
                                        Artist = s.Key, 
                                        Count = s.Count(), 
                                        TrackRefLink = s.Where(s => s.Link
                                            .Contains("spotify.com/track"))
                                            .FirstOrDefault()
                                            .Link
                                    })
                                .OrderByDescending(o => o.Count)
                                .Take(5)
                                .ToListAsync();
            }
        }

        public async Task<decimal?> GetAverageRating(Guid userId)
        {
            using (var asyncCtx = _ctxFactory.CreateDbContext())
            {
                return await asyncCtx.Songs
                                .Where(w => w.Userid == userId && w.Rating.HasValue)
                                .AverageAsync(a => a.Rating);
            }
        }

        public async Task<int> GetSongSubmissionCount(Guid userId)
        {
            using (var asyncCtx = _ctxFactory.CreateDbContext())
            {
                return await asyncCtx.Songs
                                .Where(w => w.Userid == userId)
                                .CountAsync();
            }
        }

        public async Task<int> GetUniqueArtistCount(Guid userId)
        {
            using (var asyncCtx = _ctxFactory.CreateDbContext())
            {
                return await asyncCtx.Songs
                                .Where(w => w.Userid == userId)
                                .Select(s => s.Artist)
                                .Distinct()
                                .CountAsync();
            }
        }

        public async Task<int> GetUniqueGenreCount(Guid userId)
        {
            using (var asyncCtx = _ctxFactory.CreateDbContext())
            {
                return await asyncCtx.Songs
                                .Where(w => w.Userid == userId)
                                .Include(i => i.Genre)
                                .Select(s => s.Genre.Name)
                                .Distinct()
                                .CountAsync();
            }
        }

        public async Task<List<SpotifyLinkReference>> GetSpotifyTracks(Guid userId)
        {
            using (var asyncCtx = _ctxFactory.CreateDbContext()) 
            {
                return await asyncCtx.Songs
                                .Where(s => s.Userid == userId 
                                    && s.Link.Contains("spotify.com/track/"))
                                .Select(s => new SpotifyLinkReference 
                                {
                                    Title = s.Title,
                                    Artist = s.Artist,
                                    Rating = s.Rating,
                                    Link = s.Link,
                                    Submitteddate = s.Submitteddate
                                })
                                .OrderByDescending(s => s.Rating)
                                .ToListAsync();
            }
        }
    }
}
