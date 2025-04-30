using BassLines.Api.Interfaces;
using Microsoft.EntityFrameworkCore;
using BassLines.Api.Models;
using System.Linq;
using BassLines.Api.Enums;

namespace BassLines.Api.Repositories
{
    public class RoleRepository(IDbContextFactory<BassLinesContext> contextFactory) 
        : BaseRepository(contextFactory), IRoleRepository
    {
        private static UserRole DEFAULT_ROLE = UserRole.Contributor;

        public Role GetDefaultRole()
        {
            return _ctx.Roles.FirstOrDefault(f => f.Name == DEFAULT_ROLE.ToString());
        }
    }
}
