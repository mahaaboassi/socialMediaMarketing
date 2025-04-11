const multer = require("multer")
const path = require("path")
const fs = require("fs")
// Middleware to set category for the "type" endpoint
const setCategory = (category) => (req, res, next) => {
    req.category = category; // Add category to the request object
    next();
};

// Storage configuration
const storage = multer.diskStorage({
    destination: (req, file, cb) => {
      const category = req.category || 'default';
      cb(null, `uploads/${category}/`); 
    },
    filename: (req, file, cb) => {

      const uniqueName = `${Date.now()}-${file.originalname}`;
      cb(null, uniqueName);
    }
  });


// File filter (optional - for image files only)
const fileFilter = (req, file, cb) => {
    const allowedTypes = /jpeg|jpg|png|gif|webp/;
    const extname = allowedTypes.test(path.extname(file.originalname).toLowerCase());
    const mimetype = allowedTypes.test(file.mimetype);
  
    if (extname && mimetype) return cb(null, true);
    cb(new Error("Only images are allowed"));
  };
  
  // Upload middleware
  const upload = multer({
    storage,
    fileFilter,
    limits: { fileSize: 5 * 1024 * 1024 } // 5MB
  });


//  Delete File
const deleteFile = (filePath) => {
     // Remove leading slash if exists
  const cleanedPath = filePath.startsWith("/") ? filePath.slice(1) : filePath;

  const fullPath = path.join(__dirname, "..", cleanedPath); 

  fs.unlink(fullPath, (err) => {
    if (err) {
      console.error("Failed to delete file:", err.message);
    } else {
      console.log("File deleted successfully:", fullPath);
    }
  });
};

module.exports = {upload,setCategory,deleteFile};