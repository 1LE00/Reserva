const User = require("../model/Users");
const Message = require("../model/Messages");

const renderContact = async (req, res) => {
    if (req.isAuthenticated()) {
        const user = await User.findOne({ username: req.user.username });
        const clientName = req.cookies.name;
        const clientEmail = req.cookies.email;
        const clientRequest = req.cookies.request;
        res.clearCookie("name");
        res.clearCookie("email");
        res.clearCookie("request");
        res.clearCookie("contactValidate");
        res.clearCookie("previousUrl");
        res.render("contact", {
          username: user.name,
          loggedIn: true,
          name: clientName,
          email: clientEmail,
          request: clientRequest,
          status: 0,
        });
      } else {
        res.render("contact", {
          username: "",
          loggedIn: false,
          name: "",
          email: "",
          request: "",
          status: 0,
        });
      }
};

const handleContactMessage = async (req, res) => {
  const { name, email, request } = req.body;
  if (req.isAuthenticated()) {
    const user = await User.findOne({ username: req.user.username });
    await Message.create({
      name: name,
      email: email,
      contact: req.user.contact,
      message: request,
    });
    setTimeout(() => {
      res.render("contact", {
        username: user.name,
        loggedIn: true,
        name: "",
        email: "",
        request: "",
        status: 1,
      });
    }, 1000);
  } else {
    const referrerUrl = req.originalUrl;
    res
      .cookie("previousUrl", `${referrerUrl}`, {
        maxAge: 5 * 60 * 1000,
        httpOnly: true,
      })
      .cookie("name", `${name}`, {
        maxAge: 5 * 60 * 1000,
        httpOnly: true,
      })
      .cookie("email", `${email}`, {
        maxAge: 5 * 60 * 1000,
        httpOnly: true,
      })
      .cookie("request", `${request}`, {
        maxAge: 5 * 60 * 1000,
        httpOnly: true,
      })
      .cookie("contactValidate", "true", {
        maxAge: 5 * 60 * 1000,
        httpOnly: true,
      })
      .redirect("/login");
  }
};

module.exports = { renderContact, handleContactMessage };
