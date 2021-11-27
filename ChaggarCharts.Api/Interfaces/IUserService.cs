using System;
using System.Collections.Generic;
using System.Threading.Tasks;
using ChaggarCharts.Api.ViewModels;

namespace ChaggarCharts.Api.Interfaces
{
    public interface IUserService
    {
        List<UserModel> GetUsers();
        bool CreateUser(RegistrationModel registrationModel);
        UserModel SignIn(LoginModel loginModel, out string jwt);
        string GeneratePasswordResetToken(string username);
        bool ResetUserPassword(ResetPasswordModel model);
        Task<UserMetricsModel> GetUserMetrics(Guid userId);
    }
}