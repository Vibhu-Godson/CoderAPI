using Microsoft.AspNetCore.Mvc.ViewFeatures;
using System.Text.RegularExpressions;

namespace CoderAPI.Helper
{
    public static class InputValidator
    {
        private static readonly Regex EmailRegex =
            new(@"^[^@\s]+@[^@\s]+\.[^@\s]+$", RegexOptions.Compiled | RegexOptions.IgnoreCase);

        private static readonly Regex PhoneRegex =
            new(@"^\+?[0-9]{10,15}$", RegexOptions.Compiled);
        // supports optional +, 10–15 digits (covers most phone formats)

        public static string DetectInputType(string input)
        {
            if (string.IsNullOrWhiteSpace(input))
                throw new ArgumentException("Input cannot be null or empty.");

            input = input.Trim();

            if (EmailRegex.IsMatch(input))
                return "Email";

            if (PhoneRegex.IsMatch(input))
                return "Phone";

            return "UserName";
        }
    }
}
