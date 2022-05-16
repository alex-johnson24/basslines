using Microsoft.Extensions.Caching.Memory;
using BassLines.Api.Models;
using System.Collections.Generic;
using BassLines.Api.Interfaces;
using BassLines.Api.ViewModels;
using System.Linq;
using AutoMapper;

namespace BassLines.Api.Services
{
    public class InMemoryReviewerRotationService : BaseReviewerRotationService
    {
        private readonly IMemoryCache _cache;
        private readonly IUserRepository _userRepo;
        private readonly IMapper _mapper;

        public InMemoryReviewerRotationService(IMemoryCache cache, IUserRepository userRepo, IMapper mapper, BassLinesContext ctx) : base(ctx)
        {
            _cache = cache;
            _userRepo = userRepo;
            _mapper = mapper;
        }

        public override string GetCurrentReviewer() => _cache.Get<string>(CURRENT_REVIEWER_KEY);

        public override void RebuildReviewerQueue()
        {
            var reviewerQueue = GetReviewerOrder();

            _cache.Set(REVIEWER_LIST_KEY, reviewerQueue);
            RotateReviewer();
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

        public override IEnumerable<UserModel> GetReviewerQueue()
        {
            var userQueue = _cache.Get<IEnumerable<string>>(REVIEWER_LIST_KEY)?.Select(u => _userRepo.GetUserByUsername(u));
            if (userQueue == null) return new List<UserModel>();
            return _mapper.Map<List<UserModel>>(userQueue);
        }

        public override string GetReviewerNotes()
        {
            var userNotes = _cache.Get<string>(REVIEWER_NOTES_KEY);
            return userNotes ?? "";
        }

        public override void SetReviewerNotes(string notes)
        {
            _cache.Set(REVIEWER_NOTES_KEY, notes);
        }
    }
}