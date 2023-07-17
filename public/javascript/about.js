/* back to top */

const btnTop = document.querySelector(".btn-top");

const backToTop = () => {
  if (window.scrollY >= 300) btnTop.classList.remove("invisible");
  else btnTop.classList.add("invisible");
};

window.addEventListener("scroll", () => {
  backToTop();
});

/* Header show/hide */
