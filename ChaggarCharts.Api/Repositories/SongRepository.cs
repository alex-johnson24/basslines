using System.Collections.Generic;
using System.Linq;
using AutoMapper;
using ChaggarCharts.Api.Interfaces;
using ChaggarCharts.Api.Models;
using ChaggarCharts.Api.ViewModels;
using Microsoft.EntityFrameworkCore;

namespace ChaggarCharts.Api.Repositories
{
    public class SongRepository : ISongRepository
    {
        private readonly ChaggarChartsContext _ctx;
        private readonly IMapper _mapper;
        public SongRepository(ChaggarChartsContext ctx, IMapper mapper)
        {
            _ctx = ctx;
            _mapper = mapper;
        }

        public IEnumerable<SongModel> GetSongs()
        {
            return _ctx.Set<Song>()
                    .Include(i => i.Genre)
                    .Include(i => i.User)
                    .Select(s => _mapper.Map<SongModel>(s));
        }
    }
}