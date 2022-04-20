using AutoMapper;
using ChaggarCharts.Api.ViewModels;
using ChaggarCharts.Api.Models;

namespace ChaggarCharts.Api.Profiles
{
    public class ChaggarChartProfile : Profile
    {
        public ChaggarChartProfile()
        {
            CreateMap<Song, SongModel>()
                .ReverseMap();

            CreateMap<User, UserModel>()
                .ForMember(dest => dest.Role, m => m.MapFrom(src => src.Role.Flag))
                .ReverseMap()
                .ForMember(dest => dest.Role, m => m.Ignore());
            
            CreateMap<Genre, GenreModel>()
                .ReverseMap();

            CreateMap<Like, LikeModel>()
                .ReverseMap();
        }
    }
}