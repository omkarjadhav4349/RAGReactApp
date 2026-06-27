import { useEffect, useRef } from "react";
import ChatMessage from "./ChatMessage";

export default function ChatWindow({ messages }) {
    const endRef = useRef(null);

    useEffect(() => {
        endRef.current?.scrollIntoView({ behavior: "smooth" });
    }, [messages]);

    return (
        <div className="chat-window">
            {messages.map((message, index) => (
                <ChatMessage
                    key={index}
                    message={message}
                />
            ))}
            <div ref={endRef} />
        </div>
    );
}
