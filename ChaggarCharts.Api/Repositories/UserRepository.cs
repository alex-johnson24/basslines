using System.Collections.Generic;
using System.Linq;
using ChaggarCharts.Api.Interfaces;
using ChaggarCharts.Api.Models;
using Microsoft.EntityFrameworkCore;

namespace ChaggarCharts.Api.Repositories
{
    public class UserRepository : BaseRepository, IUserRepository
    {
        public UserRepository(IDbContextFactory<ChaggarChartsContext> ctxFactory) : base(ctxFactory)
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
            return _ctx.Users.Include(i => i.Songs).ThenInclude(i => i.Genre).Include(i => i.Likes).Where(x => x.Songs.Count >= 10).ToList();
        }
    }
}
