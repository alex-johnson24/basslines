using System;
using System.Collections.Generic;

namespace BassLines.Api.ViewModels
{
    public class PlayContextRequest
    {
        public string device_id { get; set; }
        public string context_uri { get; set; }
        public string[] uris { get; set; }
        public int? position_ms { get; set; }
    }
}