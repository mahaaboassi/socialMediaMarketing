const mongoose = require("mongoose")

const UpdatesInfoSchema = new mongoose.Schema({
    by: {},
    updated_at: Date,
    notes: String
  }, { _id: false });
const MarkedDaysSchema = new mongoose.Schema({
    isSeasonal : {
        type : String,
        enum : ["0","1"],
        default : "0"
    },
    day : {  type : String, required: true},
    month : {  type : String, required: true},
    year : {  type : String, required: true},
    full_date : {  type : String, required: true},
    text_or_reel : {  type : String, required: true},
    caption : {  type : String, required: true},
    foucs : {  type : String, required: true},
    cta : {  type : String, required: true},
    post_type : {
        type: mongoose.Schema.Types.ObjectId,
        ref: "Type", // Reference
        required : true
    },
    file : {  type : String, default: ""},
    created_date : { type: Date, default: Date.now },
    created_by : {
        type: mongoose.Schema.Types.ObjectId,
        ref: "User", // Reference
        required : true
    },
    last_updated_date : { type: Date, default: Date.now },
    last_updated_by : {
        type: mongoose.Schema.Types.ObjectId,
        ref: "User", // Reference
        required : true
    },
    updates_info :{
        type : UpdatesInfoSchema,
        default : []
    }

})