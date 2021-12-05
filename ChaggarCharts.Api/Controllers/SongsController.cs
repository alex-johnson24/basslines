using System;
using System.Collections.Generic;
using System.Linq;
using ChaggarCharts.Api.Interfaces;
using ChaggarCharts.Api.ViewModels;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using Microsoft.AspNetCore.Mvc.ModelBinding;
using Microsoft.Extensions.Logging;

namespace ChaggarCharts.Api.Controllers
{
    [Authorize]
    [ApiController]
    [Route("[controller]")]
    public class SongsController : ControllerBase
    {
        private readonly ILogger<SongsController> _logger;
        private readonly ISongRepository _songRepo;

        public SongsController(ISongRepository songRepo, ILogger<SongsController> logger)
        {
            _songRepo = songRepo;
            _logger = logger;
        }

        [HttpGet]
        [ProducesResponseType(typeof(IEnumerable<SongModel>), 200)]
        [ProducesResponseType(typeof(string), 500)]
        public IActionResult Get()
        {
            try
            {
                return Ok(_songRepo.GetSongs());
            }
            catch (Exception ex)
            {
                _logger.LogError(ex, "An error occurred getting the list of songs from the db");
                return StatusCode(500, ex.Message);
            }
        }

        [HttpGet]
        [Route("SubmissionDate/{submitDateString}")]
        [ProducesResponseType(typeof(IEnumerable<SongModel>), 200)]
        [ProducesResponseType(typeof(string), 400)]
        [ProducesResponseType(typeof(string), 500)]
        public IActionResult GetSongsByDate(string submitDateString)
        {
            if (!DateTime.TryParse(submitDateString, out var submitDate)) return BadRequest("Given date string could not be parsed - try \"yyyy-mm-dd\"");

            try
            {
                return Ok(_songRepo.GetSongsByDate(submitDate));
            }
            catch (Exception ex)
            {
                _logger.LogError(ex, "An error occurred getting songs by date in the db");
                return StatusCode(500, ex.Message);
            }
        }

        [HttpGet]
        [Route("SongSearch")]
        [ProducesResponseType(typeof(IEnumerable<SongModel>), 200)]
        [ProducesResponseType(typeof(string), 500)]
        public IActionResult SongSearch([FromQuery] string search)
        {
            if (search == null || search.Length < 3) return Ok(Enumerable.Empty<SongModel>());

            try
            {
                return Ok(_songRepo.SongSearch(search));
            }
            catch (Exception ex)
            {
                _logger.LogError(ex, "An error occurred searching songs in the db");
                return StatusCode(500, ex.Message);
            }
        }

        [HttpPost]
        [ProducesResponseType(typeof(SongModel), 200)]
        [ProducesResponseType(typeof(ModelValidationState), 400)]
        [ProducesResponseType(typeof(string), 500)]
        public IActionResult SubmitSong(SongModel userSong)
        {
            if (!ModelState.IsValid) return BadRequest(ModelState.ValidationState);

            try
            {
                var result = _songRepo.SubmitSong(userSong);
                if (result == null) throw new SongSubmissionFailedException();
                return Ok(result);
            }
            catch (Exception ex)
            {
                _logger.LogError(ex, "An error occurred submitting a user song");
                return StatusCode(500, ex.Message);
            }
        }

        [HttpPut]
        [ProducesResponseType(typeof(SongModel), 200)]
        [ProducesResponseType(typeof(ModelValidationState), 400)]
        [ProducesResponseType(typeof(string), 400)]
        [ProducesResponseType(typeof(string), 500)]
        public IActionResult UpdateSong(SongModel userSong)
        {
            if (!ModelState.IsValid) return BadRequest(ModelState.ValidationState);

            if (userSong.Id == null) return BadRequest("Given song for update is missing id");

            try
            {
                var result = _songRepo.UpdateSong(userSong);
                if (result == null) throw new SongSubmissionFailedException();
                return Ok(result);
            }
            catch (Exception ex)
            {
                _logger.LogError(ex, "An error occurred updating a user song");
                return StatusCode(500, ex.Message);
            }
        }

        [HttpPut]
        [Route("Rate")]
        [ProducesResponseType(typeof(SongModel), 200)]
        [ProducesResponseType(typeof(string), 400)]
        [ProducesResponseType(typeof(string), 500)]
        public IActionResult RateSong([FromQuery]Guid? songId, [FromQuery]decimal? rating)
        {
            if (songId == null) return BadRequest("Null song id was given");
            if (rating == null) return BadRequest("Null rating was given");

            try
            {
                var result = _songRepo.RateSong(songId.Value, rating.Value);
                if (result == null) throw new SongRatingFailedException();
                return Ok(result);
            }
            catch (Exception ex)
            {
                _logger.LogError(ex, "An error occurred rating a user song");
                return StatusCode(500, ex.Message);
            }
        }
    }
}
