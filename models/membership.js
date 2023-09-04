const { Decimal128 } = require("mongodb");
const mongoose = require("mongoose")

const MembershipSchema = new mongoose.Schema({
    name:{
        type:String,
        require: true
    },
    roomID:{
        type: mongoose.Schema.Types.ObjectId,
        ref:"Room",
        require: true
    },
    price:{
        type:String,
        require: true
    },
    type:{
        type:String,
        require: true
    },
    hours:{
        type:String,
        require: true
    },

});

module.exports = mongoose.model("Membership", MembershipSchema);