using System.Security.Cryptography;
using System.Text;

namespace delivery_service_api.Helpers;

public static class AesEncryptionHelper
{
    public static string Encrypt(string plainText, string secret)
    {
        using (var rng = new RNGCryptoServiceProvider())
        {
            byte[] salt = new byte[8];
            rng.GetBytes(salt);

            byte[] password = Combine(Encoding.UTF8.GetBytes(secret), salt);

            byte[][] hash = new byte[3][];
            byte[] digest = password;

            using (var md5 = MD5.Create())
            {
                for (int i = 0; i < 3; i++)
                {
                    hash[i] = md5.ComputeHash(digest);
                    digest = Combine(hash[i], password);
                }
            }

            byte[] keyDerivation = Combine(hash[0], hash[1], hash[2]);
            byte[] key = new byte[32];
            byte[] iv = new byte[16];

            Array.Copy(keyDerivation, 0, key, 0, 32);
            Array.Copy(keyDerivation, 32, iv, 0, 16);

            using (var aes = Aes.Create())
            {
                aes.Key = key;
                aes.IV = iv;
                aes.Mode = CipherMode.CBC;
                aes.Padding = PaddingMode.PKCS7;

                using (var ms = new MemoryStream())
                {
                    using (var cs = new CryptoStream(ms, aes.CreateEncryptor(), CryptoStreamMode.Write))
                    {
                        using (var sw = new StreamWriter(cs))
                        {
                            sw.Write(plainText);
                        }
                    }

                    byte[] cipherTextBytes = ms.ToArray();
                    byte[] result = new byte[salt.Length + cipherTextBytes.Length + 8];
                    Array.Copy(Encoding.UTF8.GetBytes("Salted__"), result, 8);
                    Array.Copy(salt, 0, result, 8, salt.Length);
                    Array.Copy(cipherTextBytes, 0, result, salt.Length + 8, cipherTextBytes.Length);

                    return Convert.ToBase64String(result);
                }
            }
        }
    }

    private static byte[] Combine(params byte[][] arrays)
    {
        byte[] result = new byte[arrays.Sum(a => a.Length)];
        int offset = 0;

        foreach (byte[] array in arrays)
        {
            Buffer.BlockCopy(array, 0, result, offset, array.Length);
            offset += array.Length;
        }

        return result;
    }
}
