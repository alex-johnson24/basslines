using AutoMapper;
using BassLines.Api.Interfaces;
using BassLines.Api.Models;
using BassLines.Api.ViewModels;
using Microsoft.Extensions.Logging;
using Microsoft.Extensions.Options;
using Microsoft.IdentityModel.Tokens;
using System;
using System.Collections.Generic;
using System.IdentityModel.Tokens.Jwt;
using System.Linq;
using System.Security.Claims;
using System.Security.Cryptography;
using System.Text;
using System.Threading.Tasks;

namespace BassLines.Api.Services
{
    public class UserService : IUserService
    {
        private static readonly int _saltLength = 32;
        private readonly IUserRepository _userRepo;
        private readonly IMetricsRepository _metricsRepo;
        private readonly IRoleRepository _roleRepository;
        private readonly ILogger<UserService> _logger;
        private readonly IMapper _mapper;
        private readonly AuthSettings _authSettings;

        public UserService(IUserRepository userRepo,
                           IMetricsRepository metricsRepo,
                           ILogger<UserService> logger,
                           IMapper mapper,
                           IOptions<AuthSettings> authSettings,
                           IRoleRepository roleRepository)
        {
            _userRepo = userRepo;
            _metricsRepo = metricsRepo;
            _logger = logger;
            _mapper = mapper;
            _authSettings = authSettings.Value;
            _roleRepository = roleRepository;
        }

        public UserModel SignIn(LoginModel loginModel, out string jwt)
        {
            var user = _userRepo.GetUserByUsername(loginModel.Username);

            if (user == null) throw new UserNotFoundException();

            if (user.Hpassword != HashPasswordWithSalt(loginModel.Password, user.Salt)) throw new PasswordIncorrectException();

            jwt = GenerateToken(user);

            return _mapper.Map<UserModel>(user);
        }

        public async Task<UserMetricsModel> GetUserMetrics(Guid userId)
        {
            var recentRatingsTask = _metricsRepo.GetRecentRatings(userId);

            var topGenresTask = _metricsRepo.GetTopGenres(userId);

            var topSongsTask = _metricsRepo.GetTopSongs(userId);

            var topArtistsTask = _metricsRepo.GetTopArtists(userId);

            var averageRatingTask = _metricsRepo.GetAverageRating(userId);

            var songSubmissionCountTask = _metricsRepo.GetSongSubmissionCount(userId);

            var uniqueArtistCount = _metricsRepo.GetUniqueArtistCount(userId);

            var uniqueGenreCount = _metricsRepo.GetUniqueGenreCount(userId);

            await Task.WhenAll(recentRatingsTask, topGenresTask, topSongsTask, topArtistsTask, averageRatingTask, songSubmissionCountTask, uniqueArtistCount, uniqueGenreCount);

            return new UserMetricsModel
            {
                DailyRatings = await recentRatingsTask,
                TopGenres = await topGenresTask,
                TopSongs = await topSongsTask,
                TopArtists = await topArtistsTask,
                AverageRating = Math.Round((await averageRatingTask) ?? 0, 2),
                SongSubmissionCount = await songSubmissionCountTask,
                UniqueArtistCount = await uniqueArtistCount,
                UniqueGenreCount = await uniqueGenreCount
            };
        }

        public UserModel CreateUser(RegistrationModel registrationModel)
        {
            if (_userRepo.GetUserByUsername(registrationModel.Username) != null) throw new DuplicateUserException();

            var salt = GetSalt();
            var hpassword = HashPasswordWithSalt(registrationModel.Password, salt);
            var defaultRole = _roleRepository.GetDefaultRole();

            var toCreate = new User
            {
                Username = registrationModel.Username,
                Firstname = registrationModel.FirstName,
                Lastname = registrationModel.LastName,
                Hpassword = hpassword,
                Salt = salt,
                Roleid = defaultRole.Id,
            };

            _userRepo.CreateUser(toCreate);

            _userRepo.SaveChanges();

            return _mapper.Map<UserModel>(toCreate);
        }

