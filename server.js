const express = require("express")
const cors = require("cors")
const bodyParser = require("body-parser")
require("dotenv").config()
const connectDB = require("./config/db")
// Routers
const { authRouter } = require("./routers/auth")
const { platformRouter } = require("./routers/platform")
const { extraRouter } = require("./routers/extra")


const app = express()
const PORT = process.env.PORT || 5000;

// Middleware
app.use(cors())
app.use(express.json());
app.use(express.urlencoded({ extended: true })); // to send data from frontend as form data
app.use(bodyParser.urlencoded({
    extended: true
  }));
app.use(bodyParser.json());

// Connect DB
connectDB()

// Routes
app.use("/api/auth", authRouter)
app.use("/api", platformRouter)
app.use("/api/extra", extraRouter)


app.get("/",(req,res)=>{
    res.status(200).json({
        error: 0,
        data : [],
        message: "Welcome to our social media platform backend side.",
        status : 200
      })
})
app.use('/uploads', express.static('uploads'));
// Start the server
app.listen(PORT, () => {
    console.log(`Server is running on port ${PORT}`);
  });