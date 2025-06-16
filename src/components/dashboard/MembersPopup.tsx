import React from 'react';
import { Button } from '@/components/ui/button';
import { UserAvatar } from '@/components/ui/user-avatar';

interface Member {
  user_id: string;
  id: string;
  role?: string;
  profiles?: {
    display_name?: string;
    presence?: string;
    avatar?: string;
  };
}

interface MembersPopupProps {
  members: Member[];
  channelName: string;
}

const MembersPopup: React.FC<MembersPopupProps> = ({ members, channelName }) => {
  return (
    <div className="w-full">
      <div className="p-3 border-b border-gray-700">
        <h3 className="text-sm font-semibold text-white">Channel Members</h3>
        <p className="text-xs text-gray-400 mt-1">
          {members.length} members in #{channelName}
        </p>
      </div>
      <div className="max-h-60 overflow-y-auto">
        {members.length === 0 ? (
          <div className="p-4 text-center text-gray-400 text-sm">
            No members in this channel
          </div>
        ) : (
          <div className="py-1">
            {members.map(member => (
              <div 
                key={member.user_id} 
                className="flex items-center px-3 py-2 hover:bg-gray-700 cursor-pointer"
              >
                <div className="relative mr-2">
                  <UserAvatar 
                    name={member.profiles?.display_name || 'User'} 
                    size="sm"
                    className="w-6 h-6"
                  />
                  <div 
                    className={`absolute -bottom-0.5 -right-0.5 w-2 h-2 rounded-full ${
                      member.profiles?.presence === 'active' ? 'bg-green-500' : 'bg-gray-500'
                    }`} 
                  />
                </div>
                <div className="flex-1 min-w-0">
                  <p className="text-sm text-white truncate">
                    {member.profiles?.display_name || 'Unknown user'}
                  </p>
                  {member.role === 'admin' && (
                    <p className="text-xs text-gray-400">Admin</p>
                  )}
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
          View all members
        </Button>
      </div>
    </div>
  );
};

export default MembersPopup; 