import dotenv from "dotenv";
import { Pinecone } from "@pinecone-database/pinecone";

dotenv.config();

const apiKey = process.env.PINECONE_API_KEY;
const indexName = process.env.PINECONE_INDEX;

let pinecone = null;
let pineconeIndex = null;

export function hasPineconeConfig() {
    return Boolean(apiKey && indexName);
}

export function getPineconeClient() {
    if (!apiKey) {
        throw new Error("PINECONE_API_KEY is not configured");
    }

    if (!pinecone) {
        pinecone = new Pinecone({ apiKey });
    }

    return pinecone;
}

export function getPineconeIndex() {
    if (!indexName) {
        throw new Error("PINECONE_INDEX is not configured");
    }

    if (!pineconeIndex) {
        pineconeIndex = getPineconeClient().index(indexName);
    }

    return pineconeIndex;
}
