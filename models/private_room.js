const mongoose = require("mongoose");

const PrivateRoomShchema = new mongoose.Schema({
    name:{
        type:String,
        require: true
    },
    capacity:{
        type:String,
        require: true
    }
});

module.exports = mongoose.model("PrivateRoom", PrivateRoomShchema);
