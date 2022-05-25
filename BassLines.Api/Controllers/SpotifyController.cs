using System.Linq;
using System;
using System.Collections.Generic;
using System.Threading.Tasks;
using BassLines.Api.Interfaces;
using BassLines.Api.ViewModels;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using Microsoft.Extensions.Logging;
using static BassLines.Api.Services.SpotifyService;

namespace BassLines.Api.Controllers
{
    [Authorize]
    [ApiController]
    [Route("api/[controller]")]
    public class SpotifyController : ControllerBase
    {
        private readonly ISpotifyService _spotifyService;

        private readonly ILogger _logger;

        public SpotifyController(
            ILogger<SpotifyController> logger,
            ISpotifyService spotifyService
        )
        {
            _logger = logger;
            _spotifyService = spotifyService;
        }

        [HttpGet]
        [ProducesResponseType(typeof (string), 200)]
        [ProducesResponseType(typeof (string), 500)]
        public IActionResult GetUrl()
        {
            try
            {
                return Ok(_spotifyService.GetSpotifyAuthUrl());
            }
            catch (Exception ex)
            {
                return StatusCode(500, ex.Message);
            }
        }

        [HttpGet]
        [Route("/model")]
        [ProducesResponseType(200)]
        [ProducesResponseType(typeof (string), 400)]
        [ProducesResponseType(typeof (string), 500)]
        public async Task<IActionResult> GetClientAuth([FromQuery] string code)
        {
            if (code == null)
            {
                return BadRequest("No Spotify redirect code was provided");
            }
            try
            {
                var payload = _spotifyService.GenerateToken(await _spotifyService.GetTokens(code));
                HttpContext.Response.Headers.Add("spotify_auth", payload);
                HttpContext.Response.Cookies.Append("spotify_auth", payload);
                return Ok();
            }
            catch (Exception ex)
            {
                return StatusCode(500, ex.Message);
            }
        }

        [HttpGet]
        [Route("/refresh")]
        [ProducesResponseType(200)]
        [ProducesResponseType(typeof (string), 400)]
        [ProducesResponseType(typeof (string), 500)]
        public async Task<IActionResult> RefreshToken()
        {
            var refreshToken = HttpContext.Request.Headers["refresh_token"];
            if (String.IsNullOrWhiteSpace(refreshToken))
            {
                return BadRequest("No refresh token was provided");
            }
            try
            {
                HttpContext
                    .Response
                    .Headers
                    .Add("spotify_auth",
                    _spotifyService.GenerateToken(await _spotifyService.RefreshToken(refreshToken), refreshToken));
                return Ok();
            }
            catch (Exception ex)
            {
                return StatusCode(500, ex.Message);
            }
        }

        [HttpGet]
        [Route("/search")]
        [ProducesResponseType(typeof (IEnumerable<SongBaseWithImages>), 200)]
        [ProducesResponseType(typeof (string), 500)]
        public async Task<IActionResult> Search([FromQuery] string query)
        {
            try
            {
                var accessToken = HttpContext.Request.Headers["spotify_token"];
                return Ok(await _spotifyService.SearchTracks(accessToken, query));
            }
            catch (Exception ex)
            {
                return StatusCode(500, ex.Message);
            }
        }
        
        [HttpGet]
        [Route("/search/artist")]
        [ProducesResponseType(typeof (ArtistDetails), 200)]
        [ProducesResponseType(typeof (string), 500)]
        public async Task<IActionResult> SearchArtists([FromQuery] string query, int? pageSize = 10)
        {
            try
            {
                var accessToken = HttpContext.Request.Headers["spotify_token"];
                return Ok(await _spotifyService.SearchArtist(accessToken, query, pageSize));
            }
            catch (Exception ex)
            {
                return StatusCode(500, ex.Message);
            }
        }

        [HttpGet]
        [Route("/me")]
        [ProducesResponseType(typeof (SpotifyProfile), 200)]
        [ProducesResponseType(typeof (string), 500)]
        public async Task<IActionResult> GetProfile()
        {
            try
            {
                var accessToken = HttpContext.Request.Headers["spotify_token"];
                return Ok(await _spotifyService.GetProfile(accessToken));
            }
            catch (Exception ex)
            {
                return StatusCode(500, ex.Message);
            }
        }

        [HttpGet]
        [Route("/track/{id}")]
        [ProducesResponseType(typeof (SpotifyTrack), 200)]
        [ProducesResponseType(typeof (string), 500)]
        public async Task<IActionResult> GetTrack([FromRoute] string id)
        {
            try
            {
                var accessToken = HttpContext.Request.Headers["spotify_token"];
                return Ok(await _spotifyService.GetTrack(accessToken, id));
            }
            catch (Exception ex)
            {
                return StatusCode(500, ex.Message);
            }
        }
        
        [HttpPost]
        [Route("/tracks")]
        [ProducesResponseType(typeof (List<SpotifyTrackDetails>), 200)]
        [ProducesResponseType(typeof (string), 500)]
        public async Task<IActionResult> GetTracks([FromBody] List<string> ids)
        {
            try
            {
                var accessToken = HttpContext.Request.Headers["spotify_token"];
                return Ok(await _spotifyService.GetTracks(accessToken, ids));
            }
            catch (Exception ex)
            {
                return StatusCode(500, ex.Message);
            }
        }
        
