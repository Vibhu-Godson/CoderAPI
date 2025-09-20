namespace CoderAPI.Enum
{
    public enum ProblemStatus
    {
        NotAttempted,
        Attempted,
        Accepted,
        WA,
        TLE,
    }

    public enum ProblemSessionStatus
    {
        Completed,
        Started
    }

    public enum RunCodeStatus
    {
        Pending,
        Running,
        Completed,
        Error
    }
}
