const mongoose = require("mongoose")

const TypeSchema = new mongoose.Schema({
    name :{
        type : String,
        required : true,
    },
    description :{
        type : String,
        required : true,
    },
    file :{
        type : String, 
        default : ""
    }
})

module.exports = mongoose.model("Type", TypeSchema)