const multer = require('multer');
const path = require('path');
const fs = require('fs');
const createUploadDir = () => {
    const uploadDir = ['upload', 'upload/profile', 'upload/resume', 'upload/companies'];
    uploadDir.forEach(dir => {
        if(!fs.existsSync(dir)){
            fs.mkdirSync(dir), { recursive: true };
        }
    });
}
createUploadDir();
const storage = multer.diskStorage({
    destination: (request, file, cb) =>{
        let uploadPath = 'uploads/';
        if(file.fieldname === 'profilePicture'){
            uploadPath += 'profiles/';
        }
        else if(file.fieldname === 'resume'){
            uploadPath += 'resumes/';
        }
        else if(file.fieldname === 'companyLogo'){
            uploadPath += 'companies/';
        }
        cb(null, uploadPath);
    },
    filename: (request, file, cb) =>{
        const uniqueSuffix = Date.now() + '-' + Math.round(Math.random()*1E9);
        cb(null, file.fieldname + '-' + uniqueSuffix + path.extname(file.originalname));
    }
});
const fileFilter = (request, file, cb) =>{
    if(file.fieldname === 'profilePicture' || file.fieldname === 'companyLogo'){
        if(file.mimetype.startsWith('image/')){
            cb(null, true);
        }
        else{
            cb(new Error('Only image files are allowed!'), false);
        }
    }
    else if(file.fieldname === 'resume'){
        if(file.mimetype.startsWith('application/pdf')){
            cb(null, true);
        }
        else{
            cb(new Error('Only PDF files are allowed!'), false);
        }
    }
    else{
        return cb(new Error('Invalid file fieldname!'), false);
    }
};
const upload = multer({
    storage: storage,
    fileFilter: fileFilter,
    limits:{
        fileSize: 5 * 1024 * 1024
    }
});
module.exports = upload;