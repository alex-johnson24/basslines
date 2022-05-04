using AutoMapper;
using BassLines.Api.ViewModels;
using BassLines.Api.Models;

namespace BassLines.Api.Profiles
{
    public class BassLinesProfile : Profile
    {
        public BassLinesProfile()
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