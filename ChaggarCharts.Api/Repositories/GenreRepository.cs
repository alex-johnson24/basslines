using System.Collections.Generic;
using ChaggarCharts.Api.Interfaces;
using ChaggarCharts.Api.Models;
using Microsoft.EntityFrameworkCore;

namespace ChaggarCharts.Api.Repositories
{
    public class GenreRepository : BaseRepository, IGenreRepository
    {
        public GenreRepository(IDbContextFactory<ChaggarChartsContext> ctxFactory) : base(ctxFactory)
        { }

        public IEnumerable<Genre> GetGenres()
        {
            return _ctx.Set<Genre>();
        }
    }
}