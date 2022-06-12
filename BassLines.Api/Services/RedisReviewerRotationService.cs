using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Text.Json;
using AutoMapper;
using BassLines.Api.Models;
using BassLines.Api.ViewModels;
using Microsoft.Extensions.Caching.Distributed;
using BassLines.Api.Interfaces;
using BassLines.Api.Utils;

namespace BassLines.Api.Services
{
    public class RedisReviewerRotationService : BaseReviewerRotationService
    {
        private readonly IDistributedCache _cache;
        private readonly IUserRepository _userRepo;
        private readonly IMapper _mapper;
        private readonly DistributedCacheEntryOptions _opts = new DistributedCacheEntryOptions
        {
            SlidingExpiration = TimeSpan.MaxValue
        };
        public RedisReviewerRotationService(IDistributedCache cache, IUserRepository userRepo, IMapper mapper, BassLinesContext ctx) : base(ctx)
        {
            _cache = cache;
            _userRepo = userRepo;
            _mapper = mapper;
        }

        public override string GetCurrentReviewer(Guid studioId) => _cache.Get(CURRENT_REVIEWER_KEY.ToGuidKey(studioId)).FromRedisCache<string>();

        public override void RebuildAllReviewerQueues()
        {
            var studioIds = GetStudioIds();

            studioIds.ForEach((studioId) =>
            {
                RebuildReviewerQueue(studioId);
            });
        }

        public override void RebuildReviewerQueue(Guid studioId)
        {
            var reviewerQueue = GetReviewerOrder(studioId);

            var listAsBytes = reviewerQueue.ToRedisCache();

            _cache.Set(REVIEWER_LIST_KEY.ToGuidKey(studioId), listAsBytes, _opts);
        }

        public override void RotateReviewer(Guid studioId)
        {
            var reviewerBytes = _cache.Get(REVIEWER_LIST_KEY.ToGuidKey(studioId));

            if (reviewerBytes == null) return;

            var reviewerQueue = reviewerBytes.FromRedisCache<Queue<string>>();

            var newReviewer = reviewerQueue.Dequeue();

            AssignNewReviewer(newReviewer, studioId);

            var userAsBytes = newReviewer.ToRedisCache();

            _cache.Set(CURRENT_REVIEWER_KEY.ToGuidKey(studioId), userAsBytes, _opts);
            _cache.Remove(REVIEWER_NOTES_KEY.ToGuidKey(studioId));

            if (reviewerQueue.Count == 0)
            {
                RebuildReviewerQueue(studioId);
            }
            else
            {
                var listAsBytes = reviewerQueue.ToRedisCache();
                _cache.Set(REVIEWER_LIST_KEY.ToGuidKey(studioId), listAsBytes, _opts);
            }
        }

        public override IEnumerable<UserModel> GetReviewerQueue(Guid studioId)
        {
            var reviewerQueueBytes = _cache.Get(REVIEWER_LIST_KEY.ToGuidKey(studioId));

            if (reviewerQueueBytes == null) return new List<UserModel>();

            var strReviewerQueue = reviewerQueueBytes.FromRedisCache<IEnumerable<string>>().Select(u => _userRepo.GetUserByUsername(u));

            return _mapper.Map<List<UserModel>>(strReviewerQueue);
        }

        public override string GetReviewerNotes(Guid studioId)
        {
            var reviewerNotesBytes = _cache.Get(REVIEWER_NOTES_KEY.ToGuidKey(studioId));
            return reviewerNotesBytes.FromRedisCache<string>() ?? "";
        }

        public override void SetReviewerNotes(string notes, Guid studioId)
        {
            var notesAsBytes = notes.ToRedisCache();
            _cache.Set(REVIEWER_NOTES_KEY.ToGuidKey(studioId), notesAsBytes, _opts);
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