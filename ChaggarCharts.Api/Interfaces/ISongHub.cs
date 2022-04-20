using System.Threading.Tasks;
using ChaggarCharts.Api.ViewModels;

namespace ChaggarCharts.Api.Interfaces
{
    public interface ISongHub
    {
        Task ReceiveSongEvent(SongModel song);
    }
}