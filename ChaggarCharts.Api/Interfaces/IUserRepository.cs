using ChaggarCharts.Api.Models;

namespace ChaggarCharts.Api.Interfaces
{
    public interface IUserRepository
    {
        User GetUserByUsername(string username);
        bool CreateUser(string username, string firstName, string lastName, string hpassword, string salt);
        bool UpdateUserPassword(string username, string hpassword, string salt);
    }
}