import React, { useState, useEffect, useRef } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { 
  Hash, 
  Users, 
  Star, 
  Phone, 
  Video, 
  Info, 
  Search,
  X,
  Notebook,
  Copy,
  Download,
  Activity,
  MessageSquare,
  FileText,
  ThumbsUp,
  Bell
} from 'lucide-react';
import { downloadMeetingNotes, generateMeetingNotes } from '@/utils/meetingNotesGenerator';
import { User } from '@/contexts/AuthContext';
import { useMessages, DatabaseMessage } from '@/hooks/useMessages';
import MessageBubble from './MessageBubble';
import MessageInput from './MessageInput';
import ChannelInfoPanel from './ChannelInfoPanel';
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from '@/components/ui/tooltip';
import { Badge } from '@/components/ui/badge';
import { motion, AnimatePresence } from 'framer-motion';
import { useWorkspaceMembers } from '@/hooks/useWorkspaceMembers';
import { formatDistanceToNow } from 'date-fns';
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import MembersPopup from './MembersPopup';
import ActivityPopup from './ActivityPopup';

// Extend the DatabaseMessage interface to include reactions
interface ExtendedDatabaseMessage extends DatabaseMessage {
  reactions?: any[];
}

// Define the Channel interface if not already defined elsewhere
interface Channel {
  id: string;
  name: string;
  isPrivate: boolean;
  description?: string;
  topic?: string;
  unreadCount?: number;
  createdAt: string;
  createdBy?: string;
}

interface ChatAreaProps {
  channel: string | null;
  user: User | null;
  channels?: Channel[];
  workspaceId?: string;
}

