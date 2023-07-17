const express = require("express");
const router = express.Router();
const User = require("../model/Users");
const contactController = require("../controllers/contactController");
const bookingController = require("../controllers/bookingController");
const waitlistsController = require("../controllers/waitlistsController");

router.get("^/($|(index|home)(.html)?)", async (req, res) => {
  if (req.isAuthenticated()) {
    const user = await User.findOne({ username: req.user.username });
    res.render("index", {
      username: user.name,
      loggedIn: true,
    });
  } else {
    res.render("index", {
      username: "",
      loggedIn: false,
    });
  }
});

router.get("/menu(.html)?", async (req, res) => {
  if (req.isAuthenticated()) {
    const user = await User.findOne({ username: req.user.username });
    res.render("menu", {
      username: user.name,
      loggedIn: true,
    });
  } else {
    res.render("menu", {
      username: "",
      loggedIn: false,
    });
  }
});

router.get("/about(.html)?", async (req, res) => {
  if (req.isAuthenticated()) {
    const user = await User.findOne({ username: req.user.username });
    res.render("about", {
      username: user.name,
      loggedIn: true,
    });
  } else {
    res.render("about", {
      username: "",
      loggedIn: false,
    });
  }
});

router
  .route("/contact(-us)?(.html)?")
  .get(contactController.renderContact)
  .post(contactController.handleContactMessage);

router
  .route("/reservation(.html)?")
  .get(bookingController.renderReservation)
  .post(bookingController.handleBooking);

router.route("/waitlist").post(waitlistsController.handleWaitlist);
module.exports = router;
