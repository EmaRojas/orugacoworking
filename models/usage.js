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
    },
    member:{
        type:String
    }
});

module.exports = mongoose.model("Usage", UsageSchema);