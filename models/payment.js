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
    }

});

module.exports = mongoose.model("Payment", PaymentSchema);