        [HttpPost]
        [Route("/artists-from-trackIds")]
        [ProducesResponseType(typeof (List<ArtistDetails>), 200)]
        [ProducesResponseType(typeof (string), 500)]
        public async Task<IActionResult> GetArtistsFromTracks([FromBody] List<string> trackIds)
        {
            try
            {
                var accessToken = HttpContext.Request.Headers["spotify_token"];
                var artistIds = (await _spotifyService.GetTracks(accessToken, trackIds))
                    .ToArray()
                    .Select(t => t.ArtistDetails.SpotifyId)
                    .ToList();
                return Ok(await _spotifyService.GetArtists(accessToken, artistIds));
            }
            catch (Exception ex)
            {
                return StatusCode(500, ex.Message);
            }
        }


        
        [HttpGet]
        [Route("/track/{id}/details")]
        [ProducesResponseType(typeof (SpotifyTrackDetails), 200)]
        [ProducesResponseType(typeof (string), 500)]
        public async Task<IActionResult> GetTrackDetails([FromRoute] string id)
        {
            try
            {
                var accessToken = HttpContext.Request.Headers["spotify_token"];
                return Ok(await _spotifyService.GetTrackDetails(accessToken, id));
            }
            catch (Exception ex)
            {
                return StatusCode(500, ex.Message);
            }
        }

        [HttpPut]
        [Route("/player")]
        public async Task<IActionResult> TransferPlayerState([FromBody]TransferStateRequest request)
        {
            try
            {
                var accessToken = HttpContext.Request.Headers["spotify_token"];
                var status = await _spotifyService.TransferPlayerState(accessToken, request);
                return this.StatusCode((int)status);
            }
            catch (Exception ex)
            {
                return BadRequest(ex.Message);
            }
        }

        [HttpGet]
        [Route("/devices")]
        [ProducesResponseType(typeof (MyDevices), 200)]
        [ProducesResponseType(typeof (string), 400)]
        [ProducesResponseType(typeof (string), 500)]
        public async Task<IActionResult> GetDevices()
        {
            try
            {
                var accessToken = HttpContext.Request.Headers["spotify_token"];
                return Ok(await _spotifyService.GetDevices(accessToken));
            }
            catch (Exception ex)
            {
                return StatusCode(500, ex.Message);
            }
        }

        [HttpPost]
        [Route("/add-to-queue/{spotifyId}/device/{deviceId}")]
        public async Task<IActionResult> AddTrackToQueue([FromRoute]string spotifyId, string deviceId)
        {
            try
            {
                var accessToken = HttpContext.Request.Headers["spotify_token"];
                var status = await _spotifyService.AddTrackToQueue(accessToken, spotifyId, deviceId);
                return this.StatusCode((int)status);
            }
            catch (Exception ex)
            {
                return BadRequest(ex.Message);
            }
        }
        [HttpPut]
        [Route("/play")]
        public async Task<IActionResult> PlayTrack([FromBody] PlayContextRequest request)
        {
            try
            {
                var accessToken = HttpContext.Request.Headers["spotify_token"];
                var status = await _spotifyService.Play(accessToken, request, request.device_id);
                return this.StatusCode((int)status);
            }
            catch (Exception ex)
            {
                return BadRequest(ex.Message);
            }
        }
        
        [HttpPut]
        [Route("/shuffle")]
        public async Task<IActionResult> Shuffle([FromQuery] bool shuffle)
        {
            try
            {
                var accessToken = HttpContext.Request.Headers["spotify_token"];
                var status = await _spotifyService.Shuffle(accessToken, shuffle);
                return this.StatusCode((int)status);
            }
            catch (Exception ex)
            {
                return BadRequest(ex.Message);
            }
        }



        [HttpPut]
        [ProducesResponseType(typeof (TrackSavedReference), 200)]
        [ProducesResponseType(typeof (string), 400)]
        [Route("/save-or-remove/{id}")]
        public async Task<IActionResult> SaveOrRemoveTrack([FromRoute] string id, [FromQuery] bool save = true)
        {
            try
            {
                var accessToken = HttpContext.Request.Headers["spotify_token"];
                return Ok(await _spotifyService.SaveOrRemoveTrack(accessToken, id, save));
            }
            catch (Exception ex)
            {
                return BadRequest(ex.Message);
            }
        }

        [HttpPost]
        [ProducesResponseType(typeof (List<TrackSavedReference>), 200)]
        [ProducesResponseType(typeof (string), 400)]
        [Route("/check-saved")]
        public async Task<IActionResult> CheckSavedTracks([FromBody] List<string> ids)
        {
            try
            {
                var accessToken = HttpContext.Request.Headers["spotify_token"];
                return Ok(await _spotifyService.CheckForSavedTracks(accessToken, ids));
                
            }
            catch (Exception ex)
            {
                return BadRequest(ex.Message);
            }
        }
    }
}
