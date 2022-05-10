using System.Threading.Tasks.Dataflow;
using System.Linq;
using System.Collections.Generic;
using BassLines.Api.Interfaces;
using BassLines.Api.ViewModels;
using BassLines.Api.Models;
using System;
using System.Text;
using System.Net.Http.Headers;
using System.Net.Http;
using System.Net.Http.Json;
using System.Threading.Tasks;
using Microsoft.Extensions.Options;
using Microsoft.IdentityModel.Tokens;
using System.IdentityModel.Tokens.Jwt;
using System.Security.Claims;
using System.ComponentModel;
using AutoMapper;

namespace BassLines.Api.Services
{
  public class SpotifyService : ISpotifyService
  {
    public static string tokenUrl = "https://accounts.spotify.com/api/token";
    private readonly SpotifySettings _spotify;
    private readonly IHttpClientFactory _httpClientFactory;
    private readonly AuthSettings _authSettings;
    private readonly IMapper _mapper;
    public SpotifyService(IOptions<SpotifySettings> spotify, IHttpClientFactory httpClientFactory, IOptions<AuthSettings> authSettings, IMapper mapper)
    {
      _spotify = spotify.Value;
      _httpClientFactory = httpClientFactory;
      _authSettings = authSettings.Value;
      _mapper = mapper;

    }

    public string GetSpotifyAuthUrl()
    {
      return _spotify.AuthUrl;
    }

    public async Task<SpotifyClientAuth> GetTokens(string code)
    {
      var client = GetClient(tokenUrl);

      var content = new FormUrlEncodedContent(new[]
          {
              new KeyValuePair<string, string>("code", code),
              new KeyValuePair<string, string>("redirect_uri", _spotify.RedirectUri),
              new KeyValuePair<string, string>("grant_type", "authorization_code"),
          });

      var requestMessage = new HttpRequestMessage(HttpMethod.Post, client.BaseAddress);
      requestMessage.Headers.Authorization = new AuthenticationHeaderValue("Basic", Base64Encode($"{_spotify.ClientId}:{_spotify.ClientSecret}"));
      requestMessage.Content = content;

      var response = await client.SendAsync(requestMessage);
      var json = await response.Content.ReadFromJsonAsync<SpotifyTokenResponse>();

      var auth = new SpotifyClientAuth()
      {
        AccessToken = json.access_token,
        RefreshToken = json.refresh_token,
        ExpiryTime = DateTimeOffset.Now.AddSeconds(json.expires_in).ToUnixTimeMilliseconds()
      };

      return auth;
    }


    public async Task<SpotifyClientAuth> RefreshToken(string refreshToken)
    {
      var client = GetClient(tokenUrl);

      var content = new FormUrlEncodedContent(new[]
          {
              new KeyValuePair<string, string>("refresh_token", refreshToken),
              new KeyValuePair<string, string>("grant_type", "refresh_token"),
          });

      var requestMessage = new HttpRequestMessage(HttpMethod.Post, client.BaseAddress);
      requestMessage.Headers.Authorization = new AuthenticationHeaderValue("Basic", Base64Encode($"{_spotify.ClientId}:{_spotify.ClientSecret}"));
      requestMessage.Content = content;

      var response = await client.SendAsync(requestMessage);
      var json = await response.Content.ReadFromJsonAsync<SpotifyTokenResponse>();

      return new SpotifyClientAuth()
      {
        AccessToken = json.access_token,
        ExpiryTime = DateTimeOffset.Now.AddSeconds(json.expires_in).ToUnixTimeMilliseconds()
      };
    }


    public async Task<IEnumerable<SongBase>> SearchTracks(string accessCode, string query)
    {
      var c = GetClient();
      var request = new HttpRequestMessage(HttpMethod.Get, $"search?q={query}&type=track&limit=10");
      request.Headers.Authorization = new AuthenticationHeaderValue("Bearer", Base64Decode(accessCode));
      var response = await c.SendAsync(request);
      var json = await response.Content.ReadFromJsonAsync<SearchResponse>();

      var songs =  json.tracks.items.Select(s => new SongBase {
        Title = s.name,
        Artist = s.artists.FirstOrDefault().name,
        Link = s.external_urls.spotify,
        Images = s.album.images
      });
      return songs;
    }

