using ChaggarCharts.Api.ViewModels;

namespace ChaggarCharts.Api.Interfaces
{
    public interface ILikeRepository
    {
        bool CreateLike(LikeModel model);
    }
}