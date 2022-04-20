using System.Collections.Generic;
using ChaggarCharts.Api.Models;

namespace ChaggarCharts.Api.Interfaces
{
    public interface IUserRepository : IBaseRepository
    {
        IEnumerable<User> GetUsers();
        User GetUserByUsername(string username);
        void CreateUser(User user);
        void UpdateUser(User user);
        List<User> GetLeaderboardUsers();
    }
}