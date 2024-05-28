const { Decimal128 } = require("mongodb");
const mongoose = require("mongoose")

const MembershipByUserSchema = new mongoose.Schema({
    clientID:{
        type: mongoose.Schema.Types.ObjectId,
        ref:"Client",
        require: true
    },
    name:{
        type:String,
        require: true
    },
    room:{
        type:String,
        require: true
    },
    created:{
        type: Date,
    },
    status: {
        type: String,
    },
    total_hours: {
        type: Number,
    },
    remaining_hours: {
        type: Number,
    },
    billing: {
        type: String,
    },
    paid:{
        type:String,
        require: true
    },
    total:{
        type:String,
        require: true
    },
    paymentMethod:{
        type:String,
        require: true
    },
});

module.exports = mongoose.model("MembershipByUser", MembershipByUserSchema);