using System;
using BassLines.Api.Interfaces;
using BassLines.Api.ViewModels;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using Microsoft.Extensions.Logging;
using AutoMapper;
using BassLines.Api.Models;
using Microsoft.AspNetCore.SignalR;
using BassLines.Api.Hubs;

namespace BassLines.Api.Controllers
{
    [Authorize]
    [ApiController]
    [Route("api/[controller]")]
    public class LikesController : ControllerBase
    {
        private readonly ILogger<LikesController> _logger;
        private readonly ILikeRepository _likesRepo;
        private readonly IMapper _mapper;
        private readonly ISongRepository _songRepo;
        private readonly IHubContext<SongHub, ISongHub> _songHub;

        public LikesController(ILikeRepository likesRepo, ILogger<LikesController> logger, IMapper mapper, ISongRepository songRepo, IHubContext<SongHub, ISongHub> songHub)
        {
            _logger = logger;
            _likesRepo = likesRepo;
            _mapper = mapper;
            _songRepo = songRepo;
            _songHub = songHub;
        }

        [HttpPost]
        [ProducesResponseType(200)]
        [ProducesResponseType(typeof(string), 500)]
        public IActionResult Post(LikeModel model)
        {
            try
            {
                var toLike = _mapper.Map<Like>(model);
                _likesRepo.CreateLike(toLike);
                _likesRepo.SaveChanges();

                var likedSong = _mapper.Map<SongModel>(_songRepo.GetSongById(toLike.Songid));

                _songHub.Clients.All.ReceiveSongEvent(likedSong);

                return Ok(_mapper.Map<LikeModel>(toLike));
            }
            catch (Exception ex)
            {
                _logger.LogError(ex, "Error thrown while adding a like to the db");
                return StatusCode(500, ex.Message);
            }
        }

        [HttpDelete]
        [ProducesResponseType(200)]
        [ProducesResponseType(typeof(string), 400)]
        [ProducesResponseType(typeof(string), 500)]
        public IActionResult Delete(LikeModel like)
        {
            try
            {
                var toUnlike = _mapper.Map<Like>(like);
                _likesRepo.RemoveLike(toUnlike);
                _likesRepo.SaveChanges();

                var unlikedSong = _mapper.Map<SongModel>(_songRepo.GetSongById(toUnlike.Songid));

                _songHub.Clients.All.ReceiveSongEvent(unlikedSong);

                return Ok();
            }
            catch (Exception ex)
            {
                _logger.LogError(ex, "Error thrown while removing a like from the db");
                return StatusCode(500, ex.Message);
            }
        }
    }
}