using Microsoft.AspNetCore.SignalR;
using ChaggarCharts.Api.Interfaces;

namespace ChaggarCharts.Api.Hubs
{
    public class SongHub : Hub<ISongHub>
    {
    }
}