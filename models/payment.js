const { Decimal128 } = require("mongodb");
const mongoose = require("mongoose")

const PaymentSchema = new mongoose.Schema({
    means_of_payment:{
        type: String,
        require: true
    },
    total:{
        type:String,
        requiere:true
    },
    paid:{
        type:String,
        require:true
    },
    status:{
        type:String,
        require:true
    },
    reservationID:{
        type: mongoose.Schema.Types.ObjectId,
        ref:"Reservation"
    }
});

module.exports = mongoose.model("Payment", PaymentSchema);