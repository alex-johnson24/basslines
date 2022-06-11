using System;
using System.Collections.Generic;
using BassLines.Api.Models;

namespace BassLines.Api.Interfaces
{
    public interface IUserRepository : IBaseRepository
    {
        IEnumerable<User> GetUsers(Guid studioId);
        User GetUserByUsername(string username);
        void CreateUser(User user);
        void UpdateUser(User user);
        List<User> GetLeaderboardUsers(Guid studioId);
    }
}