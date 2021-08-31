import { openPopup, PopupsEnum } from "./popup";

//login block
const loginSubmit = document.querySelector("#loginSubmit");

// registration block
const registrationFrom = document.querySelector("#register-popup form");
const registrationInputs = document.querySelectorAll("#register-popup form input");
const registrationSubmit = document.querySelector("#registration_submit");
const registrationEmailField = document.querySelector("#registrationEmailField");
const registrationEmailFeedBackArea = document.querySelector(".registrationEmailFeedBackArea");
const passwordInputOne = document.querySelector("#passwordInputOne");
const passwordInputTwo = document.querySelector("#passwordInputTwo");
const passwordInputOneVal = document.querySelector("#passwordInputOne").value;
const passwordInputTwoVal = document.querySelector("#passwordInputTwo").value;
const registrationPasswordFeedBackArea = document.querySelector(".registrationPasswordFeedBackArea");
const registrationPasswordFeedBackAreaOne = document.querySelector(".registrationPasswordFeedBackAreaOne");
const formValidationFeedBack = document.querySelector(".formValidationFeedBack");
const showPasswordToggleOne = document.querySelector(".showPasswordToggleOne");
const showPasswordToggleTwo = document.querySelector(".showPasswordToggleTwo");

const handleToggleInputOne = (e) => {
    if (showPasswordToggleOne.className === "showPasswordToggleOne password-control view") {
        passwordInputOne.setAttribute("type", "password");
    } else {
        passwordInputOne.setAttribute("type", "text");
    }
};

const handleToggleInputTwo = (e) => {
    if (showPasswordToggleTwo.className === "showPasswordToggleTwo password-control view") {
        passwordInputTwo.setAttribute("type", "password");
    } else {
        passwordInputTwo.setAttribute("type", "text");
    }
};

showPasswordToggleOne.addEventListener("click", handleToggleInputOne);
showPasswordToggleTwo.addEventListener("click", handleToggleInputTwo);

let validEmail = function () {
    let form = document.querySelector("#registrationForm");
    let registrationEmailField = document.querySelector("#registrationEmailField");
    let registrationEmailFeedBackArea = document.querySelector(".registrationEmailFeedBackArea");
    let emailVal = form.elements.registrationEmailField.value;

    if (emailVal.length >= 0) {
        axios
            .post("/validate-email/", { email: emailVal })
            .then((res) => {
                console.log(res);
                if (res.status === 200) {
                    registrationEmailField.classList.remove("is-invalid");
                    registrationEmailFeedBackArea.style.display = "none";
                }
            })
            .catch((err) => {
                console.log(err.response);
                if (err.response.data.email_error) {
                    registrationEmailField.classList.add("is-invalid");
                    registrationEmailFeedBackArea.style.display = "block";
                    registrationEmailFeedBackArea.innerHTML = `<p>${data.email_error}</p>`;
                }
            });
    }
};

let validPassword = function () {
    let form = document.querySelector("#registrationForm");
    let passwordInputOne = document.querySelector("#passwordInputOne");
    let passwordInputTwo = document.querySelector("#passwordInputTwo");
    let passwordOneVal = form.elements.passwordInputOne.value;
    let passwordTwoVal = form.elements.passwordInputTwo.value;
    let registrationPasswordFeedBackArea = document.querySelector(".registrationPasswordFeedBackArea");
    let registrationPasswordsFeedBackArea = document.querySelector(".registrationPasswordsFeedBackArea");

    if (passwordOneVal == "" || passwordTwoVal == "") {
        passwordInputOne.classList.add("is-invalid");
        passwordInputTwo.classList.add("is-invalid");
        registrationPasswordsFeedBackArea.style.display = "block";
        registrationPasswordsFeedBackArea.innerHTML = `<p>Заполните поле пароль и подтверждение пароля</p>`;
    } else if (0 > passwordOneVal.length < 6 || 0 > passwordTwoVal.length < 6) {
        passwordInputOne.classList.add("is-invalid");
        passwordInputTwo.classList.add("is-invalid");
        registrationPasswordsFeedBackArea.style.display = "none";
        registrationPasswordFeedBackArea.style.display = "block";
        registrationPasswordFeedBackArea.innerHTML = `<p>Пароль должен быть не менее 6 символов</p>`;
        if (passwordOneVal != passwordTwoVal) {
            passwordInputOne.classList.add("is-invalid");
            passwordInputTwo.classList.add("is-invalid");
            registrationPasswordFeedBackArea.innerHTML = `<p>Пароли не совпадают</p>`;
        } else if (passwordOneVal === passwordTwoVal && passwordOneVal.length >= 6) {
            passwordInputOne.classList.remove("is-invalid");
            passwordInputTwo.classList.remove("is-invalid");
            registrationPasswordFeedBackArea.style.display = "none";
            return true;
        } else {
            registrationPasswordFeedBackArea.innerHTML = `<p>Пароль должен быть не менее 6 символов</p>`;
        }
    }
};

