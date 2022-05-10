using System;
using System.Collections.Generic;
using System.Threading.Tasks;
using BassLines.Api.Models;
using BassLines.Api.ViewModels;

namespace BassLines.Api.Interfaces
{
    public interface ISpotifyService
    {
        string GetSpotifyAuthUrl();
        string GenerateToken(SpotifyClientAuth auth, string refreshToken = null);
        Task<SpotifyClientAuth> GetTokens(string code);
        Task<SpotifyClientAuth> RefreshToken(string refreshToken);
        Task<IEnumerable<SongBase>> SearchTracks(string accessCode, string query);
        Task<SpotifyProfile> GetProfile(string accessCode);
        Task<SpotifyTrack> GetTrack(string accessCode, string songId);
        Task<SpotifyTrackDetails> GetTrackDetails(string accessCode, string songId);

    }
}