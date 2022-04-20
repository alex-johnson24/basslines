using ChaggarCharts.Api.Interfaces;
using ChaggarCharts.Api.Models;
using Microsoft.EntityFrameworkCore;

namespace ChaggarCharts.Api.Repositories
{
    public class LikeRepository : BaseRepository, ILikeRepository
    {
        public LikeRepository(IDbContextFactory<ChaggarChartsContext> ctxFactory) : base(ctxFactory)
        { }

        public void CreateLike(Like like)
        {
            _ctx.Set<Like>().Add(like);
        }

        public void RemoveLike(Like like)
        {
            _ctx.Set<Like>().Remove(like);
        }
    }
}