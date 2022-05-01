namespace BassLines.Api.Interfaces
{
    public interface IReviewerRotationService
    {
        void RebuildReviewerQueue();

        void RotateReviewer();

        string GetCurrentReviewer();
    }
}