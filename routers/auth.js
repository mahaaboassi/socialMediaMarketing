const express = require("express")
const authRouter = express.Router()
// Controller Files
const { SignIn } = require("../controllers/user")

// Apis
authRouter.post("/signIn",SignIn)
authRouter.post("/logout",()=>{})
authRouter.post("/check",()=>{})
authRouter.delete("/delete/:id",()=>{})

module.exports = { authRouter}