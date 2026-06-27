import axios from "axios";

const api = axios.create({
    baseURL: import.meta.env.VITE_API_BASE_URL || "http://127.0.0.1:5050",
});

export const askGemini = async (question) => {
    const response = await api.post("/chat", {
        question,
    });

    return response.data;
};

export const uploadPdf = async (file) => {
    const formData = new FormData();
    formData.append("pdf", file);

    const response = await api.post("/upload", formData, {
        headers: {
            "Content-Type": "multipart/form-data",
        },
    });

    return response.data;
};
