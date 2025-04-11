const express = require("express")
const { upload , setCategory} = require("../middleware/upload")
const platformRouter = express.Router()

// Controller Files
const { AddUser } = require("../controllers/user")
const { AddComapny, DeleteCompany } = require("../controllers/company")

// Apis

// Comapany
platformRouter.post("/company/add", setCategory("company") ,upload.single("file"), AddComapny)
platformRouter.delete("/company/:id", DeleteCompany)


// User
platformRouter.post("/user/add",  AddUser)


// Marked Days
platformRouter.post("/markedDay",()=>{})


// Advertisements
platformRouter.post("/ads",()=>{})

// Magazine
platformRouter.post("/magazine",()=>{})

// Videos
platformRouter.post("/video",()=>{})

// Events
platformRouter.post("/event",()=>{})

module.exports = { platformRouter}