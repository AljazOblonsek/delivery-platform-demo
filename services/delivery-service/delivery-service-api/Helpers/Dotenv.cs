using delivery_service_api.Constants;

namespace delivery_service_api.Helpers;

public static class Dotenv
{
    public static void Load(string filePath)
    {
        Console.WriteLine($"Start environment load from environment file. Path: `{filePath}`.");

        if (!File.Exists(filePath))
        {
            Console.WriteLine($"Environment file for path `{filePath}` not found. Exiting environment from file setup.");
            return;
        }

        var setEnvironmentVariables = new List<string>();

        foreach (var line in File.ReadAllLines(filePath))
        {
            var parts = line.Split('=', StringSplitOptions.RemoveEmptyEntries);

            if (parts.Length != 2)
            {
                continue;
            }

            if (Environment.GetEnvironmentVariable(parts[0]) != null)
            {
                // Skip setting it if it already exists in environment
                setEnvironmentVariables.Add(parts[0]);
                continue;
            }

            Environment.SetEnvironmentVariable(parts[0], parts[1]);

            setEnvironmentVariables.Add(parts[0]);
        }

        var missingEnvironmentVariables = EnvironmentConstants.REQUIRED_ENVIRONMENT_VARIABLES.Except(setEnvironmentVariables).ToList();

        if (missingEnvironmentVariables.Count > 0)
        {
            throw new Exception($"Missing the following environment variables: {string.Join(", ", missingEnvironmentVariables.Select(e => e))}.");
        }

        Console.WriteLine($"Successfuly loaded variables from `{filePath}` into environment.");
    }
}
