import Sidebar from "../components/sidebar";
import styles from './bot.module.css'
import React, { useState, useRef, useEffect } from 'react';
import { Send } from 'lucide-react';
import { useSelector } from "react-redux";
import API_BASE_URL from '../config';
function Bot(){
const tasks = useSelector(state=> state.task);
const calendar = useSelector(state=> state.event);
const expenses = useSelector(state=> state.expense);
const income = useSelector(state=> state.income);
  const [messages, setMessages] = useState([
    { text: "Hello! I'm Grego, your personal assistant. How can I help you today?", sender: 'bot' }
  ]);
  const [inputMessage, setInputMessage] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const messagesEndRef = useRef(null);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  const handleSendMessage = async (e) => {
    e.preventDefault();
    if (!inputMessage.trim() || isLoading) return;
  
    const newMessage = { text: inputMessage, sender: 'user' };
    setMessages(prev => [...prev, newMessage]);
    setInputMessage('');
    setIsLoading(true);
  

  
    try {
      const response = await fetch(`${API_BASE_URL}/bot`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          message: inputMessage,
          tasks,
          calendar,
          expenses,
          income
        }),
      });
  
      const data = await response.json();
  
      if (response.ok) {
        setMessages(prev => [...prev, { 
          text: data.response, 
          sender: 'bot' 
        }]);
      } else {
        throw new Error(data.message || 'Failed to get response');
      }
    } catch (error) {
      console.error('Error:', error);
      setMessages(prev => [...prev, { 
        text: "Sorry, I'm having trouble connecting right now. Please try again.", 
        sender: 'bot' 
      }]);
    } finally {
      setIsLoading(false);
    }
  };
  return(<div className={styles.bot}>
    <Sidebar />
    <main className={styles.mainContent}>
      <h1><img src="/images/pngtree-chatbot-robot-concept-chat-bot-png-image_5632381-removebg-preview.png"></img>Grego</h1>
        <div className="flex flex-col h-[600px] w-full max-w-2xl mx-auto bg-white rounded-lg shadow-lg"  style={{border:'0.1px solid #3b3a3a', borderRadius:'0.5rem', }}>
      

      <div className="flex-1 p-4 overflow-y-auto"  >
        {messages.map((message, index) => (
          <div
            key={index}
            className={`mb-4 flex ${message.sender === 'user' ? 'justify-end' : 'justify-start'}`}
          >
            <div
              className={`max-w-[70%] p-3 rounded-lg ${
                message.sender === 'user'
                  ? 'bg-blue-600 text-white'
                  : 'bg-gray-100 text-gray-800'
              }`}
            >
              {message.text}
            </div>
          </div>
        ))}
        {isLoading && (
          <div className="flex justify-start mb-4">
            <div className="bg-gray-100 text-gray-800 p-3 rounded-lg flex items-center gap-2">
              <div className="animate-bounce">●</div>
              <div className="animate-bounce delay-100">●</div>
              <div className="animate-bounce delay-200">●</div>
            </div>
          </div>
        )}
        <div ref={messagesEndRef} />
      </div>

      <form onSubmit={handleSendMessage} className="p-4 border-t">
        <div className={`flex gap-2 ${styles.input}`}>
          <input
            type="text"
            value={inputMessage}
            onChange={(e) => setInputMessage(e.target.value)}
            placeholder="Type your message..."
            className="flex-1 p-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
            disabled={isLoading}
          />
          <button
            type="submit"
            className={`p-2 text-white bg-blue-600 rounded-lg hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 ${
              isLoading ? 'opacity-50 cursor-not-allowed' : ''
            }`}
            disabled={isLoading} style={{border:'none'}}
          >
            <Send className="w-6 h-6" />
          </button>
        </div>
      </form>
    </div>
    </main>
  </div>)
}

export default Bot;