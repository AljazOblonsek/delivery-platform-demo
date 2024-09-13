using delivery_service_api.Enums;
using FluentValidation;

namespace delivery_service_api.Contracts.Requests;

public class ScanPackageRequest
{
    public int Id { get; set; }
    public string Title { get; set; }

    public PackageAction Action { get; set; }

    public class Validator : AbstractValidator<ScanPackageRequest>
    {
        public Validator()
        {
            RuleFor(e => e.Id).NotEmpty().GreaterThan(0);
            RuleFor(e => e.Title).NotEmpty().MinimumLength(3);
            RuleFor(e => e.Action).IsInEnum();
        }
    }
}
