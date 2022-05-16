using System;
using System.Collections.Generic;

namespace BassLines.Api.ViewModels
{
    public class TransferStateRequest
    {
        public IEnumerable<string> device_ids { get; set; }
        public static bool play { get; } = true;
    }
}