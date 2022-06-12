using System;
using System.Collections.Generic;

namespace BassLines.Api.Models
{
    public partial class User
    {
        public User()
        {
            Likes = new HashSet<Like>();
            SongReviewers = new HashSet<Song>();
            SongUsers = new HashSet<Song>();
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
        public bool? Disablereviewing { get; set; }
        public Guid Studioid { get; set; }

        public virtual Role Role { get; set; }
        public virtual Studio Studio { get; set; }
        public virtual ICollection<Like> Likes { get; set; }
        public virtual ICollection<Song> SongReviewers { get; set; }
        public virtual ICollection<Song> SongUsers { get; set; }
    }
}
