import React from 'react';
import { Button } from '@/components/ui/button';
import { 
  Activity, 
  Clock, 
  Bell, 
  MessageSquare, 
  FileText, 
  ThumbsUp, 
  Users 
} from 'lucide-react';

// Define the activity item interface
interface ActivityItem {
  id: string;
  type: 'mention' | 'reply' | 'file' | 'reaction' | 'join';
  user: string;
  content: string;
  time: string;
  color?: string;
}

interface ActivityPopupProps {
  channelName: string;
  activeMembers?: string[];
  recentMessages?: any[];
}

const ActivityPopup: React.FC<ActivityPopupProps> = ({ 
  channelName, 
  activeMembers = [], 
  recentMessages = [] 
}) => {
  // Generate activity items based on recent messages and active members
  const generateActivityItems = (): ActivityItem[] => {
    const items: ActivityItem[] = [];
    
    // Add mentions and reactions from recent messages if available
    if (recentMessages && recentMessages.length > 0) {
      // Get mentions (messages that contain @username)
      const mentions = recentMessages
        .filter(msg => msg.content && msg.content.includes('@'))
        .slice(0, 2)
        .map((msg, index) => ({
          id: `mention-${index}`,
          type: 'mention' as const,
          user: msg.profiles?.display_name || 'Someone',
          content: `mentioned someone in #${channelName}`,
          time: formatTimeAgo(msg.created_at),
          color: 'text-blue-400'
        }));
      
      items.push(...mentions);
      
      // Add file shares
      const fileShares = recentMessages
        .filter(msg => msg.content && msg.content.includes('file:'))
        .slice(0, 1)
        .map((msg, index) => ({
          id: `file-${index}`,
          type: 'file' as const,
          user: msg.profiles?.display_name || 'Someone',
          content: 'shared a file in this channel',
          time: formatTimeAgo(msg.created_at),
          color: 'text-orange-400'
        }));
      
      items.push(...fileShares);
      
      // Add replies
      const replies = recentMessages
        .filter(msg => msg.parent_message_id)
        .slice(0, 2)
        .map((msg, index) => ({
          id: `reply-${index}`,
          type: 'reply' as const,
          user: msg.profiles?.display_name || 'Someone',
          content: 'replied to a message',
          time: formatTimeAgo(msg.created_at),
          color: 'text-green-400'
        }));
      
      items.push(...replies);
    }
    
    // Add active members who joined
    if (activeMembers && activeMembers.length > 0) {
      items.push({
        id: 'join-1',
        type: 'join',
        user: `${activeMembers.length} ${activeMembers.length === 1 ? 'member' : 'members'}`,
        content: `active in this channel`,
        time: 'Recently',
        color: 'text-teal-400'
      });
    }
    
    return items.length > 0 ? items : [];
  };
  
  // Helper function to format time
  const formatTimeAgo = (timestamp: string): string => {
    if (!timestamp) return 'Recently';
    
    const date = new Date(timestamp);
    const now = new Date();
    const diffMs = now.getTime() - date.getTime();
    const diffMins = Math.floor(diffMs / 60000);
    
    if (diffMins < 1) return 'Just now';
    if (diffMins < 60) return `${diffMins} ${diffMins === 1 ? 'minute' : 'minutes'} ago`;
    
    const diffHours = Math.floor(diffMins / 60);
    if (diffHours < 24) return `${diffHours} ${diffHours === 1 ? 'hour' : 'hours'} ago`;
    
    const diffDays = Math.floor(diffHours / 24);
    if (diffDays === 1) return 'Yesterday';
    if (diffDays < 7) return `${diffDays} days ago`;
    
    return date.toLocaleDateString();
  };

  // Get activity icon based on type
  const getActivityIcon = (type: ActivityItem['type']) => {
    switch (type) {
      case 'mention': return <Bell className="w-4 h-4" />;
      case 'reply': return <MessageSquare className="w-4 h-4" />;
      case 'file': return <FileText className="w-4 h-4" />;
      case 'reaction': return <ThumbsUp className="w-4 h-4" />;
      case 'join': return <Users className="w-4 h-4" />;
      default: return <Activity className="w-4 h-4" />;
    }
  };
  
  const activityItems = generateActivityItems();

  return (
    <div className="w-full">
      <div className="p-3 border-b border-gray-700">
        <h3 className="text-sm font-semibold text-white">Activity in #{channelName}</h3>
      </div>
      <div className="max-h-80 overflow-y-auto">
        {activityItems.length === 0 ? (
          <div className="p-4 text-center text-gray-400 text-sm">
            No recent activity
          </div>
        ) : (
          <div className="py-1">
            {activityItems.map(item => (
              <div 
                key={item.id} 
                className="flex px-3 py-3 hover:bg-gray-700 border-b border-gray-700 last:border-b-0"
              >
                <div className={`mr-3 mt-1 ${item.color}`}>
                  {getActivityIcon(item.type)}
                </div>
                <div className="flex-1 min-w-0">
                  <p className="text-sm text-white font-medium">
                    {item.user}
                  </p>
                  <p className="text-xs text-gray-300 mb-1">
                    {item.content}
                  </p>
                  <p className="text-xs text-gray-400 flex items-center">
                    <Clock className="w-3 h-3 mr-1" />
                    {item.time}
                  </p>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
      <div className="p-2 border-t border-gray-700">
        <Button 
          variant="ghost" 
          size="sm"
          className="w-full text-sm justify-center text-blue-400 hover:text-blue-300 hover:bg-gray-700"
        >
          View All Activity
        </Button>
      </div>
    </div>
  );
};

export default ActivityPopup; 