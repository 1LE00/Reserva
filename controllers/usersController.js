const passport = require("passport");
const User = require("../model/Users");

passport.use(User.createStrategy());
passport.serializeUser(User.serializeUser());
passport.deserializeUser(User.deserializeUser());

const handleRegister = async (req, res) => {
  try {
    const { fullname, username, password, contact } = req.body;

    const duplicate = await User.findOne({ username: username }).exec();
    if (duplicate) {
      return res.render("register", {
        message: `User with email "${username}" already exists!`,
        registerName: fullname,
        registerEmail: username,
      });
    } else {
      User.register(
        { username: username, name: fullname, contact: contact },
        password,
        function (err, user) {
          if (err) {
            console.log("error while user register!", err); // TODO make time to learn regarding errors associated with this method
            res.redirect("/register");
          } else {
            passport.authenticate("local")(req, res, function () {
              res.redirect("/login");
            });
          }
        }
      );
    }
  } catch (error) {
    if (error) {
      console.log(error);
    }
  }
};

const handleSignIn = async (req, res, next) => {
  try {
    const { username, password } = req.body;

    passport.authenticate("local", function (err, user, info, status) {
      if (err) {
        return next(err);
      }
      if (!user) {
        return res.render("login", {
          message: "Incorrect Username or Password",
          loginUsername: username,
          loginPassword: password,
        });
      }
      req.logIn(user, function (err) {
        if (err) {
          return next(err);
        }
        if (req.cookies.contactValidate) {
          return res.redirect(`${req.cookies.previousUrl}`);
        } else if(req.cookies.bookingValidate) {
          return res.redirect(`${req.cookies.previousUrl}`);
        } else if(req.cookies.userRedirect) {
          return res.redirect(`${req.cookies.previousUrl}`);
        } else{
          return res.redirect("/");
        }
      });
    })(req, res, next);
  } catch (error) {
    if (error) {
      console.log(error);
    }
  }
};

module.exports = { handleRegister, handleSignIn };
