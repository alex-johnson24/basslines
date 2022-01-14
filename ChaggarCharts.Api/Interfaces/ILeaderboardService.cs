using System;
using System.Collections.Generic;
using System.Threading.Tasks;
using ChaggarCharts.Api.ViewModels;

namespace ChaggarCharts.Api.Interfaces
{
    public interface ILeaderboardService
    {
        public IEnumerable<UserLeaderboardModel> GetLeaderboardMetrics();
    }
}