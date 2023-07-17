const User = require("../model/Users");
const Booking = require("../model/Bookings");
const Counter = require("../model/Counters");
const { Table } = require("../model/Tables");

const renderReservation = async (req, res) => {
  if (req.isAuthenticated()) {
    const user = await User.findOne({ username: req.user.username });
    const numberOfGuests = req.cookies.numberOfGuest;
    const selectedDate = req.cookies.date;
    const selectedTime = req.cookies.time;
    const clientRequest = req.cookies.request;
    res.clearCookie("numberOfGuest");
    res.clearCookie("date");
    res.clearCookie("time");
    res.clearCookie("request");
    res.clearCookie("bookingValidate");
    res.clearCookie("previousUrl");
    res.render("reservation", {
      username: user.name,
      loggedIn: true,
      guest: numberOfGuests,
      date: selectedDate,
      time: selectedTime,
      request: clientRequest,
    });
  } else {
    res.render("reservation", {
      username: "",
      loggedIn: false,
      guest: "",
      date: "",
      time: "",
      request: "",
    });
  }
};

const handleBooking = async (req, res) => {
  const { guests, date, time, request } = req.body;
  console.log(req.body);
  if (req.isAuthenticated()) {
    checkTableAvailability(date, time, parseInt(guests));
    async function checkTableAvailability(date, time, partySize) {
      async function getNextSequenceValue(sequenceName) {
        const counter = await Counter.findByIdAndUpdate(
          sequenceName,
          { $inc: { count: 1 } },
          { new: true, upsert: true }
        );
        return counter.count;
      }

      async function createBooking(tableBooked) {
        try {
          const user = await User.findOne({ username: req.user.username }).exec();
          await Booking.create({
            id: await getNextSequenceValue('Booking Counters'),
            name: user.name,
            email: user.username,
            contact: user.contact,
            numberOfGuest: guests,
            date: date,
            time: time,
            request: request,
            createdAt: Date.now(),
            assignedTable: tableBooked._id
          });
          console.log("Table number " + tableBooked.tableNumber + " is booked for " + req.user.name + " at " + time + " on " + date + " for " + guests + " guests.");
          res.send({ booked: true });
        } catch (err) {
          console.error(err);
        }
      }

      async function filtertables(tableData, bookedTables) {
        // * avaialbleTables -> t4, t6, t8, t10 so on 
        let availableTables = tableData.filter(td => !bookedTables.some(bt => bt._id.equals(td._id)));
        console.log("Available Tables");
        console.log(availableTables);
        if (availableTables.length != 0) {
          const tableBooked = await Table.findOne({ tableNumber: availableTables[0].tableNumber }).exec();
          createBooking(tableBooked);
        } else {
          // No tables avaialbe to book
          console.log("Oops! No tables available at the moment! Try Booking at a different time-slot or click yes to be included in waitlist");
          res.send({ booked: false });
        }
      }
      async function switchCaseChecker(tableSize, bookedTables) {
        const tableData = await Table.find({ seatingCapacity: tableSize }).exec();
        console.log("Table Data");
        console.log(tableData);
        filtertables(tableData, bookedTables);
      }

      async function findTables() {
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
            case 1:
              break;
            case 2:
              break;
            case 3:
              switchCaseChecker(4, bookedTables);
              break;
            case 4:
              break;
            case 5:
              switchCaseChecker(6, bookedTables);
              break;
            case 6:
              break;
            case 7:
              switchCaseChecker(8, bookedTables);
              break;
            case 8:
              break;
            case 9:
              switchCaseChecker(10, bookedTables);
              break;
            case 10:
              break;
            case 11:
              switchCaseChecker(12, bookedTables);
              break;
            case 12:
              break;
            case 13:
              switchCaseChecker(14, bookedTables);
              break;
            case 14:
              break;
            case 15:
              switchCaseChecker(16, bookedTables);
              break;
            case 16:
              break;
            case 17:
              switchCaseChecker(18, bookedTables);
              break;
            case 18:
              break;
            case 19:
              switchCaseChecker(20, bookedTables);
              break;
            case 20:
              res.send({booked:false, message: "There are no tables of size " + partySize + " available at the moment."});
              break;
            default:
              break;
          }
        }
      }

      /* // *Find existing reservations */
      const existingReservations = await Booking.find(
        { date: date, time: time, numberOfGuest: partySize }).populate('assignedTable').exec();
      if (existingReservations.length != 0) {
        console.log("Inside existing reservations block:");
        findTables();
      } else {
        console.log("No existing reservations");
        findTables();
      }
    }
  } else {
    const referrerUrl = req.originalUrl;
    res
      .cookie("previousUrl", `${referrerUrl}`, {
        maxAge: 5 * 60 * 1000,
        httpOnly: true,
      })
      .cookie("numberOfGuest", `${guests}`, {
        maxAge: 5 * 60 * 1000,
        httpOnly: true,
      })
      .cookie("date", `${date}`, {
        maxAge: 5 * 60 * 1000,
        httpOnly: true,
      })
      .cookie("time", `${time}`, {
        maxAge: 5 * 60 * 1000,
        httpOnly: true,
      })
      .cookie("request", `${request}`, {
        maxAge: 5 * 60 * 1000,
        httpOnly: true,
      })
      .cookie("bookingValidate", "true", {
        maxAge: 5 * 60 * 1000,
        httpOnly: true,
      })
      .send({ redirect: "/login" }); // *HAD TO CHANGE DUE TO AJAX
  }
};

module.exports = { handleBooking, renderReservation };