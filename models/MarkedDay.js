const mongoose = require("mongoose")

const UpdatesSchema = new mongoose.Schema({
    key : { type : String, default:"" },
    current_value : { type : String , default:"" },
    previous_value : { type : String, default:"" },
})
const UpdatesInfoSchema = new mongoose.Schema({
    by: { type : mongoose.Schema.Types.ObjectId ,ref : "User"},
    date : { type :String , default:"" },
    updates: {
        type : [UpdatesSchema],
        default : []
    }
  }, { _id: false });
const MarkedDaysSchema = new mongoose.Schema({
    is_seasonal : {
        type : String,
        enum : ["0","1"],
        default : "0"
    },
    day : { type : String, required: true},
    month : { type : String, required: true},
    year : { type : String, required: true},
    full_date : { type : String, required: true},
    text_or_reel : { type : String, required: true},
    caption : { type : String, required: true},
    focus : { type : String, default:""},
    cta : { type : String, default:""},
    post_type : {
        type: mongoose.Schema.Types.ObjectId,
        ref: "Type", // Reference
        required : true
    },
    file : { type : String, default: ""} ,
    created_date : { type: Date, default: Date.now },
    created_by : {
        type: mongoose.Schema.Types.ObjectId,
        ref: "User", // Reference
        required : true
    },
    last_updated_date : { type: String, default: ""},
    last_updated_by : {
        type: mongoose.Schema.Types.ObjectId,
        ref: "User", // Reference
    },
    updates_info :{ // this like history inside marked days
        type : [UpdatesInfoSchema],
        default : []
    }

})

module.exports = mongoose.model("MarkedDays", MarkedDaysSchema)