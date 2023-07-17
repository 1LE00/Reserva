const mongoose = require("mongoose");
const Schema = mongoose.Schema;

const waitlistSchema = new Schema({
    id: {
        type: Number,
        required: true,
        unique: true
    },
    name: {
        type: String,
        required: true
    },
    email: {
        type: String,
        required: true,
    },
    contact: {
        type: Number,
        required: true
    },
    numberOfGuest: {
        type: Number,
        required: true
    },
    date: {
        type: String,
        required: true
    },
    time: {
        type: String,
        required: true
    },
    request: {
        type: String,
    },
    createdAt: {
        type: Date,
        required: true
    }
});


const Waitlist = mongoose.model("Waitlist", waitlistSchema);

module.exports = Waitlist;
