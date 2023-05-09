const mongoose = require("mongoose");

const HoursSchema = new mongoose.Schema({
    client:{
        type: mongoose.Types.ObjectId,
        ref:"Client"
    },
    activeMembership:{
        type:mongoose.Types.ObjectId,
        ref:"ActiveMembership"
    },
    duration:{
        type:Number,
        require:true
    }
})

module.exports =  mongoose.model("Hours", HoursSchema);