using System.Collections.Generic;

namespace BassLines.Api.ViewModels
{
  public class SpotifyProfile : SpotifyBase
  {
    public int? Followers { get; set; }
    public string PhotoUrl { get; set; }
    public bool Premium { get; set; }
  }

  public class Device
  {
    public string id { get; set; }
    public bool is_active { get; set; }
    public bool is_private_session { get; set; }
    public bool is_restricted { get; set; }
    public string name { get; set; }
    public string type { get; set; }
    public int? volume_percent { get; set; }
  }

  public class MyDevices
  {
    public List<Device> devices { get; set; }
  }
}