using System.Collections.Generic;
using BassLines.Api.Models;

namespace BassLines.Api.Interfaces
{
    public interface IGenreRepository : IBaseRepository
    {
        IEnumerable<Genre> GetGenres();
    }
}