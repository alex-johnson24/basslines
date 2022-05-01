using System;
using BassLines.Api.Interfaces;
using BassLines.Api.ViewModels;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using Microsoft.Extensions.Logging;
using AutoMapper;

namespace BassLines.Api.Controllers
{
    [Authorize]
    [ApiController]
    [Route("api/[controller]")]
    public class ReviewersController : ControllerBase
    {
        private readonly ILogger<ReviewersController> _logger;
        private readonly IReviewerRotationService _reviewerRotationService;
        private readonly IUserRepository _userRepo;
        private readonly IMapper _mapper;

        public ReviewersController(ILogger<ReviewersController> logger, IReviewerRotationService reviewerRotationService, IUserRepository userRepo, IMapper mapper)
        {
            _logger = logger;
            _reviewerRotationService = reviewerRotationService;
            _userRepo = userRepo;
            _mapper = mapper;
        }

        [AllowAnonymous]
        [HttpGet]
        [ProducesResponseType(typeof(UserModel), 200)]
        [ProducesResponseType(typeof(string), 500)]
        [Route("Active")]
        public IActionResult GetActiveReviewer()
        {
            try
            {
                var activeReviewer = _reviewerRotationService.GetCurrentReviewer();
                var activeReviewerUser = _mapper.Map<UserModel>(_userRepo.GetUserByUsername(activeReviewer));
                return Ok(activeReviewerUser);
            }
            catch (Exception ex)
            {
                _logger.LogError(ex.Message, ex);
                return StatusCode(500, ex.Message);
            }
        }

        [AllowAnonymous]
        [HttpGet]
        [ProducesResponseType(200)]
        [ProducesResponseType(typeof(string), 500)]
        [Route("RebuildReviewerQueue")]
        public IActionResult RebuildReviewerQueue()
        {
            try
            {
                _reviewerRotationService.RebuildReviewerQueue();
                return Ok();
            }
            catch (Exception ex)
            {
                _logger.LogError(ex.Message, ex);
                return StatusCode(500, ex.Message);
            }
        }

        [AllowAnonymous]
        [HttpGet]
        [ProducesResponseType(200)]
        [ProducesResponseType(typeof(string), 500)]
        [Route("RotateReviewer")]
        public IActionResult RotateReviewer()
        {
            try
            {
                _reviewerRotationService.RotateReviewer();
                return Ok();
            }
            catch (Exception ex)
            {
                _logger.LogError(ex.Message, ex);
                return StatusCode(500, ex.Message);
            }
        }
    }
}