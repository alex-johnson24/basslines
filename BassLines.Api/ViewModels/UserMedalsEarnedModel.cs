using System;

namespace BassLines.Api.ViewModels
{
    public class UserMedalsEarnedModel
    {
        public Guid? UserID { get; set; }
        public int Medals { get; set; }
    }
}