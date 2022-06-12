using System.Collections.Generic;
using System.Linq;
using BassLines.Api.Enums;
using BassLines.Api.Models;
using Microsoft.EntityFrameworkCore;
using BassLines.Api.Interfaces;
using BassLines.Api.ViewModels;
using System;

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

        protected Queue<string> GetReviewerOrder(Guid studioId)
        {
            // Disablereviewing is nullable so directly compare
            var reviewerList = _ctx.Set<User>()
                .AsNoTracking()
                .Include(u => u.SongUsers)
                .Where(w => w.Disablereviewing == false && w.Studioid == studioId)
                .OrderByDescending(o => o.SongUsers.Where(s => s.Rating.HasValue).Average(a => a.Rating))
                .Select(s => s.Username)
                .ToList();

            return new Queue<string>(reviewerList);
        }

        protected void AssignNewReviewer(string newReviewer, Guid studioId)
        {

            var roles = _ctx.Set<Role>().AsNoTracking().ToList();

            // "eligible users" are those who are not admins but are enabled to be in the reviewer rotation
            var eligibleUsers = _ctx.Set<User>()
                .Include(i => i.Role)
                .Where(w => w.Role.Name != UserRole.Administrator.ToString() && w.Disablereviewing == false && w.Studioid == studioId)
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

        protected List<Guid> GetStudioIds()
        {
            return _ctx.Studios.Select(s => s.Id).ToList();
        }

        public abstract void RebuildReviewerQueue(Guid studioId);

        public abstract void RebuildAllReviewerQueues();

        public abstract void RotateReviewer(Guid studioId);

        public abstract string GetCurrentReviewer(Guid studioId);

        public abstract IEnumerable<UserModel> GetReviewerQueue(Guid studioId);

        public abstract string GetReviewerNotes(Guid studioId);

        public abstract void SetReviewerNotes(string notes, Guid studioId);
    }
}