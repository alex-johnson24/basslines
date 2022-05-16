using System;
using System.Collections.Generic;
using System.ComponentModel.DataAnnotations;

namespace BassLines.Api.ViewModels
{
    public class SpotifyLinkReference : SongBase
    {
        public decimal? Rating { get; set; }
        public DateTime? Submitteddate { get; set; }
    }
}
