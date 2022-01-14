using System;

namespace ChaggarCharts.Api.ViewModels
{
    public class UserDailyWinsModel
    {
        public Guid? userID { get; set; }
        public int Wins { get; set; }
    }
}