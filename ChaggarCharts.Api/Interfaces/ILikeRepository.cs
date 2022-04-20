using System;
using ChaggarCharts.Api.Models;

namespace ChaggarCharts.Api.Interfaces
{
    public interface ILikeRepository : IBaseRepository
    {
        void CreateLike(Like like);
        void RemoveLike(Like like);
    }
}