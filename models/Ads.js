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
const AdsSchema = new mongoose.Schema({
    ads_type : { type : String, required: true},
    objective : { type : String, required: true},
    visuals : { type : String, default: ""},
    target_audience : { type : String, default: ""},
    ads_copy : { type : String, default: ""},
    cta : { type : String, default: ""},
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

module.exports = mongoose.model("Ads", AdsSchema)