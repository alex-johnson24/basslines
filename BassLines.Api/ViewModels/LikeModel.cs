using System;
using System.ComponentModel.DataAnnotations;

namespace BassLines.Api.ViewModels
{
    public class LikeModel
    {
        public Guid? Id { get; set; }
        [Required]
        public Guid? SongId { get; set; }
        [Required]
        public Guid? UserId { get; set; }
        public UserModel User { get; set; }
    }
}