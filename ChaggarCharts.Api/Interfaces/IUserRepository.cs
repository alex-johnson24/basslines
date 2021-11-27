using System;
using System.Collections.Generic;
using System.Threading.Tasks;
using ChaggarCharts.Api.Models;
using ChaggarCharts.Api.ViewModels;

namespace ChaggarCharts.Api.Interfaces
{
    public interface IUserRepository
    {
        List<User> GetUsers();
        User GetUserByUsername(string username);
        bool CreateUser(string username, string firstName, string lastName, string hpassword, string salt);
        bool UpdateUserPassword(string username, string hpassword, string salt);
    }
}