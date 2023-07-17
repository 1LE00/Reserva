const home = document.getElementById("home");
const bookingDetails = document.getElementById("booking-details");
const bookingHistory = document.getElementById("booking-history");
const orderHistory = document.getElementById("order-history");
const waitlist = document.getElementById("waitlist");
const review = document.getElementById("review");

const checkUrl = () => {
    if (window.location.pathname == "/user" || window.location.pathname == "/user/home" || window.location.pathname == "/user/index") {
        home.classList.add("active");
    }else if (window.location.pathname == "/user/booking_details") {
        bookingDetails.classList.add("active");
    } else if (window.location.href == "http://localhost:3000/user/booking_history") {
        bookingHistory.classList.add("active");
    } else if (window.location.href == "http://localhost:3000/user/order_history") {
        orderHistory.classList.add("active");
        orderHistory.scrollIntoView();
    } else if (window.location.href == "http://localhost:3000/user/waitlist") {
        waitlist.classList.add("active");
        waitlist.scrollIntoView();
    } else if (window.location.href == "http://localhost:3000/user/review") {
        review.classList.add("active");
        review.scrollIntoView();
    }
}

const loadContent = () => {
    const userContent = document.querySelector(".home");
    const bookingDetailsContent = document.querySelector(".booking-details");
    const bookingHistoryContent = document.querySelector(".booking-history");
    const orderHistoryContent = document.querySelector(".order-history");
    const waitlistContent = document.querySelector(".waitlist");
    const reviewContent = document.querySelector(".review");
    const contents = [userContent, bookingDetailsContent, bookingHistoryContent, orderHistoryContent, waitlistContent, reviewContent];
    const currentContentHodler = contents.find(content => content != null);
    if (!currentContentHodler.classList.contains("show-content-holder")) {
        currentContentHodler.classList.add("show-content-holder");
    }
}

window.onload = () => {
    checkUrl();
    loadContent();
}
