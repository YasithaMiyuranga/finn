import { useState } from 'react';
import { Send, Bot, User, Loader2 } from 'lucide-react';
import aiService from '../../services/aiService';
import toast, { Toaster } from 'react-hot-toast';

export default function AIChat() {
    const [messages, setMessages] = useState([
        {
            id: 1,
            type: 'bot',
            text: 'Hello! I\'m your AI Traffic Assistant. Ask me anything about Sri Lankan traffic laws, fines, or dispute resolution.',
            timestamp: new Date()
        }
    ]);
    const [input, setInput] = useState('');
    const [loading, setLoading] = useState(false);

    const sendMessage = async () => {
        if (!input.trim()) return;

        // Add user message
        const userMessage = {
            id: Date.now(),
            type: 'user',
            text: input,
            timestamp: new Date()
        };
        setMessages(prev => [...prev, userMessage]);
        setInput('');
        setLoading(true);

        try {
            // Call AI API
            const response = await aiService.askQuestion(input);

            // Add AI response
            const aiMessage = {
                id: Date.now() + 1,
                type: 'bot',
                text: response.data || response.answer || 'I received your question but couldn\'t generate a response.',
                timestamp: new Date()
            };
            setMessages(prev => [...prev, aiMessage]);
        } catch (error) {
            console.error('AI Error:', error);
            toast.error('Failed to get AI response. Please try again.');

            // Add error message
            const errorMessage = {
                id: Date.now() + 1,
                type: 'bot',
                text: 'Sorry, I encountered an error. Please try again.',
                timestamp: new Date()
            };
            setMessages(prev => [...prev, errorMessage]);
        } finally {
            setLoading(false);
        }
    };

    const handleKeyPress = (e) => {
        if (e.key === 'Enter' && !e.shiftKey) {
            e.preventDefault();
            sendMessage();
        }
    };

    return (
        <div className="min-h-screen bg-gradient-to-br from-blue-600 via-indigo-600 to-purple-600 p-4 md:p-8">
            <Toaster position="top-right" />

            {/* Header */}
            <div className="max-w-4xl mx-auto mb-6">
                <div className="bg-white/10 backdrop-blur-lg rounded-2xl p-6 border border-white/20">
                    <div className="flex items-center gap-3">
                        <div className="bg-gradient-to-br from-purple-500 to-pink-500 p-3 rounded-xl">
                            <Bot className="w-8 h-8 text-white" />
                        </div>
                        <div>
                            <h1 className="text-2xl font-bold text-white">AI Traffic Assistant</h1>
                            <p className="text-blue-100">Ask me about traffic laws, fines, and more!</p>
                        </div>
                    </div>
                </div>
            </div>

            {/* Chat Container */}
            <div className="max-w-4xl mx-auto bg-white rounded-2xl shadow-2xl overflow-hidden">
                {/* Messages Area */}
                <div className="h-[500px] overflow-y-auto p-6 space-y-4 bg-gradient-to-b from-gray-50 to-white">
                    {messages.map((message) => (
                        <div
                            key={message.id}
                            className={`flex gap-3 ${message.type === 'user' ? 'flex-row-reverse' : 'flex-row'}`}
                        >
                            {/* Avatar */}
                            <div className={`flex-shrink-0 w-10 h-10 rounded-full flex items-center justify-center ${message.type === 'user'
                                    ? 'bg-gradient-to-br from-blue-500 to-indigo-600'
                                    : 'bg-gradient-to-br from-purple-500 to-pink-500'
                                }`}>
                                {message.type === 'user' ? (
                                    <User className="w-5 h-5 text-white" />
                                ) : (
                                    <Bot className="w-5 h-5 text-white" />
                                )}
                            </div>

                            {/* Message Bubble */}
                            <div className={`flex-1 max-w-[70%] ${message.type === 'user' ? 'items-end' : 'items-start'}`}>
                                <div className={`rounded-2xl p-4 shadow-md ${message.type === 'user'
                                        ? 'bg-gradient-to-br from-blue-500 to-indigo-600 text-white'
                                        : 'bg-white border border-gray-200 text-gray-800'
                                    }`}>
                                    <p className="text-sm leading-relaxed whitespace-pre-wrap">{message.text}</p>
                                </div>
                                <p className={`text-xs text-gray-500 mt-1 px-2 ${message.type === 'user' ? 'text-right' : 'text-left'
                                    }`}>
                                    {message.timestamp.toLocaleTimeString('en-US', {
                                        hour: '2-digit',
                                        minute: '2-digit'
                                    })}
                                </p>
                            </div>
                        </div>
                    ))}

                    {/* Loading Indicator */}
                    {loading && (
                        <div className="flex gap-3">
                            <div className="flex-shrink-0 w-10 h-10 rounded-full flex items-center justify-center bg-gradient-to-br from-purple-500 to-pink-500">
                                <Bot className="w-5 h-5 text-white" />
                            </div>
                            <div className="bg-white border border-gray-200 rounded-2xl p-4 shadow-md">
                                <div className="flex items-center gap-2">
                                    <Loader2 className="w-4 h-4 animate-spin text-purple-600" />
                                    <span className="text-sm text-gray-600">Thinking...</span>
                                </div>
                            </div>
                        </div>
                    )}
                </div>

                {/* Input Area */}
                <div className="bg-white border-t border-gray-200 p-4">
                    <div className="flex gap-3">
                        <input
                            type="text"
                            value={input}
                            onChange={(e) => setInput(e.target.value)}
                            onKeyPress={handleKeyPress}
                            placeholder="Ask about traffic laws, fines, disputes..."
                            disabled={loading}
                            className="flex-1 px-4 py-3 bg-gray-50 border border-gray-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-transparent disabled:opacity-50 disabled:cursor-not-allowed transition-all"
                        />
                        <button
                            onClick={sendMessage}
                            disabled={loading || !input.trim()}
                            className="px-6 py-3 bg-gradient-to-r from-purple-600 to-pink-600 text-white rounded-xl hover:from-purple-700 hover:to-pink-700 disabled:opacity-50 disabled:cursor-not-allowed transition-all shadow-lg hover:shadow-xl flex items-center gap-2 font-medium"
                        >
                            <Send className="w-5 h-5" />
                            Send
                        </button>
                    </div>
                </div>

                {/* Quick Questions */}
                <div className="bg-gradient-to-r from-purple-50 to-pink-50 p-4 border-t border-gray-200">
                    <p className="text-sm font-medium text-gray-700 mb-2">Quick Questions:</p>
                    <div className="flex flex-wrap gap-2">
                        {[
                            'What are the fines for speeding?',
                            'How to dispute a traffic fine?',
                            'What happens if I don\'t pay?',
                            'License suspension rules?'
                        ].map((question, index) => (
                            <button
                                key={index}
                                onClick={() => setInput(question)}
                                className="px-3 py-1.5 bg-white text-sm text-gray-700 rounded-lg hover:bg-purple-100 hover:text-purple-700 transition-colors border border-gray-200"
                            >
                                {question}
                            </button>
                        ))}
                    </div>
                </div>
            </div>
        </div>
    );
}
