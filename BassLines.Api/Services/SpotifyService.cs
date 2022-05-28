using System.Net;
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
using System.Text.Json;

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
      
        public async Task<ArtistDetails> SearchArtist(string accessToken, string query, int? pageSize = 10)
        {
            ApplyBearerAuth(accessToken);

            var result = await _spotifyClient.GetAsync($"search?q={query}&type=artist&limit={pageSize}");

            var searchResponse = await result.DeserializeHttp<SearchResponse>();

            return searchResponse.artists.items.FirstOrDefault();
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
                Link = json.external_urls?.spotify,
                PhotoUrl = json.images?.FirstOrDefault()?.url,
                SpotifyId = json.id,
                Premium = json.product == "premium"
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
        public async Task<List<SpotifyTrackDetails>> GetTracks(string accessToken, List<string> songIds)
        {
            ApplyBearerAuth(accessToken);

            var json = await (await _spotifyClient.GetAsync($"tracks?ids={String.Join(",", songIds)}")).DeserializeHttp<MultipleEntityResponse>();

            if (json == default) return new List<SpotifyTrackDetails>();

            return json.tracks.Select(t => new SpotifyTrackDetails
            {
                Title = t.name,
                Artist = t.artists.FirstOrDefault()?.name,
                ArtistDetails = new SpotifyArtistDetails
                {
                    Name = t.artists.FirstOrDefault()?.name,
                    Link = t.artists.FirstOrDefault()?.external_urls.spotify,
                    SpotifyId = t.artists.FirstOrDefault()?.id
                },
                Album = new SpotifyAlbumDetails
                {
                    Name = t.album.name,
                    ReleaseDate = DateTime
                                .TryParse(t.album.release_date, out DateTime date)
                                  ? date
                                  : null,
                    TrackCount = t.album.total_tracks,
                    SpotifyId = t.album.id,
                    Link = t.album.external_urls.spotify,
                    Images = t.album.images
                },
                SpotifyId = t.id,
                Popularity = t.popularity,
                Explicit = t.@explicit,
                DurationSeconds = t.duration_ms.HasValue ? t.duration_ms / 1000 : null,
                Link = t.external_urls?.spotify,
            }).ToList();
        }

        public async Task<List<ArtistDetails>> GetArtists(string accessToken, List<String> artistIds)
        {
            ApplyBearerAuth(accessToken);

            var json = await (await _spotifyClient.GetAsync($"artists?ids={String.Join(",", artistIds)}")).DeserializeHttp<MultipleEntityResponse>();

            if (json == default) return new List<ArtistDetails>();

            return json.artists;
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

            var albumDetails = await(await _spotifyClient.GetAsync($"albums/{track.Album.SpotifyId}")).DeserializeHttp<AlbumDetails>();
            
            track.Album.Tracks = albumDetails.tracks.items.Select(t => new SpotifyAlbumTrack 
            {
                Title = t.name,
                SpotifyId = t.id,
                DurationSeconds = t.duration_ms / 1000,
                Explicit = t.@explicit,
                Artist = t.artists.FirstOrDefault()?.name,
                Link = t.external_urls.spotify
            }
            ).ToList();

            var genreSeeds = await(await _spotifyClient.GetAsync("recommendations/available-genre-seeds")).DeserializeHttp<GenreSeeds>();
            var genres = String.Join(",", String.Join("," , track.ArtistDetails.Genres).Split(" ")).Split("-"); // remove spaces and hyphens from artist genres to compare against valid genre seeds for query string ("Canadian death-metal" -> ["canadian", "death", "metal"] ) 
            var g = genres.Where(g => genreSeeds.genres.Contains(g));
            var recommendedTracks = await(await _spotifyClient.GetAsync($"recommendations?seeds_artists={track.ArtistDetails.SpotifyId}&seed_tracks={trackId}&seed_genres={String.Join(",", g)}")).DeserializeHttp<RecommendationsResponse>();
            
            track.RecommendedTracks = recommendedTracks.tracks.Select(t => new SpotifyAlbumTrack
            {  
                Title = t?.name,
                SpotifyId = t?.id,
                DurationSeconds = t?.duration_ms / 1000,
                Explicit = t.@explicit,
                Artist = t.artists?.FirstOrDefault()?.name,
                Link = t.external_urls?.spotify
            }).ToList();

            return track;
        }

        public async Task<HttpStatusCode> TransferPlayerState(string accessToken, TransferStateRequest request)
        {
            ApplyBearerAuth(accessToken);
            
            var content = new StringContent(JsonSerializer.Serialize(request), Encoding.UTF8, "application/json");

            var response = await _spotifyClient.PutAsync("me/player", content);

            return response.StatusCode;

        }

        public async Task<MyDevices> GetDevices(string accessToken)
        {
            ApplyBearerAuth(accessToken);

            return await (await _spotifyClient.GetAsync("me/player/devices")).DeserializeHttp<MyDevices>();
        }

        public async Task<HttpStatusCode> Play(string accessToken, PlayContextRequest request)
        {
            ApplyBearerAuth(accessToken);

            var content = new StringContent(JsonSerializer.Serialize(request), Encoding.UTF8, "application/json");
            
            var response = await _spotifyClient.PutAsync($"me/player/play", content);

            return response.StatusCode;
        }

        public async Task<HttpStatusCode> Shuffle(string accessToken, bool shuffle)
        {
            ApplyBearerAuth(accessToken);

            return (await _spotifyClient.PutAsync($"me/player/shuffle?state={shuffle}", null)).StatusCode;
        }
        public async Task<HttpStatusCode> AddTrackToQueue(string accessToken, string spotifyId)
        {
            ApplyBearerAuth(accessToken);

            var response = await _spotifyClient.PostAsync($"me/player/queue?uri=spotify:track:{spotifyId}", null);

            return response.StatusCode;
        }

        public async Task<TrackSavedReference> SaveOrRemoveTrack(string accessToken, string id, bool save)
        {
            ApplyBearerAuth(accessToken);
            HttpResponseMessage response;

            if (save) 
            {
                response = await _spotifyClient.PutAsync($"me/tracks?ids={id}", null);
            }
            else 
            {
                response = await _spotifyClient.DeleteAsync($"me/tracks?ids={id}");
            }

            response.EnsureSuccessStatusCode();

            return new TrackSavedReference{ Id = id, Saved = save };
        } 
        public async Task<List<TrackSavedReference>> CheckForSavedTracks(string accessToken, List<string> ids)
        {
            ApplyBearerAuth(accessToken);

            var response = await (await _spotifyClient.GetAsync($"me/tracks/contains?ids={String.Join(",", ids)}")).DeserializeHttp<List<bool>>();

            return response.Select((b, i) => new TrackSavedReference { Saved = b, Id = ids[i] }).ToList();
        }

        public class TrackSavedReference
        {
            public string Id { get; set; }
            public bool Saved { get; set; }
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

