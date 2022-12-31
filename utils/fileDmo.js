const multer = require("multer");

const storage = multer.diskStorage({
    destination:(req,file,cb) => {
        cb(null, "uplodes");
    },
    filename:(req,file,cb) => {
        cb(
            null,
            new Date().toISOString().replace(/:/g,'-')+'-'+file.originalname,
        );
    },
});

const upload = multer({
    storage,
    fileFilter:(req,file,cb)=>{
        if (
            file.mimetype === "image/png" ||
            file.mimetype === "image/jpg" ||
            file.mimetype === "image/jpeg"
        ) {
            cb(null, true);
        } else {
            cb(null, false);
            throw new Error('Only jpg, png, jpeg and webp format is allowed');
        }
    },
});

module.exports = upload;