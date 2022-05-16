using System.Collections.Generic;
using System.Linq;
using BassLines.Api.Enums;
using BassLines.Api.Models;
using Microsoft.EntityFrameworkCore;
using BassLines.Api.Interfaces;
using BassLines.Api.ViewModels;

namespace BassLines.Api.Services
{
    public abstract class BaseReviewerRotationService : IReviewerRotationService
    {

        protected static readonly string REVIEWER_LIST_KEY = "reviewerList";
        protected static readonly string CURRENT_REVIEWER_KEY = "currentReviewer";
        protected static readonly string REVIEWER_NOTES_KEY = "reviewerNotes";
        protected readonly BassLinesContext _ctx;

        protected BaseReviewerRotationService(BassLinesContext ctx)
        {
            _ctx = ctx;
        }

        protected Queue<string> GetReviewerOrder()
        {
            // Disablereviewing is nullable so directly compare
            var reviewerList = _ctx.Set<User>()
                .AsNoTracking()
                .Include(u => u.SongUsers)
                .Where(w => w.Disablereviewing == false)
                .OrderByDescending(o => o.SongUsers.Where(s => s.Rating.HasValue).Average(a => a.Rating))
                .Select(s => s.Username)
                .ToList();

            return new Queue<string>(reviewerList);
        }

        protected void AssignNewReviewer(string newReviewer)
        {

            var roles = _ctx.Set<Role>().AsNoTracking().ToList();

            // "eligible users" are those who are not admins but are enabled to be in the reviewer rotation
            var eligibleUsers = _ctx.Set<User>()
                .Include(i => i.Role)
                .Where(w => w.Role.Name != UserRole.Administrator.ToString() && w.Disablereviewing == false)
                .AsNoTracking();

            // this will reset all non-admins to 'contributor'
            // if an admin is the reviewer, they have the perms to review songs already
            foreach (User usr in eligibleUsers)
            {
                usr.Roleid = roles.FirstOrDefault(f =>
                                    f.Name == (usr.Username == newReviewer ?
                                    UserRole.Reviewer.ToString() :
                                    UserRole.Contributor.ToString())).Id;
                _ctx.Entry(usr).State = EntityState.Modified;
            }

            _ctx.SaveChanges();
        }

        public abstract void RebuildReviewerQueue();

        public abstract void RotateReviewer();

        public abstract string GetCurrentReviewer();

        public abstract IEnumerable<UserModel> GetReviewerQueue();

        public abstract string GetReviewerNotes();

        public abstract void SetReviewerNotes(string notes);
    }
}