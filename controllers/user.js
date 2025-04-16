const User = require("../models/User");
const Company = require("../models/Company");

const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const countriesData = require('../data/countries');
const AddUser = async (req, res) => {

    const { name, email, role, country_dial, phone_number, company, password, birthday} = req.body

    try{
        if ( !name || !email || !password || !country_dial || !phone_number ) {
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
        if(data.role == "client"){
            const companyValue = await Company.findById(company)
            if(!companyValue) return res.status(400).json({
                error: 1,
                data: [],
                message: "The company Field is required.",
                status: 400
            });
            data.company = company
        }
        const  category = req.category
        data["file"] =  req.file ? `/uploads/${category}/${req.file.filename}` : null;
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
                company : user.company,
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
const UpdateUser = async (req,res) =>{
    const { id } = req.params
    const { name, role, country_dial, phone_number, company, password, birthday, active} = req.body

    try{

        if (!id) {
            return res.status(400).json({
                error: 1,
                data: [],
                message: "User ID is required.",
                status: 400
            });
        }
        const dataExisting = await User.findById(id);

        if (!dataExisting) {
            return res.status(404).json({
                error: 1,
                message: "User not found",
                data: [],
            });
        }
        
          
        if(password && password.length < 6) {
            return res.status(400).json({
                error: 1,
                data: [],
                message: "Password must be at least 6 characters long.",
                status: 400
            });
        }
        let hashedPassword = dataExisting.password
        if(password){
            hashedPassword = await bcrypt.hash(password, 10);
        }
        const phoneRegex = /^\d{10,15}$/;  
        if (phone_number && !phoneRegex.test(phone_number)) {
            return res.status(400).json({
                error: 1,
                data: [],
                message: "Please provide a valid phone number.",
                status: 400
            });
        }

        const countryCodeRegex = /^\+\d{1,4}$/;  
        if (country_dial && !countryCodeRegex.test(country_dial)) {
            return res.status(400).json({
                error: 1,
                data: [],
                message: "Please provide a valid country code.",
                status: 400
            });
        }
        
        

        let country = {} 
        if(country_dial){
            country = countriesData.find(e=> e.dial_code == country_dial)
            if(!country){
                return res.status(400).json({
                    error: 1,
                    data: [],
                    message: "Invalid country code.",
                    status: 400
                });
            }
        }

        let roleValue = dataExisting.role
        let companyId = dataExisting.company
        if(role && ['admin', "developer", 'client'].includes(role)){
            roleValue = role
            if(role == "client"){
                companyId = await Company.findById(company)
                if(!companyId) return res.status(400).json({
                    error: 1,
                    data: [],
                    message: "The company Field is required.",
                    status: 400
                });
                companyId = company
            }else{
                companyId = null
            }
        }

        if (req.file) {
            deleteFile(dataExisting.file, "user"); // delete old file
            const category = req.category || "user";
            dataExisting.file = `/uploads/${category}/${req.file.filename}`;
    
        }
        let activeValue =  dataExisting.active
        if(active && ["1", '0'].includes(active)) activeValue = active
        const dataToUpdate = await User.findOneAndUpdate(
            { _id: id },  
            {
                name : name || dataExisting.name ,
                password :  hashedPassword ,
                country_dial : country_dial || dataExisting.country_dial,
                phone_number : phone_number || dataExisting.phone_number,
                birthday: birthday || dataExisting.birthday,
                country_name : country.name || dataExisting.country_name,
                country_code : country.code || dataExisting.country_code,
                active : activeValue,
                role : roleValue ,
                company : companyId ,
                file: dataExisting.file,
                email : dataExisting.email
            },
            { new: true }  // Ensure the updated document is returned
        );

        const populatedUser = await User.findById(dataToUpdate._id).populate("company");

        res.status(200).json({
            error : 0,
            data : {  
                id: dataToUpdate._id,
                email : dataToUpdate.email ,
                name : dataToUpdate.name ,
                role : dataToUpdate.role,
                birthday : dataToUpdate.birthday,
                company : populatedUser.company,
                active : dataToUpdate.active ,
                country : {
                    country_code : dataToUpdate.country_code,
                    phone_number : dataToUpdate.phone_number, 
                    country_dial : dataToUpdate.country_dial,
                    country_name : dataToUpdate.country_name
                },
                file :dataToUpdate.file || ""
            },
            message : "User updated successfully!"
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
const ListUsers = async (req,res) =>{
    try{
        const data = await User.find().populate("company")

        if (!data || data.data === 0) {
            return res.status(404).json({
                error: 1,
                data: [],
                message: "No data found.",
                status: 404
            });
        }
        res.status(200).json({
            error: 0,
            data: data,
            message: "Data fetched successfully.",

        });
    }catch (err){
        console.log(err);
        res.status(500).json({
            error : 1,
            data : [],
            message : "Server error."  
        })      
    }
}

const GetOneUser = async (req,res) => {
    const { id } = req.params
    try{
        const existingData = await User.findById(id).populate("company");

        if (!existingData) {
        return res.status(404).json({
            error: 1,
            message: "User not found",
            data: [],
        });
        }
        res.status(200).json({
            error: 0,
            data: existingData,
            message: "Data fetched successfully.",

        });

    }catch (err){
        console.log(err);
        res.status(500).json({
            error : 1,
            data : [],
            message : "Server error."  
        })      
    }
}
const DeleteUser = async(req, res) =>{
    const { id } = req.params
    try{
        if(!id){
            return res.status(400).json({
                error: 1,
                data: [],
                message: "ID is required.",
                status: 400
            });
        }
        const dataExist = await User.findByIdAndDelete(id)
        if (!dataExist) {
            return res.status(404).json({
                error: 1,
                data: [],
                message: "User not found.",
                status: 404
            });
        }
        res.status(200).json({
            error: 0,
            data: [],
            message: "User deleted successfully."
        });
    }catch(err) {
        console.error(err);
        res.status(500).json({
            error: 1,
            data: [],
            message: "Server error."
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
                company : user.company,
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

module.exports = { 
    SignIn,
    AddUser,
    ListUsers,
    GetOneUser,
    DeleteUser,
    UpdateUser
}