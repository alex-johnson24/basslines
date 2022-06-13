using System;
using System.Collections.Generic;
using System.Linq;
using BassLines.Api.Interfaces;
using BassLines.Api.ViewModels;
using BassLines.Api.Models;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using Microsoft.AspNetCore.Mvc.ModelBinding;
using Microsoft.Extensions.Logging;
using Microsoft.AspNetCore.SignalR;
using BassLines.Api.Hubs;
using AutoMapper;
using BassLines.Api.Utils;
using BassLines.Api.Filters;

namespace BassLines.Api.Controllers
{
    [Authorize]
    [ApiController]
    [Route("api/[controller]")]
    public class SongsController : ControllerBase
    {
        private readonly ILogger<SongsController> _logger;
        private readonly ISongRepository _songRepo;
        private readonly IHubContext<SongHub, ISongHub> _songHub;
        private readonly IMapper _mapper;

        public SongsController(ISongRepository songRepo, ILogger<SongsController> logger, IHubContext<SongHub, ISongHub> songHub, IMapper mapper)
        {
            _songRepo = songRepo;
            _logger = logger;
            _songHub = songHub;
            _mapper = mapper;
        }

        [HttpGet]
        [UserStudioClaimFilter]
        [ProducesResponseType(typeof(IEnumerable<SongModel>), 200)]
        [ProducesResponseType(typeof(string), 500)]
        public IActionResult Get()
        {
            try
            {
                // UserStudioClaimFilter is required for this entry
                var userStudioId = (Guid)HttpContext.Items[BassLinesUtils.USER_STUDIO_ITEM_KEY];
                return Ok(_mapper.Map<IEnumerable<SongModel>>(_songRepo.GetSongs(userStudioId)));
            }
            catch (Exception ex)
            {
                _logger.LogError(ex, "An error occurred getting the list of songs from the db");
                return StatusCode(500, ex.Message);
            }
        }

        [HttpGet]
        [UserStudioClaimFilter]
        [Route("SubmissionDate/{submitDateString}")]
        [ProducesResponseType(typeof(IEnumerable<SongModel>), 200)]
        [ProducesResponseType(typeof(string), 400)]
        [ProducesResponseType(typeof(string), 500)]
        public IActionResult GetSongsByDate(string submitDateString)
        {
            if (!DateTime.TryParse(submitDateString, out var submitDate)) return BadRequest("Given date string could not be parsed - try \"yyyy-mm-dd\"");

            try
            {
                // UserStudioClaimFilter is required for this entry
                var userStudioId = (Guid)HttpContext.Items[BassLinesUtils.USER_STUDIO_ITEM_KEY];
                return Ok(_mapper.Map<IEnumerable<SongModel>>(_songRepo.GetSongsByDate(submitDate, userStudioId)));
            }
            catch (Exception ex)
            {
                _logger.LogError(ex, "An error occurred getting songs by date in the db");
                return StatusCode(500, ex.Message);
            }
        }

        [HttpGet]
        [UserStudioClaimFilter]
        [Route("SongSearch")]
        [ProducesResponseType(typeof(IEnumerable<SongModel>), 200)]
        [ProducesResponseType(typeof(string), 500)]
        public IActionResult SongSearch([FromQuery] string search)
        {
            if (search == null || search.Length < 3) return Ok(Enumerable.Empty<SongModel>());

            try
            {
                var userStudioId = (Guid)HttpContext.Items[BassLinesUtils.USER_STUDIO_ITEM_KEY];
                return Ok(_mapper.Map<IEnumerable<SongModel>>(_songRepo.SongSearch(search, userStudioId)));
            }
            catch (Exception ex)
            {
                _logger.LogError(ex, "An error occurred searching songs in the db");
                return StatusCode(500, ex.Message);
            }
        }

        [HttpPost]
        [UserStudioClaimFilter]
        [ProducesResponseType(typeof(SongModel), 200)]
        [ProducesResponseType(typeof(ModelValidationState), 400)]
        [ProducesResponseType(typeof(string), 500)]
        public IActionResult SubmitSong(SongModel userSong)
        {
            if (!ModelState.IsValid) return BadRequest(ModelState.ValidationState);

            try
            {
                // UserStudioClaimFilter is required for this entry
                var userStudioId = (Guid)HttpContext.Items[BassLinesUtils.USER_STUDIO_ITEM_KEY];
                var toCreate = _mapper.Map<Song>(userSong);

                _songRepo.SubmitSong(toCreate);

                _songRepo.SaveChanges();

                var created = _mapper.Map<SongModel>(toCreate);

                _songHub.Clients.All.ReceiveSongEvent(created, userStudioId);

                return Ok(created);
            }
            catch (Exception ex)
            {
                _logger.LogError(ex, "An error occurred submitting a user song");
                return StatusCode(500, ex.Message);
            }
        }

        [HttpPut]
        [UserStudioClaimFilter]
        [ProducesResponseType(typeof(SongModel), 200)]
        [ProducesResponseType(typeof(ModelValidationState), 400)]
        [ProducesResponseType(typeof(string), 400)]
        [ProducesResponseType(typeof(string), 500)]
        public IActionResult UpdateSong(SongModel userSong)
        {
            if (userSong.Id == null) return BadRequest("Given song for update is missing id");

            if (!ModelState.IsValid) return BadRequest(ModelState.ValidationState);

            try
            {
                // UserStudioClaimFilter is required for this entry
                var userStudioId = (Guid)HttpContext.Items[BassLinesUtils.USER_STUDIO_ITEM_KEY];
                var toUpdate = _mapper.Map<Song>(userSong);

                _songRepo.UpdateSong(toUpdate);

                _songRepo.SaveChanges();

                _songHub.Clients.All.ReceiveSongEvent(userSong, userStudioId);

                return Ok(userSong);
            }
            catch (Exception ex)
            {
                _logger.LogError(ex, "An error occurred updating a user song");
                return StatusCode(500, ex.Message);
            }
        }
    }
}
