using System.Collections.Generic;
using System.Linq;
using AutoMapper;
using ChaggarCharts.Api.Interfaces;
using ChaggarCharts.Api.Models;
using ChaggarCharts.Api.ViewModels;
using Microsoft.EntityFrameworkCore;
using System;

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
                    .AsNoTracking()
                    .Include(i => i.Genre)
                    .Include(i => i.User)
                    .Select(s => _mapper.Map<SongModel>(s));
        }

        public IEnumerable<SongModel> GetSongsByDate(DateTime submitDate)
        {
            return _ctx.Set<Song>()
                    .AsNoTracking()
                    .Include(i => i.Genre)
                    .Include(i => i.User)
                    .Where(w => w.Submitteddate == submitDate)
                    .Select(s => _mapper.Map<SongModel>(s));
        }
    }
}