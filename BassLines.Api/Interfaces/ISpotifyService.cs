using System.Net;
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
        Task<IEnumerable<SongBaseWithImages>> SearchTracks(string accessToken, string query);
        Task<SpotifyProfile> GetProfile(string accessToken);
        Task<SpotifyTrack> GetTrack(string accessToken, string songId);
        Task<SpotifyTrackDetails> GetTrackDetails(string accessToken, string songId);
        Task<HttpStatusCode> TransferPlayerState(string accessToken, TransferStateRequest request);
        Task<MyDevices> GetDevices(string accessToken);
        Task<HttpStatusCode> AddTrackToQueue(string accessToken, string spotifyId, string deviceId);
        Task<HttpStatusCode> Play(string accessToken, PlayContextRequest request, string device_id = null);
    }
}