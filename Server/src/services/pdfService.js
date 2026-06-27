import fs from "fs/promises";
import { PDFParse } from "pdf-parse";

export async function extractTextFromPdf(filePath) {
    const buffer = await fs.readFile(filePath);
    const parser = new PDFParse({ data: buffer });
    const data = await parser.getText();
    await parser.destroy();

    return {
        success: true,
        pages: data.total || data.pages?.length || 0,
        text: data.text || "",
    };
}
