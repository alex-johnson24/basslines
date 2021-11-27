using System;
using System.Collections.Generic;
using System.Threading.Tasks;
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

        [Route("AllUsers")]
        [HttpGet]
        [ProducesResponseType(typeof(List<UserModel>), 200)]
        [ProducesResponseType(typeof(string), 500)]
        public IActionResult GetUsers()
        {
            try
            {
                var users = _userService.GetUsers();
                return Ok(users);
            }
            catch (Exception ex)
            {
                _logger.LogError(ex.StackTrace, ex);
                return StatusCode(500, ex.Message);
            }
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

        [Authorize(Policy = "AdminUser")]
        [HttpGet]
        [Route("GetPasswordResetToken")]
        public IActionResult GetPasswordResetToken([FromQuery] string username)
        {
            try
            {
                var token = _userService.GeneratePasswordResetToken(username);

                return Ok(token);
            }
            catch (Exception ex)
            {
                _logger.LogError(ex.Message, ex);
            }

            return BadRequest();
        }

        [HttpGet]
        [Route("UserMetrics")]
        [ProducesResponseType(typeof(UserMetricsModel), 200)]
        [ProducesResponseType(typeof(string), 500)]
        [ProducesResponseType(typeof(string), 400)]
        public async Task<IActionResult> UserMetrics([FromQuery] Guid? userId)
        {
            if (!userId.HasValue) return BadRequest("No user id was given");

            try
            {
                var metrics = await _userService.GetUserMetrics(userId.Value);

                return Ok(metrics);
            }
            catch (Exception ex)
            {
                _logger.LogError(ex.Message, ex);

                return StatusCode(500, ex.Message);
            }
        }

        [AllowAnonymous]
        [HttpPost]
        [Route("ResetUserPassword")]
        public IActionResult ResetUserPassword(ResetPasswordModel model)
        {
            if (!ModelState.IsValid) return BadRequest(ModelState.ValidationState);

            var result = _userService.ResetUserPassword(model);

            if (result) return Ok();

            return Unauthorized();
        }
    }
}