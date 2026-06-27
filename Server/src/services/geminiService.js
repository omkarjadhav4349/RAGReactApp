import ai from "../config/gemini.js";

export async function generateResponse(question) {
    const response = await ai.models.generateContent({
        model: "gemini-2.5-flash",
        contents: question,
    });

    return response.text;
}
