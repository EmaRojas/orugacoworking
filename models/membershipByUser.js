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
    expired: {
        type: Boolean,
        default: false
    },
});

module.exports = mongoose.model("MembershipByUser", MembershipByUserSchema);