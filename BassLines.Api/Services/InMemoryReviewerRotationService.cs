using Microsoft.Extensions.Caching.Memory;
using BassLines.Api.Models;
using System.Collections.Generic;

namespace BassLines.Api.Services
{
    public class InMemoryReviewerRotationService : BaseReviewerRotationService
    {
        private readonly IMemoryCache _cache;
        
        public InMemoryReviewerRotationService(IMemoryCache cache, BassLinesContext ctx) : base(ctx)
        {
            _cache = cache;
        }

        public override string GetCurrentReviewer() => _cache.Get<string>(CURRENT_REVIEWER_KEY);

        public override void RebuildReviewerQueue()
        {
            var reviewerQueue = GetReviewerOrder();

            _cache.Set(REVIEWER_LIST_KEY, reviewerQueue);
        }

        public override void RotateReviewer()
        {
            var reviewerQueue = _cache.Get<Queue<string>>(REVIEWER_LIST_KEY);

            if (reviewerQueue == null || reviewerQueue.Count < 1) return;

            var newReviewer = reviewerQueue.Dequeue();

            AssignNewReviewer(newReviewer);

            _cache.Set(CURRENT_REVIEWER_KEY, newReviewer);

            if (reviewerQueue.Count == 0)
            {
                RebuildReviewerQueue();
            }
            else
            {
                _cache.Set(REVIEWER_LIST_KEY, reviewerQueue);
            }
        }
    }
}