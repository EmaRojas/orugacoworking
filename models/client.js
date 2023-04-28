const mongoose = require("mongoose")

const ClientSchema = new mongoose.Schema({
    name:{
        type:String,
        require: true
    }
});

module.exports = mongoose.model("Client", ClientSchema);