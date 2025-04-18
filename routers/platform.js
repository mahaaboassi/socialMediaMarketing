const express = require("express")
const { upload , setCategory} = require("../middleware/upload")
const platformRouter = express.Router()

// Controller Files
const { AddUser, ListUsers, GetOneUser, DeleteUser, UpdateUser } = require("../controllers/user")
const { AddComapny, DeleteCompany, ListCompanies, GetOneCompany, UpdateComapny } = require("../controllers/company")
const { authenticate, authorizeAdmin, authorizeDeveloper, authorizePreventClient, authorizePreventDeveloper } = require("../middleware/auth")
const { AddType, ListTypes, DeleteType, UpdateType, GetOneType } = require("../controllers/type")
const { AddDay, ListDays, DeleteDay, UpdateDay, GetOneDay } = require("../controllers/markedDays")
const { AddAds, DeleteAds, UpdateAds, ListAds, GetOneAds } = require("../controllers/ads")
const { AddMagazine, DeleteMagazine, UpdateMagazine, ListMagazines, GetOneMagazine } = require("../controllers/magazine")
const { AddEvent, DeleteEvent, UpdateEvent, ListEvents, GetOneEvent } = require("../controllers/event")

// Apis

// ******** Comapany **********
// For Admin
platformRouter.post("/company/add", authenticate, authorizeAdmin, setCategory("company"), upload.single("file"), AddComapny)
platformRouter.delete("/company/:id", authenticate, authorizeAdmin, DeleteCompany)
platformRouter.put("/company/:id", authenticate, authorizeAdmin, setCategory("company"), upload.single("file"), UpdateComapny)
// for admin and developer roles
platformRouter.get("/company",authenticate, authorizePreventClient, ListCompanies)
platformRouter.get("/company/getOne/:id", authenticate, authorizePreventClient, GetOneCompany)
platformRouter.get("/company/getOne", authenticate, authorizePreventClient, (req, res) => {
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

// ******** Type *************
// For Admin
platformRouter.post("/type/add", authenticate, authorizeAdmin, setCategory("type"), upload.single("file"), AddType)
platformRouter.get("/type", authenticate, authorizeAdmin, ListTypes)
platformRouter.delete("/type/:id", authenticate, authorizeAdmin, DeleteType)
platformRouter.put("/type/:id", authenticate, authorizeAdmin, setCategory("type"), upload.single("file"), UpdateType)
platformRouter.get("/type/getOne/:id", authenticate, authorizeAdmin, GetOneType)
platformRouter.get("/type/getOne", authenticate, authorizeAdmin, (req, res) => {
    res.status(400).json({ error: 1, data:[], message: "Please provide a type ID." });
  });

// ******** Marked Days *************
// For Admin & Client
platformRouter.post("/markedDay/add", authenticate, authorizePreventDeveloper, setCategory("markedDays"), upload.single("file"), AddDay)
platformRouter.delete("/markedDay/:id", authenticate, authorizeAdmin, DeleteDay)
platformRouter.put("/markedDay/:id", authenticate, authorizePreventDeveloper, setCategory("markedDays"), upload.single("file"), UpdateDay)
// For Admin & Client & Developer
platformRouter.get("/markedDay", authenticate, ListDays)
platformRouter.get("/markedDay/getOne/:id", authenticate, GetOneDay)
platformRouter.get("/markedDay/getOne", authenticate, (req, res) => {
    res.status(400).json({ error: 1, data:[], message: "Please provide a Marked Day ID." });
  });


// ******** Advertisements *************
// For Admin & Client
platformRouter.post("/ads/add", authenticate, authorizePreventDeveloper, setCategory("ads"), upload.single("file"), AddAds)
platformRouter.delete("/ads/:id", authenticate, authorizeAdmin, DeleteAds)
platformRouter.put("/ads/:id", authenticate, authorizePreventDeveloper, setCategory("ads"), upload.single("file"), UpdateAds)
// For Admin & Client & Developer
platformRouter.get("/ads", authenticate, ListAds)
platformRouter.get("/ads/getOne/:id", authenticate, GetOneAds)
platformRouter.get("/ads/getOne", authenticate, (req, res) => {
    res.status(400).json({ error: 1, data:[], message: "Please provide a Ads ID." });
  });


// ******** Magazine *************
// For Admin & Client
platformRouter.post("/magazine/add", authenticate, authorizePreventDeveloper, setCategory("magazine"), upload.single("file"), AddMagazine)
platformRouter.delete("/magazine/:id", authenticate, authorizeAdmin, DeleteMagazine)
platformRouter.put("/magazine/:id", authenticate, authorizePreventDeveloper, setCategory("magazine"), upload.single("file"), UpdateMagazine)
// For Admin & Client & Developer
platformRouter.get("/magazine", authenticate, ListMagazines)
platformRouter.get("/magazine/getOne/:id", authenticate, GetOneMagazine)
platformRouter.get("/magazine/getOne", authenticate, (req, res) => {
    res.status(400).json({ error: 1, data:[], message: "Please provide a Magazine ID." });
  });

// Videos
platformRouter.post("/video",()=>{})


// ******** Events *************
// For Admin & Client
platformRouter.post("/event/add", authenticate, authorizePreventDeveloper, setCategory("event"), upload.single("file"), AddEvent)
platformRouter.delete("/event/:id", authenticate, authorizeAdmin, DeleteEvent)
platformRouter.put("/event/:id", authenticate, authorizePreventDeveloper, setCategory("event"), upload.single("file"), UpdateEvent)
// For Admin & Client & Developer
platformRouter.get("/event", authenticate, ListEvents)
platformRouter.get("/event/getOne/:id", authenticate, GetOneEvent)
platformRouter.get("/event/getOne", authenticate, (req, res) => {
    res.status(400).json({ error: 1, data:[], message: "Please provide a Event ID." });
  });



module.exports = { platformRouter}