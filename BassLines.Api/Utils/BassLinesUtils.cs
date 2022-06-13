using System;
using System.Net.Http;
using System.Security.Claims;
using System.Text;
using System.Text.Json;
using System.Threading.Tasks;

namespace BassLines.Api.Utils
{
    public static class BassLinesUtils
    {
        public static readonly string USER_STUDIO_ITEM_KEY = "studioId";

        public static string RandomString(int size)
        {
            var builder = new StringBuilder(size);
            char offset = 'A';
            const int lettersOffset = 26; // A...Z length = 26  

            for (var i = 0; i < size; i++)
            {
                var @char = (char)new Random().Next(offset, offset + lettersOffset);
                builder.Append(@char);
            }

            return builder.ToString();
        }

        public static string Base64Encode(this string plainText)
        {
            var plainTextBytes = System.Text.Encoding.UTF8.GetBytes(plainText);
            return System.Convert.ToBase64String(plainTextBytes);
        }

        public static string Base64Decode(this string b64)
        {
            byte[] byteArray = Convert.FromBase64String(b64);
            return System.Text.Encoding.UTF8.GetString(byteArray);
        }

        public static async Task<T> DeserializeHttp<T>(this HttpResponseMessage message)
        {
            // Todo: this should really log non-success data
            if (message.IsSuccessStatusCode)
            {
                string content = await message.Content.ReadAsStringAsync();
                return JsonSerializer.Deserialize<T>(content);
            }

            return default;
        }

        public static Guid? GetUserStudio(this ClaimsIdentity identity)
        {
            if (identity == null) return null;
            var hasStudioId = Guid.TryParse(identity.FindFirst(USER_STUDIO_ITEM_KEY)?.Value, out Guid userStudioId);
            return hasStudioId ? userStudioId : null;
        }

        public static string ToGuidKey(this string key, Guid uid)
        {
            return $"{key}_{uid}";
        }
    }
}