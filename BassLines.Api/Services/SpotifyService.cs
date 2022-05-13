using System.Linq;
using System.Collections.Generic;
using BassLines.Api.Interfaces;
using BassLines.Api.ViewModels;
using BassLines.Api.Models;
using System;
using System.Text;
using System.Net.Http;
using System.Threading.Tasks;
using Microsoft.Extensions.Options;
using Microsoft.IdentityModel.Tokens;
using System.IdentityModel.Tokens.Jwt;
using System.Security.Claims;
using AutoMapper;
using BassLines.Api.Utils;
using System.Net.Http.Headers;

namespace BassLines.Api.Services
{
    public class SpotifyService : ISpotifyService
    {
        private readonly SpotifySettings _spotify;
        private readonly HttpClient _spotifyClient;
        private readonly HttpClient _tokenClient;
        private readonly AuthSettings _authSettings;
        private readonly IMapper _mapper;

        public SpotifyService(IOptions<SpotifySettings> spotify, IHttpClientFactory httpClientFactory, IOptions<AuthSettings> authSettings, IMapper mapper)
        {
            _spotify = spotify.Value;
            _spotifyClient = httpClientFactory.CreateClient("Spotify");
            _tokenClient = httpClientFactory.CreateClient("SpotifyToken");
            _authSettings = authSettings.Value;
            _mapper = mapper;
        }

        public string GetSpotifyAuthUrl() => _spotify.AuthUrl;

        public async Task<SpotifyClientAuth> GetTokens(string code)
        {
            var content = new FormUrlEncodedContent(
              new[]
              {
              new KeyValuePair<string, string>("code", code),
              new KeyValuePair<string, string>("redirect_uri", _spotify.RedirectUri),
              new KeyValuePair<string, string>("grant_type", "authorization_code"),
          });

            var result = await _tokenClient.PostAsync("", content);

            var tokenResponse = await result.DeserializeHttp<SpotifyTokenResponse>();

            if (tokenResponse == default) return null;

            var auth = new SpotifyClientAuth()
            {
                AccessToken = tokenResponse.access_token,
                RefreshToken = tokenResponse.refresh_token,
                ExpiryTime = DateTimeOffset.Now.AddSeconds(tokenResponse.expires_in).ToUnixTimeMilliseconds()
            };

            return auth;
        }


        public async Task<SpotifyClientAuth> RefreshToken(string refreshToken)
        {

            var content = new FormUrlEncodedContent(new[]
                {
              new KeyValuePair<string, string>("refresh_token", refreshToken),
              new KeyValuePair<string, string>("grant_type", "refresh_token"),
          });

            var result = await _tokenClient.PostAsync("", content);

            var tokenResponse = await result.DeserializeHttp<SpotifyTokenResponse>();

            if (tokenResponse == default) return null;

            return new SpotifyClientAuth()
            {
                AccessToken = tokenResponse.access_token,
                ExpiryTime = DateTimeOffset.Now.AddSeconds(tokenResponse.expires_in).ToUnixTimeMilliseconds()
            };
        }


        public async Task<IEnumerable<SongBaseWithImages>> SearchTracks(string accessToken, string query)
        {
            ApplyBearerAuth(accessToken);

            var result = await _spotifyClient.GetAsync($"search?q={query}&type=track&limit=10");

            var searchResponse = await result.DeserializeHttp<SearchResponse>();

            if (searchResponse == default) return Enumerable.Empty<SongBaseWithImages>();

            var songs = searchResponse.tracks.items.Select(s => new SongBaseWithImages
            {
                Title = s.name,
                Artist = s.artists.FirstOrDefault().name,
                Link = s.external_urls.spotify,
                Images = s.album.images
            });

            return songs;
        }

        public async Task<SpotifyProfile> GetProfile(string accessToken)
        {

            ApplyBearerAuth(accessToken);

            var result = await _spotifyClient.GetAsync("me");

            var json = await result.DeserializeHttp<SpotifyUserProfile>();

            if (json == default) return null;

            return new SpotifyProfile
            {
                Name = json.display_name,
                Followers = json.followers.total ?? 0,
                Link = json.external_urls.spotify,
                PhotoUrl = json.images.FirstOrDefault().url,
                SpotifyId = json.id,
            };
        }

