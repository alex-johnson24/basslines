using System.Net;
using System;
using System.Collections.Generic;
using System.Threading.Tasks;
using BassLines.Api.ViewModels;
using static BassLines.Api.Services.SpotifyService;

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
        Task<List<SpotifyTrackDetails>> GetTracks(string accessToken, List<string> songIds);
        Task<List<ArtistDetails>> GetArtists(string accessToken, List<string> artistIds);
        Task<SpotifyTrackDetails> GetTrackDetails(string accessToken, string songId);
        Task<HttpStatusCode> TransferPlayerState(string accessToken, TransferStateRequest request);
        Task<MyDevices> GetDevices(string accessToken);
        Task<SpotifyPlaybackState> GetPlaybackState(string accessToken);
        Task<HttpStatusCode> AddTrackToQueue(string accessToken, string spotifyId);
        Task<HttpStatusCode> Play(string accessToken, PlayContextRequest request);
        Task<HttpStatusCode> Pause(string accessToken);
        Task<HttpStatusCode> NextOrPrevious(string accessToken, string nextOrPrevious);
        Task<HttpStatusCode> Shuffle(string accessToken, bool shuffle);
        Task<TrackSavedReference> SaveOrRemoveTrack(string accessToken, string id, bool save);
        Task<List<TrackSavedReference>> CheckForSavedTracks(string accessToken, List<string> ids);
        Task<ArtistDetails> SearchArtist(string accessToken, string query, int? pageSize = 10);
    }
}