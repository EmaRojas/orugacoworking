const { Decimal128 } = require("mongodb");
const mongoose = require("mongoose")

const MembershipByUserSchema = new mongoose.Schema({
    clientID:{
        type: mongoose.Schema.Types.ObjectId,
        ref:"Client",
        require: true
    },
    membershipID:{
        type: mongoose.Schema.Types.ObjectId,
        ref:"Membership",
        require: true
    },
    paymentID:{
        type: mongoose.Schema.Types.ObjectId,
        ref:"Payment",
        require: true
    },
    endDate:{
        type: Date,
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
});

module.exports = mongoose.model("MembershipByUser", MembershipByUserSchema);