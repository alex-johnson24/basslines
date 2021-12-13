using System;
using System.Linq;
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

        public bool RemoveLike(Guid userId, Guid songId)
        {
            var toDelete = _ctx.Set<Like>().Where(w => w.Songid == songId && w.Userid == userId).FirstOrDefault();
            if (toDelete == null) return false;
            _ctx.Set<Like>().Remove(toDelete);
            return _ctx.SaveChanges() > 0;
        }
    }
}