const mongoose = require("mongoose")

const UserSchema = new mongoose.Schema({
    name : { 
        type: String, 
        required: [true, 'Name is required'],
        minlength: [3, 'Name must be at least 3 characters long'],
        maxlength: [50, 'Name must be less than 50 characters long']
    },
    email :{
        type: String,
        required: [true, 'Email is required'],
        unique: true, 
        match: [/.+\@.+\..+/, 'Please enter a valid email address'],
    },
    password : {type: String, required: true },
    role : {
        type: String,
        enum: ['admin', "developer" ,'client'], 
        default: 'client'
    },
    country_code : {
        type: String, 
        required: true,
        match: [/^[A-Z]{2}$/, 'Please provide a valid 2-letter country code'], 
    },
    country_name : {
        type: String,  
        required: true,
    },
    country_dial : {
        type: String, 
        required: true, 
        match: [/^\+\d{1,4}$/, 'Please provide a valid country code'],
    },
    phone_number : {
        type: String, 
        required: true, 
        match: [/^\d{10,15}$/, 'Please provide a valid phone number'], 
    },
    birthday :{ type :String },
    active : {type: String, enum : ["0","1"], default : "1" },
    file : {type: String, },
    date: { type: Date, default: Date.now },
})

module.exports = mongoose.model("User",UserSchema)