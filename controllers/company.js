const { deleteFile } = require("../middleware/upload");
const Company = require("../models/Company");


const AddComapny = async (req,res) => {
    const { name, description } = req.body
    try{
        if(!name ){
            return res.status(400).json({
                error: 1,
                data : [],
                message: "All fields are required.",
                status : 400
              });
        }
        const data = { 
            name : name ,
            description : description || ""
        }
        if(!req.file) return res.status(400).json({
            error: 1,
            data : [],
            message: "File field is required.",
            status : 400
          });
        const  category = req.category
        data["file"] =  req.file ? `/uploads/${category}/${req.file.filename}` : null;
        const company = new Company(data)
        await company.save()

        res.status(200).json({
            error : 0,
            data : {  
                id: company._id,
                name : company.name ,
                description : description.description ,
                file :company.file || ""
            },
            message : "company Added successfully!"
        });
        
        
        
          

    } catch(err) {
        console.log(err);
        res.status(500).json({
            error : 1,
            data : [],
            message : "Server error."  
        })
        
    }
}
const UpdateComapny = async (req,res) => {
    const { id } = req.params; 
    const { name, description  } = req.body

    try {
        // Check if the id is provided
        if (!id) {
            return res.status(400).json({
                error: 1,
                data: [],
                message: "Company ID is required.",
                status: 400
            });
        }
        const dataExisting = await Company.findById(id);

        if (!dataExisting) {
        return res.status(404).json({
            error: 1,
            message: "Company not found",
            data: [],
        });
        }

        // Find and delete the feature by id
        const dataToUpdate = await Company.findOneAndUpdate(
            { _id: id },  // Find the document by ID
            {
                name : name || dataExisting.name ,
                description :  description || dataExisting.description ,
            },
            { new: true }  // Ensure the updated document is returned
        );

        if (req.file) {
            deleteFile(dataToUpdate.file, "company")
            const  category = req.category
            dataToUpdate["file"] =  req.file ? `/uploads/${category}/${req.file.filename}` : null;
        }


        
        // Respond with a success message
        res.status(200).json({
            error: 0,
            data: { id : dataToUpdate._id , 
                name : dataToUpdate.name,
                description : dataToUpdate.description ,
                file : dataToUpdate.file
           },
            message: "Company updated successfully."
        });
        
    } catch (error) {

        // Handle other errors
        console.error(error);
        res.status(500).json({
            error: 1,
            data: [],
            message: "Server error."
        });
    }
}
const ListCompanies = async (req,res) =>{
    try{
        const data = await Company.find()

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
const GetOneCompany = async (req,res) =>{
    const { id } = req.params;
    try{
        const existingData = await Company.findById(id);

        if (!existingData) {
        return res.status(404).json({
            error: 1,
            message: "Company not found",
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
const DeleteCompany = async(req, res) =>{
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
        const dataExist = await Company.findByIdAndDelete(id)
        if (!dataExist) {
            return res.status(404).json({
                error: 1,
                data: [],
                message: "Comapny not found.",
                status: 404
            });
        }
        deleteFile(dataExist.file, "company")
        res.status(200).json({
            error: 0,
            data: [],
            message: "Company deleted successfully."
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


module.exports = {
         AddComapny ,
        DeleteCompany ,
        ListCompanies ,
        UpdateComapny ,
        GetOneCompany

    }