/* back to top */

const btnTop = document.querySelector(".btn-top");
btnTop.addEventListener("click", () => {
  document.querySelector("html").classList.add("smooth");
});


const backToTop = () => {
  if (window.scrollY >= 300) btnTop.classList.remove("invisible");
  else btnTop.classList.add("invisible");
};

window.addEventListener("scroll", () => {
  backToTop();
});

/*
    TODO -> MAKE CHANGES ON DESKTOP IF IT OVERFLOWS
function replaceVerticalScrollByHorizontal(event) {
    event.preventDefault();
    if (event.wheelDelta < 0) {
        q.scrollLeft += 50;
    } else {
        q.scrollLeft -= 50;
    }
}
const mediaQuery = window.matchMedia("(min-width: 500px)");

const q = document.querySelector(".french-cuisine-type");
if (mediaQuery.matches) {
  q.addEventListener("wheel", replaceVerticalScrollByHorizontal);
} */

//  *Change Menu Navigator Color On Click //

// * Main Cusinie Links * //
const cuisineToggler = document.querySelectorAll(".cuisine-link");
// * Cuisine Submenu Containers* //
const cuisineItemTypeContainer = document.querySelectorAll(
  ".cuisine-item-type-container"
);
const frenchItemTypeContainer = document.getElementById(
  "cuisine-item-type-french"
);
// * Submenu Navigation Links *//
const cuisineItemNavigator = document.querySelectorAll(
  ".cuisine-item-type-navigator"
);

// * Submenu Navigation Links *//

function changeNavigatorColor(event, cuisineNavigator) {
  const currentMenuLink = event.target;
  cuisineNavigator.forEach((navigator) => {
    if (navigator.classList.contains("active")) {
      navigator.classList.remove("active");
      currentMenuLink.classList.add("active");
    }
  });
}

function changeCuisineContent(event) {
  const currentMenuText = event.target.innerHTML.toLowerCase();
  const typeOfCuisine = document.querySelectorAll(".type-of-cuisine");
  const french = document.getElementById("french");
  showSubContainer(currentMenuText);
  typeOfCuisine.forEach((cuisine) => {
    if (cuisine.classList.contains(currentMenuText)) {
      cuisine.classList.add("show-cuisine");
      french.classList.add("none");
    } else {
      cuisine.classList.remove("show-cuisine");
    }
  });
}

function showSubContainer(menuText) {
  cuisineItemTypeContainer.forEach((container) => {
    if (container.classList.contains(menuText)) {
      container.classList.add("show-container");
      frenchItemTypeContainer.style.display = "none";
      container.scroll(0, 0);
      findActiveSubContainerLink(menuText, container);
    } else {
      container.classList.remove("show-container");
    }
  });
}

function findActiveSubContainerLink(text, container) {
  const links = container.querySelectorAll(
    ".cuisine-item-type-navigator",
    "." + text
  );
  links.forEach((link) => {
    link.classList.remove("active");
  });
  links[0].classList.add("active");
}

cuisineToggler.forEach((toggler) => {
  toggler.addEventListener("click", (event) => {
    changeCuisineContent(event);
    changeNavigatorColor(event, cuisineToggler);
    document.querySelector("html").classList.remove("smooth");
  });
});

cuisineItemNavigator.forEach((nav) => {
  nav.addEventListener("click", (event) => {
    changeNavigatorColor(event, cuisineItemNavigator);
    document.querySelector("html").classList.add("smooth");
  });
});

// TODO CHANGE COLOR OF SUB CONTIANER LINKS ON SCROLL