    public async Task<SpotifyProfile> GetProfile(string accessCode)
    {
      var c = GetClient();
      var request = new HttpRequestMessage(HttpMethod.Get, "me");
      request.Headers.Authorization = new AuthenticationHeaderValue("Bearer", Base64Decode(accessCode));
      var response = await c.SendAsync(request);
      var json = await response.Content.ReadFromJsonAsync<RawSpotifyProfile>();
      return new SpotifyProfile 
        { 
          Name = json.display_name,
          Followers = json.followers.total ?? 0,
          Link = json.external_urls.spotify,
          PhotoUrl = json.images.FirstOrDefault().url,
          SpotifyId = json.id,
        };
    }

    public async Task<SpotifyTrack> GetTrack(string accessCode, string trackId)
    {
      var c = GetClient();
      var request = new HttpRequestMessage(HttpMethod.Get, $"tracks/{trackId}");
      request.Headers.Authorization = new AuthenticationHeaderValue("Bearer", Base64Decode(accessCode));
      var response = await c.SendAsync(request);
      var json = await response.Content.ReadFromJsonAsync<TrackDetails>();
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
          Images = json.album?.images
        };

        return track;
    }
    public async Task<SpotifyTrackDetails> GetTrackDetails(string accessCode, string trackId)
    {
        var c = GetClient();
        var request = new HttpRequestMessage(HttpMethod.Get, $"tracks/{trackId}");
        request.Headers.Authorization = new AuthenticationHeaderValue("Bearer", Base64Decode(accessCode));
        var response = await c.SendAsync(request);
        var json = await response.Content.ReadFromJsonAsync<TrackDetails>();
        var track = new SpotifyTrackDetails
        {
          Title = json.name,
          Artist = json.artists.FirstOrDefault()?.name,
          ArtistDetails = new SpotifyArtistDetails 
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
          Images = json.album?.images
        };
        
        var featuresReq = new HttpRequestMessage(HttpMethod.Get, $"audio-features/{trackId}");
        featuresReq.Headers.Authorization = new AuthenticationHeaderValue("Bearer", Base64Decode(accessCode));
        var featuresRes = await c.SendAsync(featuresReq);
        track.Features = await featuresRes.Content.ReadFromJsonAsync<TrackFeatures>();
        
        var artistReq = new HttpRequestMessage(HttpMethod.Get, $"artists/{track.ArtistDetails.SpotifyId}");
        artistReq.Headers.Authorization = new AuthenticationHeaderValue("Bearer", Base64Decode(accessCode));
        var artistRes = await c.SendAsync(artistReq);
        var artistDetails = await artistRes.Content.ReadFromJsonAsync<ArtistDetails>();
        
        track.ArtistDetails.Popularity = artistDetails.popularity;
        track.ArtistDetails.Followers = artistDetails.followers.total;
        track.ArtistDetails.Images = artistDetails.images;
        track.ArtistDetails.Genres = artistDetails.genres;
        
        return track;
    }
    private HttpClient GetClient(string baseAddress = null)
    {
      var client = _httpClientFactory.CreateClient("Spotify");
      if (baseAddress != null)
      {
        client.BaseAddress = new Uri(baseAddress);
      }
      client.DefaultRequestHeaders.Accept.Add(new MediaTypeWithQualityHeaderValue("application/json"));
      return client;
    }

    private static string RandomString(int size)
    {
      var builder = new StringBuilder(size);
      char offset = 'A';
      const int lettersOffset = 26; // A...Z length = 26  

      for (var i = 0; i < size; i++)
      {
        var @char = (char)new Random().Next(offset, offset + lettersOffset);
        builder.Append(@char);
      }

      return builder.ToString();
    }
    private static string Base64Encode(string plainText)
    {
      var plainTextBytes = System.Text.Encoding.UTF8.GetBytes(plainText);
      return System.Convert.ToBase64String(plainTextBytes);
    }
    private static string Base64Decode(string b64)
    {
      byte[] byteArray = Convert.FromBase64String(b64);
      return System.Text.Encoding.UTF8.GetString(byteArray);
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
  }
}
