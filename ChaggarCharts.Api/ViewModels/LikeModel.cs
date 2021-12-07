using System;
using System.ComponentModel.DataAnnotations;

namespace ChaggarCharts.Api.ViewModels
{
    public class LikeModel
    {
        [Required]
        public Guid? SongId { get; set; }
        [Required]
        public Guid? UserId { get; set; }
    }
}