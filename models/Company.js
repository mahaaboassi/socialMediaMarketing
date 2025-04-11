const mongoose = require("mongoose")

const CompanySchema =  new mongoose.Schema({
    name : { type: String, required : true},
    description : {type: String, required : true},
    file : { type : String}
})

module.exports = mongoose.model("Company",CompanySchema)