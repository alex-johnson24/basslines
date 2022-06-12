using Microsoft.Extensions.Caching.Memory;
using BassLines.Api.Models;
using System.Collections.Generic;
using BassLines.Api.Interfaces;
using BassLines.Api.ViewModels;
using System.Linq;
using AutoMapper;
using System;
using BassLines.Api.Utils;

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

        public override string GetCurrentReviewer(Guid studioId) => _cache.Get<string>(CURRENT_REVIEWER_KEY.ToGuidKey(studioId));

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

            var reviewers = GetReviewerOrder(studioId);
            _cache.Set(REVIEWER_LIST_KEY.ToGuidKey(studioId), reviewers);
            RotateReviewer(studioId);
        }

        public override void RotateReviewer(Guid studioId)
        {
            var reviewerQueue = _cache.Get<Queue<string>>(REVIEWER_LIST_KEY.ToGuidKey(studioId));

            if (reviewerQueue == null || reviewerQueue.Count < 1) return;

            var newReviewer = reviewerQueue.Dequeue();

            AssignNewReviewer(newReviewer, studioId);

            _cache.Set(CURRENT_REVIEWER_KEY.ToGuidKey(studioId), newReviewer);

            if (reviewerQueue.Count == 0)
            {
                RebuildReviewerQueue(studioId);
            }
            else
            {
                _cache.Set(REVIEWER_LIST_KEY.ToGuidKey(studioId), reviewerQueue);
            }
        }

        public override IEnumerable<UserModel> GetReviewerQueue(Guid studioId)
        {
            var userQueue = _cache.Get<IEnumerable<string>>(REVIEWER_LIST_KEY.ToGuidKey(studioId))?.Select(u => _userRepo.GetUserByUsername(u));
            if (userQueue == null) return new List<UserModel>();
            return _mapper.Map<List<UserModel>>(userQueue);
        }

        public override string GetReviewerNotes(Guid studioId)
        {
            var userNotes = _cache.Get<string>(REVIEWER_NOTES_KEY.ToGuidKey(studioId));
            return userNotes ?? "";
        }

        public override void SetReviewerNotes(string notes, Guid studioId)
        {
            _cache.Set(REVIEWER_NOTES_KEY.ToGuidKey(studioId), notes);
        }
    }
}