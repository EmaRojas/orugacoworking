const mongoose = require("mongoose")

const ReservationSchema = new mongoose.Schema({
    client:{
        type: mongoose.Schema.Types.ObjectId,
        ref:"Client"
    },
    privateRoom:{
        type: mongoose.Schema.Types.ObjectId,
        ref:"PrivateRoom"
    },
    payment:{
        type: mongoose.Schema.Types.ObjectId,
        ref:"Payment"
    },    
})

module.exports = mongoose.model("Reservation", ReservationSchema);