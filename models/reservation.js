const mongoose = require("mongoose")

const ReservationSchema = new mongoose.Schema({
    clientID:{
        type: mongoose.Schema.Types.ObjectId,
        ref:"Client"
    },
    priceRoomID:{
        type: mongoose.Schema.Types.ObjectId,
        ref:"PriceRoom"
    },
    roomID:{
        type: mongoose.Schema.Types.ObjectId,
        ref:"Room"
    },
    paymentID:{
        type: mongoose.Schema.Types.ObjectId,
        ref:"Payment"
    },    
    date:{
        type: mongoose.Schema.Types.Date
    }
})

module.exports = mongoose.model("Reservation", ReservationSchema);