import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { 
  Search, 
  Users, 
  ChevronLeft,
  Settings,
  Bell
} from 'lucide-react';
import { User, Workspace } from '@/contexts/AuthContext';
import { UserAvatar } from '@/components/ui/user-avatar';
import { useWorkspaceMembers } from '@/hooks/useWorkspaceMembers';
import { motion } from 'framer-motion';

interface DMSidebarProps {
  user: User | null;
  workspace: Workspace | null;
  onUserSelect: (userId: string) => void;
  onBackClick: () => void;
  selectedDM: string | null;
}

const DMSidebar: React.FC<DMSidebarProps> = ({
  user,
  workspace,
  onUserSelect,
  onBackClick,
  selectedDM
}) => {
  const [searchQuery, setSearchQuery] = useState('');
  const { members, loading } = useWorkspaceMembers(workspace?.id);

  const getPresenceColor = (presence: string) => {
    switch (presence) {
      case 'active': return 'bg-green-500';
      case 'away': return 'border-2 border-green-500 bg-transparent';
      case 'dnd': return 'bg-red-500';
      default: return 'bg-gray-400';
    }
  };

  // Filter out current user and apply search
  const filteredMembers = members
    .filter(member => member.user_id !== user?.id)
    .filter(member =>
      member.profiles?.display_name?.toLowerCase().includes(searchQuery.toLowerCase())
    );

  return (
    <motion.div 
      initial={{ x: -50, opacity: 0 }}
      animate={{ x: 0, opacity: 1 }}
      transition={{ duration: 0.3 }}
      className="w-64 bg-[#19171d] text-white flex flex-col shadow-xl"
    >
      {/* Header */}
      <div className="p-3 border-b border-gray-700">
        <div className="flex items-center justify-between mb-2">
          <Button
            variant="ghost"
            size="sm"
            onClick={onBackClick}
            className="text-gray-300 hover:bg-gray-700 hover:text-white p-1 h-8 w-8"
          >
            <ChevronLeft className="w-4 h-4" />
          </Button>
          <h1 className="font-bold text-lg text-white">Direct Messages</h1>
          <div className="w-8" />
        </div>
        
        <div className="flex items-center mt-2">
          <div className="relative">
            <motion.div
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              className="w-6 h-6 bg-purple-600 rounded-full flex items-center justify-center text-white font-bold shadow-md"
            >
              {user?.displayName?.charAt(0).toUpperCase() || 'U'}
            </motion.div>
            <motion.div 
              className="absolute -bottom-0.5 -right-0.5 w-2 h-2 rounded-full bg-green-500 border border-[#19171d]"
              animate={{ scale: [1, 1.15, 1] }}
              transition={{ repeat: Infinity, duration: 2 }}
            />
          </div>
          <span className="ml-2 text-sm text-gray-300">{user?.displayName}</span>
        </div>
      </div>

      {/* Search */}
      <div className="p-3">
        <motion.div 
          className="relative"
          whileHover={{ scale: 1.02 }}
          whileTap={{ scale: 0.98 }}
        >
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-gray-400" />
          <Input
            type="text"
            placeholder="Search people"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="pl-10 bg-[#222529] border-transparent text-white placeholder:text-gray-400 rounded-md h-9 text-sm focus:ring-1 focus:ring-gray-500 focus:border-transparent"
          />
        </motion.div>
      </div>

      {/* Members List */}
      <div className="flex-1 overflow-y-auto p-3 sidebar-content">
        <div className="mb-4">
          <h3 className="text-sm font-medium text-gray-300 mb-2 flex items-center">
            <Users className="w-4 h-4 mr-2" />
            Workspace Members ({filteredMembers.length})
          </h3>
          
          {loading ? (
            <div className="flex justify-center py-4">
              <div className="w-5 h-5 border-2 border-t-transparent border-purple-500 rounded-full animate-spin" />
            </div>
          ) : filteredMembers.length === 0 ? (
            <div className="text-center py-4">
              <p className="text-gray-400 text-sm">
                {searchQuery ? 'No members found.' : 'No other members in workspace.'}
              </p>
            </div>
          ) : (
            <div className="space-y-1">
              {filteredMembers.map((member) => {
                const isSelected = selectedDM === `dm-${member.user_id}`;
                return (
                  <motion.div
                    key={member.id}
                    whileHover={{ x: 4 }}
                    whileTap={{ scale: 0.98 }}
                  >
                    <Button
                      variant="ghost"
                      onClick={() => onUserSelect(`dm-${member.user_id}`)}
                      className={`w-full justify-start text-white hover:bg-gray-700 h-10 text-sm px-2 transition-all duration-200 ${
                        isSelected ? 'bg-[#1164a3] text-white' : 'text-gray-300'
                      }`}
                    >
                      <div className="flex items-center space-x-3 w-full">
                        <div className="relative">
                          <UserAvatar 
                            name={member.profiles?.display_name || 'User'} 
                            size="sm"
                            className="w-6 h-6"
                          />
                          <motion.div 
                            className={`absolute -bottom-0.5 -right-0.5 w-2.5 h-2.5 rounded-full ${getPresenceColor(member.profiles?.presence || 'offline')}`}
                            animate={member.profiles?.presence === 'active' ? { scale: [1, 1.2, 1] } : {}}
                            transition={{ repeat: member.profiles?.presence === 'active' ? Infinity : 0, duration: 2 }}
                          />
                        </div>
                        <span className="flex-1 text-left truncate">
                          {member.profiles?.display_name || 'User'}
                        </span>
                        {member.role === 'admin' && (
                          <span className="text-xs text-gray-400">Admin</span>
                        )}
                      </div>
                    </Button>
                  </motion.div>
                );
              })}
            </div>
          )}
        </div>
      </div>

      {/* Footer */}
      <div className="p-3 border-t border-gray-700">
        <div className="flex items-center space-x-2">
          <Button
            variant="ghost"
            size="sm"
            className="text-gray-400 hover:text-white hover:bg-gray-700 p-2 h-8 w-8 rounded-full"
          >
            <Settings className="w-4 h-4" />
          </Button>
          <Button
            variant="ghost"
            size="sm"
            className="text-gray-400 hover:text-white hover:bg-gray-700 p-2 h-8 w-8 rounded-full"
          >
            <Bell className="w-4 h-4" />
          </Button>
        </div>
      </div>
    </motion.div>
  );
};

export default DMSidebar;
