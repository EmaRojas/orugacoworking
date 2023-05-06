const { Decimal128 } = require("mongodb");
const mongoose = require("mongoose")

const PaymentSchema = new mongoose.Schema({
    means_of_payment:{
        type: String,
        require: true
    },
    total:{
        type:Decimal128,
        requiere:true
    },
    paid:{
        type:Decimal128,
        require:true
    },
    status:{
        type:String,
        require:true
    }

});

module.exports = mongoose.model("Payment", PaymentSchema);