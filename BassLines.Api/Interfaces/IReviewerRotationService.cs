using System;
using System.Collections.Generic;
using BassLines.Api.ViewModels;

namespace BassLines.Api.Interfaces
{
    public interface IReviewerRotationService
    {
        void RebuildAllReviewerQueues();
        
        void RebuildReviewerQueue(Guid studioId);

        void RotateReviewer(Guid studioId);

        string GetCurrentReviewer(Guid studioId);

        IEnumerable<UserModel> GetReviewerQueue(Guid studioId);

        string GetReviewerNotes(Guid studioId);

        void SetReviewerNotes(string notes, Guid studioId);
    }
}