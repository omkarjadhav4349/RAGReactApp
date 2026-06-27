import { useState } from "react";
import { askGemini, uploadPdf } from "../api/chatApi";

export default function useChat() {
    const [messages, setMessages] = useState([]);
    const [loading, setLoading] = useState(false);
    const [uploading, setUploading] = useState(false);
    const [error, setError] = useState("");
    const [documentInfo, setDocumentInfo] = useState(null);

    const sendMessage = async (question) => {
        setError("");
        setLoading(true);
        // Add user message
        setMessages((prev) => [
            ...prev,
            {
                role: "user",
                text: question,
            },
        ]);

        try {
            const response = await askGemini(question);

            // Add Gemini response
            setMessages((prev) => [
                ...prev,
                {
                    role: "assistant",
                    text: response.answer,
                },
            ]);
        } catch (error) {
            console.error(error);
            setError(error?.response?.data?.message || error.message);

            setMessages((prev) => [
                ...prev,
                {
                    role: "assistant",
                    text: "Something went wrong.",
                },
            ]);
        } finally {
            setLoading(false);
        }
    };

    const handleUpload = async (file) => {
        if (!file) return;
        setError("");
        setUploading(true);

        try {
            const response = await uploadPdf(file);
            setDocumentInfo({
                filename: response.filename,
                pages: response.pages,
                chunksIndexed: response.chunksIndexed,
            });
            setMessages((prev) => [
                ...prev,
                {
                    role: "assistant",
                    text: `Indexed **${response.filename}** with ${response.chunksIndexed} chunks.`,
                },
            ]);
        } catch (error) {
            console.error(error);
            setError(error?.response?.data?.message || error.message);
        } finally {
            setUploading(false);
        }
    };

    return {
        messages,
        sendMessage,
        handleUpload,
        loading,
        uploading,
        error,
        documentInfo,
    };
}
