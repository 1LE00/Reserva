const User = require("../model/Users");
const Waitlist = require("../model/Waitlist");
const Counter = require("../model/Counters");

const handleWaitlist = async (req, res) => {
    const { guests, date, time, request } = req.body;
    if (req.isAuthenticated()) {
        try {
            const user = await User.findOne({ username: req.user.username }).exec();
            const duplicate = await Waitlist.findOne({ email: user.username, date: date, time: time, numberOfGuest: parseInt(guests) }).exec();
            if (duplicate) {
                console.log("Duplicate exists:")
                console.log(duplicate);
                return res.send({ waitlistExists: true });
            } else {
                async function getNextSequenceValue(sequenceName) {
                    const counter = await Counter.findByIdAndUpdate(
                        sequenceName,
                        { $inc: { count: 1 } },
                        { new: true, upsert: true }
                    );
                    return counter.count;
                }
                await Waitlist.create({
                    id: await getNextSequenceValue('Waitlist Counters'),
                    name: user.name,
                    email: user.username,
                    contact: user.contact,
                    numberOfGuest: guests,
                    date: date,
                    time: time,
                    request: request,
                    createdAt: Date.now()
                });
                console.log("<---Waitlist Message--->");
                console.log(`User ${user.name} has been added to the waitlist for the booking of ${guests} guests on ${date} at ${time}.`);
                res.send({ waitlist: true });
            }
        } catch (error) {
            if (error) console.log(error);
        }

    } else {
        res.send({ redirect: "/login" });
    }
}

module.exports = { handleWaitlist };