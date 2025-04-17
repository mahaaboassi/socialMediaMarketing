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
const EventSchema = new mongoose.Schema({
    title : { type : String, required: true},
    description : { type : String, default: ""},
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

module.exports = mongoose.model("Event", EventSchema)