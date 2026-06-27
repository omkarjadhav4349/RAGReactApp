import ai from "../config/gemini.js";

const EMBEDDING_MODEL = "gemini-embedding-001";

export async function generateEmbedding(text) {
    const response = await ai.models.embedContent({
        model: EMBEDDING_MODEL,
        contents: [text],
    });

    return response.embeddings?.[0]?.values || response.embedding?.values || [];
}
