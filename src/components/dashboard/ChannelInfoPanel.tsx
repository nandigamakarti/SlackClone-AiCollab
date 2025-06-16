import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { 
  X, 
  Users,
  Star,
  Info, 
  Calendar, 
  Hash, 
  Settings,
  LogOut,
  User as UserIcon 
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Switch } from '@/components/ui/switch';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Separator } from '@/components/ui/separator';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Input } from '@/components/ui/input';
import { User } from '@/contexts/AuthContext';
import { useWorkspaceMembers } from '@/hooks/useWorkspaceMembers';
import { formatDistanceToNow } from 'date-fns';

interface ChannelInfoPanelProps {
  isOpen: boolean;
  onClose: () => void;
  channelId: string;
  channelName: string;
  channelDescription?: string;
  channelTopic?: string;
  isPrivate: boolean;
  createdAt: string;
  createdBy?: string;
  onLeaveChannel?: () => void;
  onStarChannel?: (isStarred: boolean) => void;
  onUpdateChannel?: (data: { topic?: string; description?: string }) => void;
  user?: User | null;
  workspaceId?: string;
}

const ChannelInfoPanel: React.FC<ChannelInfoPanelProps> = ({
  isOpen,
  onClose,
  channelId,
  channelName,
  channelDescription = '',
  channelTopic = '',
  isPrivate,
  createdAt,
  createdBy,
  onLeaveChannel,
  onStarChannel,
  onUpdateChannel,
  user,
  workspaceId
}) => {
  const [isStarred, setIsStarred] = useState(false);
  const [description, setDescription] = useState(channelDescription);
  const [topic, setTopic] = useState(channelTopic);
  const [isEditing, setIsEditing] = useState(false);
  const { members } = useWorkspaceMembers(workspaceId);
  
  // Find creator details
  const creator = members.find(member => member.user_id === createdBy);
  
  useEffect(() => {
    // Check local storage if channel is starred by current user
    const starredChannels = JSON.parse(localStorage.getItem('starredChannels') || '[]');
    setIsStarred(starredChannels.includes(channelId));
  }, [channelId]);
  
  const handleStarToggle = () => {
    const newStarredState = !isStarred;
    setIsStarred(newStarredState);
    
    // Update local storage
    const starredChannels = JSON.parse(localStorage.getItem('starredChannels') || '[]');
    
    if (newStarredState) {
      localStorage.setItem('starredChannels', JSON.stringify([...starredChannels, channelId]));
    } else {
      localStorage.setItem('starredChannels', JSON.stringify(
        starredChannels.filter((id: string) => id !== channelId)
      ));
    }
    
    if (onStarChannel) {
      onStarChannel(newStarredState);
    }
  };
  
  const handleSaveChanges = () => {
    if (onUpdateChannel) {
      onUpdateChannel({
        topic,
        description
      });
    }
    setIsEditing(false);
  };
  
  const formatDate = (dateString: string) => {
    try {
      return formatDistanceToNow(new Date(dateString), { addSuffix: true });
    } catch (error) {
      return 'Unknown date';
    }
  };
  
  if (!isOpen) return null;
  
  return (
    <motion.div
      initial={{ x: '100%', opacity: 0 }}
      animate={{ x: 0, opacity: 1 }}
      exit={{ x: '100%', opacity: 0 }}
      transition={{ type: 'spring', damping: 30, stiffness: 300 }}
      className="fixed right-0 top-0 h-full w-80 bg-gray-800 border-l border-gray-700 z-30 shadow-xl overflow-y-auto"
    >
      <div className="p-4 flex items-center justify-between border-b border-gray-700">
        <h2 className="text-lg font-bold text-white flex items-center">
          {isPrivate ? (
            <span className="flex items-center">
              <span className="w-5 h-5 flex items-center justify-center rounded-full border border-gray-400 mr-2">
                <span className="text-xs">🔒</span>
              </span>
              {channelName}
            </span>
          ) : (
            <span className="flex items-center">
              <Hash className="w-5 h-5 mr-2 text-gray-400" />
              {channelName}
            </span>
          )}
        </h2>
        <Button
          variant="ghost"
          size="sm"
          onClick={onClose}
          className="text-gray-400 hover:text-white hover:bg-gray-700 p-0 w-8 h-8"
        >
          <X className="w-5 h-5" />
        </Button>
      </div>
      
      <div className="p-4">
        {/* Star Channel Toggle */}
        <div className="flex items-center justify-between mb-6">
          <div className="flex items-center">
            <Star className={`w-5 h-5 mr-2 ${isStarred ? 'text-yellow-400 fill-current' : 'text-gray-400'}`} />
            <span className="text-white">Star Channel</span>
          </div>
          <Switch
            checked={isStarred}
            onCheckedChange={handleStarToggle}
          />
        </div>
        
        {/* Channel Topic */}
        <div className="mb-6">
          <div className="flex items-center justify-between mb-2">
            <Label className="text-gray-300">Topic</Label>
            {!isEditing && (
              <Button 
                variant="ghost" 
                size="sm" 
                onClick={() => setIsEditing(true)}
                className="text-xs h-6 px-2 text-gray-400 hover:text-white hover:bg-gray-700"
              >
                Edit
              </Button>
            )}
          </div>
          
          {isEditing ? (
            <Textarea
              value={topic}
              onChange={(e) => setTopic(e.target.value)}
              placeholder="Add a topic"
              className="bg-gray-700 border-gray-600 text-white resize-none min-h-[80px]"
            />
          ) : (
            <p className="text-white text-sm">
              {channelTopic || <span className="text-gray-400 italic">No topic set</span>}
            </p>
          )}
        </div>
        
        {/* Channel Description */}
        <div className="mb-6">
          <div className="flex items-center justify-between mb-2">
            <Label className="text-gray-300">Description</Label>
            {!isEditing && (
              <Button 
                variant="ghost" 
                size="sm" 
                onClick={() => setIsEditing(true)}
                className="text-xs h-6 px-2 text-gray-400 hover:text-white hover:bg-gray-700"
              >
                Edit
              </Button>
            )}
          </div>
          
          {isEditing ? (
            <Textarea
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              placeholder="Add a description"
              className="bg-gray-700 border-gray-600 text-white resize-none min-h-[80px]"
            />
          ) : (
            <p className="text-white text-sm">
              {channelDescription || <span className="text-gray-400 italic">No description set</span>}
            </p>
          )}
        </div>
        
        {/* Save Button for Editing */}
        {isEditing && (
          <div className="flex justify-end space-x-2 mb-6">
            <Button 
              variant="ghost" 
              size="sm" 
              onClick={() => {
                setTopic(channelTopic);
                setDescription(channelDescription);
                setIsEditing(false);
              }}
              className="text-gray-300 hover:text-white hover:bg-gray-700"
            >
              Cancel
            </Button>
            <Button 
              variant="primary" 
              size="sm" 
              onClick={handleSaveChanges}
              className="bg-purple-600 hover:bg-purple-700 text-white"
            >
              Save Changes
            </Button>
          </div>
        )}
        
        <Separator className="my-4 bg-gray-700" />
        
        {/* Channel Details */}
        <div className="mb-6">
          <h3 className="text-white font-medium mb-3">About</h3>
          
          <div className="space-y-3">
            <div className="flex items-center text-sm">
              <Calendar className="w-4 h-4 text-gray-400 mr-3" />
              <div>
                <span className="text-gray-300">Created </span>
                <span className="text-white">{formatDate(createdAt)}</span>
              </div>
            </div>
            
            {creator && (
              <div className="flex items-center text-sm">
                <UserIcon className="w-4 h-4 text-gray-400 mr-3" />
                <div>
                  <span className="text-gray-300">Created by </span>
                  <span className="text-white">{creator.profiles?.display_name || 'Unknown user'}</span>
                </div>
              </div>
            )}
          </div>
        </div>
        
        <Separator className="my-4 bg-gray-700" />
        
        {/* Channel Members */}
        <div className="mb-6">
          <div className="flex items-center justify-between mb-3">
            <h3 className="text-white font-medium">Members</h3>
            <span className="text-sm bg-gray-700 px-2 py-0.5 rounded-full text-gray-300">
              {members.length}
            </span>
          </div>
          
          <div className="space-y-2 max-h-60 overflow-y-auto">
            {members.map((member) => (
              <div key={member.user_id} className="flex items-center px-2 py-1 hover:bg-gray-700 rounded-md">
                <Avatar className="h-8 w-8 mr-2">
                  <AvatarImage src={member.profiles?.avatar_url || ''} />
                  <AvatarFallback className="bg-purple-700 text-white">
                    {member.profiles?.display_name?.charAt(0).toUpperCase() || 'U'}
                  </AvatarFallback>
                </Avatar>
                <div className="flex-1 min-w-0">
                  <p className="text-white text-sm truncate">
                    {member.profiles?.display_name || 'Unknown user'}
                  </p>
                  {member.role === 'admin' && (
                    <p className="text-xs text-gray-400">Admin</p>
                  )}
                </div>
              </div>
            ))}
          </div>
        </div>
        
        <Separator className="my-4 bg-gray-700" />
        
        {/* Leave Channel Button */}
        <Button 
          variant="destructive" 
          className="w-full bg-red-900 hover:bg-red-800 text-white"
          onClick={onLeaveChannel}
        >
          <LogOut className="w-4 h-4 mr-2" />
          Leave Channel
        </Button>
      </div>
    </motion.div>
  );
};

export default ChannelInfoPanel; 