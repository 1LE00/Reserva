const express = require("express");
const router = express.Router();
const passport = require("passport");
const User = require("../model/Users");
const Booking = require("../model/Bookings");
const Waitlist = require("../model/Waitlist");
const Message = require("../model/Messages");
const Dish = require("../model/Dish");
const { Table } = require("../model/Tables");

passport.use(User.createStrategy());
passport.serializeUser(User.serializeUser());
passport.deserializeUser(User.deserializeUser());

const verifyAdmin = async (req, res, next) => {
    if (req.isAuthenticated() && req.user.isAdmin) {
        res.clearCookie("previousUrl");
        res.clearCookie("adminRedirect");
        next();
    } else {
        const referrerUrl = req.originalUrl;
        res
            .cookie("previousUrl", `${referrerUrl}`, {
                maxAge: 1 * 60 * 1000,
                httpOnly: true,
            })
            .cookie("adminRedirect", "true", {
                maxAge: 1 * 60 * 1000,
                httpOnly: true,
            })
        res.redirect("/reserva/auth/admin/verify");
    }
}

router
    .route("/$|(/|home|index)$")
    .get(verifyAdmin, async (req, res) => {
        res.render("admin/index");
    });

router.route("/bookings")
    .get(verifyAdmin, async (req, res) => {
        const bookings = await Booking.find({}).populate("assignedTable").exec();
        console.log("All Bookings");
        console.log(bookings);
        const now = new Date();
        const filteredBookings = bookings.filter((booking) => {
            const bookingDateTime = `${booking.date} ${booking.time}`;
            const bookingDate = new Date(bookingDateTime);
            return bookingDate > now;
        });
        console.log("filtered Bookings");
        console.log(filteredBookings);
        res.render("admin/bookings", { title: "Upcoming Reservations", bookings: filteredBookings });
    })

router.route("/bookings/all")
    .get(verifyAdmin, async (req, res) => {
        const bookings = await Booking.find({}).populate("assignedTable").exec();
        res.render("admin/bookings", { title: "All Reservations", bookings: bookings });
    })

router.route("/tables")
    .get(verifyAdmin, async (req, res) => {
        const tables = await Table.find({}).exec();
        console.log("All tables");
        console.log(tables);
        res.render("admin/tables", { tables: tables });
    })

router.route("/tables/add")
    .get(verifyAdmin, async (req, res) => {
        res.render("admin/addTables");
    })
    .post(verifyAdmin, async (req, res) => {
        const { tableNumber, seatingCapacity } = req.body;
        const tableNumberExists = await Table.findOne({tableNumber: tableNumber}).exec();
        if(tableNumberExists){
            const data = {error: "Table Number " + tableNumber + " already exists", existingTable: tableNumberExists}
            res.send(data);
        }else{
            const createdTable = await Table.create({
                tableNumber: parseInt(tableNumber),
                seatingCapacity: parseInt(seatingCapacity)
            });
            const data = {tableCreated: createdTable}
            res.redirect('/reserva/tables');
        }
    });


router
    .route("/tables/:id")
    .delete(verifyAdmin, async (req, res) => {
        const ID = req.params.id;
        console.log(ID);
        try {
            const delBookings = await Booking.deleteMany({ assignedTable: ID }).exec();
            const deletedRecord = await Table.findByIdAndDelete(ID).exec();
            if (!null) {
                console.log(deletedRecord);
                console.log(delBookings);
                res.send({ status: true, deletedId: deletedRecord, deletedBookings: delBookings });
            } else {
                res.send({ status: false, message: `Table ID: ${ID} doesnt exist` });
            }
        } catch (error) {
            if (error) {
                console.log(error);
            }
        }
    });

router.route("/users")
    .get(verifyAdmin, async (req, res) => {
        const users = await User.find({ isAdmin: false }).exec();
        console.log("All users");
        console.log(users);
        res.render("admin/users", { users: users });
    })
    .delete(verifyAdmin, async (req, res) => {

    });

router
    .route("/users/:id")
    .delete(verifyAdmin, async (req, res) => {
        const ID = req.params.id;
        console.log(ID);
        try {
            const deletedRecord = await User.findByIdAndDelete(ID).exec();
            if (!null) {
                console.log(deletedRecord);
                res.send({ status: true, deletedId: deletedRecord });
            } else {
                res.send({ status: false, message: `User ID: ${ID} doesnt exist` });
            }
        } catch (error) {
            if (error) {
                console.log(error);
            }
        }
    });

