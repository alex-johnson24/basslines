using System;
using System.Collections.Generic;
using System.Linq;
using AutoMapper;
using ChaggarCharts.Api.Models;
using ChaggarCharts.Api.Repositories;
using ChaggarCharts.Api.ViewModels;
using Microsoft.EntityFrameworkCore;
using Moq;
using Xunit;

namespace ChaggarCharts.Test
{
    public class SongRepositoryTests
    {
        [Fact]
        public void GetSongsOk()
        {
            var data = new List<Song>().AsQueryable();
            var dbSet = new Mock<DbSet<Song>>();
            dbSet.As<IQueryable<Song>>().Setup(m => m.Provider).Returns(data.Provider);
            dbSet.As<IQueryable<Song>>().Setup(m => m.Expression).Returns(data.Expression);
            dbSet.As<IQueryable<Song>>().Setup(m => m.ElementType).Returns(data.ElementType);
            dbSet.As<IQueryable<Song>>().Setup(m => m.GetEnumerator()).Returns(() => data.GetEnumerator());
            var dbContextMock = new Mock<ChaggarChartsContext>();
            var dbContextFactoryMock = new Mock<IDbContextFactory<ChaggarChartsContext>>();
            var mapperMock = new Mock<IMapper>();
            mapperMock.Setup(s => s.Map<SongModel>(It.IsAny<Song>())).Returns(new SongModel { });
            dbContextFactoryMock.Setup(s => s.CreateDbContext()).Returns(dbContextMock.Object);
            dbContextMock.Setup(s => s.Set<Song>()).Returns(dbSet.Object);


            var songRepository = new SongRepository(dbContextFactoryMock.Object, mapperMock.Object);
            var songs = songRepository.GetSongs();

            Assert.NotNull(songs);
        }
    }
}
