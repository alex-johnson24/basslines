using System.Collections.Generic;
using System.Linq;
using AutoMapper;
using ChaggarCharts.Api.Interfaces;
using ChaggarCharts.Api.Models;
using ChaggarCharts.Api.ViewModels;
using Microsoft.EntityFrameworkCore;

namespace ChaggarCharts.Api.Repositories
{
    public class GenreRepository : IGenreRepository
    {
        private readonly ChaggarChartsContext _ctx;
        private readonly IMapper _mapper;
        public GenreRepository(IDbContextFactory<ChaggarChartsContext> ctxFactory, IMapper mapper)
        {
            _ctx = ctxFactory.CreateDbContext();
            _mapper = mapper;
        }

        public IEnumerable<GenreModel> GetGenres()
        {
            return _ctx.Set<Genre>().Select(s => _mapper.Map<GenreModel>(s));
        }
    }
}