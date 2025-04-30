using BassLines.Api.Models;
using Microsoft.EntityFrameworkCore;
using BassLines.Api.Interfaces;

namespace BassLines.Api.Repositories
{
    public abstract class BaseRepository(IDbContextFactory<BassLinesContext> ctxFactory) : IBaseRepository
    {
        protected readonly BassLinesContext _ctx = ctxFactory.CreateDbContext();
        
        public bool SaveChanges()
        {
            return _ctx.SaveChanges() > 0;
        }
    }
}
