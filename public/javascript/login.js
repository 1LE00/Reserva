const eyes = document.querySelectorAll(".eye-holder");
const passwordField = document.querySelectorAll("[data-password]");

passwordField.forEach((field) => {
  if (field.value.length > 0) {
    eyes.forEach((eye) => {
      eye.style.display = "initial";
    });
  }
  field.addEventListener("input", (event) => {
    const password = event.target;
    const eye = password.nextElementSibling;
    eye.style.display = "initial";
    if (password.value.length == 0) {
      if (eye.classList.contains("unslash")) {
        eye.classList.remove("unslash");
      }
      eye.style.display = "none";
      password.setAttribute("type", "password");
    }
  });
});

eyes.forEach((eye) => {
  eye.addEventListener("click", (event) => {
    const currentEye = event.target;
    const password = currentEye.previousElementSibling;
    const end = password.value.length;
    eye.classList.toggle("unslash");
    password.setAttribute("type", "text");
    setTimeout(() => {
      password.focus();
      password.setSelectionRange(end, end);
    }, 0);
    if (eye.classList.length == 1) {
      password.setAttribute("type", "password");
    }
  });
});

/* Form Validation */

const loginForm = document.querySelector("#login-form");

loginForm.addEventListener("submit", (event) => {
  const loginEmail = document.querySelector("#login-email");
  const loginPassword = document.querySelector("#login-password");
  const loginEmailError = document.querySelector(".login-email-error");
  const loginPasswordError = document.querySelector(".login-password-error");
  isEmailValid(event, loginEmail, loginEmailError);
  isLoginPasswordEmpty(event, loginPassword, loginPasswordError);

  if (
    isEmailValid(event, loginEmail, loginEmailError) &&
    isLoginPasswordEmpty(event, loginPassword, loginPasswordError)
  ) {
    console.log("Correctly Entered Email and Password");
  }
});

function defaultInvalidAction(event, error, field) {
  event.preventDefault();
  field.parentElement.style.borderBottomColor = "hsl(var(--clr-error))";
  error.style.display = "flex";
  field.focus();
  field.addEventListener("input", () => {
    error.style.display = "none";
    field.parentElement.style.borderBottomColor = "hsl(var(--clr-primary))";
  });
}

function isEmailValid(event, email, emailError) {
  const emailFormat = /^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w{2,3})+$/;

  if (!email.value.match(emailFormat)) {
    defaultInvalidAction(event, emailError, email);
    emailError.lastElementChild.innerHTML =
      "Please enter a valid email address.";
    return false;
  } else {
    return true;
  }
}

function isLoginPasswordEmpty(event, loginPassword, loginPasswordError) {
  if (loginPassword.value === "") {
    defaultInvalidAction(event, loginPasswordError, loginPassword);
    loginPasswordError.lastElementChild.innerHTML =
      "Please enter your password to continue.";
    return false;
  } else {
    return true;
  }
}
/* Form Validation */
