const navtogglers = document.querySelectorAll("[data-nav-toggle]");
const nav = document.querySelector("[data-nav-container]");
const navbar = document.querySelector("[data-primary-navbar]");
const body = document.getElementsByTagName("body")[0];
const topHeader = document.querySelector("[data-top-header]");

navtogglers.forEach((element) => {
  element.addEventListener("click", (e) => {
    navbar.classList.toggle("invisible");
    navbar.classList.toggle("navbar-show");
    body.classList.toggle("nav-active");
    nav.classList.toggle("invisible");
    topHeader.classList.toggle("seven");
  });
});

const addBg = () => {
  if (window.scrollY > 52) {
    topHeader.classList.add("bg");
  } else {
    topHeader.classList.remove("bg");
  }
};

const hideHeader = () => {
  if (scrollPosition <= window.scrollY) {
    topHeader.classList.add("hide");
  } else {
    topHeader.classList.remove("hide");
  }
};

let scrollPosition = 570;
window.addEventListener("scroll", () => {
  addBg();
  hideHeader();
  scrollPosition = window.scrollY;
});

const mediaQuery = window.matchMedia("(max-width: 1023px)");
if (mediaQuery.matches) {
  window.onclick = (e) => {
    const navbarLinks = document.querySelectorAll(".navbar-links");
    navbarLinks.forEach((navbarLink) => {
      if (e.target === navbarLink) {
        navbar.classList.toggle("invisible");
        navbar.classList.toggle("navbar-show");
        body.classList.toggle("nav-active");
        nav.classList.toggle("invisible");
      }
    });
    if (e.target === nav) {
      navbar.classList.toggle("invisible");
      navbar.classList.toggle("navbar-show");
      body.classList.toggle("nav-active");
      nav.classList.toggle("invisible");
    }
  };
}

function showUserDropDown() {
  const userDropdown = document.getElementById("user-dropdown");
  const dropdownIcon = document.getElementById("dropdown-icon");
  const userLinks = document.querySelectorAll(".user-links");
  body.classList.toggle("nav-active");
  userDropdown.classList.toggle("show");
  dropdownIcon.classList.toggle("rotate");
  userLinks.forEach((userLink)=>{
    userLink.classList.toggle("color-black");
  });
}
