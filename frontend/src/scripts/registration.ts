import { registerAPI } from "./api/authApi";
import { openPopup, PopupsEnum } from "./popup";
import InputValidator from "./validators/InputValidator";

const registrationSubmit: HTMLInputElement = document.getElementById("registration_submit") as HTMLInputElement;

registrationSubmit.addEventListener("click", (event: MouseEvent) => {
    event.preventDefault();

    const emailInput: HTMLInputElement = document.getElementById("registrationEmail") as HTMLInputElement;
    const passwordInput: HTMLInputElement = document.getElementById("registrationPassword") as HTMLInputElement;
    const rePasswordInput: HTMLInputElement = document.getElementById("registrationRePassword") as HTMLInputElement;
    const agreeCheckbox: HTMLInputElement = document.getElementById("registrationAgreeCheckbox") as HTMLInputElement;
    const ageCheckbox: HTMLInputElement = document.getElementById("registrationAgeCheckbox") as HTMLInputElement;

    const errorsBlock: HTMLDivElement = document.getElementById("registreation__errors-block") as HTMLDivElement;

    emailInput.classList.remove("is-invalid");
    passwordInput.classList.remove("is-invalid");
    rePasswordInput.classList.remove("is-invalid");

    const emailErrors = new InputValidator(emailInput, "Email").isNotEmpty().isEmail().getErrors();
    const passwordErrors = new InputValidator(passwordInput, "Пароль").isNotEmpty().minLength(6).getErrors();
    const rePasswordErrors = new InputValidator(rePasswordInput, "Пароль")
        .isEqual(passwordInput, "Пароли не совпадают!")
        .getErrors();
    const agreeErrors = new InputValidator(agreeCheckbox)
        .isChecked("Пользовательское соглашение не принято!")
        .getErrors();
    const ageErrors = new InputValidator(ageCheckbox).isChecked("Вам должно быть больше 18 лет!").getErrors();

    if (emailErrors.length > 0) emailInput.classList.add("is-invalid");
    if (passwordErrors.length > 0) passwordInput.classList.add("is-invalid");
    if (rePasswordErrors.length > 0) rePasswordInput.classList.add("is-invalid");

    const resultErrors = emailErrors.concat(passwordErrors, rePasswordErrors, agreeErrors, ageErrors);

    if (resultErrors.length > 0) {
        errorsBlock.innerHTML = resultErrors.map((error) => `<p>- ${error}</p>`).join("\n");
        errorsBlock.classList.remove("hidden");
        return;
    }

    errorsBlock.innerHTML = "";
    errorsBlock.classList.add("hidden");

    registerAPI({
        email: emailInput.value.trim(),
        password: passwordInput.value.trim(),
        rePassword: rePasswordInput.value.trim(),
        isAgree: agreeCheckbox.checked,
        isOver18: ageCheckbox.checked,
    }).then((res) => {
        if (res.status === 200) {
            openPopup(PopupsEnum.successedRegistrationPopup);
        } else console.log(res);
    });
});
