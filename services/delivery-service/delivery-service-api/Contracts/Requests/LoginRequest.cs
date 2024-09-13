using FluentValidation;

namespace delivery_service_api.Contracts.Requests;

public class LoginRequest
{
    public string Email { get; set; }
    public string Password { get; set; }

    public class Validator : AbstractValidator<LoginRequest>
    {
        public Validator()
        {
            RuleFor(e => e.Email).NotEmpty().EmailAddress();
            RuleFor(e => e.Password).NotEmpty().MinimumLength(8);
        }
    }
}
