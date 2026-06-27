import { useState } from "react";

export default function ChatInput({ onSend, loading }) {
    const [question, setQuestion] = useState("");

    const handleSend = (event) => {
        event.preventDefault();
        if (!question.trim()) return;

        onSend(question);

        setQuestion("");
    };

    return (
        <form className="chat-input" onSubmit={handleSend}>
            <input
                value={question}
                onChange={(e) =>
                    setQuestion(e.target.value)
                }
                placeholder="Ask Gemini..."
                disabled={loading}
            />

            <button type="submit" disabled={loading}>
                {loading ? "Thinking..." : "Send"}
            </button>
        </form>
    );
}
