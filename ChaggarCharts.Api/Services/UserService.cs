using AutoMapper;
using ChaggarCharts.Api.Interfaces;
using ChaggarCharts.Api.Models;
using ChaggarCharts.Api.ViewModels;
using Microsoft.Extensions.Logging;
using Microsoft.Extensions.Options;
using Microsoft.IdentityModel.Tokens;
using System;
using System.IdentityModel.Tokens.Jwt;
using System.Security.Claims;
using System.Security.Cryptography;
using System.Text;

namespace ChaggarCharts.Api.Services
{
    public class UserService : IUserService
    {
        private static readonly int _saltLength = 32;
        private readonly IUserRepository _userRepo;
        private readonly ILogger<UserService> _logger;
        private readonly IMapper _mapper;
        private readonly AuthSettings _authSettings;

        public UserService(IUserRepository userRepo, ILogger<UserService> logger, IMapper mapper, IOptions<AuthSettings> authSettings)
        {
            _userRepo = userRepo;
            _logger = logger;
            _mapper = mapper;
            _authSettings = authSettings.Value;
        }

        public UserModel SignIn(LoginModel loginModel, out string jwt)
        {
            var user = _userRepo.GetUserByUsername(loginModel.Username);
            
            if (user == null) throw new UserNotFoundException();

            if (user.Hpassword != HashPasswordWithSalt(loginModel.Password, user.Salt)) throw new PasswordIncorrectException();

            jwt = GenerateToken(user);

            return _mapper.Map<UserModel>(user);
        }

        public bool CreateUser(RegistrationModel registrationModel)
        {
            if (_userRepo.GetUserByUsername(registrationModel.Username) != null) throw new DuplicateUserException();

            var salt = GetSalt();
            var hpassword = HashPasswordWithSalt(registrationModel.Password, salt);

            return _userRepo.CreateUser(registrationModel.Username, registrationModel.FirstName, registrationModel.LastName, hpassword, salt);
        }

        private string GetSalt()
        {
            var salt = new byte[_saltLength];
            using (var random = new RNGCryptoServiceProvider())
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
                    new Claim("role", user.Role.Name)
                }),
                Issuer = _authSettings.ValidIssuer,
                Audience = _authSettings.ValidAudience,
                Expires = DateTime.UtcNow.AddHours(1),
                SigningCredentials = new SigningCredentials(new SymmetricSecurityKey(key), SecurityAlgorithms.HmacSha256Signature)
            };
            var token = tokenHandler.CreateToken(tokenDescriptor);
            return tokenHandler.WriteToken(token);
        }
    }
}
