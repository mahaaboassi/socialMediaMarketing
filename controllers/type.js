const { deleteFile } = require("../middleware/upload");
const Type = require("../models/Type");


const AddType = async (req,res) => {
    const { name, description } = req.body
    try{
        if(!name ){
            return res.status(400).json({
                error: 1,
                data : [],
                message: "Name field is required.",
                status : 400
              });
        }
        const data = { 
            name : name ,
            description : description || ""
        }

        const  category = req.category
        data["file"] =  req.file ? `/uploads/${category}/${req.file.filename}` : null;
        const type = new Type(data)
        await type.save()

        res.status(200).json({
            error : 0,
            data : {  
                id: type._id,
                name : type.name ,
                description : type.description ,
                file : type.file || ""
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
const UpdateType = async (req,res) => {
    const { id } = req.params; 
    const { name, description  } = req.body

    try {
        // Check if the id is provided
        if (!id) {
            return res.status(400).json({
                error: 1,
                data: [],
                message: "Type ID is required.",
                status: 400
            });
        }
        const dataExisting = await Type.findById(id);

        if (!dataExisting) {
        return res.status(404).json({
            error: 1,
            message: "Type not found",
            data: [],
        });
        }
        if (req.file) {
            deleteFile(dataExisting.file, "type")
            const  category = req.category
            dataExisting["file"] =  req.file ? `/uploads/${category}/${req.file.filename}` : null;
        }
        const dataToUpdate = await Type.findOneAndUpdate(
            { _id: id },  
            {
                name : name || dataExisting.name ,
                description :  description || dataExisting.description ,
                file : dataExisting.file
            },
            { new: true }  
        );
        

       


        
        // Respond with a success message
        res.status(200).json({
            error: 0,
            data: { id : dataToUpdate._id , 
                name : dataToUpdate.name,
                description : dataToUpdate.description ,
                file : dataToUpdate.file
           },
            message: "Type updated successfully."
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
const ListTypes = async (req,res) =>{
    try{
        const data = await Type.find()

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
const GetOneType = async (req,res) =>{
    const { id } = req.params;
    try{
        const existingData = await Type.findById(id);

        if (!existingData) {
        return res.status(404).json({
            error: 1,
            message: "Type not found",
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
const DeleteType = async(req, res) =>{
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

        const dataExist = await Type.findByIdAndDelete(id)

        if (!dataExist) {
            return res.status(404).json({
                error: 1,
                data: [],
                message: "Type not found.",
                status: 404
            });
        }
        deleteFile(dataExist.file, "type")
        res.status(200).json({
            error: 0,
            data: [],
            message: "Type deleted successfully."
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
        AddType ,
        DeleteType ,
        ListTypes ,
        UpdateType ,
        GetOneType

    }