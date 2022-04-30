using System.Collections.Generic;
using BassLines.Api.Interfaces;
using BassLines.Api.Models;
using Microsoft.EntityFrameworkCore;

namespace BassLines.Api.Repositories
{
    public class GenreRepository : BaseRepository, IGenreRepository
    {
        public GenreRepository(IDbContextFactory<BassLinesContext> ctxFactory) : base(ctxFactory)
        { }

        public IEnumerable<Genre> GetGenres()
        {
            return _ctx.Set<Genre>();
        }
    }
}