let latestDocument = null;

export function setLatestDocument(document) {
    latestDocument = document;
}

export function getLatestDocument() {
    return latestDocument;
}

export function hasLatestDocument() {
    return Boolean(latestDocument?.text);
}

export function getLatestDocumentChunks() {
    return latestDocument?.chunks || [];
}
