const User = require("../models/User");
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const countriesData = require('../data/countries');

const AddUser = async (req, res) => {
    
    
    const { name, email, role, country_dial, phone_number , password ,birthday} = req.body

    try{
        if (!name || !email || !password || !country_dial || !phone_number) {
            return res.status(400).json({
              error: 1,
              data : [],
              message: "All fields are required.",
              status : 400
            });
          }
        const dataExist = await User.findOne( {email} )
        if(dataExist) return res.status(409).json({
            error: 1,
            data : [],
            message: "This email aleardy exist.",
            status : 409
          });

        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        if (!emailRegex.test(email)) {
            return res.status(400).json({
                error: 1,
                data: [],
                message: "Please provide a valid email address.",
                status: 400
            });
        }

        if (password.length < 6) {
            return res.status(400).json({
                error: 1,
                data: [],
                message: "Password must be at least 6 characters long.",
                status: 400
            });
        }

        const phoneRegex = /^\d{10,15}$/;  
        if (!phoneRegex.test(phone_number)) {
            return res.status(400).json({
                error: 1,
                data: [],
                message: "Please provide a valid phone number.",
                status: 400
            });
        }

        const countryCodeRegex = /^\+\d{1,4}$/;  
        if (!countryCodeRegex.test(country_dial)) {
            return res.status(400).json({
                error: 1,
                data: [],
                message: "Please provide a valid country code.",
                status: 400
            });
        }

        const hashedPassword = await bcrypt.hash(password, 10);
        const data = {name, email ,password : hashedPassword  , country_dial, phone_number}
        const country = countriesData.find(e=> e.dial_code == country_dial)
        
        
        if(country){
            data["country_name"] =  country.name,
            data["country_code"] =  country.code
        }else{
            return res.status(400).json({
                error: 1,
                data: [],
                message: "Invalid country code.",
                status: 400
            });
        }
        
        if(birthday)  data["birthday"] = birthday
        if(role && ['admin', "developer", 'client'].includes(role)) data["role"] = role
        const user = new User(data);
        await user.save();
        res.status(200).json({
            error : 0,
            data : {  
                id: user._id,
                email : user.email ,
                name : user.name ,
                role : user.role,
                birthday : user.birthday,
                active : user.active,
                country : {
                    country_code : user.country_code,
                    phone_number : user.phone_number, 
                    country_dial : user.country_dial,
                    country_name : user.country_name
                },
                file :user.file || ""
            },
            message : "User Added successfully!"
        });
    }catch(err){
        console.error(err);
        res.status(500).json({
            error : 1,
            data : [],
            message : "Server error." 
        });
    }

}
const SignIn = async (req, res) => {
    const {email ,password } = req.body
    try{
        const user = await User.findOne({ email });
        if (!user) {
          return res.status(404).json({
            error : 1,
            data : [],
            message: "User not found."
        });
        }
        const isPasswordValid = await bcrypt.compare(password, user.password);
        if (!isPasswordValid) {
            return res.status(400).json({
              error : 1,
              data : [],
              message: "Invalid credentials."
          });   
          }
        const token = jwt.sign({ id: user._id , role : user.role}, process.env.JWT_SECRET, {
        expiresIn: "1h",
        });

        res.status(200).json({
            error : 0,
            data : { token, 
                id: user._id ,
                email : user.email ,
                name : user.name ,
                role : user.role,
                birthday : user.birthday,
                country : {
                    country_code : user.country_code,
                    phone_number : user.phone_number, 
                    country_dial : user.country_dial,
                    country_name : user.country_name
                },
                file : user.file
                
            },
            message : "User signIn successfully!"
        });
    }catch(err){
        console.error(err);
        res.status(500).json({
            error : 1,
            data : [],
            message : "Server error." 
        });
    }

}

module.exports = { SignIn, AddUser}