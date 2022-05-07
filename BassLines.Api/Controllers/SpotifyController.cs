using System;
using System.Net.Http;
using System.Threading.Tasks;
using System.Web;
using BassLines.Api.Interfaces;
using BassLines.Api.ViewModels;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using Microsoft.AspNetCore.Mvc.ModelBinding;
using Microsoft.Extensions.Logging;

namespace BassLines.Api.Controllers
{
    [Authorize]
    [ApiController]
    [Route("[controller]")]
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
        [AllowAnonymous]
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
                var payload =
                    _spotifyService
                        .GenerateToken(await _spotifyService.GetTokens(code));
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
                var payload = await _spotifyService.RefreshToken(refreshToken);
                HttpContext
                    .Response
                    .Headers
                    .Add("spotify_auth",
                    _spotifyService.GenerateToken(payload, refreshToken));
                return Ok();
            }
            catch (Exception ex)
            {
                return StatusCode(500, ex.Message);
            }
        }

        [HttpGet]
        [Route("/search")]
        [ProducesResponseType(typeof (object), 200)]
        [ProducesResponseType(typeof (string), 500)]
        public async Task<IActionResult> Search([FromQuery] string query)
        {
            try
            {
                var accessToken = HttpContext.Request.Headers["spotify_token"];
                return Ok(await _spotifyService.Search(accessToken, query));
            }
            catch (Exception ex)
            {
                return StatusCode(500, ex.Message);
            }
        }
    }
}
