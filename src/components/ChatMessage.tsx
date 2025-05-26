import ChatbotIcon from "./ChatbotIcon";

type ChatMessageProps = {
    message: {
        text: string;
        role: string;
    }
}

const ChatMessage = ( {message}: ChatMessageProps) => {
    return (
       <div className={`message ${message.role === "assistant" ? "bot" : "user"}-message`}>
            {message.role === "assistant" && <ChatbotIcon />}
            <p className="message-text">{message.text}</p>
        </div>
    );
}

export default ChatMessage;