router.route("/waitlists")
    .get(verifyAdmin, async (req, res) => {
        const waitlists = await Waitlist.find({}).exec();
        console.log("All waitlists");
        console.log(waitlists);
        const now = new Date();
        const filteredwaitlists = waitlists.filter((waitlists) => {
            const waitlistsDateTime = `${waitlists.date} ${waitlists.time}`;
            const waitlistsDate = new Date(waitlistsDateTime);
            return waitlistsDate > now;
        });
        console.log("filtered waitlists");
        console.log(filteredwaitlists);
        res.render("admin/waitlists", { waitlists: filteredwaitlists });
    })
    .delete(verifyAdmin, async (req, res) => {

    });

router.route("/messages")
    .get(verifyAdmin, async (req, res) => {
        const messages = await Message.find({}).exec();
        console.log("All messages");
        console.log(messages);
        res.render("admin/messages", { messages: messages });
    })

router
    .route("/messages/:id")
    .delete(verifyAdmin, async (req, res) => {
        const ID = req.params.id;
        console.log(ID);
        try {
            const deletedRecord = await Message.findByIdAndDelete(ID).exec();
            if (!null) {
                console.log(deletedRecord);
                res.send({ status: true, deletedId: deletedRecord });
            } else {
                res.send({ status: false, message: `Message ID: ${ID} doesnt exist` });
            }
        } catch (error) {
            if (error) {
                console.log(error);
            }
        }
    });

router.route("/dishes")
    .get(verifyAdmin, async (req, res) => {
        const insertedDishes = await Dish.find({}).exec();
        res.render("admin/dishes", { dishes: insertedDishes });
    })
    .delete(verifyAdmin, async (req, res) => {

    });

router.route("/dishes/add")
    .get(verifyAdmin, async (req, res) => {
        res.render("admin/addDishes");
    })
    .post(verifyAdmin, async (req, res) => {
        const { name, description, price, imagePath } = req.body;
        const createdDish = await Dish.create({
            name: name,
            description: description,
            price: parseInt(price),
            imagePath: imagePath
        });
        res.send({ createdDish })
    });

router
    .route("/dishes/:id")
    .post(verifyAdmin, async (req, res) => {
        const ID = req.params.id;
        const { name, description, price } = req.body;
        console.log(ID);
        try {
            const updatedRecord = await Dish.findByIdAndUpdate(ID, { name: name, description: description, price: parseInt(price) }, { new: true }).exec();
            console.log(updatedRecord);
            res.send({ status: true, updatedRecord: ID });
        } catch (error) {
            if (error) {
                console.error(error);
            }
        }
    })
    .delete(verifyAdmin, async (req, res) => {
        const ID = req.params.id;
        console.log(ID);
        try {
            const deletedRecord = await Dish.findByIdAndDelete(ID).exec();
            if (!null) {
                console.log(deletedRecord);
                res.send({ status: true, deletedId: deletedRecord });
            } else {
                res.send({ status: false, message: `Meal ID: ${ID} doesnt exist` });
            }
        } catch (error) {
            if (error) {
                console.log(error);
            }
        }
    });

router.route("/events")
    .get(verifyAdmin, async (req, res) => {
        res.render("admin/events");
    })
    .delete(verifyAdmin, async (req, res) => {

    });

router.route("/auth/admin/verify")
    .get(async (req, res) => {
        res.render("admin/auth", { message: '', loginUsername: '', loginPassword: '' });
    })
    .post(async (req, res, next) => {
        try {
            const { username, password } = req.body;

            passport.authenticate("local", function (err, user, info, status) {
                if (err) {
                    return next(err);
                }
                if (!user || user.isAdmin == false) {
                    return res.render("admin/auth", {
                        message: "Incorrect Username or Password",
                        loginUsername: username,
                        loginPassword: password,
                    });
                }
                req.logIn(user, function (err) {
                    if (err) {
                        return next(err);
                    }
                    if (req.cookies.adminRedirect) {
                        return res.redirect(`${req.cookies.previousUrl}`);
                    } else {
                        return res.redirect("/reserva");
                    }
                });
            })(req, res, next);
        } catch (error) {
            if (error) {
                console.log(error);
            }
        }
    });

module.exports = router;
