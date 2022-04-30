using BassLines.Api.Models;
using BassLines.Api.Enums;

namespace BassLines.Api.Interfaces
{
    public interface IRoleRepository : IBaseRepository
    {
        Role GetDefaultRole();
    }
}