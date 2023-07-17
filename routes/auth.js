const express = require("express");
const router = express.Router();
const usersController = require("../controllers/usersController");
const { URL } = require("url");

router
  .route("/login(.html)?")
  .get((req, res) => {
    const referer = req.headers.referer || 'http://localhost:3000/';
    const referrerUrl = new URL(referer);
    const pathname = referrerUrl.pathname;
    if (req.isAuthenticated() && pathname != '/register') {
      res.redirect(`${referer}`);
    } else {
      res.render("login", {
        message: "",
        loginUsername: "",
        loginPassword: "",
      });
    }
  })
  .post(usersController.handleSignIn);

router
  .route("/register(.html)?")
  .get((req, res) => {
    const referer = req.headers.referer || 'http://localhost:3000/';
    const referrerUrl = new URL(referer);
    const pathname = referrerUrl.pathname;
    if (req.isAuthenticated() && pathname != '/login') {
      res.redirect(`${referer}`);
    } else {
      res.render("register", {
        message: "",
        registerName: "",
        registerEmail: "",
        condition: false,
      });
    }
  })
  .post(usersController.handleRegister);

router.post("/logout", function (req, res, next) {
  if(req.user.isAdmin){
    req.logout(function (err) {
      if (err) {
        return next(err);
      }
      res.redirect("/reserva/auth/admin/verify");
    });
  }else{
    req.logout(function (err) {
      if (err) {
        return next(err);
      }
      res.redirect("/login");
    });
  }
});
module.exports = router;