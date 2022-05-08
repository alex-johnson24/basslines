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

namespace BassLines.Api.Services
{
  public class SpotifyService : ISpotifyService
  {
    private readonly SpotifySettings _spotify;
    private readonly IHttpClientFactory _httpClientFactory;
    private readonly AuthSettings _authSettings;
    public SpotifyService(IOptions<SpotifySettings> spotify, IHttpClientFactory httpClientFactory, IOptions<AuthSettings> authSettings)
    {
      _spotify = spotify.Value;
      _httpClientFactory = httpClientFactory;
      _authSettings = authSettings.Value;

    }
    public string GetSpotifyAuthUrl()
    {
      return $"https://accounts.spotify.com/authorize?response_type=code&client_id={_spotify.ClientId}&scope=user-read-private+user-read-email&redirect_uri={_spotify.RedirectUri}&state=" + RandomString(16);
    }


    public async Task<SpotifyClientAuth> GetTokens(string code)
    {
      var client = GetClient("https://accounts.spotify.com/api/token");

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
      var client = GetClient("https://accounts.spotify.com/api/token");

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


    public async Task<object> Search(string accessCode, string query)
    {
      var c = GetClient($"https://api.spotify.com/v1/search?q={query}&type=track&limit=8");
      var request = new HttpRequestMessage(HttpMethod.Get, c.BaseAddress);
      request.Headers.Authorization = new AuthenticationHeaderValue("Bearer", Base64Decode(accessCode));
      var response = await c.SendAsync(request);
      var json = await response.Content.ReadFromJsonAsync<SearchResponse>();

      var songs = json.tracks.items.Select(s => new SongBase {
        Title = s.name,
        Artist = s.artists.FirstOrDefault().name,
        Link = s.external_urls.spotify,
        Photos = s.album.images
      });
      return songs;
    }


    private HttpClient GetClient(string baseAddress = null)
    {
      var client = _httpClientFactory.CreateClient("spotify");
      if (baseAddress != null)
      {
        client.BaseAddress = new Uri(baseAddress);
      }
      client.DefaultRequestHeaders.Accept.Add(new MediaTypeWithQualityHeaderValue("application/json"));
      return client;
    }


    private Random _random = new Random();


    public string RandomString(int size)
    {
      var builder = new StringBuilder(size);
      char offset = 'A';
      const int lettersOffset = 26; // A...Z length = 26  

      for (var i = 0; i < size; i++)
      {
        var @char = (char)_random.Next(offset, offset + lettersOffset);
        builder.Append(@char);
      }

      return builder.ToString();
    }
    public static string Base64Encode(string plainText)
    {
      var plainTextBytes = System.Text.Encoding.UTF8.GetBytes(plainText);
      return System.Convert.ToBase64String(plainTextBytes);
    }
    public static string Base64Decode(string b64)
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
            Expires = DateTime.UtcNow.AddHours(1),
            SigningCredentials = new SigningCredentials(new SymmetricSecurityKey(key), SecurityAlgorithms.HmacSha256Signature)
        };
        var token = tokenHandler.CreateToken(tokenDescriptor);
        return tokenHandler.WriteToken(token);
    }
  }
}
