const mongoose = require("mongoose")

const ClientSchema = new mongoose.Schema({
    full_name:{
        type:String,
        require: true
    },
    phone:{
        type:String,
        require:true
    },
    email:{
        type:String,
        require:true
    },
    company_name:{
        type:String,
        require:true
    },
    cuit:{
        type:String,
        require:true
    },    
    assistance:{
        type:String,
        require:true
    }

});

module.exports = mongoose.model("Client", ClientSchema);