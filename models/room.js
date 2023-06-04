const mongoose = require("mongoose")

const RoomSchema = new mongoose.Schema({
    name:{
        type:String,
        require: true
    },
    capacity:{
        type:String,
    }

});

module.exports = mongoose.model("Room", RoomSchema);