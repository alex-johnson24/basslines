using System;

namespace ChaggarCharts.Api.ViewModels
{
    public class DailyRatingModel
    {
        public DateTime SubmittedDate { get; set; }
        public decimal? Rating { get; set; }
        public string Title { get; set; }
        public string Artist { get; set; }
    }
}

