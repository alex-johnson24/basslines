using ChaggarCharts.Api.Interfaces;
using Microsoft.EntityFrameworkCore;
using ChaggarCharts.Api.Models;
using System.Linq;
using ChaggarCharts.Api.Enums;

namespace ChaggarCharts.Api.Repositories
{
    public class RoleRepository : BaseRepository, IRoleRepository
    {
        private static UserRole DEFAULT_ROLE = UserRole.Contributor;
        public RoleRepository(IDbContextFactory<ChaggarChartsContext> contextFactory) : base(contextFactory)
        { }

        public Role GetDefaultRole()
        {
            return _ctx.Roles.FirstOrDefault(f => f.Name == DEFAULT_ROLE.ToString());
        }
    }
}