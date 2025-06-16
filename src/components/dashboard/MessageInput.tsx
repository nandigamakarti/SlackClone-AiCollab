import React, { useState, useRef, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Textarea } from '@/components/ui/textarea';
import { 
  Send,
  Paperclip,
  Smile,
  AtSign,
  Hash,
  Bold,
  Italic,
  Code,
  Link2,
  Image as ImageIcon,
  File as FileIcon,
  X,
  Loader2
} from 'lucide-react';
import { useAuth } from '@/contexts/AuthContext';
import SentimentMeter from './SentimentMeter';
import { analyzeSentiment } from '@/services/aiAnalyzer';
// Import these when they're properly installed
// import data from '@emoji-mart/data';
// import Picker from '@emoji-mart/react';
import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover';
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from '@/components/ui/tooltip';

interface MessageInputProps {
  channelId?: string;
  placeholder?: string;
  onSendMessage?: (content: string, parentMessageId?: string) => Promise<any>;
  threadParentId?: string;
  onFileUpload?: (files: FileList) => void;
  channelMessages?: any[];
  channelName?: string;
  onInputChange?: (text: string) => void;
}

const MessageInput: React.FC<MessageInputProps> = ({
  channelId,
  placeholder = "Type a message...",
  onSendMessage,
  threadParentId,
  onFileUpload,
  channelMessages = [],
  channelName = '',
  onInputChange
}) => {
  const { user } = useAuth();
  const [message, setMessage] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [sentimentData, setSentimentData] = useState<any>(null);
  const [isAnalyzing, setIsAnalyzing] = useState(false);
  const [showFormatting, setShowFormatting] = useState(false);
  const [selectedFiles, setSelectedFiles] = useState<File[]>([]);
  const [showEmojiPicker, setShowEmojiPicker] = useState(false);
  const textareaRef = useRef<HTMLTextAreaElement>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);
  const imageInputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    const analyzeMessageSentiment = async () => {
      // Always show the analyzer for testing - remove the length check
      try {
        setIsAnalyzing(true);
        const analysis = await analyzeSentiment(message, channelMessages, channelName || '');
        setSentimentData(analysis);
      } catch (error) {
        console.error('Sentiment analysis failed:', error);
        setSentimentData(null);
      } finally {
        setIsAnalyzing(false);
      }
    };

    const debounceTimer = setTimeout(analyzeMessageSentiment, 300);
    return () => clearTimeout(debounceTimer);
  }, [message, channelMessages, channelName]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    // Do nothing if there's no message or no callback
    if ((!message.trim() && selectedFiles.length === 0) || isSubmitting || !onSendMessage) return;

    setIsSubmitting(true);
    
    // Log submission attempt for debugging
    console.log(`Submitting message in ${channelId?.startsWith('dm-') ? 'DM' : 'channel'}: ${message}`);

    // In a real app, you would upload the files here and get their URLs
    // Then include those URLs in your message or as attachments
    const hasFiles = selectedFiles.length > 0;
    let fileDetails = '';
    
    if (hasFiles) {
      fileDetails = '\n\n' + selectedFiles.map(file => 
        `Attached: ${file.name} (${(file.size / 1024).toFixed(1)} KB)`
      ).join('\n');
    }
    
    try {
      // Check if this is a DM channel (starts with 'dm-')
      const isDM = channelId?.startsWith('dm-');
      
      // Send the message with a timeout to prevent hanging
      const sendPromise = onSendMessage(message.trim() + fileDetails, threadParentId);
      
      // Set a timeout to prevent the UI from hanging indefinitely
      const timeoutPromise = new Promise((_, reject) => {
        setTimeout(() => reject(new Error('Send message timeout')), 10000);
      });
      
      // Race the send against the timeout
      await Promise.race([sendPromise, timeoutPromise])
        .catch(error => {
          if (error.message === 'Send message timeout') {
            console.warn('Message send timed out, but may still complete in background');
          } else {
            throw error;
          }
        });
      
      // Reset state
      setMessage('');
      setSentimentData(null);
      setSelectedFiles([]);
      
      // Reset textarea height
      if (textareaRef.current) {
        textareaRef.current.style.height = 'auto';
      }
      
      // Force textarea focus after sending (especially helpful for DMs)
      setTimeout(() => {
        if (textareaRef.current) {
          textareaRef.current.focus();
        }
      }, 100);
      
    } catch (error) {
      console.error('Error sending message:', error);
      alert('Failed to send message. Please try again.');
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleSubmit(e);
    }
  };

  const handleTextareaChange = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
    const newMessage = e.target.value;
    setMessage(newMessage);
    
    // Call the onInputChange prop if provided
    if (onInputChange) {
      onInputChange(newMessage);
    }
    
    // Auto-resize textarea
    const textarea = e.target;
    textarea.style.height = 'auto';
    textarea.style.height = `${Math.min(textarea.scrollHeight, 120)}px`;
  };

  const insertFormatting = (type: string) => {
    if (!textareaRef.current) return;
    
    const textarea = textareaRef.current;
    const start = textarea.selectionStart;
    const end = textarea.selectionEnd;
    const selectedText = message.substring(start, end);
    
    let formattedText = '';
    let cursorOffset = 0;
    
    switch (type) {
      case 'bold':
        formattedText = `**${selectedText}**`;
        cursorOffset = selectedText ? 0 : 2;
        break;
      case 'italic':
        formattedText = `_${selectedText}_`;
        cursorOffset = selectedText ? 0 : 1;
        break;
      case 'code':
        formattedText = `\`${selectedText}\``;
        cursorOffset = selectedText ? 0 : 1;
        break;
      case 'link':
        formattedText = `[${selectedText || 'link text'}](url)`;
        cursorOffset = selectedText ? -4 : -10;
        break;
    }
    
    const newMessage = message.substring(0, start) + formattedText + message.substring(end);
    setMessage(newMessage);
    
    setTimeout(() => {
      const newPosition = start + formattedText.length + cursorOffset;
      textarea.setSelectionRange(newPosition, newPosition);
      textarea.focus();
    }, 0);
  };

  const handleFileSelect = () => {
    fileInputRef.current?.click();
  };

  const handleImageSelect = () => {
    imageInputRef.current?.click();
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files;
    if (files && files.length > 0) {
      // Convert FileList to Array and add to selectedFiles
      const filesArray = Array.from(files);
      setSelectedFiles(prev => [...prev, ...filesArray]);
      
      // Reset the file input
      e.target.value = '';
    }
  };

  const removeFile = (index: number) => {
    setSelectedFiles(prev => prev.filter((_, i) => i !== index));
  };

  const handleEmojiSelect = (emoji: any) => {
    if (!textareaRef.current) return;
    
    const textarea = textareaRef.current;
    const start = textarea.selectionStart;
    const end = textarea.selectionEnd;
    
    const newMessage = message.substring(0, start) + emoji + message.substring(end);
    setMessage(newMessage);
    
    setTimeout(() => {
      const newPosition = start + emoji.length;
      textarea.setSelectionRange(newPosition, newPosition);
      textarea.focus();
    }, 0);
    
    setShowEmojiPicker(false);
  };

  // Simple emoji picker until we fix the emoji-mart imports
  const simpleEmojis = ["😊", "😃", "😄", "😁", "😆", "😅", "😂", "🙂", "😉", "😍", "😘", "👍", "👎", "❤️", "🔥"];

  if (!user) {
    return (
      <div className="p-4 text-center text-gray-500">
        Please log in to send messages
      </div>
    );
  }

  return (
    <div className="w-full">
      {/* Sentiment Meter - Show for debug */}
      {(sentimentData || isAnalyzing) && (
        <div className="mb-2">
          <SentimentMeter
            analysis={sentimentData}
            isLoading={isAnalyzing}
            message={message}
          />
        </div>
      )}
      
      {/* Formatting toolbar */}
      <div className="flex items-center space-x-1 mb-2 px-2 py-1 border-t border-gray-700 bg-gray-800 rounded-t-md">
        <TooltipProvider>
          <Tooltip>
            <TooltipTrigger asChild>
              <Button
                type="button"
                variant="ghost"
                size="sm"
                onClick={() => insertFormatting('bold')}
                className="h-8 w-8 p-0 text-gray-400 hover:text-white hover:bg-gray-700"
              >
                <Bold className="w-4 h-4" />
              </Button>
            </TooltipTrigger>
            <TooltipContent side="top">
              <p className="text-xs">Bold (Ctrl+B)</p>
            </TooltipContent>
          </Tooltip>
        </TooltipProvider>
        
        <TooltipProvider>
          <Tooltip>
            <TooltipTrigger asChild>
              <Button
                type="button"
                variant="ghost"
                size="sm"
                onClick={() => insertFormatting('italic')}
                className="h-8 w-8 p-0 text-gray-400 hover:text-white hover:bg-gray-700"
              >
                <Italic className="w-4 h-4" />
              </Button>
            </TooltipTrigger>
            <TooltipContent side="top">
              <p className="text-xs">Italic (Ctrl+I)</p>
            </TooltipContent>
          </Tooltip>
        </TooltipProvider>
        
        <TooltipProvider>
          <Tooltip>
            <TooltipTrigger asChild>
              <Button
                type="button"
                variant="ghost"
                size="sm"
                onClick={() => insertFormatting('code')}
                className="h-8 w-8 p-0 text-gray-400 hover:text-white hover:bg-gray-700"
              >
                <Code className="w-4 h-4" />
              </Button>
            </TooltipTrigger>
            <TooltipContent side="top">
              <p className="text-xs">Code (Ctrl+Shift+C)</p>
            </TooltipContent>
          </Tooltip>
        </TooltipProvider>
        
        <TooltipProvider>
          <Tooltip>
            <TooltipTrigger asChild>
              <Button
                type="button"
                variant="ghost"
                size="sm"
                onClick={() => insertFormatting('link')}
                className="h-8 w-8 p-0 text-gray-400 hover:text-white hover:bg-gray-700"
              >
                <Link2 className="w-4 h-4" />
              </Button>
            </TooltipTrigger>
            <TooltipContent side="top">
              <p className="text-xs">Link (Ctrl+K)</p>
            </TooltipContent>
          </Tooltip>
        </TooltipProvider>
        
        <span className="border-l border-gray-700 h-5 mx-1"></span>
        
        <TooltipProvider>
          <Tooltip>
            <TooltipTrigger asChild>
              <Button
                type="button"
                variant="ghost"
                size="sm"
                onClick={handleImageSelect}
                className="h-8 w-8 p-0 text-gray-400 hover:text-white hover:bg-gray-700"
              >
                <ImageIcon className="w-4 h-4" />
              </Button>
            </TooltipTrigger>
            <TooltipContent side="top">
              <p className="text-xs">Upload Image</p>
            </TooltipContent>
          </Tooltip>
        </TooltipProvider>
        
        <TooltipProvider>
          <Tooltip>
            <TooltipTrigger asChild>
              <Button
                type="button"
                variant="ghost"
                size="sm"
                onClick={handleFileSelect}
                className="h-8 w-8 p-0 text-gray-400 hover:text-white hover:bg-gray-700"
              >
                <Paperclip className="w-4 h-4" />
              </Button>
            </TooltipTrigger>
            <TooltipContent side="top">
              <p className="text-xs">Attach File</p>
            </TooltipContent>
          </Tooltip>
        </TooltipProvider>
        
        <Popover open={showEmojiPicker} onOpenChange={setShowEmojiPicker}>
          <PopoverTrigger asChild>
            <Button
              type="button"
              variant="ghost"
              size="sm"
              className="h-8 w-8 p-0 text-gray-400 hover:text-white hover:bg-gray-700"
            >
              <Smile className="w-4 h-4" />
            </Button>
          </PopoverTrigger>
          <PopoverContent side="top" className="w-auto p-0 border-gray-700 bg-gray-800">
            <div className="p-2 grid grid-cols-5 gap-1">
              {simpleEmojis.map((emoji, index) => (
                <button
                  key={index}
                  onClick={() => handleEmojiSelect(emoji)}
                  className="hover:bg-gray-700 rounded p-1 transition-colors"
                >
                  {emoji}
                </button>
              ))}
            </div>
          </PopoverContent>
        </Popover>
      </div>

      {/* File Previews */}
      {selectedFiles.length > 0 && (
        <div className="mb-2 p-3 bg-gray-800 rounded-md border border-gray-700">
          <div className="flex flex-wrap gap-2">
            {selectedFiles.map((file, index) => (
              <div key={index} className="flex items-center bg-gray-700 rounded-md px-2 py-1 text-sm text-white">
                <div className="flex items-center">
                  {file.type.startsWith('image/') ? (
                    <ImageIcon className="w-4 h-4 mr-1 text-blue-400" />
                  ) : (
                    <FileIcon className="w-4 h-4 mr-1 text-purple-400" />
                  )}
                  <span className="truncate max-w-[150px]">{file.name}</span>
                </div>
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={() => removeFile(index)}
                  className="h-5 w-5 p-0 ml-1 text-gray-400 hover:text-white hover:bg-gray-600 rounded-full"
                >
                  <X className="w-3 h-3" />
                </Button>
              </div>
            ))}
          </div>
        </div>
      )}
      
      {/* Message Form */}
      <form onSubmit={handleSubmit} className="relative flex flex-col bg-gray-800 rounded-md border border-gray-700 shadow-lg">
        <Textarea
          ref={textareaRef}
          value={message}
          onChange={handleTextareaChange}
          onKeyDown={handleKeyDown}
          placeholder={placeholder}
          className="min-h-[40px] max-h-[120px] resize-none bg-gray-800 border-0 text-white placeholder-gray-400 focus:ring-0 focus:outline-none px-3 py-3"
          disabled={isSubmitting}
        />
        
        <div className="flex items-center justify-between px-3 py-2 border-t border-gray-700">
          <div className="flex items-center space-x-2">
            <TooltipProvider>
              <Tooltip>
                <TooltipTrigger asChild>
                  <Button
                    type="button"
                    variant="ghost"
                    size="sm"
                    onClick={() => setMessage(prev => prev + ' @')}
                    className="h-7 w-7 p-0 text-gray-400 hover:text-white hover:bg-gray-700 rounded-full"
                  >
                    <AtSign className="w-4 h-4" />
                  </Button>
                </TooltipTrigger>
                <TooltipContent side="top">
                  <p className="text-xs">Mention a user</p>
                </TooltipContent>
              </Tooltip>
            </TooltipProvider>
            
            <TooltipProvider>
              <Tooltip>
                <TooltipTrigger asChild>
                  <Button
                    type="button"
                    variant="ghost"
                    size="sm"
                    onClick={() => setMessage(prev => prev + ' #')}
                    className="h-7 w-7 p-0 text-gray-400 hover:text-white hover:bg-gray-700 rounded-full"
                  >
                    <Hash className="w-4 h-4" />
                  </Button>
                </TooltipTrigger>
                <TooltipContent side="top">
                  <p className="text-xs">Reference a channel</p>
                </TooltipContent>
              </Tooltip>
            </TooltipProvider>
          </div>
          
          <Button
            type="submit"
            size="sm"
            disabled={(!message.trim() && selectedFiles.length === 0) || isSubmitting}
            className="h-8 px-3 bg-purple-600 hover:bg-purple-700 disabled:bg-gray-600 text-white"
          >
            {isSubmitting ? (
              <span className="flex items-center">
                <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                Sending
              </span>
            ) : (
              <span className="flex items-center">
                <Send className="w-4 h-4 mr-2" />
                Send
              </span>
            )}
          </Button>
        </div>
      </form>
      
      {/* Hidden File/Image Inputs */}
      <input
        ref={fileInputRef}
        type="file"
        multiple
        onChange={handleFileChange}
        className="hidden"
        accept=".pdf,.doc,.docx,.txt,.xls,.xlsx,.zip,.rar"
      />
      <input
        ref={imageInputRef}
        type="file"
        multiple
        onChange={handleFileChange}
        className="hidden"
        accept="image/*"
      />
    </div>
  );
};

export default MessageInput;
