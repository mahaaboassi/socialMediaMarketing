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


module.exports = { AddComapny ,DeleteCompany}