import { getPineconeIndex, hasPineconeConfig } from "../config/pinecone.js";

const memoryStore = new Map();
const DEFAULT_NAMESPACE = "documents";

function cosineSimilarity(a = [], b = []) {
    let dot = 0;
    let magA = 0;
    let magB = 0;

    const length = Math.min(a.length, b.length);
    for (let i = 0; i < length; i += 1) {
        dot += a[i] * b[i];
        magA += a[i] * a[i];
        magB += b[i] * b[i];
    }

    if (!magA || !magB) return 0;
    return dot / (Math.sqrt(magA) * Math.sqrt(magB));
}

export async function upsertVectors(vectors, namespace = DEFAULT_NAMESPACE) {
    if (!vectors.length) {
        return { count: 0, mode: "none" };
    }

    if (!hasPineconeConfig()) {
        if (!memoryStore.has(namespace)) memoryStore.set(namespace, []);
        memoryStore.get(namespace).push(...vectors);
        return { count: vectors.length, mode: "memory" };
    }

    const index = getPineconeIndex();
    await index.namespace(namespace).upsert(vectors);
    return { count: vectors.length, mode: "pinecone" };
}

export async function queryVectors(vector, topK = 5, namespace = DEFAULT_NAMESPACE) {
    if (!vector?.length) {
        return [];
    }

    if (!hasPineconeConfig()) {
        const stored = memoryStore.get(namespace) || [];
        return stored
            .map((item) => ({
                id: item.id,
                score: cosineSimilarity(vector, item.values),
                metadata: item.metadata,
            }))
            .sort((a, b) => b.score - a.score)
            .slice(0, topK);
    }

    const index = getPineconeIndex();
    const result = await index.namespace(namespace).query({
        vector,
        topK,
        includeMetadata: true,
    });

    return result.matches || [];
}
