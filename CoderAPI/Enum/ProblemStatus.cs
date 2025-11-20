namespace CoderAPI.Enum
{
    public enum ProblemStatus
    {
        NotAttempted,
        Attempted,
        Accepted,
        WA,
        TLE,
        Completed,
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
    public static class TestCasesStatus
    {
        public const string Accepted = "Accepted";
        public const string CompilationError = "Compilation Error";
        public const string RuntimeError = "Runtime Error";
        public const string Pending = "Pending";
        public const string WrongAnswer = "Wrong Answer";
    }
}
