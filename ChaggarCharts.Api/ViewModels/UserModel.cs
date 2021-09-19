using System;
using ChaggarCharts.Api.Enums;

namespace ChaggarCharts.Api.ViewModels
{
    public partial class UserModel
    {
        public Guid Id { get; set; }
        public string Username { get; set; }
        public UserRole Role {get;set;}
    }
}
