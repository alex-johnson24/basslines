using System;
using System.Collections.Generic;

#nullable disable

namespace ChaggarCharts.Api.Models
{
    public partial class Song
    {
        public Guid Id { get; set; }
        public string Title { get; set; }
        public string Artist { get; set; }
        public Guid? Userid { get; set; }
        public Guid? Genreid { get; set; }
        public DateTime? Submitteddate { get; set; }
        public decimal? Rating { get; set; }
        public DateTime? Createdatetime { get; set; }
        public DateTime? Updatedatetime { get; set; }

        public virtual Genre Genre { get; set; }
        public virtual User User { get; set; }
    }
}
