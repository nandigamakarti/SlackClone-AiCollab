import React, { useState, useRef, useEffect } from 'react';
import { useMessages } from '@/hooks/useMessages';
import { useAuth } from '@/contexts/AuthContext';
// Fixed UserAvatar import
import { UserAvatar } from '@/components/ui/user-avatar';
import { Button } from '@/components/ui/button';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import UserProfileModal from '@/components/dashboard/UserProfileModal';
import ReactionBar from '@/components/dashboard/ReactionBar';
import { 
  Reply,
  Smile,
  Paperclip,
  Share2,
  Pin,
  PinOff,
  MessageSquare,
  MoreVertical,
  FileIcon,
  ExternalLink,
  Bookmark,
  Link2
} from 'lucide-react';
import { formatDistanceToNow } from 'date-fns';

interface Message {
  id: string;
  channelId: string;
  userId: string;
  username: string;
  avatar?: string;
  content: string;
  timestamp: Date;
  edited?: boolean;
  editedAt?: Date;
  isPinned?: boolean;
  reactions: Array<{
    emoji: string;
    count: number;
    users: string[];
  }>;
  attachments?: Array<{
    name: string;
    type: string;
    size: string;
    url: string;
  }>;
  replyCount: number;
  threadParticipants: string[];
  replies?: Message[];
}

interface MessageBubbleProps {
  message: Message;
  showAvatar?: boolean;
  isGrouped?: boolean;
  isInThread?: boolean;
  currentUser?: any;
}

