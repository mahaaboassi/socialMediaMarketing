const express = require("express")
const { upload , setCategory} = require("../middleware/upload")
const platformRouter = express.Router()

// Controller Files
const { AddUser, ListUsers, GetOneUser, DeleteUser, UpdateUser } = require("../controllers/user")
const { AddComapny, DeleteCompany, ListCompanies, GetOneCompany, UpdateComapny } = require("../controllers/company")
const { authenticate, authorizeAdmin, authorizeDeveloper, authorizeClient } = require("../middleware/auth")

// Apis

// ******** Comapany **********
// For Admin
platformRouter.post("/company/add", authenticate, authorizeAdmin, setCategory("company"), upload.single("file"), AddComapny)
platformRouter.delete("/company/:id", authenticate, authorizeAdmin, DeleteCompany)
platformRouter.put("/company/:id", authenticate, authorizeAdmin, setCategory("company"), upload.single("file"), UpdateComapny)
// for admin and developer roles
platformRouter.get("/company",authenticate, authorizeClient, ListCompanies)
platformRouter.get("/company/getOne/:id", authenticate, authorizeClient, GetOneCompany)
platformRouter.get("/company/getOne", authenticate, authorizeClient, (req, res) => {
    res.status(400).json({ error: 1, data:[], message: "Please provide a company ID." });
  });

// ******** User *************
// For Admin
platformRouter.post("/user/add", authenticate, authorizeAdmin, setCategory("user"), upload.single("file"), AddUser)
platformRouter.get("/user", authenticate, authorizeAdmin, ListUsers)
platformRouter.delete("/user/:id", authenticate, authorizeAdmin, DeleteUser)
platformRouter.put("/user/:id", authenticate, authorizeAdmin, setCategory("user"), upload.single("file"), UpdateUser)
platformRouter.get("/user/getOne/:id", authenticate, authorizeAdmin, GetOneUser)
platformRouter.get("/user/getOne", authenticate, authorizeAdmin, (req, res) => {
    res.status(400).json({ error: 1, data:[], message: "Please provide a user ID." });
  });

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