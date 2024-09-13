using System.Text.Json;
using delivery_service_api.Constants;
using delivery_service_api.Contracts.Mails;
using MailKit.Net.Smtp;
using MimeKit;
using Mjml.Net;

namespace delivery_service_api.Services;

public class MailService : IMailService
{
    private readonly ILogger<MailService> _logger;

    public MailService(ILogger<MailService> logger)
    {
        _logger = logger;
    }

    public async Task SendTrackPackageMailAsync(TrackPackageMail trackPackageMail)
    {
        _logger.LogInformation("Attempting to send track package mail for the following payload: {trackPackageMail}.", JsonSerializer.Serialize(trackPackageMail));

        if (!File.Exists(MailConstants.TrackEmailTemplatePath))
        {
            _logger.LogError("Missing track email template - could not send email. Path: {trackEmailTemplatePath}.", MailConstants.TrackEmailTemplatePath);
            return;
        }

        var mjmlTemplate = await File.ReadAllTextAsync(MailConstants.TrackEmailTemplatePath);

        string trackUiBaseUrl = Environment.GetEnvironmentVariable(EnvironmentConstants.TrackUiBaseUrl);

        var populatedMjmlTemplate = mjmlTemplate
            .Replace("{{ companyName }}", trackPackageMail.CompanyName)
            .Replace("{{ trackUrl }}", $"{trackUiBaseUrl}/track?trackNumber={trackPackageMail.TrackNumber}&secretKey={trackPackageMail.TrackSecretKey}")
            .Replace("{{ trackUiBaseUrl }}", trackUiBaseUrl)
            .Replace("{{ packageTitle }}", trackPackageMail.PackageTitle)
            .Replace("{{ trackNumber }}", trackPackageMail.TrackNumber)
            .Replace("{{ trackSecretKey }}", trackPackageMail.TrackSecretKey);

        var renderResult = new MjmlRenderer().Render(populatedMjmlTemplate);

        if (renderResult.Errors.Count > 0)
        {
            _logger.LogError("Errors while trying to render mjml template: {mjmlRenderErrors}.", string.Join(", ", renderResult.Errors.Select(e => $"Error: {e.Error}, Position: {e.Position.LineNumber}, {e.Position.LinePosition}\n")));
            return;
        }

        var mimeMessage = new MimeMessage();
        mimeMessage.From.Add(new MailboxAddress("DP Demo", "no-reply@dp-demo.io"));
        mimeMessage.To.Add(new MailboxAddress(trackPackageMail.TrackNumber, $"{trackPackageMail.TrackNumber}@dp-demo.io"));
        mimeMessage.Subject = $"Your {trackPackageMail.PackageTitle} is on its way!";

        var bodyBuilder = new BodyBuilder();
        bodyBuilder.HtmlBody = renderResult.Html;

        mimeMessage.Body = bodyBuilder.ToMessageBody();

        var smtpClient = new SmtpClient();
        await smtpClient.ConnectAsync(
            Environment.GetEnvironmentVariable(EnvironmentConstants.SmtpHost),
            int.Parse(Environment.GetEnvironmentVariable(EnvironmentConstants.SmtpPort)),
            false
        );

        await smtpClient.SendAsync(mimeMessage);

        await smtpClient.DisconnectAsync(true);
        smtpClient.Dispose();
    }
}
