using FluentValidation;
using XtraWork.Requests;

namespace XtraWork.Validators;

public class TitleRequestValidator : AbstractValidator<TitleRequest>
{
    public TitleRequestValidator()
    {
        RuleFor(t => t.Description)
            .NotEmpty().WithMessage("La description du titre est obligatoire")
            .MinimumLength(2).WithMessage("La description doit contenir au moins 2 caractères")
            .MaximumLength(100).WithMessage("La description ne peut pas dépasser 100 caractères")
            .Matches("^[a-zA-ZÀ-ÿ0-9\\s\\-]+$")
            .WithMessage("La description ne peut contenir que des lettres, chiffres, espaces et tirets");
    }
}
