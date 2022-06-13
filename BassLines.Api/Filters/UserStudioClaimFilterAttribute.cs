using System.Security.Claims;
using BassLines.Api.Utils;
using Microsoft.AspNetCore.Mvc;
using Microsoft.AspNetCore.Mvc.Filters;

namespace BassLines.Api.Filters
{
    public class UserStudioClaimFilterAttribute : ActionFilterAttribute, IActionFilter
    {
        public override void OnActionExecuting(ActionExecutingContext context)
        {
            var currentUser = context.HttpContext.User.Identity as ClaimsIdentity;
            var userStudioId = currentUser.GetUserStudio();
            if (userStudioId.HasValue)
            {
                context.HttpContext.Items[BassLinesUtils.USER_STUDIO_ITEM_KEY] = userStudioId;
                return;
            }
            context.Result = new BadRequestObjectResult("No user studio claim was found for the given request");
        }
    }
}