        public async Task<SpotifyTrack> GetTrack(string accessToken, string trackId)
        {

            var json = await GetBaseTrack(accessToken, trackId);

            if (json == default) return null;

            var track = new SpotifyTrack
            {
                Title = json.name,
                Artist = json.artists.FirstOrDefault()?.name,
                ArtistDetails = new SpotifyBase
                {
                    Name = json.artists.FirstOrDefault()?.name,
                    Link = json.artists.FirstOrDefault()?.external_urls.spotify,
                    SpotifyId = json.artists.FirstOrDefault()?.id
                },
                Album = new SpotifyAlbum
                {
                    Name = json.album.name,
                    ReleaseDate = DateTime
                                  .TryParse(json.album.release_date, out DateTime date)
                                    ? date
                                    : null,
                    TrackCount = json.album.total_tracks,
                    SpotifyId = json.album.id,
                    Link = json.album.external_urls.spotify,
                    Images = json.album.images
                },
                SpotifyId = json.id,
                Popularity = json.popularity,
                Explicit = json.@explicit,
                DurationSeconds = json.duration_ms.HasValue ? json.duration_ms / 1000 : null,
                Link = json.external_urls?.spotify,
            };

            return track;
        }
        public async Task<SpotifyTrackDetails> GetTrackDetails(string accessToken, string trackId)
        {
            var trackJson = await GetBaseTrack(accessToken, trackId);

            if (trackJson == default) return null;

            var track = new SpotifyTrackDetails
            {
                Title = trackJson.name,
                Artist = trackJson.artists.FirstOrDefault()?.name,
                ArtistDetails = new SpotifyArtistDetails
                {
                    Name = trackJson.artists.FirstOrDefault()?.name,
                    Link = trackJson.artists.FirstOrDefault()?.external_urls.spotify,
                    SpotifyId = trackJson.artists.FirstOrDefault()?.id
                },
                Album = new SpotifyAlbumDetails
                {
                    Name = trackJson.album.name,
                    ReleaseDate = DateTime
                                .TryParse(trackJson.album.release_date, out DateTime date)
                                  ? date
                                  : null,
                    TrackCount = trackJson.album.total_tracks,
                    SpotifyId = trackJson.album.id,
                    Link = trackJson.album.external_urls.spotify,
                    Images = trackJson.album.images
                },
                SpotifyId = trackJson.id,
                Popularity = trackJson.popularity,
                Explicit = trackJson.@explicit,
                DurationSeconds = trackJson.duration_ms.HasValue ? trackJson.duration_ms / 1000 : null,
                Link = trackJson.external_urls?.spotify,
            };

            // we already refreshed the httpClient with this access code via the base track call
            // todo: technically we could call this async with the initial track call
            track.Features = await (await _spotifyClient.GetAsync($"audio-features/{trackId}")).DeserializeHttp<TrackFeatures>();

            var artistDetails = await (await _spotifyClient.GetAsync($"artists/{track.ArtistDetails.SpotifyId}")).DeserializeHttp<ArtistDetails>();

            track.ArtistDetails.Popularity = artistDetails.popularity;
            track.ArtistDetails.Followers = artistDetails.followers.total;
            track.ArtistDetails.Images = artistDetails.images;
            track.ArtistDetails.Genres = artistDetails.genres;

            return track;
        }

        public string GenerateToken(SpotifyClientAuth auth, string refreshToken = null)
        {
            var tokenHandler = new JwtSecurityTokenHandler();
            var key = Encoding.ASCII.GetBytes(_authSettings.SecretKey);
            var tokenDescriptor = new SecurityTokenDescriptor
            {
                Subject = new ClaimsIdentity(new[]
                {
                new Claim("accessToken", auth.AccessToken),
                new Claim("expiryTime", auth.ExpiryTime.ToString()),
                new Claim("refreshToken", !String.IsNullOrWhiteSpace(auth.RefreshToken) ? auth.RefreshToken : refreshToken )
            }),
                Expires = DateTime.UtcNow.AddYears(1),
                SigningCredentials = new SigningCredentials(new SymmetricSecurityKey(key), SecurityAlgorithms.HmacSha256Signature)
            };
            var token = tokenHandler.CreateToken(tokenDescriptor);
            return tokenHandler.WriteToken(token);
        }

        private void ApplyBearerAuth(string accessToken)
        {
            _spotifyClient.DefaultRequestHeaders.Authorization = new AuthenticationHeaderValue("Bearer", accessToken.Base64Decode());
        }

        private async Task<TrackDetails> GetBaseTrack(string accessToken, string trackId)
        {
            ApplyBearerAuth(accessToken);

            var result = await _spotifyClient.GetAsync($"tracks/{trackId}");

            var trackDetails = await result.DeserializeHttp<TrackDetails>();

            return trackDetails;
        }
    }
}
