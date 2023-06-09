const { Decimal128 } = require("mongodb");
const mongoose = require("mongoose")

const PriceRoomSchema = new mongoose.Schema({
    roomID:{
        type: mongoose.Schema.Types.ObjectId,
        ref:"Room",
        require: true
    },
    hour:{
        type:String,
        require:true
    },
    price:{
        type: String,
        require: true
    }

});

module.exports = mongoose.model("PriceRoom", PriceRoomSchema);