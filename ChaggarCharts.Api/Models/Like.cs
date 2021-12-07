using System;
using System.Collections.Generic;

#nullable disable

namespace ChaggarCharts.Api.Models
{
    public partial class Like
    {
        public Guid Id { get; set; }
        public Guid? Songid { get; set; }
        public Guid? Userid { get; set; }
        public DateTime? Createdatetime { get; set; }
        public DateTime? Updatedatetime { get; set; }

        public virtual Song Song { get; set; }
        public virtual User User { get; set; }
    }
}
