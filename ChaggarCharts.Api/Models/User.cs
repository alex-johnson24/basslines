using System;
using System.Collections.Generic;

#nullable disable

namespace ChaggarCharts.Api.Models
{
    public partial class User
    {
        public User()
        {
            Songs = new HashSet<Song>();
        }

        public Guid Id { get; set; }
        public string Username { get; set; }
        public string Firstname { get; set; }
        public string Lastname { get; set; }
        public string Hpassword { get; set; }
        public string Salt { get; set; }
        public Guid? Roleid { get; set; }
        public DateTime? Createdatetime { get; set; }
        public DateTime? Updatedatetime { get; set; }

        public virtual Role Role { get; set; }
        public virtual ICollection<Song> Songs { get; set; }
    }
}
