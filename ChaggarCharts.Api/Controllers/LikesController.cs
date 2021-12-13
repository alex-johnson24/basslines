using System;
using ChaggarCharts.Api.Interfaces;
using ChaggarCharts.Api.ViewModels;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using Microsoft.Extensions.Logging;

namespace ChaggarCharts.Api.Controllers
{
    [Authorize]
    [ApiController]
    [Route("[controller]")]
    public class LikesController : ControllerBase
    {
        private readonly ILogger<LikesController> _logger;
        private readonly ILikeRepository _likesRepo;

        public LikesController(ILikeRepository likesRepo, ILogger<LikesController> logger)
        {
            _logger = logger;
            _likesRepo = likesRepo;
        }

        [HttpPost]
        [ProducesResponseType(201)]
        [ProducesResponseType(typeof(string), 500)]
        public IActionResult Post(LikeModel model)
        {
            try
            {
                if (_likesRepo.CreateLike(model)) return Created("", null);
                throw new Exception("No like record was saved - check the model body");
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
        public IActionResult Delete([FromQuery] Guid? userId, [FromQuery] Guid? songId)
        {
            if (!userId.HasValue || !songId.HasValue) return BadRequest("Check your request details");
            try
            {
                if (_likesRepo.RemoveLike(userId.Value, songId.Value)) return Ok();
                throw new Exception("No like record was removed - check the query fields");
            }
            catch (Exception ex)
            {
                _logger.LogError(ex, "Error thrown while removing a like from the db");
                return StatusCode(500, ex.Message);
            }
        }
    }
}