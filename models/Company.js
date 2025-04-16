const mongoose = require("mongoose")

const CompanySchema =  new mongoose.Schema({
    name : { type: String, required : true},
    description : {type: String, default:"" },
    file : { type : String},
    date :{ type: Date, default: Date.now },
})

module.exports = mongoose.model("Company",CompanySchema)