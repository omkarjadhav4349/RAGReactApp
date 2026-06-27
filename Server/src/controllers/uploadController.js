import { extractTextFromPdf } from "../services/pdfService.js";
import { createEmbeddingsForDocument } from "../services/ragService.js";
import { setLatestDocument } from "../services/documentStore.js";
import { chunkText } from "../utils/chunkText.js";

export const uploadPDF = async (req, res) => {
    try {
        if (!req.file) {
            return res.status(400).json({
                success: false,
                message: "No PDF uploaded",
            });
        }

        const result = await extractTextFromPdf(req.file.path);
        const chunks = chunkText(result.text);
        setLatestDocument({
            filename: req.file.originalname,
            text: result.text,
            pages: result.pages,
            chunks,
        });
        const indexed = await createEmbeddingsForDocument({
            filename: req.file.originalname,
            text: result.text,
            pages: result.pages,
        });

        return res.status(200).json({
            success: true,
            pages: result.pages,
            text: result.text,
            filename: req.file.originalname,
            chunksIndexed: indexed.count,
            indexingMode: indexed.mode,
        });
    } catch (error) {
        return res.status(500).json({
            success: false,
            message: error.message,
        });
    }
};
