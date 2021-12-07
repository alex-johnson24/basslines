using ChaggarCharts.Api.Interfaces;
using ChaggarCharts.Api.Models;
using ChaggarCharts.Api.ViewModels;
using Microsoft.EntityFrameworkCore;

namespace ChaggarCharts.Api.Repositories
{
    public class LikeRepository : ILikeRepository
    {
        private readonly ChaggarChartsContext _ctx;
        public LikeRepository(IDbContextFactory<ChaggarChartsContext> ctxFactory)
        {
            _ctx = ctxFactory.CreateDbContext();
        }
        public bool CreateLike(LikeModel model)
        {
            _ctx.Set<Like>().Add(new Like
            {
                Songid = model.SongId,
                Userid = model.UserId
            });

            return _ctx.SaveChanges() > 0;
        }
    }
}