import { Router } from "express";

import upload from "../middleware/uploadMiddleware.js";

import { uploadPDF } from "../controllers/uploadController.js";

const router = Router();

router.post(
    "/",
    upload.single("pdf"),
    uploadPDF
);

export default router;
