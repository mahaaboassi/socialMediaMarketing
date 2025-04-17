const { deleteFile } = require("../middleware/upload");
const Company = require("../models/Company");
const MarkedDay = require("../models/MarkedDay");
const Type = require("../models/Type");
const User = require("../models/User");

const AddDay = async (req,res) => {
    const { is_seasonal, day, month, text_or_reel ,caption, focus, cta, post_type  } = req.body
    try{
        if(!day || !month   ){
            return res.status(400).json({
                error: 1,
                data : [],
                message: "Date field is required.",
                status : 400
              });
        }
        if(!text_or_reel || !caption  ){
            return res.status(400).json({
                error: 1,
                data : [],
                message: "Caption & Text Or Reel fields are required.",
                status : 400
              });
        }
        const dayTest = /^(0?[1-9]|[12][0-9]|3[01])$/ // Matches 01–31
        const monthTest = /^(0?[1-9]|1[0-2])$/ // Matches 01–12
        const date = new Date() 
        if(!dayTest.test(day)){
            return res.status(400).json({
                error: 1,
                data : [],
                message: "Day field is invalid.",
                status : 400
              });
        }
        if(!monthTest.test(month)){
            return res.status(400).json({
                error: 1,
                data : [],
                message: "Month field is invalid.",
                status : 400
              });

        }
        if(!post_type ){
            return res.status(400).json({
                error: 1,
                data : [],
                message: "Post Type field is invalid.",
                status : 400
              });

        }
        const typeExist = await Type.findById(post_type)
        if(!typeExist){
            return res.status(400).json({
                error: 1,
                data : [],
                message: "Post Type not found",
                status : 400
              }); 
        }
        if(is_seasonal && !["0","1"].includes(is_seasonal)){
            return res.status(400).json({
                error: 1,
                data : [],
                message: "Is Seasonal field is invalid",
                status : 400
              }); 
        }

        
        const user = await User.findById(req.user.id)

        const data = { 
            is_seasonal : ["0","1"].includes(is_seasonal) ? is_seasonal : "0" ,
            day : day,
            month : month,
            year : JSON.stringify(date.getFullYear()),
            full_date : `${day}-${month}-${date.getFullYear()}`,
            text_or_reel : text_or_reel,
            caption : caption,
            focus : focus || "",
            cta : cta || "",
            post_type : typeExist,
            created_by : user,
            last_updated_date : "",
            last_updated_by : null,
            updates_info : null
            
        }

        const  category = req.category
        data["file"] =  req.file ? `/uploads/${category}/${req.file.filename}` : "";
        const dayData = new MarkedDay(data)
        await dayData.save()

        res.status(200).json({
            error : 0,
            data : dayData,
            message : "Marked Day Added successfully!"
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
const UpdateDay = async (req,res) => {
    const { id } = req.params; 
    const { is_seasonal, day, month, text_or_reel ,caption, focus, cta, post_type  } = req.body

    try {
        // Check if the id is provided
        if (!id) {
            return res.status(400).json({
                error: 1,
                data: [],
                message: "Marked Day ID is required.",
                status: 400
            });
        }
        const dataExisting = await MarkedDay.findById(id);

        if (!dataExisting) {
        return res.status(404).json({
            error: 1,
            message: "Marked Day not found",
            data: [],
        });
        }

        let updates = []
        if(is_seasonal && ["0","1"].includes(is_seasonal)){
            updates.unshift({
                key : "is_seasonal",
                current_value : is_seasonal,
                previous_value : dataExisting.is_seasonal
            })
        }
        const dayTest = /^(0?[1-9]|[12][0-9]|3[01])$/ // Matches 01–31
        const monthTest = /^(0?[1-9]|1[0-2])$/ // Matches 01–12
        if(day && dayTest.test(day)){
            updates.unshift({
                key : "day",
                current_value : day,
                previous_value : dataExisting.day
            })
            dataExisting.day = day
        }
        if(month && monthTest.test(month)){
            updates.unshift({
                key : "month",
                current_value : month,
                previous_value : dataExisting.month
            })
            dataExisting.month = month
        }
        if(text_or_reel ){
            updates.unshift({
                key : "text_or_reel",
                current_value : text_or_reel,
                previous_value : dataExisting.text_or_reel
            })
            dataExisting.text_or_reel = text_or_reel
        }
        if(caption ){
            updates.unshift({
                key : "caption",
                current_value : caption,
                previous_value : dataExisting.caption
            })
            dataExisting.caption = caption
        }
        if(focus){
            updates.unshift({
                key : "focus",
                current_value : focus,
                previous_value : dataExisting.focus
            })
            dataExisting.focus = focus
        }
        if(cta ){
            updates.unshift({
                key : "cta",
                current_value : cta,
                previous_value : dataExisting.cta
            })
            dataExisting.caption = cta
        }
        if(req.file) {
            deleteFile(dataExisting.file, "markedDays")
            const  category = req.category
            updates.unshift({
                key : "file",
                current_value :`/uploads/${category}/${req.file.filename}`,
                previous_value : dataExisting.file
            })
            dataExisting["file"] =  req.file ? `/uploads/${category}/${req.file.filename}` : null;
        }
        if(post_type){
            const typeExist = await Type.findById(post_type)
            if(!typeExist){
                return res.status(400).json({
                    error: 1,
                    data : [],
                    message: "Post Type not found",
                    status : 400
                  }); 
            }
            updates.unshift({
                key : "post_type",
                current_value : post_type,
                previous_value : dataExisting.post_type
            })
            dataExisting.post_type = post_type
        }
        const user = await User.findById(req.user.id)
        
        if(dataExisting.updates_info && dataExisting.updates_info.length>0){
            dataExisting.updates_info.forEach((e,i)=>{
                const existingDate = e.date.split('T')[0];
                if(existingDate == new Date().toISOString().split('T')[0] ){
                    dataExisting.updates_info[i] = {
                        by: user,
                        date: new Date().toISOString(),
                        updates: updates
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


        const dataToUpdate = await MarkedDay.findOneAndUpdate(
            { _id: id },  // Find the document by ID
            {
                is_seasonal : ["0","1"].includes(is_seasonal) ? is_seasonal : dataExisting.is_seasonal ,
                day : dataExisting.day,
                month : dataExisting.month,
                year : dataExisting.year,
                full_date : `${dataExisting.day}-${dataExisting.month}-${dataExisting.year}`,
                text_or_reel : dataExisting.text_or_reel,
                caption : dataExisting.caption,
                focus : dataExisting.focus,
                cta : dataExisting.cta,
                post_type : dataExisting.post_type,
                created_by : dataExisting.created_by,
                last_updated_date : new Date().toISOString(),
                last_updated_by : user,
                updates_info : dataExisting.updates_info,
                file : dataExisting.file
            },
            { new: true }  // Ensure the updated document is returned
        );

        


        
        // Respond with a success message
        res.status(200).json({
            error: 0,
            data: dataToUpdate,
            message: "Marked Day updated successfully."
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
const ListDays = async (req,res) =>{
    try{
        const data = await MarkedDay.find().populate("created_by")
        .populate("last_updated_by")
        .populate("post_type");

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
const GetOneDay = async (req,res) =>{
    const { id } = req.params;
    try{
        const existingData = await MarkedDay.findById(id).populate("created_by")
        .populate("last_updated_by")
        .populate("post_type");;

        if (!existingData) {
        return res.status(404).json({
            error: 1,
            message: "Marked Day not found",
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
const DeleteDay = async(req, res) =>{
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
        const dataExist = await MarkedDay.findByIdAndDelete(id)

        if (!dataExist) {
            return res.status(404).json({
                error: 1,
                data: [],
                message: "Marked Day not found.",
                status: 404
            });
        }

        deleteFile(dataExist.file, "markedDays")

        res.status(200).json({
            error: 0,
            data: [],
            message: "Marked Day deleted successfully."
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
        AddDay ,
        DeleteDay ,
        ListDays ,
        UpdateDay ,
        GetOneDay

    }