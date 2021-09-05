import { loginAPI } from "./api/authApi";
import InputValidator from "./validators/InputValidator";

const loginSubmit: HTMLInputElement = document.getElementById("loginSubmit") as HTMLInputElement;

loginSubmit.addEventListener("click", (event: MouseEvent) => {
    event.preventDefault();

    const emailInput: HTMLInputElement = document.getElementById("loginEmail") as HTMLInputElement;
    const passwordInput: HTMLInputElement = document.getElementById("loginPassword") as HTMLInputElement;
    const rememberMeInput: HTMLInputElement = document.getElementById("loginRememberMe") as HTMLInputElement;

    const errorsBlock: HTMLDivElement = document.getElementById("login__errors-block") as HTMLDivElement;

    emailInput.classList.remove("is-invalid");
    passwordInput.classList.remove("is-invalid");

    const emailErrors = new InputValidator(emailInput, "Email").isNotEmpty().getErrors();
    const passwordErrors = new InputValidator(passwordInput, "Пароль").isNotEmpty().getErrors();

    if (emailErrors.length > 0) emailInput.classList.add("is-invalid");
    if (passwordErrors.length > 0) passwordInput.classList.add("is-invalid");

    const resultErrors = emailErrors.concat(passwordErrors);

    if (resultErrors.length > 0) {
        errorsBlock.innerHTML = resultErrors.map((error) => `<p>- ${error}</p>`).join("\n");
        errorsBlock.classList.remove("hidden");
        return;
    }

    errorsBlock.innerHTML = "";
    errorsBlock.classList.add("hidden");

    loginAPI({
        email: emailInput.value.trim(),
        password: passwordInput.value.trim(),
        rememberMe: rememberMeInput.checked,
    }).then((res) => {
        if (res.status === 200) {
            location.reload();
            return;
        }

        console.log(res);

        if (res.data.email_error || res.data.password_error) {
            emailInput.classList.add("is-invalid");
            passwordInput.classList.add("is-invalid");

            errorsBlock.innerHTML = `<p>- Пользователя с таким email и паролем не существует</p>`;
            errorsBlock.classList.remove("hidden");
            return;
        }

        errorsBlock.innerHTML = `<p>- Неизвестная ошибка, попробуйте позже</p>`;
        errorsBlock.classList.remove("hidden");
        return;
    });
});
