using System;
using System.Collections.Generic;
using System.Linq;
using BassLines.Api.Models;
using BassLines.Api.Repositories;
using Microsoft.EntityFrameworkCore;
using Moq;
using Xunit;

namespace BassLines.Test
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
            var dbContextMock = new Mock<BassLinesContext>();
            var dbContextFactoryMock = new Mock<IDbContextFactory<BassLinesContext>>();
            dbContextFactoryMock.Setup(s => s.CreateDbContext()).Returns(dbContextMock.Object);
            dbContextMock.Setup(s => s.Set<Song>()).Returns(dbSet.Object);


            var songRepository = new SongRepository(dbContextFactoryMock.Object);
            var songs = songRepository.GetSongs(Guid.NewGuid());

            Assert.NotNull(songs);
        }
    }
}