        private string GetSalt()
        {
            var salt = new byte[_saltLength];

            using (var random = RandomNumberGenerator.Create())
            {
                random.GetNonZeroBytes(salt);
            }

            return Encoding.Default.GetString(salt);
        }

        private string HashPasswordWithSalt(string password, string salt)
        {
            var toEncrypt = string.Concat(password, salt);

            using (SHA256 sha256Encrypt = SHA256.Create())
            {
                return Encoding.Default.GetString(sha256Encrypt.ComputeHash(System.Text.Encoding.UTF8.GetBytes(toEncrypt)));
            }
        }

        public void ResetUserPassword(ResetPasswordModel model)
        {
            ValidatePasswordToken(model.ResetToken, model.Username);

            var salt = GetSalt();
            var hpassword = HashPasswordWithSalt(model.Password, salt);

            var toUpdate = _userRepo.GetUserByUsername(model.Username);

            toUpdate.Salt = salt;
            toUpdate.Hpassword = hpassword;

            _userRepo.UpdateUser(toUpdate);

            _userRepo.SaveChanges();
        }

        public string GeneratePasswordResetToken(string username)
        {
            var tokenHandler = new JwtSecurityTokenHandler();
            var key = Encoding.ASCII.GetBytes(_authSettings.SecretKey);
            var tokenDescriptor = new SecurityTokenDescriptor
            {
                Subject = new ClaimsIdentity(new[]
                {
                    new Claim("username", username),
                }),
                Issuer = _authSettings.ValidIssuer,
                Audience = _authSettings.ValidAudience,
                Expires = DateTime.UtcNow.AddMinutes(15),
                SigningCredentials = new SigningCredentials(new SymmetricSecurityKey(key), SecurityAlgorithms.HmacSha256Signature)
            };
            var token = tokenHandler.CreateToken(tokenDescriptor);
            return tokenHandler.WriteToken(token);
        }

        // https://jasonwatmore.com/post/2021/06/02/net-5-create-and-validate-jwt-tokens-use-custom-jwt-middleware
        private string GenerateToken(User user)
        {
            var tokenHandler = new JwtSecurityTokenHandler();
            var key = Encoding.ASCII.GetBytes(_authSettings.SecretKey);
            var tokenDescriptor = new SecurityTokenDescriptor
            {
                Subject = new ClaimsIdentity(new[]
                {
                    new Claim("id", user.Id.ToString()),
                    new Claim("username", user.Username),
                    new Claim("firstName", user.Firstname),
                    new Claim("lastName", user.Lastname),
                    new Claim("role", user.Role.Name),
                }),
                Issuer = _authSettings.ValidIssuer,
                Audience = _authSettings.ValidAudience,
                Expires = DateTime.UtcNow.AddHours(8),
                SigningCredentials = new SigningCredentials(new SymmetricSecurityKey(key), SecurityAlgorithms.HmacSha256Signature)
            };
            var token = tokenHandler.CreateToken(tokenDescriptor);
            return tokenHandler.WriteToken(token);
        }

        private void ValidatePasswordToken(string token, string username)
        {
            var key = new SymmetricSecurityKey(Encoding.ASCII.GetBytes(_authSettings.SecretKey));
            var creds = new SigningCredentials(key, SecurityAlgorithms.HmacSha256Signature);
            var validator = new JwtSecurityTokenHandler();

            // These need to match the values used to generate the token
            TokenValidationParameters validationParameters = new TokenValidationParameters();
            validationParameters.ValidIssuer = _authSettings.ValidIssuer;
            validationParameters.ValidAudience = _authSettings.ValidAudience;
            validationParameters.IssuerSigningKey = key;
            validationParameters.ValidateIssuerSigningKey = true;
            validationParameters.ValidateAudience = true;

            if (!validator.CanReadToken(token)) throw new TokenFormatException();

            ClaimsPrincipal principal;

            // This line throws if invalid
            principal = validator.ValidateToken(token, validationParameters, out _);

            if (!principal.Claims.Any(w => w.Type == "username" && w.Value == username)) throw new UserNotFoundException();
        }

        public IEnumerable<UserModel> GetUsers()
        {
            return _mapper.Map<List<UserModel>>(_userRepo.GetUsers());
        }
    }
}
