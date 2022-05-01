using System;
using System.Collections.Generic;
using System.Text;
using System.Text.Json;
using BassLines.Api.Models;
using Microsoft.Extensions.Caching.Distributed;

namespace BassLines.Api.Services
{
    public class RedisReviewerRotationService : BaseReviewerRotationService
    {
        private readonly IDistributedCache _cache;
        private readonly DistributedCacheEntryOptions _opts = new DistributedCacheEntryOptions
        {
            SlidingExpiration = TimeSpan.MaxValue
        };
        public RedisReviewerRotationService(IDistributedCache cache, BassLinesContext ctx) : base(ctx)
        {
            _cache = cache;
        }

        public override string GetCurrentReviewer() => _cache.Get(CURRENT_REVIEWER_KEY).FromRedisCache<string>();

        public override void RebuildReviewerQueue()
        {
            var reviewerQueue = GetReviewerOrder();

            var listAsBytes = reviewerQueue.ToRedisCache();

            _cache.Set(REVIEWER_LIST_KEY, listAsBytes, _opts);
        }

        public override void RotateReviewer()
        {
            var reviewerBytes = _cache.Get(REVIEWER_LIST_KEY);

            if (reviewerBytes == null) return;

            var reviewerQueue = reviewerBytes.FromRedisCache<Queue<string>>();

            var newReviewer = reviewerQueue.Dequeue();

            AssignNewReviewer(newReviewer);

            var userAsBytes = newReviewer.ToRedisCache();

            _cache.Set(CURRENT_REVIEWER_KEY, userAsBytes, _opts);

            if (reviewerQueue.Count == 0)
            {
                RebuildReviewerQueue();
            }
            else
            {
                var listAsBytes = reviewerQueue.ToRedisCache();
                _cache.Set(REVIEWER_LIST_KEY, listAsBytes, _opts);
            }
        }


    }

    public static class RedisHelpers
    {
        public static T FromRedisCache<T>(this byte[] item)
        {
            if (item == null) return default;
            try
            {
                var cachedDataString = Encoding.UTF8.GetString(item);
                var result = JsonSerializer.Deserialize<T>(cachedDataString);
                return result;
            }
            catch (Exception)
            {
                return default;
            }
        }

        public static byte[] ToRedisCache<T>(this T item)
        {
            if (item == null) return default;
            try
            {
                var jsonString = JsonSerializer.Serialize(item);
                var redisBytes = Encoding.ASCII.GetBytes(jsonString);
                return redisBytes;
            }
            catch (Exception)
            {
                return default;
            }
        }
    }
}