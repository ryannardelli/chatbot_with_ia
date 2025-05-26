import { useRef } from "react";

type ChatFormProps = {
    setChatHistory: React.Dispatch<React.SetStateAction<{ role: string; text: string }[]>>
};

const ChatForm = ({ chatHistory, setChatHistory, generateBotResponse }: ChatFormProps) => {

    const inputRef = useRef<HTMLInputElement>(null);

    const handleFormSubmit = (e: { preventDefault: () => void; }) => {
        e.preventDefault();
        const userMessage = inputRef.current?.value.trim();
        if(!userMessage) return;

        inputRef.current!.value = "";
        setChatHistory((prevHistory) => [
            ...prevHistory,
            { role: "user", text: userMessage }
        ]);

        setTimeout(() => {
            setChatHistory((prevHistory) => [
            ...prevHistory,
            { role: "assistant", text: "Digitando..." }
        ]);

        generateBotResponse([...chatHistory, { role: "user", text: userMessage }]);

        }, 600);
    }

    return(
        <form action="#" className="chat-form" onSubmit={handleFormSubmit}>
            <input ref={inputRef} type="text" placeholder="Mensagem..." className="message-input" required />
            <button className="material-symbols-outlined">arrow_upward</button>
        </form>
    );
}

export default ChatForm;