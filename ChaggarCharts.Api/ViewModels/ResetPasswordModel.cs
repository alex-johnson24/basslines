using System.ComponentModel.DataAnnotations;

namespace ChaggarCharts.Api.ViewModels
{
    public class ResetPasswordModel
    {
        [Required]
        public string Username {get;set;}
        [Required]
        public string Password {get;set;}
        [Required]
        public string ResetToken {get;set;}
    }
}