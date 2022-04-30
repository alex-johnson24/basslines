using BassLines.Api.Interfaces;
using BassLines.Api.Models;
using Microsoft.EntityFrameworkCore;

namespace BassLines.Api.Repositories
{
    public class LikeRepository : BaseRepository, ILikeRepository
    {
        public LikeRepository(IDbContextFactory<BassLinesContext> ctxFactory) : base(ctxFactory)
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