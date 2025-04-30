using System.Collections.Generic;
using BassLines.Api.Interfaces;
using BassLines.Api.Models;
using Microsoft.EntityFrameworkCore;

namespace BassLines.Api.Repositories
{
    public class GenreRepository(IDbContextFactory<BassLinesContext> ctxFactory) 
        : BaseRepository(ctxFactory), IGenreRepository
    {
        public IEnumerable<Genre> GetGenres()
        {
            return _ctx.Set<Genre>();
        }
    }
}
