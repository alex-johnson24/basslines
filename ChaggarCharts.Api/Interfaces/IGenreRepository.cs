using System.Collections.Generic;
using ChaggarCharts.Api.Models;

namespace ChaggarCharts.Api.Interfaces
{
    public interface IGenreRepository : IBaseRepository
    {
        IEnumerable<Genre> GetGenres();
    }
}