using System.ComponentModel.DataAnnotations;

namespace ChaggarCharts.Api.ViewModels
{
    public class LoginModel
    {
        [Required]
        public string Username { get; set; }
        [Required]
        public string Password { get; set; }
    }
}
