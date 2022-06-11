using System;
using BassLines.Api.Interfaces;
using BassLines.Api.ViewModels;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using Microsoft.Extensions.Logging;
using AutoMapper;
using System.Collections.Generic;
using Microsoft.AspNetCore.SignalR;
using BassLines.Api.Hubs;
using BassLines.Api.Filters;
using BassLines.Api.Utils;

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
        private readonly IHubContext<SongHub, ISongHub> _songHub;

        public ReviewersController(ILogger<ReviewersController> logger, IReviewerRotationService reviewerRotationService, IUserRepository userRepo, IMapper mapper, IHubContext<SongHub, ISongHub> songHub)
        {
            _logger = logger;
            _reviewerRotationService = reviewerRotationService;
            _userRepo = userRepo;
            _mapper = mapper;
            _songHub = songHub;
        }

        [HttpGet]
        [UserStudioClaimFilter]
        [ProducesResponseType(typeof(string), 200)]
        [ProducesResponseType(typeof(string), 500)]
        [Route("Notes")]
        public IActionResult GetReviewerNotes()
        {
            try
            {
                // UserStudioClaimFilter is required for this entry
                var userStudioId = (Guid)HttpContext.Items[BassLinesUtils.USER_STUDIO_ITEM_KEY];
                var reviewerNotes = _reviewerRotationService.GetReviewerNotes(userStudioId);
                return Ok(reviewerNotes);
            }
            catch (Exception ex)
            {
                _logger.LogError(ex.Message, ex);
                return StatusCode(500, ex.Message);
            }
        }

        [Authorize(Policy = "Reviewer")]
        [HttpPut]
        [UserStudioClaimFilter]
        [ProducesResponseType(200)]
        [ProducesResponseType(typeof(string), 500)]
        [Route("Notes")]
        public IActionResult SetReviewerNotes([FromBody] ReviewerNotesModel model)
        {
            try
            {
                // UserStudioClaimFilter is required for this entry
                var userStudioId = (Guid)HttpContext.Items[BassLinesUtils.USER_STUDIO_ITEM_KEY];
                _reviewerRotationService.SetReviewerNotes(model.Notes ?? "", userStudioId);
                _songHub.Clients.All.ReceiveNoteEvent(model.Notes, userStudioId);
                return Ok();
            }
            catch (Exception ex)
            {
                _logger.LogError(ex.Message, ex);
                return StatusCode(500, ex.Message);
            }
        }

        [HttpGet]
        [UserStudioClaimFilter]
        [ProducesResponseType(typeof(UserModel), 200)]
        [ProducesResponseType(typeof(string), 500)]
        [Route("Active")]
        public IActionResult GetActiveReviewer()
        {
            try
            {
                // UserStudioClaimFilter is required for this entry
                var userStudioId = (Guid)HttpContext.Items[BassLinesUtils.USER_STUDIO_ITEM_KEY];
                var activeReviewer = _reviewerRotationService.GetCurrentReviewer(userStudioId);
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
        public IActionResult RotateReviewer(Guid? studioId)
        {
            try
            {
                if (!studioId.HasValue) return BadRequest("A studioId is required to rotate a reviewer");
                _reviewerRotationService.RotateReviewer(studioId.Value);
                return Ok();
            }
            catch (Exception ex)
            {
                _logger.LogError(ex.Message, ex);
                return StatusCode(500, ex.Message);
            }
        }

        [HttpGet]
        [UserStudioClaimFilter]
        [ProducesResponseType(typeof(IEnumerable<UserModel>), 200)]
        [ProducesResponseType(typeof(string), 500)]
        [Route("GetReviewerQueue")]
        public IActionResult GetReviewerQueue()
        {
            try
            {
                // UserStudioClaimFilter is required for this entry
                var userStudioId = (Guid)HttpContext.Items[BassLinesUtils.USER_STUDIO_ITEM_KEY];
                var reviewerQueue = _reviewerRotationService.GetReviewerQueue(userStudioId);
                return Ok(reviewerQueue);
            }
            catch (Exception ex)
            {
                _logger.LogError(ex.Message, ex);
                return StatusCode(500, ex.Message);
            }
        }
    }
}