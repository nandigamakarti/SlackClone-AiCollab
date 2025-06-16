import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Brain, Globe, PaperclipIcon, Search, Send, X } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import { Avatar } from '@/components/ui/avatar';
import { useAuth } from '@/contexts/AuthContext';

interface AIAssistantProps {
  isOpen: boolean;
  onClose: () => void;
}

const AIAssistant: React.FC<AIAssistantProps> = ({ isOpen, onClose }) => {
  const [input, setInput] = useState('');
  const [isDeepSearchEnabled, setIsDeepSearchEnabled] = useState(false);
  const [workspaceOnlyMode, setWorkspaceOnlyMode] = useState(true);
  const { workspace } = useAuth();
  
  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!input.trim()) return;
    
    // Handle submission
    console.log('Submitted:', input);
    setInput('');
  };

  if (!isOpen) return null;

  const workspaceName = workspace?.name || 'Workspace';

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50">
      <motion.div
        initial={{ opacity: 0, scale: 0.95 }}
        animate={{ opacity: 1, scale: 1 }}
        exit={{ opacity: 0, scale: 0.95 }}
        transition={{ duration: 0.2 }}
        className="w-full max-w-4xl h-[85vh] bg-[#0a121f] rounded-lg shadow-2xl overflow-hidden flex flex-col"
      >
        {/* Header */}
        <div className="flex items-center justify-between px-4 py-3 bg-[#0a121f] border-b border-gray-700">
          <div className="flex items-center space-x-2">
            <div className="flex items-center space-x-2">
              <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-indigo-600">
                <Brain className="h-6 w-6 text-white" />
              </div>
              <div>
                <div className="flex items-center">
                  <span className="text-xl font-bold text-white">AI Assistant</span>
                  <span className="ml-2 rounded bg-blue-600 px-1.5 py-0.5 text-xs font-medium text-white">ENHANCED</span>
                </div>
                <div className="flex items-center text-gray-400 text-sm">
                  <span className="flex items-center">
                    <span className="h-2 w-2 rounded-full bg-green-500 mr-1.5"></span>
                    {workspaceName}
                  </span>
                  <span className="mx-2">•</span>
                  <span className="flex items-center">
                    <svg className="h-3.5 w-3.5 mr-1" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 15V9a6 6 0 0112 0v6M3 15h18" />
                    </svg>
                    Workspace Mode
                  </span>
                </div>
              </div>
            </div>
          </div>
          <div className="flex items-center space-x-2">
            <Button 
              variant="ghost" 
              size="icon" 
              className="text-gray-400 hover:text-white hover:bg-gray-700 rounded-full"
              onClick={onClose}
            >
              <X className="h-5 w-5" />
            </Button>
          </div>
        </div>

        {/* Content Area */}
        <div className="flex-1 overflow-y-auto p-4 space-y-4">
          <div className="flex items-start space-x-3">
            <div className="flex-shrink-0">
              <div className="h-8 w-8 rounded-md bg-blue-600 flex items-center justify-center">
                <svg className="h-5 w-5 text-white" viewBox="0 0 24 24" fill="none">
                  <path d="M12 2L14.8 7.6L21 8.4L16.5 12.8L17.6 19L12 16.1L6.4 19L7.5 12.8L3 8.4L9.2 7.6L12 2Z" 
                    stroke="white" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" fill="white" />
                </svg>
              </div>
            </div>
            <div className="bg-[#1e2837] rounded-lg p-4 w-full">
              <div className="flex items-center mb-2">
                <svg className="h-4 w-4 text-white mr-2" viewBox="0 0 24 24" fill="none">
                  <path d="M8 6h13M8 12h13M8 18h13M3 6h.01M3 12h.01M3 18h.01" 
                    stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                </svg>
                <span className="text-blue-400 font-semibold">Workspace Analysis</span>
              </div>
              
              <div className="mb-4">
                <div className="bg-blue-600 rounded-md text-white py-1 px-2 inline-flex items-center">
                  <span className="mr-1">🤖</span>
                  <span className="font-bold">**AI Assistant Ready!**</span>
                </div>
              </div>
              
              <div className="space-y-4 text-white">
                <p>Hello! I'm your enhanced AI assistant for <strong>*{workspaceName}*</strong>.</p>
                
                <p className="font-semibold">**What I can do:**</p>
                <ul className="space-y-2">
                  <li className="flex items-start">
                    <span className="mr-2">📊</span>
                    <span>Analyze your workspace conversations</span>
                  </li>
                  <li className="flex items-start">
                    <span className="mr-2">📌</span>
                    <span>Review pinned documents and images</span>
                  </li>
                  <li className="flex items-start">
                    <span className="mr-2">🔍</span>
                    <span>Search through channel history</span>
                  </li>
                  <li className="flex items-start">
                    <span className="mr-2">🌐</span>
                    <span>Access web information (when Deep Search is enabled)</span>
                  </li>
                </ul>
                
                <p className="font-semibold">**Getting Started:**</p>
                <p>Just ask me anything about your workspace or enable Deep Search for broader knowledge!</p>
              </div>
            </div>
          </div>
        </div>

        {/* Footer */}
        <div className="p-4 border-t border-gray-700">
          <div className="flex items-center mb-2 space-x-3">
            <Button 
              variant="outline" 
              size="sm"
              className={`${isDeepSearchEnabled ? 'bg-indigo-600 text-white' : 'bg-transparent text-gray-400 border-gray-700'} text-xs px-3 py-1 h-auto flex items-center space-x-1`}
              onClick={() => setIsDeepSearchEnabled(!isDeepSearchEnabled)}
            >
              <Search className="h-3.5 w-3.5" />
              <span>Deep Search Mode</span>
            </Button>
            
            <Button 
              variant="outline" 
              size="sm"
              className="bg-indigo-600/20 text-indigo-400 border-indigo-800 text-xs px-3 py-1 h-auto flex items-center space-x-1"
            >
              <svg className="h-3.5 w-3.5" viewBox="0 0 24 24" fill="none">
                <path d="M3 15V9a6 6 0 0112 0v6M3 15h18" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
              </svg>
              <span>Workspace-only mode active</span>
            </Button>
          </div>
          
          <form onSubmit={handleSubmit} className="relative">
            <Input
              placeholder={`Ask me about ${workspaceName}...`}
              value={input}
              onChange={(e) => setInput(e.target.value)}
              className="bg-[#1e2837] border-gray-700 text-gray-200 pl-4 pr-12 py-6 rounded-lg focus-visible:ring-indigo-500"
            />
            <Button
              type="submit"
              size="sm"
              className={`absolute right-2 top-1/2 transform -translate-y-1/2 ${!input.trim() ? 'text-gray-500' : 'text-indigo-400 hover:text-indigo-300'} bg-transparent hover:bg-transparent`}
              disabled={!input.trim()}
            >
              <Send className="h-5 w-5" />
            </Button>
          </form>
        </div>
      </motion.div>
    </div>
  );
};

export default AIAssistant; 