using System;
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

        public IEnumerable<User> GetUsers(Guid studioId)
        {
            return _ctx.Set<User>()
                    .AsNoTracking()
                    .Where(w => w.Studioid == studioId)
                    .Include(i => i.Role);
        }

        public User GetUserByUsername(string username)
        {
            return _ctx.Users.Include(i => i.Role).Include(i => i.Studio).Where(w => w.Username == username).FirstOrDefault();
        }

        public void CreateUser(User user)
        {
            _ctx.Users.Add(user);
        }

        public void UpdateUser(User user)
        {
            _ctx.Users.Update(user);
        }

        public List<User> GetLeaderboardUsers(Guid studioId)
        {
            return _ctx.Users.Include(i => i.SongUsers)
                             .ThenInclude(s => s.Likes)
                             .Include(i => i.SongUsers)
                             .ThenInclude(i => i.Genre)
                             .Where(x => x.Studioid == studioId && x.SongUsers.Count >= 20).ToList();
        }
    }
}