let validCheck = function () {
    let form = document.querySelector("#registrationForm");
    let checkAgree = document.querySelector("#is_agree");
    let check18Over = document.querySelector("#is_18over");
    let formValidationFeedBack = document.querySelector(".formValidationFeedBack");
    if (!checkAgree.checked || !check18Over.checked) {
        formValidationFeedBack.style.display = "block";
        formValidationFeedBack.innerHTML = `<p>Подтвердите свое согласие и что Вам больше 18 лет</p>`;
    } else {
        formValidationFeedBack.style.display = "none";
        return true;
    }
};

registrationSubmit.onclick = (e) => {
    let form = document.querySelector("#registrationForm");
    let emailVal = form.elements.registrationEmailField.value;
    let passwordOneVal = form.elements.passwordInputOne.value;
    let passwordTwoVal = form.elements.passwordInputTwo.value;
    let checkAgree = document.querySelector("#is_agree");
    let check18Over = document.querySelector("#is_18over");

    e.preventDefault();
    validEmail();
    validPassword();
    validCheck();

    if (validCheck() && validPassword()) {
        axios
            .post("/register/", {
                email: emailVal,
                password1: passwordOneVal,
                password2: passwordTwoVal,
                is_agree: checkAgree.checked,
                is_over18: check18Over.checked,
            })
            .then((res) => {
                if (res.status === 200) {
                    openPopup(PopupsEnum.successedRegistrationPopup);
                } else console.log(res);
            })
            .catch((err) => console.log(err.response));
    }
};

//login block
loginSubmit.onclick = (e) => {
    e.preventDefault();
    let loginForm = document.querySelector("#loginForm");
    let loginEmail = document.querySelector("#loginEmailField");
    let loginEmailVal = loginForm.elements.loginEmailField.value;
    let loginPassword = document.querySelector("#loginPassword");
    let loginPasswordVal = loginForm.elements.loginPassword.value;
    let loginRememberMe = document.querySelector("#loginRememberMe");
    let loginRememberMeVal = loginForm.elements.loginRememberMe.value;
    let loginEmailFeedBackArea = document.querySelector(".loginEmailFeedBackArea");
    let loginPasswordFeedBackArea = document.querySelector(".loginPasswordFeedBackArea");
    if ((loginEmailVal.length = 0)) {
        loginEmail.classList.add("is-invalid");
        loginPassword.classList.add("is-invalid");
        loginEmailFeedBackArea.style.display = "block";
        loginPasswordFeedBackArea.style.display = "block";
        loginEmailFeedBackArea.innerHTML = `<p>Введите Ваш E-mail адрес</p>`;
        loginPasswordFeedBackArea.innerHTML = `<p>Введите Ваш пароль</p>`;
    } else {
        loginEmail.classList.remove("is-invalid");
        loginPassword.classList.remove("is-invalid");
        loginEmailFeedBackArea.style.display = "none";
        loginPasswordFeedBackArea.style.display = "none";
    }
    if (loginEmailVal.length > 0) {
        axios
            .post("/login/", {
                email: loginEmailVal,
                password: loginPasswordVal,
                remember: loginRememberMe.checked,
            })
            .then((res) => {
                if (res.status === 200) {
                    loginEmail.classList.remove("is-invalid");
                    loginPassword.classList.remove("is-invalid");
                    loginEmailFeedBackArea.style.display = "none";
                    loginPasswordFeedBackArea.style.display = "none";
                    window.location.reload();
                } else console.log(res);
            })
            .catch((err) => {
                if (err.response.data.email_error) {
                    loginEmail.classList.add("is-invalid");
                    loginEmailFeedBackArea.style.display = "block";
                    loginEmailFeedBackArea.innerHTML = `<p>${err.response.data.email_error}</p>`;
                }

                if (err.response.data.password_error) {
                    loginPassword.classList.add("is-invalid");
                    loginPasswordFeedBackArea.style.display = "block";
                    loginPasswordFeedBackArea.innerHTML = `<p>${err.response.data.password_error}</p>`;
                }

                console.log(err.response);
            });
    }
};

// //Отключаем кнопку верификации телефона
if (document.getElementById("phoneVerify")) document.getElementById("phoneVerify").disabled = true;
