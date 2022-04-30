using System;
using BassLines.Api.Models;

namespace BassLines.Api.Interfaces
{
    public interface ILikeRepository : IBaseRepository
    {
        void CreateLike(Like like);
        void RemoveLike(Like like);
    }
}