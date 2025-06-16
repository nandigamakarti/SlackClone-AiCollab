import React, { useState, useRef, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Textarea } from '@/components/ui/textarea';
import { 
  Bold, 
  Italic, 
  Code, 
  Send,
  Sparkles,
  Loader2,
  AlertCircle
} from 'lucide-react';
import { enhanceMessageWithAI } from '@/services/openai';
import { analyzeTone, ToneAnalysis } from '@/services/toneAnalyzer';
import ToneImpactMeter from './ToneImpactMeter';
import { useMessages } from '@/contexts/MessageContext';
import { useAuth } from '@/contexts/AuthContext';
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from '@/components/ui/tooltip';

interface ThreadMessageInputProps {
  channelId: string;
  placeholder?: string;
  parentMessageId: string;
  channelName?: string;
  onInputChange?: (text: string) => void;
}

const ThreadMessageInput: React.FC<ThreadMessageInputProps> = ({ 
  channelId, 
  placeholder = "Reply in thread...",
  parentMessageId,
  channelName = "general",
  onInputChange
}) => {
  const [message, setMessage] = useState('');
  const [isEnhancingWithAI, setIsEnhancingWithAI] = useState(false);
  const [toneAnalysis, setToneAnalysis] = useState<ToneAnalysis | null>(null);
  const [isAnalyzingTone, setIsAnalyzingTone] = useState(false);
  const [typingTimeout, setTypingTimeout] = useState<NodeJS.Timeout | null>(null);
  const textareaRef = useRef<HTMLTextAreaElement>(null);
  const { addReply, getMessages, getThreadReplies, getAllPublicChannelMessages } = useMessages();
  const { user } = useAuth();

  useEffect(() => {
    if (textareaRef.current) {
      textareaRef.current.style.height = '44px';
      textareaRef.current.style.height = Math.min(textareaRef.current.scrollHeight, 400) + 'px';
    }
  }, [message]);

  const generateAIReply = async () => {
    if (isEnhancingWithAI) return;

    setIsEnhancingWithAI(true);
    
    try {
      // Get thread messages with validation
      const parentMessage = getMessages(channelId)?.find(msg => msg.id === parentMessageId);
      const threadReplies = getThreadReplies(channelId, parentMessageId) || [];
      
      // Filter out invalid messages
      const validThreadMessages = (parentMessage ? [parentMessage, ...threadReplies] : threadReplies)
        .filter(msg => msg && typeof msg === 'object' && msg.username && msg.content);
      
      // Create a custom prompt for the AI
      const customPrompt = `
You are an AI assistant helping a user craft a reply in a conversation thread.

Here is the conversation so far:
${validThreadMessages.map(msg => `${msg.username}: ${msg.content}`).join('\n')}

Please generate a thoughtful reply that continues this conversation naturally. 
The reply should be conversational, helpful, and relevant to the discussion.
`;

      // Call the OpenAI API
      const generatedReply = await enhanceMessageWithAI(
        message || "I'm working on a response...",
        validThreadMessages,
        channelName,
        customPrompt
      );
      
      // Update the message with AI-generated content
      setMessage(generatedReply);
      
      // Analyze tone after generating reply
      analyzeToneAndImpact(generatedReply);
    } catch (error) {
      console.error('Error generating AI reply:', error);
      alert('Failed to generate AI reply. Please check your OpenAI API key in the .env file.');
    } finally {
      setIsEnhancingWithAI(false);
    }
  };

  const analyzeToneAndImpact = async (textToAnalyze: string = message) => {
    if (!textToAnalyze.trim()) {
      setIsAnalyzingTone(false);
      setToneAnalysis(null);
      return;
    }
    
    // Don't set isAnalyzingTone here as it's already set in handleInputChange
    // This prevents flickering of the loading state
    try {
      // Get thread messages with validation
      const parentMessage = getMessages(channelId)?.find(msg => msg.id === parentMessageId);
      const threadReplies = getThreadReplies(channelId, parentMessageId) || [];
      
      // Filter out invalid messages
      const validThreadMessages = (parentMessage ? [parentMessage, ...threadReplies] : threadReplies)
        .filter(msg => msg && typeof msg === 'object' && msg.username && msg.content);
      
      // Call the tone analyzer with valid messages
      const analysis = await analyzeTone(textToAnalyze, validThreadMessages, channelName);
      setToneAnalysis(analysis);
    } catch (error) {
      console.error('Error analyzing tone:', error);
      // Provide a default analysis in case of error
      setToneAnalysis({
        tone: 'neutral',
        impact: 'medium',
        suggestions: 'Could not analyze tone due to an error.',
        score: 5
      });
    } finally {
      setIsAnalyzingTone(false);
    }
  };

  const handleInputChange = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
    const newMessage = e.target.value;
    setMessage(newMessage);
    
    // Call the onInputChange prop if provided
    if (onInputChange) {
      onInputChange(newMessage);
    }

    // Auto-resize textarea
    if (textareaRef.current) {
      textareaRef.current.style.height = '44px';
      textareaRef.current.style.height = Math.min(textareaRef.current.scrollHeight, 400) + 'px';
    }

    // Set up debounced tone analysis
    if (typingTimeout) {
      clearTimeout(typingTimeout);
    }

    // Analyze from the first word typed
    if (newMessage.trim().length > 0) {
      // Start analyzing immediately but show loading state
      if (!isAnalyzingTone) {
        setIsAnalyzingTone(true);
      }
      
      setTypingTimeout(setTimeout(() => {
        analyzeToneAndImpact(newMessage);
      }, 800)); // Slightly faster response time
    } else {
      // Clear analysis if message is empty
      setToneAnalysis(null);
      setIsAnalyzingTone(false);
    }
  };

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleSend();
    }
  };

  const handleSend = () => {
    if (!message.trim() || !user) return;

    const messageData = {
      channelId,
      userId: user.id,
      username: user.displayName,
      content: message.trim(),
      threadParticipants: [],
    };

    addReply(channelId, parentMessageId, messageData);
    
    // Clear message and tone analysis
    setMessage('');
    setToneAnalysis(null);
    setIsAnalyzingTone(false);
    
    // Notify parent component that message is empty
    if (onInputChange) {
      onInputChange('');
    }
  };

  const handleFormatting = (type: string) => {
    if (!textareaRef.current) return;
    
    const start = textareaRef.current.selectionStart;
    const end = textareaRef.current.selectionEnd;
    const selectedText = message.substring(start, end);
    
    let formattedText = '';
    let cursorPosition = 0;
    
    switch (type) {
      case 'bold':
        formattedText = `**${selectedText}**`;
        cursorPosition = start + 2;
        break;
      case 'italic':
        formattedText = `*${selectedText}*`;
        cursorPosition = start + 1;
        break;
      case 'code':
        formattedText = `\`${selectedText}\``;
        cursorPosition = start + 1;
        break;
      default:
        return;
    }
    
    const newText = message.substring(0, start) + formattedText + message.substring(end);
    setMessage(newText);
    
    setTimeout(() => {
      if (textareaRef.current) {
        textareaRef.current.focus();
        if (!selectedText) {
          textareaRef.current.selectionStart = cursorPosition;
          textareaRef.current.selectionEnd = cursorPosition;
        } else {
          textareaRef.current.selectionStart = start;
          textareaRef.current.selectionEnd = start + formattedText.length;
        }
      }
    }, 0);
  };

  return (
    <div className="relative">
      {/* Main Input Container */}
      <div className="bg-chat-dark shadow-md">
        {/* Tone & Impact Meter */}
        {(toneAnalysis || isAnalyzingTone) && (
          <div className="mb-2 mx-2">
            <ToneImpactMeter 
              analysis={toneAnalysis} 
              isLoading={isAnalyzingTone} 
              message={message} 
            />
          </div>
        )}
        
        {/* Formatting Options */}
        <div className="flex items-center space-x-2 p-2 border-t border-gray-700">
          <Button
            variant="ghost"
            size="sm"
            onClick={() => handleFormatting('bold')}
            className="h-8 w-8 p-0 text-gray-300 hover:text-white hover:bg-gray-700 rounded-md"
          >
            <Bold className="w-4 h-4" />
          </Button>
          <Button
            variant="ghost"
            size="sm"
            onClick={() => handleFormatting('italic')}
            className="h-8 w-8 p-0 text-gray-300 hover:text-white hover:bg-gray-700 rounded-md"
          >
            <Italic className="w-4 h-4" />
          </Button>
          <Button
            variant="ghost"
            size="sm"
            onClick={() => handleFormatting('code')}
            className="h-8 w-8 p-0 text-gray-300 hover:text-white hover:bg-gray-700 rounded-md"
          >
            <Code className="w-4 h-4" />
          </Button>
        </div>
        
        {/* Text Input */}
        <div className="flex items-end p-2 space-x-2">
          <Textarea
            ref={textareaRef}
            value={message}
            onChange={handleInputChange}
            onKeyPress={handleKeyPress}
            placeholder={placeholder}
            className="flex-1 min-h-[44px] max-h-[400px] resize-none bg-gray-700 border border-gray-600 rounded-md text-white placeholder:text-gray-400 focus:ring-1 focus:ring-blue-500 focus:border-blue-500 px-3 py-2"
            rows={1}
          />
          <div className="flex items-center space-x-1">
            {/* AI Response Generation Button */}
            <TooltipProvider>
              <Tooltip>
                <TooltipTrigger asChild>
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={generateAIReply}
                    disabled={isEnhancingWithAI}
                    className="h-10 w-10 p-0 text-blue-400 hover:text-blue-300 hover:bg-gray-700 rounded-md"
                  >
                    {isEnhancingWithAI ? (
                      <Loader2 className="w-5 h-5 animate-spin" />
                    ) : (
                      <Sparkles className="w-5 h-5 ai-icon-glow ai-icon-shine" />
                    )}
                  </Button>
                </TooltipTrigger>
                <TooltipContent side="top">
                  <p>Generate AI response to this thread</p>
                </TooltipContent>
              </Tooltip>
            </TooltipProvider>
            <Button
              onClick={handleSend}
              disabled={!message.trim()}
              size="sm"
              className="h-8 w-8 p-0 bg-purple-600 hover:bg-purple-700 text-white disabled:opacity-50 rounded-md"
              title="Send message"
            >
              <Send className="w-4 h-4" />
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ThreadMessageInput;
