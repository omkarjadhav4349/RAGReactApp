import useChat from "../hooks/useChat";

import ChatInput from "../components/ChatInput";

import ChatWindow from "../components/ChatWindow";

export default function Home() {
    const {
        messages,
        sendMessage,
        handleUpload,
        loading,
        uploading,
        error,
        documentInfo,
    } = useChat();

    return (
        <div className="page-shell">
            <div className="hero">
                <div>
                    <p className="eyebrow">RAG Chat</p>
                    <h1>Chat with your PDFs.</h1>
                    <p className="subtitle">
                        Upload a document, index it, and ask questions with relevant context from Pinecone and Gemini.
                    </p>
                </div>

                <label className="upload-button">
                    <input
                        type="file"
                        accept="application/pdf"
                        onChange={(e) => handleUpload(e.target.files?.[0])}
                        disabled={uploading}
                    />
                    {uploading ? "Uploading..." : "Upload PDF"}
                </label>
            </div>

            {documentInfo && (
                <div className="document-card">
                    <strong>{documentInfo.filename}</strong>
                    <span>{documentInfo.pages} pages</span>
                    <span>{documentInfo.chunksIndexed} chunks indexed</span>
                </div>
            )}

            {error && <div className="error-banner">{error}</div>}

            <ChatWindow
                messages={messages}
            />

            <ChatInput
                onSend={sendMessage}
                loading={loading}
            />
        </div>
    );
}