const ChatArea: React.FC<ChatAreaProps> = ({ channel, user, channels = [], workspaceId }) => {
  const { messages, loading, sendMessage } = useMessages(channel || undefined);
  const [isFavorite, setIsFavorite] = useState(false);
  const [showSearch, setShowSearch] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const [showInfoPanel, setShowInfoPanel] = useState(false);
  const [isTyping, setIsTyping] = useState<{[key: string]: boolean}>({});
  const [typingTimeout, setTypingTimeout] = useState<{[key: string]: NodeJS.Timeout}>({});
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const { members } = useWorkspaceMembers(workspaceId);
  const [activeMembers, setActiveMembers] = useState<string[]>([]);
  const [recentActivity, setRecentActivity] = useState<string>('');
  const [showAiNotesModal, setShowAiNotesModal] = useState(false);
  const [aiNotes, setAiNotes] = useState<string>('');
  const [isLoadingNotes, setIsLoadingNotes] = useState(false);
  const [showMembersPopover, setShowMembersPopover] = useState(false);
  const [showActivityPopover, setShowActivityPopover] = useState(false);
  
  // Check if channel is starred
  useEffect(() => {
    if (channel) {
      const starredChannels = JSON.parse(localStorage.getItem('starredChannels') || '[]');
      setIsFavorite(starredChannels.includes(channel));
    }
  }, [channel]);
  
  // Simulate recent activity
  useEffect(() => {
    if (channel && messages.length > 0) {
      const lastMessage = messages[messages.length - 1];
      const lastActivity = `Last message ${formatDistanceToNow(new Date(lastMessage.created_at), { addSuffix: true })}`;
      setRecentActivity(lastActivity);
      
      // Simulate active members (in a real app, this would come from the server)
      const uniqueUsers = [...new Set(messages.slice(-10).map(msg => msg.user_id))];
      setActiveMembers(uniqueUsers);
    }
  }, [channel, messages]);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  const getChannelIcon = () => {
    if (!channel) {
      return <Hash className="w-5 h-5" />;
    }
    if (channel.startsWith('dm-')) {
      return <Users className="w-5 h-5" />;
    }
    return <Hash className="w-5 h-5" />;
  };

  const getChannelDetails = () => {
    if (!channel) {
      return { name: 'Select a channel', description: '', topic: '', isPrivate: false, createdAt: '', createdBy: '' };
    }
    
    // For direct messages, we'll need to get the user name from the workspace members
    if (channel.startsWith('dm-')) {
      const userId = channel.substring(3); // Remove 'dm-' prefix
      const member = members.find(m => m.user_id === userId);
      return { 
        name: member?.profiles?.display_name || 'Direct Message',
        description: '',
        topic: '',
        isPrivate: true,
        createdAt: new Date().toISOString(),
        createdBy: ''
      };
    }
    
    // For channels, look up the details in the channels array
    const foundChannel = channels.find(c => c.id === channel);
    return { 
      name: foundChannel?.name || channel,
      description: foundChannel?.description || '',
      topic: foundChannel?.topic || '',
      isPrivate: foundChannel?.isPrivate || false,
      createdAt: foundChannel?.createdAt || new Date().toISOString(),
      createdBy: foundChannel?.createdBy || ''
    };
  };

  const shouldShowAvatar = (messageIndex: number) => {
    if (messageIndex === 0) return true;
    const currentMessage = messages[messageIndex];
    const previousMessage = messages[messageIndex - 1];
    
    // Show avatar if different user or time gap > 5 minutes
    const timeDiff = new Date(currentMessage.created_at).getTime() - new Date(previousMessage.created_at).getTime();
    return currentMessage.user_id !== previousMessage.user_id || timeDiff > 5 * 60 * 1000;
  };

  const isGroupedMessage = (messageIndex: number) => {
    if (messageIndex === 0) return false;
    const currentMessage = messages[messageIndex];
    const previousMessage = messages[messageIndex - 1];
    
    // Group if same user and within 5 minutes
    const timeDiff = new Date(currentMessage.created_at).getTime() - new Date(previousMessage.created_at).getTime();
    return currentMessage.user_id === previousMessage.user_id && timeDiff <= 5 * 60 * 1000;
  };

  const handleStarClick = () => {
    const newStarredState = !isFavorite;
    setIsFavorite(newStarredState);
    
    if (channel) {
      // Update local storage
      const starredChannels = JSON.parse(localStorage.getItem('starredChannels') || '[]');
      
      if (newStarredState) {
        localStorage.setItem('starredChannels', JSON.stringify([...starredChannels, channel]));
      } else {
        localStorage.setItem('starredChannels', JSON.stringify(
          starredChannels.filter((id: string) => id !== channel)
        ));
      }
    }
  };

  const handleSearchClick = () => {
    setShowSearch(!showSearch);
    if (!showSearch) {
      setSearchQuery('');
    }
  };
  
  const handleInfoClick = () => {
    setShowInfoPanel(!showInfoPanel);
  };
  
  const handleLeaveChannel = () => {
    // In a real app, this would call an API to remove the user from the channel
    alert(`You have left the channel: ${channelDetails.name}`);
    setShowInfoPanel(false);
  };
  
  const handleUpdateChannel = (data: { topic?: string; description?: string }) => {
    // In a real app, this would call an API to update the channel
    console.log('Update channel:', data);
    alert(`Channel updated:\nTopic: ${data.topic}\nDescription: ${data.description}`);
  };
  
  const handleUserTyping = (userId: string, isCurrentlyTyping: boolean) => {
    // Clear any existing timeout for this user
    if (typingTimeout[userId]) {
      clearTimeout(typingTimeout[userId]);
    }
    
    // Update typing status
    setIsTyping(prev => ({
      ...prev,
      [userId]: isCurrentlyTyping
    }));
    
    // Set a timeout to clear the typing status after 3 seconds
    if (isCurrentlyTyping) {
      setTypingTimeout(prev => ({
        ...prev,
        [userId]: setTimeout(() => {
          setIsTyping(prevTyping => ({
            ...prevTyping,
            [userId]: false
          }));
        }, 3000)
      }));
    }
  };
  
  const handleInputChange = (text: string) => {
    // Simulate sending typing indicator to other users
    if (user) {
      handleUserTyping(user.id, text.length > 0);
    }
  };

  const filteredMessages = searchQuery.trim() 
    ? messages.filter(message => 
        message.content.toLowerCase().includes(searchQuery.toLowerCase()) ||
        (message.profiles?.display_name || '').toLowerCase().includes(searchQuery.toLowerCase())
      )
    : messages;

  // Convert database messages to the format expected by MessageBubble
  const formattedMessages = filteredMessages.map(msg => {
    const extendedMsg = msg as ExtendedDatabaseMessage;
    return {
    id: msg.id,
    channelId: msg.channel_id,
    userId: msg.user_id,
    username: msg.profiles?.display_name || 'User',
    avatar: msg.profiles?.avatar,
    content: msg.content,
    timestamp: new Date(msg.created_at),
    edited: !!msg.edited_at,
    editedAt: msg.edited_at ? new Date(msg.edited_at) : undefined,
      reactions: extendedMsg.reactions || [],
    replies: [],
    replyCount: 0,
    threadParticipants: [],
    isPinned: msg.is_pinned || false
    };
  });

  const handleAiNotesClick = async () => {
    if (!channel) return;
    
    setShowAiNotesModal(true);
    setIsLoadingNotes(true);
    
    try {
      // Try to fetch existing notes first
      const response = await fetch(`/api/notes/${channel}`);
      
      if (response.ok) {
        const data = await response.json();
        setAiNotes(data.notes);
      } else {
        // If no notes exist, generate them
        const generateResponse = await fetch(`/api/generate-notes/${channel}`, {
          method: 'POST'
        });
        
        if (generateResponse.ok) {
          const data = await generateResponse.json();
          setAiNotes(data.notes);
        } else {
          // Fallback to client-side generation if API fails
          const notes = await generateMeetingNotes(formattedMessages, getChannelDetails().name);
          setAiNotes(notes);
        }
      }
    } catch (error) {
      console.error('Error fetching AI notes:', error);
      // Fallback to client-side generation
      try {
        const notes = await generateMeetingNotes(formattedMessages, getChannelDetails().name);
        setAiNotes(notes);
      } catch (fallbackError) {
        console.error('Error generating fallback notes:', fallbackError);
        setAiNotes('Failed to generate AI notes. Please try again later.');
      }
    } finally {
      setIsLoadingNotes(false);
    }
  };

  const handleCopyNotes = () => {
    navigator.clipboard.writeText(aiNotes)
      .then(() => {
        // You could add a toast notification here
        console.log('Notes copied to clipboard');
      })
      .catch(err => {
        console.error('Failed to copy notes:', err);
      });
  };

  const handleDownloadNotes = () => {
    // Create a safe filename from the channel name
    const channelDetails = getChannelDetails();
    const safeChannelName = channelDetails.name.replace(/[^a-z0-9]/gi, '_').toLowerCase();
    const timestamp = new Date().toISOString().replace(/[:.]/g, '-');
    const filename = `${safeChannelName}_ai_notes_${timestamp}.txt`;
    
    // Create a blob and download link
    const blob = new Blob([aiNotes], { type: 'text/plain' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    
    link.href = url;
    link.download = filename;
    document.body.appendChild(link);
    link.click();
    
    // Clean up
    setTimeout(() => {
      document.body.removeChild(link);
      URL.revokeObjectURL(url);
    }, 100);
  };

  // Get channel details for the info panel
  const channelDetails = getChannelDetails();

  // Helper function to check if current channel is a DM
  const isDMChannel = () => {
    return channel?.startsWith('dm-') || false;
  };

  // Handle sending messages with proper UI updates
  const handleSendMessage = async (content: string, parentMessageId?: string) => {
    if (!sendMessage || !channel) {
      console.error('Cannot send message: sendMessage function or channel ID is missing');
      return;
    }
    
    try {
      console.log(`Sending message to channel ${channel}: ${content}`);
      
      // For DM channels, we need to be extra careful to ensure the message shows up
      if (isDMChannel()) {
        console.log('Sending message in DM channel');
        
        // Send the message and get the result
        const result = await sendMessage(content, parentMessageId);
        
        // Force scroll to the bottom after a short delay
        setTimeout(() => {
          scrollToBottom();
        }, 100);
        
        return result;
      } else {
        // For regular channels, just send the message
        return await sendMessage(content, parentMessageId);
      }
    } catch (error) {
      console.error('Error sending message:', error);
      throw error;
    }
  };

  // Show a placeholder when no channel is selected
  if (!channel) {
    return (
      <div className="flex flex-col h-full w-full bg-chat-dark min-w-0">
        <div className="flex-1 flex items-center justify-center">
          <div className="text-center">
            <div className="w-16 h-16 bg-gray-700 rounded-lg flex items-center justify-center mx-auto mb-4">
              <Hash className="w-8 h-8 text-gray-400" />
            </div>
            <h3 className="text-xl font-bold text-white mb-2">
              Welcome to your workspace
            </h3>
            <p className="text-gray-400">
              Select a channel from the sidebar to start chatting
            </p>
          </div>
        </div>
      </div>
    );
  }

  // Get typing users
  const typingUsers = members
    .filter(member => isTyping[member.user_id] && member.user_id !== user?.id)
    .map(member => member.profiles?.display_name || 'Someone');

  return (
    <div className="flex flex-col h-full w-full bg-chat-dark min-w-0">
      {/* Chat Header */}
      <div className="flex items-center justify-between p-4 border-b border-gray-700 bg-chat-dark flex-shrink-0">
        <div className="flex items-center space-x-3 min-w-0">
          <div className="text-gray-300 flex-shrink-0">
            {getChannelIcon()}
          </div>
          <div className="min-w-0">
            <h2 className="font-bold text-lg text-white truncate">
              {channelDetails.name}
            </h2>
            {!channel.startsWith('dm-') && channelDetails.topic && (
                  <p className="text-sm text-gray-300 truncate">
                {channelDetails.topic}
                  </p>
            )}
          </div>
        </div>
        
        <div className="flex items-center space-x-2 flex-shrink-0">
          <TooltipProvider>
            <Tooltip>
              <TooltipTrigger asChild>
          <Button 
            variant="ghost" 
            size="sm" 
            onClick={handleStarClick}
            className={`hover:text-gray-200 hover:bg-gray-700 ${
              isFavorite ? 'text-yellow-400' : 'text-gray-400'
            }`}
          >
            <Star className={`w-4 h-4 ${isFavorite ? 'fill-current' : ''}`} />
          </Button>
              </TooltipTrigger>
              <TooltipContent side="bottom">
                <p>{isFavorite ? 'Remove from favorites' : 'Add to favorites'}</p>
              </TooltipContent>
            </Tooltip>
          </TooltipProvider>
          
          <Popover>
            <PopoverTrigger asChild>
              <Button 
                variant="ghost" 
                size="sm" 
                className="text-gray-400 hover:text-gray-200 hover:bg-gray-700"
              >
                <Users className="w-4 h-4 mr-1" />
                <span className="text-xs">{members.length}</span>
              </Button>
            </PopoverTrigger>
            <PopoverContent 
              side="bottom" 
              align="end" 
              className="w-64 bg-[#1a1d21] border-gray-700 p-0 shadow-xl"
            >
              <MembersPopup members={members} channelName={channelDetails.name} />
            </PopoverContent>
          </Popover>
          
          <Popover>
            <PopoverTrigger asChild>
              <Button 
                variant="ghost" 
                size="sm" 
                className="text-gray-400 hover:text-gray-200 hover:bg-gray-700"
              >
                <Activity className="w-4 h-4 mr-1" />
                <span className="text-xs">{activeMembers.length} active</span>
              </Button>
            </PopoverTrigger>
            <PopoverContent 
              side="bottom" 
              align="end" 
              className="w-72 bg-[#1a1d21] border-gray-700 p-0 shadow-xl"
            >
              <ActivityPopup 
                channelName={channelDetails.name} 
                activeMembers={activeMembers}
                recentMessages={messages.slice(-10)}
              />
            </PopoverContent>
          </Popover>
          
          <TooltipProvider>
            <Tooltip>
              <TooltipTrigger asChild>
                <Button 
                  variant="ghost" 
                  size="sm" 
                  onClick={handleInfoClick}
                  className={`hover:text-gray-200 hover:bg-gray-700 ${
                    showInfoPanel ? 'text-white bg-gray-700' : 'text-gray-400'
                  }`}
                >
            <Info className="w-4 h-4" />
          </Button>
              </TooltipTrigger>
              <TooltipContent side="bottom">
                <p>Channel info</p>
              </TooltipContent>
            </Tooltip>
          </TooltipProvider>
          
          <Button 
            variant="ghost" 
            size="sm" 
            onClick={handleAiNotesClick}
            className="text-gray-400 hover:text-white hover:bg-gray-700"
          >
            <Notebook className="w-4 h-4 mr-2" />
            AI Notes
          </Button>
          
          <TooltipProvider>
            <Tooltip>
              <TooltipTrigger asChild>
          <Button 
            variant="ghost" 
            size="sm" 
            onClick={handleSearchClick}
            className={`hover:text-gray-200 hover:bg-gray-700 ${
              showSearch ? 'text-white bg-gray-700' : 'text-gray-400'
            }`}
          >
            <Search className="w-4 h-4" />
          </Button>
              </TooltipTrigger>
              <TooltipContent side="bottom">
                <p>Search in channel</p>
              </TooltipContent>
            </Tooltip>
          </TooltipProvider>
        </div>
      </div>

      {/* Search Bar (if active) */}
      <AnimatePresence>
      {showSearch && (
          <motion.div
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: 'auto', opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            transition={{ duration: 0.2 }}
            className="overflow-hidden"
          >
        <div className="p-4 border-b border-gray-700 bg-chat-dark">
          <div className="relative">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-gray-400" />
            <Input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
                  placeholder="Search in this channel"
                  className="pl-9 pr-9 bg-gray-700 border-gray-600 text-white placeholder-gray-400 h-9"
            />
            {searchQuery && (
              <Button
                variant="ghost"
                size="sm"
                onClick={() => setSearchQuery('')}
                    className="absolute right-1 top-1/2 transform -translate-y-1/2 h-7 w-7 p-0 text-gray-400 hover:text-white hover:bg-gray-600"
              >
                    <X className="w-4 h-4" />
              </Button>
            )}
          </div>
          {searchQuery && (
                <div className="mt-2 text-sm text-gray-300">
                  Found {filteredMessages.length} {filteredMessages.length === 1 ? 'result' : 'results'}
                </div>
          )}
        </div>
          </motion.div>
      )}
      </AnimatePresence>

      {/* Messages Area */}
      <div className="flex-1 overflow-y-auto p-4 space-y-4 scrollbar-thin scrollbar-thumb-gray-600 scrollbar-track-transparent">
        {loading ? (
          <div className="flex items-center justify-center h-full">
            <div className="animate-spin rounded-full h-8 w-8 border-t-2 border-b-2 border-blue-500"></div>
          </div>
        ) : messages.length === 0 ? (
          <div className="flex flex-col items-center justify-center h-full text-gray-400">
            <div className="w-16 h-16 bg-gray-700 rounded-full flex items-center justify-center mb-4">
              {isDMChannel() ? (
                <Users className="w-8 h-8 text-gray-400" />
              ) : (
                <Hash className="w-8 h-8 text-gray-400" />
              )}
            </div>
            <p className="text-center">
              {isDMChannel() 
                ? "This conversation is just getting started. Send a message to begin!" 
                : "This channel is empty. Be the first to send a message!"}
            </p>
          </div>
        ) : (
          <>
            {formattedMessages.map((msg, index) => (
              <MessageBubble
                key={msg.id}
                message={msg}
                showAvatar={shouldShowAvatar(index)}
                isGrouped={isGroupedMessage(index)}
                currentUser={user}
              />
            ))}
          </>
        )}
        <div ref={messagesEndRef} />
      </div>

      {/* Typing Indicator */}
      {typingUsers.length > 0 && (
        <div className="px-4 py-1 text-xs text-gray-400">
          {typingUsers.length === 1 
            ? `${typingUsers[0]} is typing...`
            : typingUsers.length === 2
              ? `${typingUsers[0]} and ${typingUsers[1]} are typing...`
              : `${typingUsers.length} people are typing...`
          }
        </div>
      )}

      {/* Message Input */}
      <div className="p-4 border-t border-gray-700">
          <MessageInput
          channelId={channel || undefined}
          placeholder={`Message ${channelDetails.name}`}
          onSendMessage={handleSendMessage}
          onInputChange={handleInputChange}
          channelName={channelDetails.name}
          channelMessages={messages}
        />
      </div>
      
      {/* Channel Info Panel */}
      <AnimatePresence>
        {showInfoPanel && (
          <ChannelInfoPanel
            isOpen={showInfoPanel}
            onClose={() => setShowInfoPanel(false)}
            channelId={channel}
            channelName={channelDetails.name}
            channelDescription={channelDetails.description}
            channelTopic={channelDetails.topic}
            isPrivate={channelDetails.isPrivate}
            createdAt={channelDetails.createdAt}
            createdBy={channelDetails.createdBy}
            onLeaveChannel={handleLeaveChannel}
            onStarChannel={handleStarClick}
            onUpdateChannel={handleUpdateChannel}
            user={user}
            workspaceId={workspaceId}
          />
        )}
      </AnimatePresence>

      {/* AI Notes Modal */}
      <AnimatePresence>
        {showAiNotesModal && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-50 flex items-center justify-center bg-black/50"
          >
            <motion.div
              initial={{ scale: 0.95 }}
              animate={{ scale: 1 }}
              exit={{ scale: 0.95 }}
              className="w-full max-w-3xl bg-[#0a121f] rounded-lg shadow-2xl overflow-hidden flex flex-col"
            >
              {/* Modal Header */}
              <div className="flex items-center justify-between px-4 py-3 bg-[#0a121f] border-b border-gray-700">
                <h2 className="text-xl font-bold text-white">
                  AI Notes for #{getChannelDetails().name}
                </h2>
                <Button
                  variant="ghost"
                  size="icon"
                  onClick={() => setShowAiNotesModal(false)}
                  className="text-gray-400 hover:text-white hover:bg-gray-700 rounded-full"
                >
                  <X className="h-5 w-5" />
                </Button>
              </div>
              
              {/* Notes Content */}
              <div className="p-4 max-h-[60vh] overflow-y-auto bg-[#0f1825]">
                {isLoadingNotes ? (
                  <div className="flex flex-col items-center justify-center py-12">
                    <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-purple-500 mb-4"></div>
                    <p className="text-gray-300">Generating AI notes...</p>
                  </div>
                ) : (
                  <pre className="whitespace-pre-wrap text-gray-300 font-mono text-sm p-4 bg-gray-800/30 rounded-md">
                    {aiNotes}
                  </pre>
                )}
        </div>
              
              {/* Modal Footer */}
              <div className="flex items-center justify-end space-x-2 px-4 py-3 bg-[#0a121f] border-t border-gray-700">
                <Button
                  variant="outline"
                  onClick={handleCopyNotes}
                  className="bg-gray-700 hover:bg-gray-600 text-white border-gray-600"
                  disabled={isLoadingNotes}
                >
                  <Copy className="h-4 w-4 mr-2" />
                  Copy
                </Button>
                <Button
                  variant="default"
                  onClick={handleDownloadNotes}
                  className="bg-purple-600 hover:bg-purple-700 text-white"
                  disabled={isLoadingNotes}
                >
                  <Download className="h-4 w-4 mr-2" />
                  Download
                </Button>
      </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};

export default ChatArea;
