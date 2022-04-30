using System;
using BassLines.Api.Enums;

namespace BassLines.Api.ViewModels
{
    public partial class UserModel
    {
        public Guid Id { get; set; }
        public string Username { get; set; }
        public string FirstName { get; set; }
        public string LastName { get; set; }
        public UserRole Role { get; set; }
    }
}
