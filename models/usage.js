const mongoose = require("mongoose")

const UsageSchema = new mongoose.Schema({
    membershipByUserID:{
        type: mongoose.Schema.Types.ObjectId,
        ref:"MembershipByUser",
        require: true
    },
    startDateTime:{
        type:Date
    },
    endDateTime:{
        type:Date
    },
    hours:{
        type: Number
    }
});

module.exports = mongoose.model("Usage", UsageSchema);