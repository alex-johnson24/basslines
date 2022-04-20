using System;
using System.Collections.Generic;
using System.Threading.Tasks;
using ChaggarCharts.Api.ViewModels;

namespace ChaggarCharts.Api.Interfaces
{
    public interface IUserService
    {
        IEnumerable<UserModel> GetUsers();
        UserModel CreateUser(RegistrationModel registrationModel);
        UserModel SignIn(LoginModel loginModel, out string jwt);
        string GeneratePasswordResetToken(string username);
        void ResetUserPassword(ResetPasswordModel model);
        Task<UserMetricsModel> GetUserMetrics(Guid userId);
    }
}