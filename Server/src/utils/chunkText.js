const DEFAULT_CHUNK_SIZE = 900;
const DEFAULT_OVERLAP = 180;

function isHeading(line) {
    const trimmed = line.trim();
    if (!trimmed) return false;

    const headingPatterns = [
        /^(experience|work experience|employment|professional experience|projects|education|skills|summary|profile|about me|certifications|achievements)[:\s]*$/i,
        /^[A-Z][A-Z\s/&-]{3,}$/,
        /^[A-Z][A-Za-z\s/&-]{2,}:$/,
    ];

    return headingPatterns.some((pattern) => pattern.test(trimmed));
}

function splitIntoSections(text) {
    const lines = text
        .replace(/\r/g, "\n")
        .split("\n")
        .map((line) => line.trim())
        .filter(Boolean);

    const sections = [];
    let currentSection = [];

    for (const line of lines) {
        if (isHeading(line) && currentSection.length) {
            sections.push(currentSection.join(" "));
            currentSection = [line];
            continue;
        }

        currentSection.push(line);
    }

    if (currentSection.length) {
        sections.push(currentSection.join(" "));
    }

    return sections.length ? sections : [text];
}

function chunkLongText(text, chunkSize, overlap) {
    const cleanedText = text.replace(/\s+/g, " ").trim();
    const chunks = [];
    let start = 0;

    while (start < cleanedText.length) {
        const end = Math.min(start + chunkSize, cleanedText.length);
        chunks.push(cleanedText.slice(start, end));

        if (end === cleanedText.length) {
            break;
        }

        start = Math.max(0, end - overlap);
    }

    return chunks;
}

export function chunkText(text, chunkSize = DEFAULT_CHUNK_SIZE, overlap = DEFAULT_OVERLAP) {
    const cleanedText = text.replace(/\s+/g, " ").trim();

    if (!cleanedText) {
        return [];
    }

    const sections = splitIntoSections(text);
    const chunks = [];

    for (const section of sections) {
        const normalizedSection = section.replace(/\s+/g, " ").trim();
        if (!normalizedSection) continue;

        if (normalizedSection.length <= chunkSize) {
            chunks.push(normalizedSection);
            continue;
        }

        chunks.push(...chunkLongText(normalizedSection, chunkSize, overlap));
    }

    return chunks;
}
