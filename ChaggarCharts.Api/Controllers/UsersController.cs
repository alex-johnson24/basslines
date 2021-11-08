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
    public class UsersController : ControllerBase
    {
        private readonly ILogger<UsersController> _logger;
        private readonly IUserService _userService;

        public UsersController(ILogger<UsersController> logger, IUserService userService)
        {
            _logger = logger;
            _userService = userService;
        }

        [Route("Logout")]
        [HttpGet]
        [ProducesResponseType(200)]
        public IActionResult Logout()
        {
            HttpContext.Response.Cookies.Delete("access_token");
            return Ok();
        }

        [AllowAnonymous]
        [Route("SignIn")]
        [HttpPost]
        [ProducesResponseType(typeof(UserModel), 200)]
        [ProducesResponseType(typeof(string), 500)]
        [ProducesResponseType(typeof(string), 400)]
        [ProducesResponseType(typeof(string), 401)]
        public IActionResult SignIn([FromBody] LoginModel loginModel)
        {
            try
            {
                var user = _userService.SignIn(loginModel, out var jwt);
                HttpContext.Response.Cookies.Append("access_token", jwt);
                return Ok(user);
            }
            catch (UserNotFoundException)
            {
                return BadRequest("Username not found");
            }
            catch (PasswordIncorrectException)
            {
                _logger.LogWarning($"Incorrect password given for username: {loginModel.Username}");
                return Unauthorized("");
            }
            catch (Exception ex)
            {
                _logger.LogError(ex, ex.Message);
                return StatusCode(500, "Error signing in");
            }
        }

        [AllowAnonymous]
        [HttpPost]
        [ProducesResponseType(200)]
        [ProducesResponseType(typeof(string), 500)]
        [ProducesResponseType(typeof(string), 400)]
        public IActionResult CreateUser([FromBody] RegistrationModel registrationModel)
        {
            try
            {
                _userService.CreateUser(registrationModel);
                return Ok();
            }
            catch (DuplicateUserException)
            {
                _logger.LogWarning("A duplicate username was given while creating a new user");
                return BadRequest("Username already exists");
            }
            catch (Exception ex)
            {
                _logger.LogError(ex, $"Error creating user with username '{registrationModel.Username}'");
                return StatusCode(500, ex.Message);
            }
        }
    }
}