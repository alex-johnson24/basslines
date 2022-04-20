using ChaggarCharts.Api.Models;
using ChaggarCharts.Api.Enums;

namespace ChaggarCharts.Api.Interfaces
{
    public interface IRoleRepository : IBaseRepository
    {
        Role GetDefaultRole();
    }
}