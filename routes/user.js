const express = require("express");
const router = express.Router();
const usersController = require("../controllers/usersController");
const User = require("../model/Users");
const Booking = require("../model/Bookings");
const Waitlist = require("../model/Waitlist");
const { Table } = require("../model/Tables");

const verifyAuthentication = (req, res, next) => {
    if (req.isAuthenticated()) {
        res.clearCookie("previousUrl");
        res.clearCookie("userRedirect");
        next();
    } else {
        const referrerUrl = req.originalUrl;
        res
            .cookie("previousUrl", `${referrerUrl}`, {
                maxAge: 5 * 60 * 1000,
                httpOnly: true,
            })
            .cookie("userRedirect", "true", {
                maxAge: 5 * 60 * 1000,
                httpOnly: true,
            })
            .redirect("/login");
    }
}
router
    .route("/$|(/|home|index)$")
    .get(verifyAuthentication, async (req, res) => {
        const user = await User.findOne({ username: req.user.username });
        res.render("user/home", {
            username: user.name,
            email: user.username,
            contact: user.contact,
            loggedIn: true
        });
    });

router.
    route("/booking_details")
    .get(verifyAuthentication, async (req, res) => {
        const user = await User.findOne({ username: req.user.username });
        const bookingDetails = await Booking.find({ email: user.username }).select({
            id: 1, name: 1, email: 1, contact: 1, numberOfGuest: 1, date: 1, time: 1, assignedTable: 1, _id: 0
        }).populate('assignedTable', 'tableNumber -_id');
        console.log("bookingDetails");
        console.log(bookingDetails);

        const now = new Date();
        const filteredReservations = bookingDetails.filter((reservation) => {
            const reservationDateTime = `${reservation.date} ${reservation.time}`;
            const reservationDate = new Date(reservationDateTime);
            return reservationDate > now;
        });

        console.log(filteredReservations);

        console.log("filteredReservations");
        console.log(filteredReservations);
        res.render("user/booking-details", {
            username: user.name,
            loggedIn: true,
            bookings: filteredReservations
        });
    })
    .put(verifyAuthentication, async (req, res) => {

    })
    .delete(verifyAuthentication, async (req, res) => {

    });


router.
    route("/booking_history")
    .get(verifyAuthentication, async (req, res) => {
        const user = await User.findOne({ username: req.user.username });
        const bookingDetails = await Booking.find({ email: user.username }).select({
            id: 1, name: 1, email: 1, contact: 1, numberOfGuest: 1, date: 1, time: 1, assignedTable: 1, _id: 0
        }).populate('assignedTable', 'tableNumber -_id');
        console.log("bookingDetails");
        console.log(bookingDetails);
        res.render("user/booking-history", {
            username: user.name,
            loggedIn: true,
            bookings: bookingDetails
        });
    });

router.
    route("/order_history")
    .get(verifyAuthentication, async (req, res) => {
        const user = await User.findOne({ username: req.user.username });
        res.render("user/order-history", {
            username: user.name,
            loggedIn: true
        })
    });

    router.
    route("/review")
    .get(verifyAuthentication, async (req, res) => {
        const user = await User.findOne({ username: req.user.username });
        res.render("user/review", {
            username: user.name,
            loggedIn: true
        })
    });

router.
    route("/waitlist")
    .get(verifyAuthentication, async (req, res) => {
        const user = await User.findOne({ username: req.user.username });
        const waitlistDetails = await Waitlist.find({ email: user.username }).select({
            id: 1, name: 1, email: 1, contact: 1, numberOfGuest: 1, date: 1, time: 1, createdAt: 1, _id: 0
        });
        console.log("waitlistDetails");
        console.log(waitlistDetails);
        const now = new Date();
        const filteredWaitlists = waitlistDetails.filter((waitlist) => {
            const waitlistDateTime = `${waitlist.date} ${waitlist.time}`;
            const waitlistDate = new Date(waitlistDateTime);
            return waitlistDate > now;
        });
        console.log("filteredWaitlists");
        console.log(filteredWaitlists);
        res.render("user/waitlist", {
            username: user.name,
            loggedIn: true,
            waitlists: filteredWaitlists
        })
    });


router.
    route("/waitlist/:id")
    .delete(verifyAuthentication, async (req, res) => {
        const ID = parseInt(req.params.id);
        console.log(ID);
        try {
            const recordToBeDeleted = await Waitlist.findOne({ id: ID }).exec();
            console.log("recordToBeDeleted");
            console.log(recordToBeDeleted);
            const deletedRecord = await Waitlist.findByIdAndDelete(recordToBeDeleted._id).exec();
            if (!null) {
                console.log(deletedRecord);
                res.send({ status: true, deletedId: ID });
            } else {
                res.send({ status: false, message: `Waitlist with ID: ${ID} doesnt exist` });
            }
        } catch (error) {
            if (error) {
                console.log(error);
            }
        }
    });

