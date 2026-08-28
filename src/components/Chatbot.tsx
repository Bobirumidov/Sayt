import { useState, useRef, useEffect } from 'react';
import { MessageSquare, X, Send, Bot } from 'lucide-react';

const Chatbot = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [messages, setMessages] = useState([
    { text: "Assalomu alaykum! Men UNG Burg'ilash kompaniyasining virtual yordamchisiman. Tashkilotimiz haqida qanday ma'lumot kerak?", isBot: true }
  ]);
  const [input, setInput] = useState("");
  const [settings, setSettings] = useState<any>({});
  const messagesEndRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    fetch('/api/settings')
      .then(res => res.json())
      .then(data => setSettings(data))
      .catch(e => console.error(e));
  }, []);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages, isOpen]);

  const handleSend = () => {
    if (!input.trim()) return;
    
    const userText = input.trim();
    setMessages(prev => [...prev, { text: userText, isBot: false }]);
    setInput("");

    // Simple keyword-based bot logic
    setTimeout(() => {
      const lowerInput = userText.toLowerCase();
      let botResponse = "";

      if (lowerInput.match(/(salom|assalom|qalay)/)) {
        botResponse = "Assalomu alaykum! UNG Burg'ilash kompaniyasining virtual yordamchisiman. Tashkilot haqida, aloqa ma'lumotlari yoki texnikalarimiz haqida so'rashingiz mumkin.";
      } else if (lowerInput.match(/(haqida|kompaniya|tashkilot|kimsiz|nima ish|kimlar)/)) {
        botResponse = settings.about_text || "Biz neft va gaz quduqlarini burg'ilash sohasida yetakchi kompaniyalardan birimiz.";
      } else if (lowerInput.match(/(aloqa|nomer|telefon|raqam|manzil|email|bog'lanish|kontakt)/)) {
        botResponse = `Biz bilan bog'lanish uchun:\nTelefon: ${settings.phone || '+998 71 123 45 67'}\nEmail: ${settings.email || 'info@ung-burgilash.uz'}`;
      } else if (lowerInput.match(/(texnika|uskuna|burg'ilash|mashina|apparat)/)) {
        botResponse = "Kompaniyamizda eng zamonaviy burg'ilash uskunalari, maxsus transportlar va nasoslar mavjud. To'liq ro'yxatni saytimizning 'Texnikalar' bo'limidan ko'rishingiz mumkin.";
      } else if (lowerInput.match(/(rahmat|tashakkur|sog' bo'l|yaxshi)/)) {
        botResponse = "Arzimaydi! Yana savollaringiz bo'lsa, bemalol murojaat qiling.";
      } else {
        botResponse = "Kechirasiz, savolingizga tushunmadim. Men hozircha o'rganish jarayonidaman. Tashkilotimiz haqida yoki aloqa ma'lumotlari haqida so'rashingiz mumkin.";
      }

      setMessages(prev => [...prev, { text: botResponse, isBot: true }]);
    }, 800);
  };

  return (
    <>
      {/* Floating Button */}
      <button 
        onClick={() => setIsOpen(true)}
        className={`fixed bottom-6 right-6 p-4 rounded-full bg-corporate-accent text-white shadow-xl hover:bg-blue-600 hover:scale-105 transition-all z-50 flex items-center justify-center ${isOpen ? 'scale-0 opacity-0' : 'scale-100 opacity-100'}`}
      >
        <MessageSquare size={28} />
      </button>

      {/* Chat Window */}
      {isOpen && (
        <div className="fixed bottom-6 right-6 w-[350px] bg-white rounded-2xl shadow-2xl z-[100] overflow-hidden flex flex-col border border-gray-100 animate-in slide-in-from-bottom-5 fade-in duration-300" style={{ height: '500px', maxHeight: '80vh' }}>
          {/* Header */}
          <div className="bg-corporate-dark/85 backdrop-blur-md text-white p-4 flex justify-between items-center shadow-md z-10">
            <div className="flex items-center space-x-3">
              <div className="p-2 bg-white/10 rounded-full">
                <Bot size={20} className="text-corporate-accent" />
              </div>
              <div>
                <h3 className="font-bold text-sm">UNG Yordamchi</h3>
                <div className="flex items-center space-x-1 mt-0.5">
                  <div className="w-1.5 h-1.5 rounded-full bg-green-400 animate-pulse"></div>
                  <span className="text-[10px] text-gray-300">Onlayn</span>
                </div>
              </div>
            </div>
            <button 
              onClick={() => setIsOpen(false)} 
              className="text-gray-300 hover:text-white p-1 hover:bg-white/10 rounded-lg transition-colors"
            >
              <X size={20} />
            </button>
          </div>

          {/* Messages */}
          <div className="flex-1 overflow-y-auto p-4 space-y-4 bg-slate-50">
            {messages.map((msg, idx) => (
              <div key={idx} className={`flex ${msg.isBot ? 'justify-start' : 'justify-end'}`}>
                {msg.isBot && (
                  <div className="w-8 h-8 rounded-full bg-blue-100 flex items-center justify-center mr-2 flex-shrink-0 mt-1">
                    <Bot size={16} className="text-corporate-accent" />
                  </div>
                )}
                <div 
                  className={`max-w-[75%] p-3 text-[13.5px] leading-relaxed ${
                    msg.isBot 
                      ? 'bg-white border border-gray-100 shadow-sm text-gray-800 rounded-2xl rounded-tl-sm' 
                      : 'bg-corporate-accent text-white shadow-sm rounded-2xl rounded-tr-sm'
                  }`}
                >
                  {msg.text}
                </div>
              </div>
            ))}
            <div ref={messagesEndRef} />
          </div>

          {/* Input Area */}
          <div className="p-4 bg-white border-t border-gray-100">
            <div className="flex items-center space-x-2 bg-white/75 backdrop-blur-md rounded-xl border border-gray-200 p-1 pl-3 focus-within:border-corporate-accent focus-within:ring-1 focus-within:ring-corporate-accent transition-all">
              <input 
                type="text" 
                value={input}
                onChange={(e) => setInput(e.target.value)}
                onKeyDown={(e) => e.key === 'Enter' && handleSend()}
                placeholder="Savolingizni yozing..."
                className="flex-1 bg-transparent border-none focus:outline-none text-sm py-2"
              />
              <button 
                onClick={handleSend}
                disabled={!input.trim()}
                className="p-2 bg-corporate-accent text-white rounded-lg hover:bg-blue-600 disabled:opacity-50 disabled:hover:bg-corporate-accent transition-colors"
              >
                <Send size={18} />
              </button>
            </div>
          </div>
        </div>
      )}
    </>
  );
};

export default Chatbot;



