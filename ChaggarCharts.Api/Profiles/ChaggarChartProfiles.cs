using AutoMapper;
using ChaggarCharts.Api.ViewModels;
using ChaggarCharts.Api.Models;

namespace ChaggarCharts.Api.Profiles
{
    public class ChaggarChartProfile : Profile
    {
        public ChaggarChartProfile()
        {
            CreateMap<Song, SongModel>();

            CreateMap<User, UserModel>();
            
            CreateMap<Genre, GenreModel>();
        }
    }
}