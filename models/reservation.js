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
    endDateTime:{
        type: Date
    },
    date:{
        type:String
    },
    time:{
        type:String
    },
    endTime:{
        type:String
    },
    paymentID:{
        type: mongoose.Schema.Types.ObjectId,
        ref:"Payment"
    },
    membershipID:{
        type: mongoose.Schema.Types.ObjectId,
        ref:"MembershipByUser"
    },
    billing:{
        type:String
    },
    note:{
        type:String
    }
})

module.exports = mongoose.model("Reservation", ReservationSchema);