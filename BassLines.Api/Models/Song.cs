using System;
using System.Collections.Generic;

namespace BassLines.Api.Models
{
    public partial class Song
    {
        public Song()
        {
            Likes = new HashSet<Like>();
        }

        public Guid Id { get; set; }
        public string Title { get; set; }
        public string Artist { get; set; }
        public Guid? Userid { get; set; }
        public Guid? Genreid { get; set; }
        public DateTime? Submitteddate { get; set; }
        public decimal? Rating { get; set; }
        public DateTime? Createdatetime { get; set; }
        public DateTime? Updatedatetime { get; set; }
        public string Link { get; set; }
        public Guid? Reviewerid { get; set; }

        public virtual Genre Genre { get; set; }
        public virtual User Reviewer { get; set; }
        public virtual User User { get; set; }
        public virtual ICollection<Like> Likes { get; set; }
    }
}
