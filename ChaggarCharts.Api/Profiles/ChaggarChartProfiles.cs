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
                .ForMember(m => m.Genre, opt => opt.MapFrom(s => s.Genre.Name));
        }
    }
}