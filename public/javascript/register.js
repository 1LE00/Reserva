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

const registerForm = document.querySelector("#register-form");

registerForm.addEventListener("submit", (event) => {
  let fullName = document.querySelector("#fullname");
  const registerEmail = document.querySelector("#register-email");
  const registerPassword = document.querySelector("#register-password");
  const contactNumber = document.querySelector("#register-contact");
  const fullNameError = document.querySelector(".name-error");
  const registerEmailError = document.querySelector(".register-email-error");
  const registerPasswordError = document.querySelector(
    ".register-password-error"
  );
  const contactNumberError = document.querySelector(".contact-error");

  isNameValid(event, fullName, fullNameError);
  isEmailValid(event, registerEmail, registerEmailError);
  isPasswordValid(event, registerPassword, registerPasswordError);
  isContactValid(event, contactNumber, contactNumberError);
  if (
    isNameValid(event, fullName, fullNameError) &&
    isEmailValid(event, registerEmail, registerEmailError) &&
    isPasswordValid(event, registerPassword, registerPasswordError) &&
    isContactValid(event, contactNumber, contactNumberError)
  ) {
    console.log("Correctly Entered Name, Email, Password, Contact");
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

function capitalizeWords(str) {
  return str
    .toLowerCase()
    .split(" ")
    .map((word) => word.charAt(0).toUpperCase() + word.slice(1))
    .join(" ");
}

function isNameValid(event, fullName, fullNameError) {
  const letters = /^[A-Za-z]+(\s?[A-Za-z])*$/;
  const whiteSpace = /^[\s]+[A-Za-z]*(\s?[A-Za-z])*\s*$/;
  const whiteSpaceAtEnd = /^[A-Za-z]+(\s?[A-Za-z])*\s+$/;
  fullName.value = capitalizeWords(fullName.value);

  if (fullName.value === "") {
    defaultInvalidAction(event, fullNameError, fullName);
    fullNameError.lastElementChild.innerHTML =
      "Please fill in your name.";
    return false;
  } else if (fullName.value.length > 50) {
    defaultInvalidAction(event, fullNameError, fullName);
    fullNameError.lastElementChild.innerHTML =
      "Name cannot be longer than 50 characters";
    return false;
  } else if (fullName.value.match(whiteSpace)) {
    defaultInvalidAction(event, fullNameError, fullName);
    fullNameError.lastElementChild.innerHTML =
      "Name should not contain a whitespace at the beginning or at the end.";
    return false;
  } else if (fullName.value.match(whiteSpaceAtEnd)) {
    defaultInvalidAction(event, fullNameError, fullName);
    fullNameError.lastElementChild.innerHTML =
      "Name should not contain a whitespace at the end.";
    return false;
  } else if (!fullName.value.match(letters)) {
    defaultInvalidAction(event, fullNameError, fullName);
    fullNameError.lastElementChild.innerHTML =
      "Name should only contain alphabets.";
    return false;
  } else {
    return true;
  }
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

function isPasswordValid(event, registerPassword, registerPasswordError) {
  if (
    !(registerPassword.value.length >= 6 && registerPassword.value.length <= 20)
  ) {
    defaultInvalidAction(event, registerPasswordError, registerPassword);
    registerPasswordError.lastElementChild.innerHTML =
      "Please create a password of length between 6-20 characters.";
    return false;
  } else {
    return true;
  }
}

function isContactValid(event, contactNumber, contactNumberError) {
  if (contactNumber.value == "") {
    defaultInvalidAction(event, contactNumberError, contactNumber);
    contactNumberError.lastElementChild.innerHTML =
      "Please enter your contact number.";
    return false;
  } else if (contactNumber.value.length != 10) {
    defaultInvalidAction(event, contactNumberError, contactNumber);
    contactNumberError.lastElementChild.innerHTML =
      "Please enter your 10 digit contact number.";
    return false;
  } else {
    return true;
  }
}

/* Form Validation */