const MessageBubble: React.FC<MessageBubbleProps> = ({ 
  message, 
  showAvatar = true,
  isGrouped = false,
  isInThread = false,
  currentUser
}) => {
  // const { selectThread, addReaction, removeReaction, pinMessage, getMessages } = useMessages();
  const { user } = useAuth();
  const [isHovered, setIsHovered] = useState(false);
  const [showShareDialog, setShowShareDialog] = useState(false);
  const [showUserProfile, setShowUserProfile] = useState(false);
  const [documentToShare, setDocumentToShare] = useState<any>(null);
  const [documentName, setDocumentName] = useState('');
  const messageRef = useRef<HTMLDivElement>(null);
  // const channelMessages = message.channelId ? getMessages(message.channelId) : [];
  const isPinned = message.isPinned || false;
  
  const emojiCategories = {
    'Smileys & People': ['😀', '😃', '😄', '😁', '😆', '😅', '😂', '🙂', '😊', '👍', '👎', '👏', '🙌'],
    'Animals & Nature': ['🐶', '🐱', '🦊', '🐢', '🦁', '🐯', '🦖', '🦕', '🌵', '🌲', '🌴'],
    'Food & Drink': ['🍎', '🍐', '🍊', '🍋', '🍌', '🍉', '🍇', '🍓', '🍒', '🍕', '🍔', '☕'],
    'Activities': ['⚽', '🏀', '🏈', '⚾', '🎾', '🏐', '🎮', '♟️', '🎭', '🎨'],
    'Travel & Places': ['🚗', '✈️', '🚀', '🏠', '🏢', '🏛️', '🏝️', '🌋', '🗻'],
    'Objects': ['💻', '📱', '⌚', '📷', '🔋', '💡', '📚', '🔑', '🔨'],
    'Symbols': ['❤️', '🧡', '💛', '💚', '💙', '💜', '🖤', '💯', '✅', '❌', '❓', '❗']
  };

  // Format timestamps
  const timestamp = new Date(message.timestamp);
  const formattedTime = formatDistanceToNow(timestamp, { addSuffix: true });

  const formatMessageContent = (content: string) => {
    if (!content) return '';
    
    let formattedContent = content;
    
    // Replace URLs with clickable links
    formattedContent = formattedContent.replace(
      /(https?:\/\/[^\s]+)/g,
      '<a href="$1" target="_blank" rel="noopener noreferrer" class="text-blue-400 hover:underline">$1</a>'
    );
    
    // Replace markdown-style bold with HTML
    formattedContent = formattedContent.replace(/\*\*(.*?)\*\*/g, '<strong>$1</strong>');
    
    // Replace markdown-style italic with HTML
    formattedContent = formattedContent.replace(/__(.*?)__/g, '<em>$1</em>');
    
    // Replace alternative markdown-style italic with HTML
    formattedContent = formattedContent.replace(/\*(.*?)\*/g, '<em>$1</em>');
    
    // Replace markdown-style code with HTML
    formattedContent = formattedContent.replace(/`(.*?)`/g, '<code class="bg-gray-800 px-1 rounded text-sm">$1</code>');
    
    // Replace markdown-style links with HTML
    formattedContent = formattedContent.replace(/\[(.*?)\]\((.*?)\)/g, '<a href="$2" target="_blank" rel="noopener noreferrer" class="text-blue-400 hover:underline">$1</a>');
    
    // Handle @mentions
    const mentionRegex = /@(\w+)/g;
    formattedContent = formattedContent.replace(mentionRegex, '<span class="text-yellow-400 font-semibold">@$1</span>');
    
    return formattedContent;
  };

  const getFileType = (fileName: string) => {
    const extension = fileName.split('.').pop()?.toLowerCase();
    switch (extension) {
      case 'pdf': return 'PDF Document';
      case 'doc':
      case 'docx': return 'Word Document';
      case 'xls':
      case 'xlsx': return 'Excel Spreadsheet';
      case 'ppt':
      case 'pptx': return 'PowerPoint Presentation';
      case 'jpg':
      case 'jpeg':
      case 'png':
      case 'gif': return 'Image';
      case 'mp4':
      case 'mov':
      case 'avi': return 'Video';
      default: return 'File';
    }
  };

  const createMockFileUrl = (fileName: string) => {
    // In a real app, this would be an actual file URL
    // For this demo, we'll just return a placeholder
    return `#file-${fileName.replace(/\s+/g, '-').toLowerCase()}`;
  };

  const handleFileDownload = (file: any) => {
    // This would download the file in a real app
    // For this demo, we'll just log it
    console.log(`Downloading file: ${file.name}`);
    alert(`In a real app, this would download the file: ${file.name}`);
  };

  const handleAddReaction = (emoji: string) => {
    console.log(`Adding reaction ${emoji} to message ${message.id}`);
    // Mock implementation since we don't have access to the real context
  };
  
  const handleRemoveReaction = (emoji: string) => {
    console.log(`Removing reaction ${emoji} from message ${message.id}`);
    // Mock implementation since we don't have access to the real context
  };

  const handleReplyClick = () => {
    if (!isInThread) {
      console.log(`Opening thread for message ${message.id}`);
      // Mock implementation since we don't have access to the real context
    }
  };

  const handlePinMessage = () => {
    console.log(`${isPinned ? 'Unpinning' : 'Pinning'} message ${message.id}`);
    // Mock implementation since we don't have access to the real context
  };
  
  const handleDocumentShare = () => {
    if (!documentToShare) return;
    
    // In a real app, this would upload the file and add it to the channel
    alert(`Document "${documentName || documentToShare.name}" shared in channel ${message.channelId}`);
    
    // Reset state
    setDocumentToShare(null);
    setDocumentName('');
    setShowShareDialog(false);
  };
  
  const handleFileSelect = (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files;
    if (files && files.length > 0) {
      setDocumentToShare(files[0]);
      setDocumentName(files[0].name);
    }
  };

  const formatTimestamp = (date: Date) => {
    return formatDistanceToNow(date, { addSuffix: true });
  };

  return (
    <div 
      ref={messageRef}
      className={`flex w-full ${isGrouped ? 'mt-1' : 'mt-4'} group relative message-bubble`}
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
    >
      {/* Avatar - only show if not grouped */}
            {showAvatar && !isGrouped && (
        <div className="flex-shrink-0 mr-3">
          <div 
            className="cursor-pointer" 
            onClick={() => setShowUserProfile(true)}
          >
            <UserAvatar name={message.username} size="md" />
          </div>
        </div>
      )}
      
      {/* Avatar Placeholder - for grouped messages */}
      {showAvatar && isGrouped && <div className="flex-shrink-0 mr-3 w-10"></div>}
      
      {/* Message Content */}
      <div className="flex-grow">
        {/* Username and Timestamp - only show if not grouped */}
            {!isGrouped && (
              <div className="flex items-center mb-1">
                <span 
              className="font-medium text-gray-200 hover:underline cursor-pointer"
                  onClick={() => setShowUserProfile(true)}
                >
                  {message.username}
                </span>
            {isPinned && (
              <span className="ml-2 text-yellow-400 flex items-center text-xs">
                <Pin className="w-3 h-3 mr-1" />
                Pinned
              </span>
            )}
            <span className="ml-2 text-xs text-gray-400">{formattedTime}</span>
              </div>
            )}
            
        {/* Message Text */}
        <div className="text-gray-200 whitespace-pre-wrap">
          {/* Render file attachments if present */}
          {message.attachments && message.attachments.length > 0 && (
            <div className="mb-2 space-y-2">
              {message.attachments.map((file, index) => (
                <div 
                  key={`file-${index}`}
                  className="bg-gray-700 rounded p-3 flex items-start max-w-md"
                >
                  <FileIcon className="h-5 w-5 mt-1 mr-3 text-blue-400" />
                  <div className="flex-1">
                    <div className="font-medium text-sm">{file.name}</div>
                    <div className="text-xs text-gray-400">{getFileType(file.name)} · {file.size}</div>
                    <div className="mt-2 flex items-center space-x-2">
                      <button 
                        className="text-xs text-blue-400 hover:text-blue-300 flex items-center"
                        onClick={() => handleFileDownload(file)}
                      >
                        Download
                      </button>
                      <span className="text-gray-500">|</span>
                      <button className="text-xs text-blue-400 hover:text-blue-300 flex items-center">
                        <ExternalLink className="w-3 h-3 mr-1" />
                        Preview
                      </button>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}
          
          {/* Render message content as HTML */}
          <div 
            dangerouslySetInnerHTML={{
              __html: formatMessageContent(message.content)
            }}
          />

          {/* Reactions */}
          <ReactionBar 
            reactions={message.reactions || []}
            currentUserId={user?.id || ''}
            onAddReaction={handleAddReaction}
            onRemoveReaction={handleRemoveReaction}
          />

          {/* Thread Preview */}
          {message.replyCount > 0 && (
            <button
              onClick={handleReplyClick}
              className="flex items-center gap-2 mt-2 text-blue-400 hover:text-blue-300 text-sm bg-gray-800/40 px-2 py-1 rounded-md hover:bg-gray-700/60 hover:scale-105 transition-all duration-200"
            >
              <MessageSquare className="w-4 h-4" />
              <span className="font-medium">{message.replyCount} {message.replyCount === 1 ? 'reply' : 'replies'}</span>
              <span className="text-gray-400">
                Last reply {formatTimestamp(new Date())}
              </span>
            </button>
          )}
        </div>
      </div>

      {/* Message Actions - Only visible on hover */}
      <div className="flex-shrink-0 relative ml-2">
        <div 
          className="flex items-center space-x-1 transition-opacity duration-200"
          style={{ opacity: isHovered ? 1 : 0 }}
        >
          <div className="hover:scale-110 transition-transform duration-200">
            <Button
              variant="ghost"
              size="sm"
              onClick={handleReplyClick}
              className="h-7 w-7 p-0 text-gray-400 hover:text-white hover:bg-gray-600 rounded-full"
            >
              <Reply className="w-4 h-4" />
            </Button>
          </div>
          
          <div className="hover:scale-110 transition-transform duration-200">
            <Dialog open={showShareDialog} onOpenChange={setShowShareDialog}>
              <DialogTrigger asChild>
                <Button
                  variant="ghost"
                  size="sm"
                  className="h-7 w-7 p-0 text-gray-400 hover:text-white hover:bg-gray-600 rounded-full"
                >
                  <Share2 className="w-4 h-4" />
                </Button>
              </DialogTrigger>
              <DialogContent className="bg-gray-800 border-gray-700 text-white">
                <DialogHeader>
                  <DialogTitle>Share Document</DialogTitle>
                </DialogHeader>
                <div className="space-y-4 py-4">
                  <div className="flex items-center space-x-2">
                    <label className="flex h-10 w-full items-center justify-center rounded-md border border-gray-600 bg-gray-700 px-3 py-2 text-sm hover:bg-gray-600 cursor-pointer">
                      <Paperclip className="mr-2 h-4 w-4" />
                      <span>Upload File</span>
                      <input
                        type="file"
                        className="hidden"
                        onChange={handleFileSelect}
                      />
                    </label>
                  </div>
                  {documentToShare && (
                    <div className="rounded-md border border-gray-600 bg-gray-700 p-3">
                      <div className="flex items-center">
                        <FileIcon className="h-5 w-5 mr-2" />
                        <span className="text-sm font-medium">{documentToShare.name}</span>
                      </div>
                      <div className="mt-2">
                        <Input
                          placeholder="Document title (optional)"
                          value={documentName}
                          onChange={(e) => setDocumentName(e.target.value)}
                          className="bg-gray-600 border-gray-500"
                        />
                      </div>
                      <Button 
                        onClick={handleDocumentShare} 
                        className="mt-3 w-full bg-blue-600 hover:bg-blue-700"
                      >
                        Share Document
                      </Button>
                    </div>
                  )}
                </div>
              </DialogContent>
            </Dialog>
          </div>
          
          <div className="hover:scale-110 transition-transform duration-200">
            <Button
              variant="ghost"
              size="sm"
              onClick={handlePinMessage}
              className={`h-7 w-7 p-0 hover:bg-gray-600 rounded-full ${isPinned ? 'text-yellow-400 hover:text-yellow-300' : 'text-gray-400 hover:text-white'}`}
            >
              {isPinned ? <PinOff className="w-4 h-4" /> : <Pin className="w-4 h-4" />}
            </Button>
          </div>
          
          <div className="hover:scale-110 transition-transform duration-200">
            <Button
              variant="ghost"
              size="sm"
              className="h-7 w-7 p-0 text-gray-400 hover:text-white hover:bg-gray-600 rounded-full"
            >
              <MoreVertical className="w-4 h-4" />
            </Button>
          </div>
        </div>
      </div>
      
      {/* User Profile Modal */}
      {showUserProfile && (
        <UserProfileModal
          isOpen={showUserProfile}
          userId={message.userId}
          onClose={() => setShowUserProfile(false)}
        />
      )}
    </div>
  );
};

export default MessageBubble;
