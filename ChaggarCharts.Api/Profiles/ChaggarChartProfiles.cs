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

            CreateMap<User, UserModel>()
                .ForMember(dest => dest.Role, m => m.MapFrom(src => src.Role.Flag));
            
            CreateMap<Genre, GenreModel>();
        }
    }
}