router.
    route("/bookings/:id")
    .get(verifyAuthentication, async (req, res) => {

    })
    .post(verifyAuthentication, async (req, res) => {
        const ID = parseInt(req.params.id);
        const { guests, date, time } = req.body;
        console.log(ID);
        try {
            async function filtertables(tableData, bookedTables) {
                // * avaialbleTables -> t4, t6, t8, t10 so on 
                let availableTables = tableData.filter(td => !bookedTables.some(bt => bt._id.equals(td._id)));
                console.log("Available Tables");
                console.log(availableTables);
                if (availableTables.length != 0) {
                    const tableBooked = await Table.findOne({ tableNumber: availableTables[0].tableNumber }).exec();
                    const recordToBeUpdated = await Booking.findOne({ id: ID }).exec();
                    console.log(recordToBeUpdated);
                    const updatedRecord = await Booking.findByIdAndUpdate(recordToBeUpdated._id, { numberOfGuest: parseInt(guests), date: date, time: time, assignedTable: tableBooked._id, updatedAt: Date.now() }, { new: true }).exec();
                    if (!null) {
                        console.log(updatedRecord);
                        res.send({ status: true, updatedRecord: ID });
                    } else {
                        res.send({ status: false, message: `Oops! Couldn't update the document. Reservation with ID: ${ID} doesnt exist.` });
                    }
                    return true;
                } else {
                    // No tables avaialbe to book
                    console.log("Oops! No tables available at the moment! Try Booking at a different time-slot or click yes to be included in waitlist");
                    res.send({ status: false, message: `There are no available tables for party of ${guests} on ${date} at ${time}` });
                }
            }
            async function switchCaseChecker(tableSize, bookedTables) {
                const tableData = await Table.find({ seatingCapacity: tableSize }).exec();
                console.log("Table Data");
                console.log(tableData);
                filtertables(tableData, bookedTables);
            }
            async function findTables(partySize) {
                // get the total number of bookings for a given date and time
                const totalBookings = await Booking.find({ date: date, time: time }, 'numberOfGuest -_id').populate('assignedTable').exec();
                console.log("Total Bookings");
                console.log(totalBookings);
                // create an empty array and push the id's of booked tables from totalbookings
                let bookedTables = [];
                for (let i = 0; i < totalBookings.length; i++) {
                    bookedTables.push(totalBookings[i].assignedTable._id);
                }
                console.log("Booked Tables");
                console.log(bookedTables);
                // get the table that matches the party size
                const tableData = await Table.find({ seatingCapacity: partySize }).exec();
                console.log("Table Data");
                console.log(tableData);
                if (tableData.length != 0) {
                    // filter the tables that are not yet booked from the booked ones 
                    filtertables(tableData, bookedTables);
                } else {
                    switch (partySize) {
                        case 3:
                            switchCaseChecker(4, bookedTables);
                            break;
                        case 5:
                            switchCaseChecker(6, bookedTables);
                            break;
                        case 7:
                            switchCaseChecker(8, bookedTables);
                            break;
                        case 9:
                            switchCaseChecker(10, bookedTables);
                            break;
                        case 11:
                            switchCaseChecker(12, bookedTables);
                            break;
                        case 13:
                            switchCaseChecker(14, bookedTables);
                            break;
                        case 15:
                            switchCaseChecker(16, bookedTables);
                            break;
                        case 17:
                            switchCaseChecker(18, bookedTables);
                            break;
                        case 19:
                            switchCaseChecker(20, bookedTables);
                            break;
                        default:
                            break;
                    }
                }
            }
            const existingReservations = await Booking.find(
                { date: date, time: time, numberOfGuest: parseInt(guests) }).populate('assignedTable').exec();
            if (existingReservations.length != 0) {
                console.log("Inside existing reservations block:");
                findTables(parseInt(guests));
            } else {
                console.log("No existing reservations");
                findTables(parseInt(guests));
            }
        } catch (error) {
            if (error) {
                console.error(error);
            }
        }
    })
    .put(verifyAuthentication, async (req, res) => {

    })
    .delete(verifyAuthentication, (async (req, res) => {
        const ID = parseInt(req.params.id);
        console.log(ID);
        try {
            const recordToBeDeleted = await Booking.findOne({ id: ID }).exec();
            console.log(recordToBeDeleted);
            const deletedRecord = await Booking.findByIdAndDelete(recordToBeDeleted._id).exec();
            if (!null) {
                console.log(deletedRecord);
                res.send({ status: true, deletedId: ID });
            } else {
                res.send({ status: false, message: `Reservation with ID: ${ID} doesnt exist` });
            }
        } catch (error) {
            if (error) {
                console.log(error);
            }
        }
    }));
module.exports = router;
