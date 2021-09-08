using System;
using System.Collections.Generic;

#nullable disable

namespace ChaggarCharts.Api.Models
{
    public partial class Genre
    {
        public Genre()
        {
            Songs = new HashSet<Song>();
        }

        public Guid Id { get; set; }
        public string Name { get; set; }
        public DateTime? Createdatetime { get; set; }
        public DateTime? Updatedatetime { get; set; }

        public virtual ICollection<Song> Songs { get; set; }
    }
}
