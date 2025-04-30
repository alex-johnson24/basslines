using BassLines.Api.Interfaces;
using BassLines.Api.Models;
using Microsoft.EntityFrameworkCore;

namespace BassLines.Api.Repositories
{
    public class LikeRepository(IDbContextFactory<BassLinesContext> ctxFactory) 
        : BaseRepository(ctxFactory), ILikeRepository
    {
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
