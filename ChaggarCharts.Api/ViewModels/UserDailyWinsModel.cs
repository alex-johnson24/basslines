using System;

namespace ChaggarCharts.Api.ViewModels
{
    public class UserDailyWinsModel
    {
        public Guid? UserID { get; set; }
        public int Wins { get; set; }
    }
}