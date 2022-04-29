using System;
using System.Collections.Generic;

namespace ChaggarCharts.Api.Models
{
    public partial class Role
    {
        public Role()
        {
            Users = new HashSet<User>();
        }

        public Guid Id { get; set; }
        public string Name { get; set; }
        public int Flag { get; set; }
        public DateTime? Createdatetime { get; set; }
        public DateTime? Updatedatetime { get; set; }

        public virtual ICollection<User> Users { get; set; }
    }
}
