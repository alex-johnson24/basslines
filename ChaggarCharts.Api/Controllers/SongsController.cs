using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;
using ChaggarCharts.Api.Interfaces;
using ChaggarCharts.Api.ViewModels;
using Microsoft.AspNetCore.Mvc;
using Microsoft.Extensions.Logging;

namespace ChaggarCharts.Api.Controllers
{
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
    }
}
