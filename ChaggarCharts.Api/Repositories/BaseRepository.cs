using ChaggarCharts.Api.Models;
using Microsoft.EntityFrameworkCore;

namespace ChaggarCharts.Api.Repositories
{
    public abstract class BaseRepository
    {
        protected readonly ChaggarChartsContext _ctx;
        public BaseRepository(IDbContextFactory<ChaggarChartsContext> ctxFactory)
        {
            _ctx = ctxFactory.CreateDbContext();
        }
        
        public bool SaveChanges()
        {
            return _ctx.SaveChanges() > 0;
        }
    }
}