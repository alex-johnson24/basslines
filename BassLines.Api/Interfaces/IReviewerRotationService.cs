using System.Collections.Generic;
using BassLines.Api.ViewModels;

namespace BassLines.Api.Interfaces
{
    public interface IReviewerRotationService
    {
        void RebuildReviewerQueue();

        void RotateReviewer();

        string GetCurrentReviewer();

        IEnumerable<UserModel> GetReviewerQueue();

        string GetReviewerNotes();

        void SetReviewerNotes(string notes);
    }
}