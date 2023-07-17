
const restaurantInfo = document.querySelector("[data-restaurant-info]"); 
const btnTop = document.querySelector(".btn-top");

let scrollPos = 0;
const hideInfo = ()=>{
    if(scrollPos <= window.scrollY){
        restaurantInfo.classList.add("hide");
    }else{
        restaurantInfo.classList.remove("hide");
    }
}

const backToTop = ()=>{
    if (window.scrollY >= 300)
        btnTop.classList.remove("invisible");
    else
        btnTop.classList.add("invisible");  
}

window.addEventListener("scroll", ()=>{ 
    hideInfo();
    backToTop();
    scrollPos = window.scrollY;
});

/* Header show/hide */

/* Hero-Slider */

const heroSliderItems = document.getElementsByClassName("slider-item");

let currentSliderPositon = 0;
let currentHeroItem = heroSliderItems[0];

function updateSlider() {
    currentHeroItem.classList.remove("active");
    heroSliderItems[currentSliderPositon].classList.add("active");
    currentHeroItem = heroSliderItems[currentSliderPositon]
}

const slideNext = ()=>{
    if(currentSliderPositon >= heroSliderItems.length - 1 ){
        currentSliderPositon = 0;
    }else{
        currentSliderPositon++;
    }
    updateSlider();
}

const autoSlide = function () {
    
    setInterval(function () {
      slideNext();
    }, 7000);
    
    testimonialSlider();
}

/* Testimonials slider */

const testimonialsCard = document.querySelectorAll(".testimonials-card");

let currentTestimonialPosition = 0;
let currentTestimonialItem = testimonialsCard[0];

function updateTestimonialCard(){
    testimonialsCard.forEach((card)=>{
        if(card.classList.contains("before")){
            card.classList.remove("before");
        }
    });
    currentTestimonialItem.classList.remove("active");
    currentTestimonialItem.classList.add("before");
    testimonialsCard[currentTestimonialPosition].classList.add("active");
    currentTestimonialItem = testimonialsCard[currentTestimonialPosition];
};

const testimonialNext = function(){
    if(currentTestimonialPosition >= testimonialsCard.length - 1){
        currentTestimonialPosition = 0;
    }else{
        currentTestimonialPosition++;
    }
    updateTestimonialCard();
}


const testimonialSlider = (params) => {
    setInterval(function () {
        testimonialNext();
      }, 10000);
}

window.addEventListener("load", autoSlide);

/* Testimonials slider */
