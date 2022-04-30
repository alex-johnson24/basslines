using Microsoft.AspNetCore.SignalR;
using BassLines.Api.Interfaces;

namespace BassLines.Api.Hubs
{
    public class SongHub : Hub<ISongHub>
    {
    }
}