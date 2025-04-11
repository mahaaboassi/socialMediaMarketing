// const mongoose = require("mongoose");

// const UserSchema = new mongoose.Schema({
//   name: String,
//   email: String,
//   company: {
//     type: mongoose.Schema.Types.ObjectId,
//     ref: "Company", // Reference
//     required: true
//   }
// });

// module.exports = mongoose.model("User", UserSchema);
// --------------------

// const User = require("../models/User");

// const AddUser = async (req, res) => {
//   const { name, email, company } = req.body;

//   if (!name || !email || !company) {
//     return res.status(400).json({ message: "All fields are required" });
//   }

//   try {
//     const newUser = new User({ name, email, company });
//     await newUser.save();

//     res.status(201).json({ message: "User added successfully", data: newUser });
//   } catch (err) {
//     console.error(err);
//     res.status(500).json({ message: "Server error" });
//   }
// }
// --------------------------
// const User = require("../models/User");

// const ViewUsers = async (req, res) => {
//   try {
//     const users = await User.find().populate("company"); // this fetches full company data

//     res.status(200).json({ data: users });
//   } catch (err) {
//     console.error(err);
//     res.status(500).json({ message: "Server error" });
//   }
// };
// ------------------
