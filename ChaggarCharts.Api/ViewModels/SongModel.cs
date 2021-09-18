namespace ChaggarCharts.Api.ViewModels
{
    public class SongModel
    {
        public string Title { get; set; }
        public string Artist { get; set; }
        public GenreModel Genre { get; set; }
        public UserModel User { get; set; }
        public int? Rating { get; set; }
    }
}