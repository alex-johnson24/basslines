using System.Threading.Tasks;
using BassLines.Api.ViewModels;

namespace BassLines.Api.Interfaces
{
    public interface ISongHub
    {
        Task ReceiveSongEvent(SongModel song);
        Task ReceiveNoteEvent(string note);
    }
}