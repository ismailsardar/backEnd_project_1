// const path = require('path');
const multer = require('multer');

// const PATH = path.join(__dirname, '../uplodes/');
 
const storage = multer.diskStorage({
    destination:(req, file, callback)=>{
        callback(null, "uplodes");
    },
    filename:(req, file, callback)=>{
        callback(
            null,
            new Date().toISOString().replace(/:/g, "-") + "-" + file.originalname,
        );
    },
});

//filter function
function fileFelter (req, file, callback) {
    if (
        file.mimetype === "image/png" ||
        file.mimetype === "image/jpg" ||
        file.mimetype === "image/jpeg"
    ) {
        callback(null, true);
    } else {
        callback(null, false);
        throw new Error('Only jpg, png, jpeg and webp format is allowed');
    }
}

const upload = multer({storage, fileFelter});

// module.exports = upload;