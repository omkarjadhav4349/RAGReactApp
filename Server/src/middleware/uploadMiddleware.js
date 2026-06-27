import multer from "multer";
import path from "path";
import fs from "fs";
import { fileURLToPath } from "url";

const uploadPath = fileURLToPath(new URL("../../uploads", import.meta.url));

if (!fs.existsSync(uploadPath)) {
    fs.mkdirSync(uploadPath, { recursive: true });
}

const storage = multer.diskStorage({
    destination(req, file, cb) {
        cb(null, uploadPath);
    },

    filename(req, file, cb) {
        const uniqueName =
            Date.now() +
            path.extname(file.originalname);

        cb(null, uniqueName);
    },
});

const upload = multer({
    storage,
    fileFilter(req, file, cb) {
        const isPdf = file.mimetype === "application/pdf";
        cb(isPdf ? null : new Error("Only PDF files are allowed"), isPdf);
    },
});

export default upload;
