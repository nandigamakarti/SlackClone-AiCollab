import React, { useState, useRef, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Textarea } from '@/components/ui/textarea';
import { Send, X, Loader2, Sparkles } from 'lucide-react';
import { useMessages } from '@/contexts/MessageContext';
import { getAIResponse } from '@/services/openai';

interface AIChatboxProps {
  isOpen: boolean;
  onClose: () => void;
  channelNames: { [channelId: string]: string };
}

interface AIMessage {
  id: string;
  role: 'user' | 'assistant';
  content: string;
  timestamp: Date;
}

const AIChatbox: React.FC<AIChatboxProps> = ({ isOpen, onClose, channelNames }) => {
  const [messages, setMessages] = useState<AIMessage[]>([]);
  const [inputValue, setInputValue] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const { getAllPublicChannelMessages } = useMessages();

  // Add welcome message when component mounts
  useEffect(() => {
    if (messages.length === 0) {
      setMessages([
        {
          id: 'welcome',
          role: 'assistant',
          content: "👋 Hi there! I'm your AI assistant. I can help you with information from all public channels and pinned documents. What would you like to know?",
          timestamp: new Date()
        }
      ]);
    }
  }, []);

  // Scroll to bottom when messages change
  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages]);

  const handleSendMessage = async () => {
    if (!inputValue.trim() || isLoading) return;

    const userMessage: AIMessage = {
      id: Date.now().toString(),
      role: 'user',
      content: inputValue.trim(),
      timestamp: new Date()
    };

    // Add user message to chat
    setMessages(prev => [...prev, userMessage]);
    setInputValue('');
    setIsLoading(true);

    try {
      // Get all public channel messages
      const allChannelMessages = getAllPublicChannelMessages();
      
      // Get AI response
      const aiResponseText = await getAIResponse(
        userMessage.content,
        allChannelMessages,
        channelNames
      );

      // Add AI response to chat
      setMessages(prev => [
        ...prev,
        {
          id: Date.now().toString(),
          role: 'assistant',
          content: aiResponseText,
          timestamp: new Date()
        }
      ]);
    } catch (error) {
      console.error('Error getting AI response:', error);
      
      // Add error message with specific information
      let errorMessage = "I'm sorry, I encountered an error processing your request.";
      
      if (error instanceof Error) {
        if (error.message.includes('API key')) {
          errorMessage += " Please check that your OpenAI API key is properly set in the .env file.";
        } else if (error.message.includes('rate limit')) {
          errorMessage += " The API rate limit has been exceeded. Please try again later.";
        }
      }
      
      setMessages(prev => [
        ...prev,
        {
          id: Date.now().toString(),
          role: 'assistant',
          content: errorMessage,
          timestamp: new Date()
        }
      ]);
    } finally {
      setIsLoading(false);
    }
  };

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleSendMessage();
    }
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-50">
      <div className="bg-gray-900 rounded-lg shadow-lg w-full max-w-2xl h-[80vh] flex flex-col overflow-hidden">
        {/* Header */}
        <div className="flex items-center justify-between p-4 border-b border-gray-700">
          <div className="flex items-center space-x-2">
            <Sparkles className="w-5 h-5 text-blue-400 ai-icon-glow ai-icon-shine" />
            <h2 className="text-lg font-semibold text-white">AI Assistant</h2>
          </div>
          <Button
            variant="ghost"
            size="sm"
            onClick={onClose}
            className="h-8 w-8 p-0 rounded-full text-gray-400 hover:text-white hover:bg-gray-700"
          >
            <X className="w-5 h-5" />
          </Button>
        </div>

        {/* Messages */}
        <div className="flex-1 p-4 overflow-y-auto bg-gray-800">
          <div className="space-y-4">
            {messages.map(message => (
              <div
                key={message.id}
                className={`flex ${message.role === 'user' ? 'justify-end' : 'justify-start'}`}
              >
                <div
                  className={`max-w-[80%] rounded-lg p-3 ${
                    message.role === 'user'
                      ? 'bg-purple-600 text-white'
                      : 'bg-gray-700 text-white'
                  }`}
                >
                  <div className="whitespace-pre-wrap">{message.content}</div>
                  <div className="text-xs text-gray-300 mt-1">
                    {message.timestamp.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                  </div>
                </div>
              </div>
            ))}
            {isLoading && (
              <div className="flex justify-start">
                <div className="bg-gray-700 rounded-lg p-3 flex items-center space-x-2">
                  <Loader2 className="w-4 h-4 text-blue-400 animate-spin" />
                  <span className="text-white">Thinking...</span>
                </div>
              </div>
            )}
            <div ref={messagesEndRef} />
          </div>
        </div>

        {/* Input */}
        <div className="p-4 border-t border-gray-700">
          <div className="flex space-x-2">
            <Textarea
              value={inputValue}
              onChange={e => setInputValue(e.target.value)}
              onKeyPress={handleKeyPress}
              placeholder="Ask me anything about your workspace..."
              className="flex-1 min-h-[44px] max-h-[120px] resize-none bg-gray-700 border border-gray-600 rounded-md text-white placeholder:text-gray-400 focus:ring-1 focus:ring-blue-500 focus:border-blue-500"
              rows={1}
            />
            <Button
              onClick={handleSendMessage}
              disabled={!inputValue.trim() || isLoading}
              className="h-[44px] bg-blue-600 hover:bg-blue-700 text-white disabled:opacity-50"
            >
              {isLoading ? <Loader2 className="w-4 h-4 animate-spin" /> : <Send className="w-4 h-4" />}
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default AIChatbox;
