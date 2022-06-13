using System;
using System.Collections.Generic;

namespace BassLines.Api.Models
{
    public partial class Studio
    {
        public Studio()
        {
            Users = new HashSet<User>();
        }

        public Guid Id { get; set; }
        public string Name { get; set; }

        public virtual ICollection<User> Users { get; set; }
    }
}
