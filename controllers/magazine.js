const { deleteFile } = require("../middleware/upload");
const Magazine = require("../models/Magazine");
const User = require("../models/User");

const AddMagazine = async (req,res) => {
    const { title, description } = req.body
    try{
        if(!title ){
            return res.status(400).json({
                error: 1,
                data : [],
                message: "Title field is required.",
                status : 400
              });
        }

        const user = await User.findById(req.user.id)

        const data = { 
            title : title,
            description : description || "",
            created_by : user,
            last_updated_date : "",
            last_updated_by : null,
            updates_info : null
            
        }

        const  category = req.category
        data["file"] =  req.file ? `/uploads/${category}/${req.file.filename}` : "";
        const newData = new Magazine(data)
        await newData.save()

        res.status(200).json({
            error : 0,
            data : newData,
            message : "Magazine Added successfully!"
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
const UpdateMagazine = async (req,res) => {
    const { id } = req.params; 
    const { title, description } = req.body

    try {
        // Check if the id is provided
        if (!id) {
            return res.status(400).json({
                error: 1,
                data: [],
                message: "Magazine ID is required.",
                status: 400
            });
        }
        const dataExisting = await Magazine.findById(id);

        if (!dataExisting) {
        return res.status(404).json({
            error: 1,
            message: "Magazine not found",
            data: [],
        });
        }

        let updates = []

        const inputValues = { title, description};
        const fieldsToUpdate = ["title", "description"];

        fieldsToUpdate.forEach((key) => {
            const newValue = inputValues[key];
            if (newValue !== undefined && newValue && dataExisting[key] !== newValue) {
                updates.unshift({
                    key: key,
                    current_value: newValue,
                    previous_value: dataExisting[key]
                });
                dataExisting[key] = newValue;
            }
        });

        if(req.file) {
            deleteFile(dataExisting.file, "magazine")
            const  category = req.category
            updates.unshift({
                key : "file",
                current_value :`/uploads/${category}/${req.file.filename}`,
                previous_value : dataExisting.file
            })
            dataExisting["file"] =  req.file ? `/uploads/${category}/${req.file.filename}` : null;
        }

        const user = await User.findById(req.user.id)
        
        if(dataExisting.updates_info && dataExisting.updates_info.length>0){
            dataExisting.updates_info.forEach((e,i)=>{
                const existingDate = e.date.split('T')[0];
                if(existingDate == new Date().toISOString().split('T')[0] ){
                    e.updates.forEach((el,i)=>{
                        const updatesMap = new Map(updates.map(el => [el.key, el]));
                        if (updatesMap.has(el.key)) {
                            e.updates[i] = updatesMap.get(el.key);
                            updates = updates.filter(element=> element.key !=el.key)
                        }
                    })
                    dataExisting.updates_info[i] = {
                        by: user,
                        date: new Date().toISOString(),
                        updates: [...e.updates,...updates]
                    }
                }else{
                    dataExisting.updates_info.unshift({
                        by: user,
                        date: new Date().toISOString(),
                        updates: updates
                    })
                }
             })
        }else{
            dataExisting.updates_info = [{
                by: user,
                date: new Date().toISOString(),
                updates: updates
            }]
        }


        await Magazine.findOneAndUpdate(
            { _id: id },  // Find the document by ID
            {
                title : dataExisting.title,
                description : dataExisting.description,
                created_by : dataExisting.created_by,
                last_updated_date : new Date().toISOString(),
                last_updated_by : user,
                updates_info : dataExisting.updates_info,
                file : dataExisting.file
            },
            { new: true }  // Ensure the updated document is returned
        );

        const data = await Magazine.findById(id).populate("created_by")
        .populate("last_updated_by")   


        
        // Respond with a success message
        res.status(200).json({
            error: 0,
            data: data,
            message: "Magazine updated successfully."
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
const ListMagazines = async (req,res) =>{
    try{
        const data = await Magazine.find().populate("created_by")
        .populate("last_updated_by")

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
const GetOneMagazine = async (req,res) =>{
    const { id } = req.params;
    try{
        const existingData = await Magazine.findById(id).populate("created_by")
        .populate("last_updated_by")

        if (!existingData) {
        return res.status(404).json({
            error: 1,
            message: "Magazine not found",
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
const DeleteMagazine = async(req, res) =>{
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
        const dataExist = await Magazine.findByIdAndDelete(id)

        if (!dataExist) {
            return res.status(404).json({
                error: 1,
                data: [],
                message: "Magazine not found.",
                status: 404
            });
        }

        deleteFile(dataExist.file, "magazine")

        res.status(200).json({
            error: 0,
            data: [],
            message: "Magazine deleted successfully."
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
    AddMagazine ,
    DeleteMagazine ,
    ListMagazines ,
    UpdateMagazine ,
    GetOneMagazine
}