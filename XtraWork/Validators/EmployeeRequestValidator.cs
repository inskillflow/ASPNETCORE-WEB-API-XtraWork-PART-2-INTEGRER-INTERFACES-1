using FluentValidation;
using XtraWork.Requests;

namespace XtraWork.Validators;

public class EmployeeRequestValidator : AbstractValidator<EmployeeRequest>
{
    public EmployeeRequestValidator()
    {
        RuleFor(e => e.FirstName)
            .NotEmpty().MinimumLength(2).MaximumLength(50)
            .Matches("^[a-zA-ZÀ-ÿ\\s\\-]+$")
            .WithMessage("Le prénom ne peut contenir que des lettres, espaces et tirets");

        RuleFor(e => e.LastName)
            .NotEmpty().MinimumLength(2).MaximumLength(50)
            .Matches("^[a-zA-ZÀ-ÿ\\s\\-]+$")
            .WithMessage("Le nom ne peut contenir que des lettres, espaces et tirets");

        RuleFor(e => e.BirthDate)
            .NotEmpty().Must(BeValidAge).WithMessage("L'employé doit avoir entre 16 et 70 ans");

        RuleFor(e => e.Gender)
            .NotEmpty().Must(BeValidGender)
            .WithMessage("Le genre doit être 'M', 'F' ou 'Autre'");

        RuleFor(e => e.TitleId)
            .NotEmpty().WithMessage("Le titre est obligatoire");
    }

    private bool BeValidAge(DateTime birthDate)
    {
        var age = DateTime.Today.Year - birthDate.Year;
        if (birthDate.Date > DateTime.Today.AddYears(-age)) age--;
        return age >= 16 && age <= 70;
    }

    private bool BeValidGender(string gender)
    {
        var valid = new[] { "M", "F", "Autre", "Masculin", "Féminin" };
        return valid.Contains(gender, StringComparer.OrdinalIgnoreCase);
    }
}
