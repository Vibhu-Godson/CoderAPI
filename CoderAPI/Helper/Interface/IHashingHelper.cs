namespace CoderAPI.Helper.Interface
{
    public interface IHashingHelper
    {
        string Hash(string value);
        bool Verify(string value, string hashedValue);
    }
}
