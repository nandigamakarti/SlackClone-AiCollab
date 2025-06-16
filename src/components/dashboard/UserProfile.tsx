
import React, { useState } from 'react';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Separator } from '@/components/ui/separator';
import { 
  User as UserIcon, 
  Mail, 
  Clock, 
  Settings, 
  LogOut,
  Edit3,
  Camera
} from 'lucide-react';
import { User, useAuth } from '@/contexts/AuthContext';
import { UserAvatar } from '@/components/ui/user-avatar';

interface UserProfileProps {
  user: User | null;
  onClose: () => void;
}

const UserProfile: React.FC<UserProfileProps> = ({ user, onClose }) => {
  const { logout, updateUserStatus, updateUserPresence } = useAuth();
  const [isEditingStatus, setIsEditingStatus] = useState(false);
  const [statusText, setStatusText] = useState(user?.status.text || '');
  const [statusEmoji, setStatusEmoji] = useState(user?.status.emoji || '😀');

  const handleStatusSave = () => {
    updateUserStatus({
      text: statusText,
      emoji: statusEmoji
    });
    setIsEditingStatus(false);
  };

  const handlePresenceChange = (presence: 'active' | 'away' | 'offline' | 'dnd') => {
    updateUserPresence(presence);
  };

  const handleLogout = () => {
    logout();
    onClose();
  };

  const getPresenceText = () => {
    switch (user?.presence) {
      case 'active': return 'Active';
      case 'away': return 'Away';
      case 'dnd': return 'Do not disturb';
      case 'offline': return 'Offline';
      default: return 'Unknown';
    }
  };

  const getPresenceColor = () => {
    switch (user?.presence) {
      case 'active': return 'bg-slack-green';
      case 'away': return 'border-2 border-slack-green bg-transparent';
      case 'dnd': return 'bg-slack-red';
      case 'offline': return 'bg-gray-400';
      default: return 'bg-gray-400';
    }
  };

  return (
    <Dialog open={true} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-md bg-gray-800 border-gray-700 text-white">
        <DialogHeader>
          <DialogTitle className="text-lg font-bold text-white">
            Profile
          </DialogTitle>
        </DialogHeader>

        <div className="space-y-6">
          {/* Avatar and Basic Info */}
          <div className="flex items-center space-x-4">
            <div className="relative">
              <div className="w-16 h-16 overflow-hidden rounded-lg">
                <UserAvatar 
                  name={user?.displayName || ''} 
                  size="lg" 
                  className="w-full h-full rounded-lg"
                  imageUrl={user?.avatar}
                />
              </div>
              <Button
                variant="ghost"
                size="sm"
                className="absolute -bottom-1 -right-1 w-6 h-6 p-0 bg-gray-700 border border-gray-600 rounded-full hover:bg-gray-600"
              >
                <Camera className="w-3 h-3 text-white" />
              </Button>
              <div className={`absolute -bottom-1 -left-1 w-4 h-4 rounded-full ${getPresenceColor()}`} />
            </div>
            <div className="flex-1">
              <h3 className="font-bold text-lg text-white">
                {user?.displayName}
              </h3>
              <p className="text-sm text-gray-400">
                {getPresenceText()}
              </p>
            </div>
          </div>

          {/* Status Section */}
          <div className="space-y-3">
            <div className="flex items-center justify-between">
              <h4 className="font-medium text-white">Status</h4>
              <Button
                variant="ghost"
                size="sm"
                onClick={() => setIsEditingStatus(!isEditingStatus)}
                className="text-gray-400 hover:text-white hover:bg-gray-700"
              >
                <Edit3 className="w-4 h-4" />
              </Button>
            </div>
            
            {isEditingStatus ? (
              <div className="space-y-3">
                <div className="flex items-center space-x-2">
                  <Input
                    value={statusEmoji}
                    onChange={(e) => setStatusEmoji(e.target.value)}
                    className="w-16 text-center bg-gray-700 border-gray-600 text-white"
                    maxLength={2}
                  />
                  <Input
                    value={statusText}
                    onChange={(e) => setStatusText(e.target.value)}
                    placeholder="What's your status?"
                    className="flex-1 bg-gray-700 border-gray-600 text-white placeholder-gray-400"
                  />
                </div>
                <div className="flex justify-end space-x-2">
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => setIsEditingStatus(false)}
                    className="border-gray-600 text-gray-400 hover:text-white hover:bg-gray-700"
                  >
                    Cancel
                  </Button>
                  <Button
                    size="sm"
                    onClick={handleStatusSave}
                    className="bg-slack-green hover:bg-slack-green/90"
                  >
                    Save
                  </Button>
                </div>
              </div>
            ) : (
              <div className="p-3 bg-gray-700 rounded-lg">
                <p className="text-sm text-white">
                  {user?.status.emoji} {user?.status.text || 'No status set'}
                </p>
              </div>
            )}
          </div>

          <Separator className="bg-gray-600" />

          {/* Presence Settings */}
          <div className="space-y-3">
            <h4 className="font-medium text-white">Set yourself as</h4>
            <div className="space-y-2">
              {[
                { key: 'active', label: 'Active', color: 'bg-slack-green' },
                { key: 'away', label: 'Away', color: 'border-2 border-slack-green bg-transparent' },
                { key: 'dnd', label: 'Do not disturb', color: 'bg-slack-red' },
              ].map((option) => (
                <Button
                  key={option.key}
                  variant="ghost"
                  onClick={() => handlePresenceChange(option.key as any)}
                  className={`w-full justify-start text-white hover:bg-gray-700 ${
                    user?.presence === option.key ? 'bg-gray-700' : ''
                  }`}
                >
                  <div className={`w-3 h-3 rounded-full mr-3 ${option.color}`} />
                  {option.label}
                </Button>
              ))}
            </div>
          </div>

          <Separator className="bg-gray-600" />

          {/* User Info */}
          <div className="space-y-3">
            <h4 className="font-medium text-white">Contact Information</h4>
            <div className="space-y-2">
              <div className="flex items-center space-x-3 text-sm">
                <Mail className="w-4 h-4 text-gray-400" />
                <span className="text-white">{user?.email}</span>
              </div>
              <div className="flex items-center space-x-3 text-sm">
                <Clock className="w-4 h-4 text-gray-400" />
                <span className="text-white">{user?.timezone}</span>
              </div>
              <div className="flex items-center space-x-3 text-sm">
                <UserIcon className="w-4 h-4 text-gray-400" />
                <span className="text-white">{user?.role}</span>
              </div>
            </div>
          </div>

          <Separator className="bg-gray-600" />

          {/* Actions */}
          <div className="space-y-2">
            <Button
              variant="ghost"
              className="w-full justify-start text-white hover:bg-gray-700"
            >
              <Settings className="w-4 h-4 mr-3" />
              Account Settings
            </Button>
            <Button
              variant="ghost"
              onClick={handleLogout}
              className="w-full justify-start text-slack-red hover:text-slack-red hover:bg-gray-700"
            >
              <LogOut className="w-4 h-4 mr-3" />
              Sign out
            </Button>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
};

export default UserProfile;
