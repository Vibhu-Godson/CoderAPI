using CoderAPI.Helper.Interface;
using System.Security.Cryptography;
using System.Text;

namespace CoderAPI.Helper.Implementation
{
    public class HashingHelper : IHashingHelper
    {
        private const int SaltSize = 16;     // 128 bit
        private const int KeySize = 32;      // 256 bit
        private const int Iterations = 100000; // Increase as needed
        public string Hash(string input)
        {
            using var rng = RandomNumberGenerator.Create();
            var salt = new byte[SaltSize];
            rng.GetBytes(salt);

            var key = Rfc2898DeriveBytes.Pbkdf2(
                Encoding.UTF8.GetBytes(input),
                salt,
                Iterations,
                HashAlgorithmName.SHA256,
                KeySize
            );

            var base64Salt = Convert.ToBase64String(salt);
            var base64Key = Convert.ToBase64String(key);

            return $"{Iterations}.{base64Salt}.{base64Key}";
        }

        public bool Verify(string input, string hashedValue)
        {
            var parts = hashedValue.Split('.');
            if (parts.Length != 3)
                return false;

            var iterations = int.Parse(parts[0]);
            var salt = Convert.FromBase64String(parts[1]);
            var key = Convert.FromBase64String(parts[2]);

            var inputKey = Rfc2898DeriveBytes.Pbkdf2(
                Encoding.UTF8.GetBytes(input),
                salt,
                iterations,
                HashAlgorithmName.SHA256,
                key.Length
            );

            return CryptographicOperations.FixedTimeEquals(inputKey, key);
        }
    }
}
