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
        Task<SpotifyClientAuth> GetTokens(string code);
        Task<SpotifyClientAuth> RefreshToken(string refreshToken);
        string GenerateToken(SpotifyClientAuth auth, string refreshToken = null);
        Task<object> Search(string accessCode, string query);
    }
}