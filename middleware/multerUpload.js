import multer from "multer";
import path from "path";
import fs from "fs";

// Store files in memory temporarily
const storage = multer.memoryStorage();

const upload = multer({
    storage,
    limits: { fileSize: 5 * 1024 * 1024 }, // 5MB limit
});

export default upload;
