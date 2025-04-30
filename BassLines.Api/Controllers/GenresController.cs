using System;
using System.Collections.Generic;
using BassLines.Api.Interfaces;
using BassLines.Api.ViewModels;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using Microsoft.Extensions.Logging;

namespace BassLines.Api.Controllers
{
    [Authorize]
    [ApiController]
    [Route("api/[controller]")]
    public class GenresController(
        IGenreRepository genreRepo, 
        ILogger<GenresController> logger
    ) : ControllerBase
    {
        private readonly ILogger<GenresController> _logger = logger;
        private readonly IGenreRepository _genreRepo = genreRepo;

        [HttpGet]
        [ProducesResponseType(typeof(IEnumerable<GenreModel>), 200)]
        [ProducesResponseType(typeof(string), 500)]
        public IActionResult Get()
        {
            try
            {
                return Ok(_genreRepo.GetGenres());
            }
            catch (Exception ex)
            {
                _logger.LogError(ex, "Error thrown while getting genres from db");
                return StatusCode(500, ex.Message);
            }
        }
    }
}
