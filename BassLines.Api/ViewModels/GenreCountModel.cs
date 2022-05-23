using System.Collections.Generic;
namespace BassLines.Api.ViewModels
{
    public class GenreCountModel
    {
        public string Genre { get; set; }
        public int Count { get; set; }
        public List<string> SpotifyLinks { get; set; }
    }
}