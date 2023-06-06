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
    dateTime:{
        type: Date
    },
    date:{
        type: string
    },
    time:{
        type: string
    },
    paymentID:{
        type: mongoose.Schema.Types.ObjectId,
        ref:"Payment"
    }
})

module.exports = mongoose.model("Reservation", ReservationSchema);