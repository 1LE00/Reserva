const pageRight = document.querySelector(".page-right");

const pageBg = () => {
  if (pageRight.scrollTop > 0) topHeader.classList.add("bg");
  else topHeader.classList.remove("bg");
};

const pageHeader = () => {
  if (scrollPos <= pageRight.scrollTop) topHeader.classList.add("hide");
  else topHeader.classList.remove("hide");
};

let scrollPos = 0;
pageRight.addEventListener("scroll", () => {
  pageBg();
  pageHeader();
  scrollPos = pageRight.scrollTop;
});

/* 
  * Form Validation 
*/
const contactForm = document.querySelector("#contact-form");
if(contactForm != null){
  contactForm.addEventListener("submit", (event) => {
    let name = document.querySelector("#name");
    const email = document.querySelector("#email");
    const request = document.querySelector("#request");
    const nameError = document.querySelector(".name-error");
    const emailError = document.querySelector(".email-error");
    const requestError = document.querySelector(".request-error");
    const submitButton = document.querySelector("#btn-submit");
    isRequestValid(event, request, requestError);
    isEmailValid(event, email, emailError);
    isNameValid(event, name, nameError);
  
    if (
      (isRequestValid(event, request, requestError),
      isEmailValid(event, email, emailError),
      isNameValid(event, name, nameError))
    ) {
      submitButton.innerHTML= submitButton.dataset.wait;
    }
  });
}else{
  document.querySelector(".form-message-success").scrollIntoView();
}

function defaultInvalidAction(event, error, field) {
  event.preventDefault();
  field.style.borderColor = "hsl(var(--clr-error))";
  error.style.display = "flex";
  field.focus();
  field.addEventListener("input", () => {
    error.style.display = "none";
    field.style.borderColor = "hsl(var(--clr-primary))";
  });
}

function capitalizeWords(str) {
  return str
    .toLowerCase()
    .split(" ")
    .map((word) => word.charAt(0).toUpperCase() + word.slice(1))
    .join(" ");
}

function isNameValid(event, name, nameError) {
  const letters = /^[A-Za-z]+(\s?[A-Za-z])*$/;
  const whiteSpace = /^[\s]+[A-Za-z]*(\s?[A-Za-z])*\s*$/;
  const whiteSpaceAtEnd = /^[A-Za-z]+(\s?[A-Za-z])*\s+$/;
  name.value = capitalizeWords(name.value);

  if (name.value === "") {
    defaultInvalidAction(event, nameError, name);
    nameError.lastElementChild.innerHTML = "Please fill in your name.";
    return false;
  } else if (name.value.length > 50) {
    defaultInvalidAction(event, nameError, name);
    nameError.lastElementChild.innerHTML =
      "Name cannot be longer than 50 characters";
    return false;
  } else if (name.value.match(whiteSpace)) {
    defaultInvalidAction(event, nameError, name);
    nameError.lastElementChild.innerHTML =
      "Name should not contain a whitespace at the beginning or at the end.";
    return false;
  } else if (name.value.match(whiteSpaceAtEnd)) {
    defaultInvalidAction(event, nameError, name);
    nameError.lastElementChild.innerHTML =
      "Name should not contain a whitespace at the end.";
    return false;
  } else if (!name.value.match(letters)) {
    defaultInvalidAction(event, nameError, name);
    nameError.lastElementChild.innerHTML =
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

function isRequestValid(event, request, requestError) {
  if (request.value === "") {
    defaultInvalidAction(event, requestError, request);
    requestError.lastElementChild.innerHTML =
      "Perhaps you meant to fill this field";
    return false;
  } else if (request.value.length > 500) {
    defaultInvalidAction(event, requestError, request);
    requestError.lastElementChild.innerHTML =
      "Your message is too long. Please make it up to 500 characters";
    return false;
  } else {
    return true;
  }
}
/* 
  * Form Validation 
*/