using System;
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
        public int? Rating { get; set; }
    }
}