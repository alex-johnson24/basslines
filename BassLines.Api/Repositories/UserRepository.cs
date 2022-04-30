using System.Collections.Generic;
using System.Linq;
using BassLines.Api.Interfaces;
using BassLines.Api.Models;
using Microsoft.EntityFrameworkCore;

namespace BassLines.Api.Repositories
{
    public class UserRepository : BaseRepository, IUserRepository
    {
        public UserRepository(IDbContextFactory<BassLinesContext> ctxFactory) : base(ctxFactory)
        { }

        public IEnumerable<User> GetUsers()
        {
            return _ctx.Set<User>()
                    .AsNoTracking()
                    .Include(i => i.Role);
        }

        public User GetUserByUsername(string username)
        {
            return _ctx.Users.Where(w => w.Username == username).Include(i => i.Role).FirstOrDefault();
        }

        public void CreateUser(User user)
        {
            _ctx.Users.Add(user);
        }

        public void UpdateUser(User user)
        {
            _ctx.Users.Update(user);
        }

        public List<User> GetLeaderboardUsers()
        {
            return _ctx.Users.Include(i => i.SongUsers).ThenInclude(i => i.Genre).Include(i => i.Likes).Where(x => x.SongUsers.Count >= 10).ToList();
        }
    }
}
