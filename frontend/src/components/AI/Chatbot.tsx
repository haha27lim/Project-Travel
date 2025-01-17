import React, { useState, useEffect, useRef } from 'react';
import { useAuth } from '../../contexts/AuthContext';
import aiService from '../../services/ai.service';
import { MessageCircle, X, Send } from 'lucide-react';
import '../../styles/components/Chatbot.css';

interface Message {
    id: string;
    text: string;
    sender: 'user' | 'bot';
    timestamp: Date;
}

const Chatbot: React.FC = () => {
    const { isAuthenticated, currentUser } = useAuth();
    const [isOpen, setIsOpen] = useState(false);
    const [messages, setMessages] = useState<Message[]>([]);
    const [inputText, setInputText] = useState('');
    const [isTyping, setIsTyping] = useState(false);
    const messagesEndRef = useRef<HTMLDivElement>(null);

    useEffect(() => {
        if (isOpen && messages.length === 0) {

            const initialMessage = isAuthenticated
                ? `Welcome back ${currentUser?.username}! How can I assist with your travel plans today?`
                : "Welcome to TravelBloom! I'm here to help you plan your perfect trip. Feel free to ask about our features or sign up to access personalized recommendations!";
            
            addBotMessage(initialMessage);
        }
    }, [isOpen, isAuthenticated, currentUser]);

    useEffect(() => {
        scrollToBottom();
    }, [messages]);

    const scrollToBottom = () => {
        messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
    };

    const addBotMessage = (text: string) => {
        setMessages(prev => [...prev, {
            id: Date.now().toString(),
            text,
            sender: 'bot',
            timestamp: new Date()
        }]);
    };

    const handleSendMessage = async () => {
        if (!inputText.trim()) return;


        const userMessage: Message = {
            id: Date.now().toString(),
            text: inputText.trim(),
            sender: 'user',
            timestamp: new Date()
        };

        setMessages(prev => [...prev, userMessage]);
        setInputText('');
        setIsTyping(true);

        try {

            const response = await aiService.processChatMessage({
                message: userMessage.text,
                isAuthenticated,
                userId: currentUser?.id
            });

            setIsTyping(false);
            addBotMessage(response);
        } catch (error) {
            setIsTyping(false);
            addBotMessage("I apologize, but I'm having trouble processing your request. Please try again later.");
        }
    };

    const handleKeyPress = (e: React.KeyboardEvent) => {
        if (e.key === 'Enter' && !e.shiftKey) {
            e.preventDefault();
            handleSendMessage();
        }
    };

    return (
        <div className={`chatbot-container ${isOpen ? 'open' : ''}`}>
            {!isOpen ? (
                <button 
                    className="chatbot-toggle"
                    onClick={() => setIsOpen(true)}
                    aria-label="Open chat"
                >
                    <MessageCircle size={24} />
                </button>
            ) : (
                <div className="chatbot-window">
                    <div className="chatbot-header">
                        <h3>TravelBloom Assistant</h3>
                        <button 
                            className="close-button"
                            onClick={() => setIsOpen(false)}
                            aria-label="Close chat"
                        >
                            <X size={20} />
                        </button>
                    </div>
                    
                    <div className="messages-container">
                        {messages.map((message) => (
                            <div 
                                key={message.id}
                                className={`message ${message.sender === 'bot' ? 'bot' : 'user'}`}
                            >
                                <div className="message-content">
                                    {message.text}
                                </div>
                                <div className="message-timestamp">
                                    {message.timestamp.toLocaleTimeString([], { 
                                        hour: '2-digit', 
                                        minute: '2-digit' 
                                    })}
                                </div>
                            </div>
                        ))}
                        {isTyping && (
                            <div className="typing-indicator">
                                <span></span>
                                <span></span>
                                <span></span>
                            </div>
                        )}
                        <div ref={messagesEndRef} />
                    </div>

                    <div className="chatbot-input">
                        <textarea
                            value={inputText}
                            onChange={(e) => setInputText(e.target.value)}
                            onKeyPress={handleKeyPress}
                            placeholder="Type your message..."
                            rows={1}
                        />
                        <button 
                            onClick={handleSendMessage}
                            disabled={!inputText.trim()}
                            aria-label="Send message"
                        >
                            <Send size={20} />
                        </button>
                    </div>
                </div>
            )}
        </div>
    );
};

export default Chatbot; 