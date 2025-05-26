import ChatbotIcon from "./components/ChatbotIcon";
import './App.css';
import ChatForm from "./components/ChatForm";
import { useEffect, useRef, useState } from "react";
import ChatMessage from "./components/ChatMessage";

function App() {

  const [chatHistory, setChatHistory] = useState<{ role: string; text: string }[]>([]);
  const [showChatbot, setShowChatbot] = useState(false);
  const chatBodyRef = useRef<HTMLDivElement>(null);

  const updateHistory = (text: string) => {
     setChatHistory((prevHistory) => [
      ...prevHistory.filter(msg => msg.text !== "Digitando..."),
      { role: "assistant", text }
    ]);
  }

  const generateBotResponse = async (history: { role: string; text: string; }[]) => {
  const systemMessage = {
    role: "system",
    content: `
      Você é o **Sabichão**, um professor virtual descontraído, divertido e didático. Explique os conceitos de forma leve, como se estivesse conversando com um aluno de maneira informal, usando exemplos do dia a dia, comparações criativas e até brincadeiras para facilitar o entendimento.

      Sua missão é ensinar qualquer assunto de forma clara e envolvente, com um tom animado e acolhedor. Use metáforas engraçadas, emojis (quando fizer sentido), frases de incentivo e piadinhas leves para deixar o aprendizado mais divertido.

      Evite jargões técnicos desnecessários e adapte a linguagem ao nível do aluno. Trate cada dúvida com empatia, como um verdadeiro professor que ama ensinar e adora quando te chamam de Sabichão.

      Lembre-se: você é o Sabichão, o mestre da explicação divertida!
`

  };

  const formattedHistory = [
    systemMessage,
    ...history.map(({ role, text }: { role: string; text: string }) => ({ role, content: text }))
  ];

  const requestOptions = {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      'Authorization': `Bearer ${import.meta.env.VITE_API_KEY}`
    },
    body: JSON.stringify({
      model: "gpt-3.5-turbo",
      messages: formattedHistory
    })
  };

  try {
    const response = await fetch(import.meta.env.VITE_API_URL, requestOptions);
    const data = await response.json();
    if (!response.ok) throw new Error(data.error?.message || 'Failed to fetch response');

    const apiResponse = data.choices[0].message.content.replace(/<[^>]*>/g, '').trim();
    updateHistory(apiResponse);
  } catch (e) {
    console.error(e);
  }
};

useEffect(() => {
  if (chatBodyRef.current) {
    chatBodyRef.current.scrollTo({ top: chatBodyRef.current.scrollHeight, behavior: 'smooth' });
  }
}, [chatHistory]);

  return (
    <div className={`container ${showChatbot ? 'show-chatbot' : ''}`}>
      
      <button onClick={() => setShowChatbot(prev => !prev)} id="chatbot-toggler">
        <span className="material-symbols-outlined">mode_comment</span>
        <span className="material-symbols-outlined">close</span>
      </button>

      <div className="chatbot-popup">
        <div className="chat-header">
          <div className="header-info">
            <ChatbotIcon />
            <h2 className="logo-text">Sabichão</h2>
          </div>
          <button onClick={() => setShowChatbot(prev => !prev)} className="material-symbols-outlined">keyboard_arrow_down</button>
        </div>

        <div ref={chatBodyRef} className="chat-body">
          <div className="message bot-message">
              <ChatbotIcon />
              <p className="message-text">Olá! Eu sou o Sabichão, seu assistente virtual. Como posso ajudar você hoje?</p>
          </div>

          {chatHistory.map((message, index) => (
              <ChatMessage key={index} message={message} />
          ))}
        </div>

        <div className="chat-footer">
          <ChatForm chatHistory={chatHistory} setChatHistory={setChatHistory} generateBotResponse={generateBotResponse} />
        </div>
      </div>
    </div>
  )
}

export default App;
