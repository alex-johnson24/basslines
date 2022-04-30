namespace BassLines.Api.Enums
{
    public enum UserRole
    {
        Contributor = 1 << 0,
        Reviewer = 1 << 1,
        Administrator = 1 << 2
    }
}