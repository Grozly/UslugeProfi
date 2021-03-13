//login block
const loginSubmit = document.querySelector("#loginSubmit")


// registration block
const registrationFrom = document.querySelector("#myModal1 form")
const registrationInputs = document.querySelectorAll("#myModal1 form input")
const registrationSubmit = document.querySelector('#registration_submit');
const registrationEmailField = document.querySelector('#registrationEmailField');
const registrationEmailFeedBackArea = document.querySelector('.registrationEmailFeedBackArea');
const passwordInputOne = document.querySelector('#passwordInputOne');
const passwordInputTwo = document.querySelector('#passwordInputTwo');
const passwordInputOneVal = document.querySelector('#passwordInputOne').value;
const passwordInputTwoVal = document.querySelector('#passwordInputTwo').value;
const registrationPasswordFeedBackArea = document.querySelector('.registrationPasswordFeedBackArea');
const registrationPasswordFeedBackAreaOne = document.querySelector('.registrationPasswordFeedBackAreaOne');
const formValidationFeedBack = document.querySelector('.formValidationFeedBack');
const showPasswordToggleOne = document.querySelector('.showPasswordToggleOne');
const showPasswordToggleTwo = document.querySelector('.showPasswordToggleTwo');


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


let validEmail = function() {
    let form = document.querySelector("#registrationForm");
    let registrationEmailField = document.querySelector("#registrationEmailField");
    let registrationEmailFeedBackArea = document.querySelector(".registrationEmailFeedBackArea");
    let emailVal = form.elements.registrationEmailField.value;

    if (emailVal.length >= 0) {

        fetch("validate-email/", {
            body: JSON.stringify({ email: emailVal }),
            method: "POST",
        })

        .then((res) => res.json())
        .then((data) => {
            if (data.email_error) {
                registrationEmailField.classList.add("is-invalid");
                registrationEmailFeedBackArea.style.display = "block";
                registrationEmailFeedBackArea.innerHTML = `<p>${data.email_error}</p>`;
            } else {
                registrationEmailField.classList.remove("is-invalid");
                registrationEmailFeedBackArea.style.display = "none";

            }
            if (data.email_valid) {
                return true;
            }
        });

    }
};

let validPassword = function() {
    let form = document.querySelector("#registrationForm");
    let passwordInputOne = document.querySelector('#passwordInputOne');
    let passwordInputTwo = document.querySelector('#passwordInputTwo');
    let passwordOneVal = form.elements.passwordInputOne.value;
    let passwordTwoVal = form.elements.passwordInputTwo.value;
    let registrationPasswordFeedBackArea = document.querySelector('.registrationPasswordFeedBackArea');
    let registrationPasswordsFeedBackArea = document.querySelector('.registrationPasswordsFeedBackArea')

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

let validCheck = function() {
    let form = document.querySelector("#registrationForm");
    let checkAgree = document.querySelector('#is_agree')
    let check18Over = document.querySelector('#is_18over')
    let formValidationFeedBack = document.querySelector('.formValidationFeedBack');
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
    let checkAgree = document.querySelector('#is_agree')
    let check18Over = document.querySelector('#is_18over')

    e.preventDefault();
    validEmail();
    validPassword();
    validCheck();

    if (validCheck() && validPassword()) {
        fetch("register/", {
           body: JSON.stringify({ email: emailVal,
                                  password1: passwordOneVal,
                                  password2: passwordTwoVal,
                                  is_agree: checkAgree.checked,
                                  is_over18: check18Over.checked,
           }),
           method: "POST",
        })

        .then((res) => res.json())
            .then((data) => {

            });
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

    if (loginEmailVal.length > 0) {
        fetch("login/", {
            body: JSON.stringify({ email: loginEmailVal,
                                   password: loginPasswordVal,
                                   remember: loginRememberMe.checked,
                                   }),
            method: "POST",
        })
        .then((res) => res.json())
        .then((data) => {
            if (data.email_error) {
                loginEmail.classList.add("is-invalid");
                loginPassword.classList.add("is-invalid");
                loginEmailFeedBackArea.style.display = "block";
                loginPasswordFeedBackArea.style.display = "block";

                loginEmailFeedBackArea.innerHTML = `<p>${data.email_error}</p>`;
                loginPasswordFeedBackArea.innerHTML = `<p>${data.password_error}</p>`;
            } else {
                loginEmail.classList.remove("is-invalid");
                loginPassword.classList.remove("is-invalid");
                loginEmailFeedBackArea.style.display = "none";
                loginPasswordFeedBackArea.style.display = "none";
            }
        });
    } else {
        loginEmail.classList.add("is-invalid");
        loginPassword.classList.add("is-invalid");
        loginPasswordFeedBackArea.style.display = "block";
        loginPasswordFeedBackArea.innerHTML = `<p>Заполните все поля!</p>`;
    }

};

//Отключаем кнопку верификации телефона
document.getElementById("phoneVerify").disabled = true;