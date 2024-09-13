using System.Security.Cryptography;
using System.Text;

namespace delivery_service_api.Helpers;

public static class PassphraseHelper
{
    private static readonly List<string> WordList = new List<string>
    {
        "apple", "banana", "cherry", "date", "elderberry", "fig", "grape", "honeydew",
        "kiwi", "lemon", "mango", "nectarine", "orange", "papaya", "quince", "raspberry",
        "strawberry", "tangerine", "ugli", "vanilla", "watermelon", "yam", "zucchini"
    };

    public static string GeneratePassphrase(int wordCount = 3)
    {
        var passphrase = new StringBuilder();
        using (var rng = new RNGCryptoServiceProvider())
        {
            var byteBuffer = new byte[4];
            for (int i = 0; i < wordCount; i++)
            {
                rng.GetBytes(byteBuffer);
                int randomIndex = BitConverter.ToInt32(byteBuffer, 0) % WordList.Count;
                randomIndex = Math.Abs(randomIndex);
                passphrase.Append(WordList[randomIndex]);
                if (i < wordCount - 1)
                {
                    passphrase.Append("-");
                }
            }
        }
        return passphrase.ToString();
    }
}
