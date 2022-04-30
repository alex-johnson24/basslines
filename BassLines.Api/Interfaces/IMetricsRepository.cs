using System;
using System.Collections.Generic;
using System.Threading.Tasks;
using BassLines.Api.ViewModels;

namespace BassLines.Api.Interfaces
{
    public interface IMetricsRepository
    {
        Task<List<DailyRatingModel>> GetRecentRatings(Guid userId);
        Task<List<GenreCountModel>> GetTopGenres(Guid userId);
        Task<List<DailyRatingModel>> GetTopSongs(Guid userId);
        Task<List<ArtistCountModel>> GetTopArtists(Guid userId);
        Task<decimal?> GetAverageRating(Guid userId);
        Task<int> GetSongSubmissionCount(Guid userId);
        Task<int> GetUniqueArtistCount(Guid userId);
        Task<int> GetUniqueGenreCount(Guid userId);
    }
}