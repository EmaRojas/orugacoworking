const mongoose = require("mongoose")

const ReservationSchema = new mongoose.Schema({
    clientID:{
        type: mongoose.Schema.Types.ObjectId,
        ref:"Client"
    },
    membershipID:{
        type: mongoose.Schema.Types.ObjectId,
        ref:"MembershipByUser"
    },
    room:{
        type:String
    },
    startDateTime:{
        type: Date
    },
    endDateTime:{
        type: Date
    },
    total:{
        type:String,
        require: true
    },
    paid:{
        type:String,
        require: true
    },
    billing: {
        type: String,
    },
    note:{
        type:String
    },
    paymentMethod:{
        type:String
    },
    date:{
        type:String
    },
    dateString:{
        type:String
    },
    time:{
        type:String
    },
    endTime:{
        type:String
    }
})

module.exports = mongoose.model("Reservation", ReservationSchema);