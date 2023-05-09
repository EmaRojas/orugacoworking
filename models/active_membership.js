const mongoose = require("mongoose");

const ActiveMembershipSchema = new mongoose.Schema({
    client:{
        type: mongoose.Types.ObjectId,
        ref:"Client",
        require: true
    },
    membership:{
        type: mongoose.Types.ObjectId,
        ref: "Membership",
        require: true
    },
    payment:{
        type: mongoose.Types.ObjectId,
        ref:"Payment",
        require: true
    },
    availableHours:{
        type:String,
        require: true
    },
    startDate:{
        type:Date,
        require: true
    },
    endDate:{
        type:Date        
    }
})

module.exports = mongoose.model("ActiveMembership", ActiveMembershipSchema);