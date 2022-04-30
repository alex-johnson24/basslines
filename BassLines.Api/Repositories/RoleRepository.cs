using BassLines.Api.Interfaces;
using Microsoft.EntityFrameworkCore;
using BassLines.Api.Models;
using System.Linq;
using BassLines.Api.Enums;

namespace BassLines.Api.Repositories
{
    public class RoleRepository : BaseRepository, IRoleRepository
    {
        private static UserRole DEFAULT_ROLE = UserRole.Contributor;
        public RoleRepository(IDbContextFactory<BassLinesContext> contextFactory) : base(contextFactory)
        { }

        public Role GetDefaultRole()
        {
            return _ctx.Roles.FirstOrDefault(f => f.Name == DEFAULT_ROLE.ToString());
        }
    }
}