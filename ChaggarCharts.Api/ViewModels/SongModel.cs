using System;
using System.Collections.Generic;
using System.ComponentModel.DataAnnotations;

namespace ChaggarCharts.Api.ViewModels
{
    public class SongModel
    {
        public Guid? Id { get; set; }
        [Required]
        public string Title { get; set; }
        [Required]
        public string Artist { get; set; }
        public GenreModel Genre { get; set; }
        public UserModel User { get; set; }
        public UserModel Reviewer { get; set; }
        public decimal? Rating { get; set; }
        public string Link { get; set; }
        public DateTime? Submitteddate { get; set; }
        public DateTime? Createdatetime { get; set; }
        public ICollection<LikeModel> Likes { get; set; }
    }
}
