using System.Linq;
using AutoMapper;
using ChaggarCharts.Api.Enums;
using ChaggarCharts.Api.Interfaces;
using ChaggarCharts.Api.Models;
using Microsoft.EntityFrameworkCore;

namespace ChaggarCharts.Api.Repositories
{
    public class UserRepository : IUserRepository
    {
        private readonly ChaggarChartsContext _ctx;
        private readonly IMapper _mapper;
        public UserRepository(ChaggarChartsContext ctx, IMapper mapper)
        {
            _ctx = ctx;
            _mapper = mapper;
        }

        public User GetUserByUsername(string username)
        {
            return _ctx.Users.Where(w => w.Username == username).Include(i => i.Role).FirstOrDefault();
        }

        public bool CreateUser(string username, string firstName, string lastName, string hpassword, string salt)
        {
            var contributorId = _ctx.Roles.Where(w => w.Name == UserRole.Contributor.ToString()).FirstOrDefault()?.Id;
            _ctx.Users.Add(
                new User
                {
                    Username = username,
                    Firstname = firstName,
                    Lastname = lastName,
                    Hpassword = hpassword,
                    Salt = salt,
                    Roleid = contributorId
                }
            );

            return _ctx.SaveChanges() > 0;
        }

        public bool UpdateUserPassword(string username, string hpassword, string salt)
        {
            var user = _ctx.Users.FirstOrDefault(f => f.Username == username);

            user.Hpassword = hpassword;
            user.Salt = salt;

            return _ctx.SaveChanges() > 0;
        }
    }
}
