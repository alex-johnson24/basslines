using System.Collections.Generic;
using System.Threading.Tasks;
using ChaggarCharts.Api.ViewModels;

namespace ChaggarCharts.Api.Interfaces
{
    public interface ISongRepository
    {
        IEnumerable<SongModel> GetSongs();
    }
}