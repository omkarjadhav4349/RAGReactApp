import ai from "../config/gemini.js";
import { chunkText } from "../utils/chunkText.js";
import { generateEmbedding } from "./embeddingService.js";
import { getLatestDocument, getLatestDocumentChunks, hasLatestDocument } from "./documentStore.js";
import { queryVectors, upsertVectors } from "./vectorService.js";

const CHAT_MODEL = "gemini-2.5-flash";
const MAX_FULL_TEXT_CONTEXT = 12000;

function normalizeText(text = "") {
    return text.replace(/\s+/g, " ").trim();
}

function shouldUseFullDocument(question = "") {
    return /summar|overview|explain|all|everything|complete|full|detail|details|experience|work history|employment|company|companies|job|career|resume|document/i.test(question);
}

function buildContextFromChunks(chunks, matches) {
    const selected = new Map();

    for (const match of matches) {
        const docChunkIndex = match?.metadata?.chunkIndex;
        if (typeof docChunkIndex !== "number") continue;

        for (const offset of [-1, 0, 1]) {
            const chunk = chunks[docChunkIndex + offset];
            if (chunk) {
                selected.set(`${docChunkIndex + offset}`, chunk);
            }
        }
    }

    return Array.from(selected.values()).join("\n\n");
}

export async function createEmbeddingsForDocument({ filename, text, pages }) {
    const chunks = chunkText(text);
    const vectors = [];

    for (let i = 0; i < chunks.length; i += 1) {
        const values = await generateEmbedding(chunks[i]);
        vectors.push({
            id: `${filename}-${i}-${Date.now()}`,
            values,
            metadata: {
                text: chunks[i],
                page: pages,
                filename,
                chunkIndex: i,
            },
        });
    }

    const stored = await upsertVectors(vectors);
    return { count: stored.count, mode: stored.mode };
}

export async function answerWithRag(question) {
    let context = "";
    let orderedMatches = [];

    if (hasLatestDocument() && shouldUseFullDocument(question)) {
        const latestDocument = getLatestDocument();
        const fullText = normalizeText(latestDocument.text);
        context = fullText.length <= MAX_FULL_TEXT_CONTEXT
            ? fullText
            : getLatestDocumentChunks().join("\n\n");
    } else {
        const questionEmbedding = await generateEmbedding(question);
        const matches = await queryVectors(questionEmbedding, 10);
        const uniqueMatches = Array.from(
            new Map(
                matches
                    .filter((match) => match?.metadata?.text)
                    .map((match) => [match.metadata.text, match]),
            ).values(),
        );
        orderedMatches = uniqueMatches.sort((a, b) => {
            const pageA = a.metadata?.page ?? 0;
            const pageB = b.metadata?.page ?? 0;
            const chunkA = a.metadata?.chunkIndex ?? 0;
            const chunkB = b.metadata?.chunkIndex ?? 0;

            if (pageA !== pageB) return pageA - pageB;
            return chunkA - chunkB;
        });
        const latestChunks = getLatestDocumentChunks();
        context = buildContextFromChunks(
            latestChunks,
            orderedMatches,
        ) || orderedMatches
            .map((match) => match.metadata?.text)
            .filter(Boolean)
            .join("\n\n");
    }

    const prompt = `You are answering questions about an uploaded document.
Be exhaustive and do not omit relevant names, dates, titles, companies, figures, bullets, or section details.
If the user asks for a list or summary, include every relevant item found in the context.
If the context contains only partial information, say the document may be incomplete rather than inventing details.
Prefer direct extraction from the context over inference.

Context:
${context || "No relevant context found."}

Question: ${question}

Answer with complete, structured detail.`;

    const response = await ai.models.generateContent({
        model: CHAT_MODEL,
        contents: prompt,
    });

    return {
        answer: response.text || "",
        sources: orderedMatches.map((match) => match.metadata).filter(Boolean),
    };
}
