import multer from "multer";
import path from "path";
import fs from "fs";

// Configure Storage Dynamically
const storage = multer.diskStorage({
    destination: (req, file, cb) => {
        const { questionType, questionID } = req.body;

        // Create folder path: ./questions/questionType/questionID/files
        const folderPath = path.join(process.cwd(), "questions", questionType, questionID, "files");

        // Ensure the directory exists
        if (!fs.existsSync(folderPath)) {
            fs.mkdirSync(folderPath, { recursive: true });
        }

        cb(null, folderPath);
    },
    filename: (req, file, cb) => {
        const uniqueSuffix = Date.now() + "-" + Math.round(Math.random() * 1e9);
        cb(null, uniqueSuffix + path.extname(file.originalname));
    },
});

// File Filter (Allow only images)
const fileFilter = (req, file, cb) => {
    const allowedTypes = /jpeg|jpg|png|gif/;
    const isValidExt = allowedTypes.test(path.extname(file.originalname).toLowerCase());
    const isValidMime = allowedTypes.test(file.mimetype);

    if (isValidExt && isValidMime) {
        cb(null, true);
    } else {
        cb(new Error("Only image files are allowed!"), false);
    }
};

// Initialize Multer
const upload = multer({
    storage,
    limits: { fileSize: 5 * 1024 * 1024 }, // 5MB limit
    fileFilter,
});

export default upload;

// import multer from 'multer';
// import path from 'path';
// import fs from 'fs';

// // Ensure uploads directory exists
// const uploadDir = path.join(process.cwd(), 'uploads'); // Use process.cwd() for better path handling
// if (!fs.existsSync(uploadDir)) {
//     fs.mkdirSync(uploadDir, { recursive: true });
// }

// // Configure Storage
// const storage = multer.diskStorage({
//     destination: (req, file, cb) => {
//         cb(null, uploadDir);
//     },
//     filename: (req, file, cb) => {
//         const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1e9);
//         cb(null, uniqueSuffix + path.extname(file.originalname));
//     }
// });

// // File Filter (Allow only images)
// const fileFilter = (req, file, cb) => {
//     const allowedTypes = /jpeg|jpg|png|gif/;
//     const isValidExt = allowedTypes.test(path.extname(file.originalname).toLowerCase());
//     const isValidMime = allowedTypes.test(file.mimetype);

//     if (isValidExt && isValidMime) {
//         cb(null, true);
//     } else {
//         cb(new Error('Only image files are allowed!'), false);
//     }
// };

// // Initialize Multer
// const upload = multer({
//     storage,
//     limits: { fileSize: 5 * 1024 * 1024 }, // 5MB limit
//     fileFilter
// });

// export default upload;
