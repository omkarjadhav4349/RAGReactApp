import ReactMarkdown from "react-markdown";

export default function ChatMessage({ message }) {
    return (
        <div
            className={
                message.role === "user"
                    ? "user-message"
                    : "bot-message"
            }
        >
            <ReactMarkdown>{message.text}</ReactMarkdown>
        </div>
    );
}
