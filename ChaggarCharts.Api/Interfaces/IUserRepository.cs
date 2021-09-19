using ChaggarCharts.Api.Models;

namespace ChaggarCharts.Api.Interfaces
{
    public interface IUserRepository
    {
        User GetUserByUsername(string username);
        bool CreateUser(string username, string firstName, string lastName, string hpassword, string salt);
    }
}