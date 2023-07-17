require("dotenv").config();
const express = require("express");
const path = require("path");
const root = require("./routes/root.js");
const auth = require("./routes/auth.js");
const user = require("./routes/user.js");
const reserva = require("./routes/reserva.js");
const bodyParser = require("body-parser");
const mongoose = require("mongoose");
const passport = require("passport");
const session = require("express-session");
const cookieParser = require("cookie-parser");

const app = express();
const PORT = process.env.PORT || 3000;

mongoose.set("strictQuery", false);
mongoose.connect("mongodb://127.0.0.1:27017/restaurant");

/* Set view engine */
app.set("view engine", "ejs");

/* Serve static files */
app.use(express.static(path.join(__dirname, "public")));

/* Middleware */
app.use(bodyParser.urlencoded({ extended: true }));
app.use(
  session({
    secret: process.env.SESSION_SECRET,
    resave: false,
    cookie: { maxAge: 24 * 60 * 60 * 1000 },
    saveUninitialized: true,
  })
);

app.use(passport.initialize());
app.use(passport.session());

app.use(cookieParser());

/* Routes */
app.use("/", root);
app.use("/", auth);
app.use('/user', user);
app.use('/reserva', reserva);

/* Handle 404 */
app.all("*", (req, res) => {
  res.status(400).render("404.ejs");
});

app.listen(PORT, () => console.log(`Server is running at port ${PORT}`));
