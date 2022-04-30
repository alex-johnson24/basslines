using System;
using System.Collections.Generic;
using System.Threading.Tasks;
using BassLines.Api.ViewModels;

namespace BassLines.Api.Interfaces
{
    public interface ILeaderboardService
    {
        public IEnumerable<UserLeaderboardModel> GetLeaderboardMetrics();
    }
}