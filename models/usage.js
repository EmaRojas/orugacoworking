const mongoose = require("mongoose")

const UsageSchema = new mongoose.Schema({
    membershipByUserID:{
        type: mongoose.Schema.Types.ObjectId,
        ref:"MembershipByUser",
        require: true
    },
    hour:{
        type:String,
        require:true
    },
    date:{
        type: mongoose.Schema.Types.Date,
        require: true
    },
    company_name:{
        type: String,
    },

});

module.exports = mongoose.model("Usage", UsageSchema);