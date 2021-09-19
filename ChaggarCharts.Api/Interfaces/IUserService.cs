using ChaggarCharts.Api.ViewModels;

namespace ChaggarCharts.Api.Interfaces
{
    public interface IUserService
    {
        bool CreateUser(RegistrationModel registrationModel);
        UserModel SignIn(LoginModel loginModel, out string jwt);
    }
}