import React, { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { 
  ChevronDown,
  ChevronRight,
  Hash,
  Lock,
  Plus,
  Search,
  MoreVertical,
  UserPlus,
  MessageSquare,
  LogOut, 
  Settings,
  User as UserIcon
} from 'lucide-react';
import { User, Workspace } from '@/contexts/AuthContext';
import { useMessages } from '@/contexts/MessageContext';
import { useWorkspaceMembers } from '@/hooks/useWorkspaceMembers';
import DirectMessageModal from './DirectMessageModal';
import { motion, AnimatePresence } from 'framer-motion';
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from '@/components/ui/tooltip';
import { UserAvatar } from '@/components/ui/user-avatar';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";

interface Channel {
  id: string;
  name: string;
  isPrivate: boolean;
  description?: string;
  unreadCount?: number;
  createdAt: string;
  createdBy?: string;
}

interface SidebarProps {
  user: User | null;
  workspace: Workspace | null;
  currentChannel: string;
  channels: Channel[];
  onChannelSelect: (channel: string) => void;
  onCreateChannel: () => void;
  onInviteTeammates: () => void;
  onProfileClick: () => void;
  onLogout: () => void;
}

const Sidebar: React.FC<SidebarProps> = ({
  user,
  workspace,
  currentChannel,
  channels,
  onChannelSelect,
  onCreateChannel,
  onInviteTeammates,
  onProfileClick,
  onLogout
}) => {
  const [channelsExpanded, setChannelsExpanded] = useState(true);
  const [directMessagesExpanded, setDirectMessagesExpanded] = useState(true);
  const [searchQuery, setSearchQuery] = useState('');
  const [showDirectMessageModal, setShowDirectMessageModal] = useState(false);
  const { messages } = useMessages();
  const { members } = useWorkspaceMembers(workspace?.id);

  const getPresenceColor = (presence: string) => {
    switch (presence) {
      case 'active': return 'bg-green-500';
      case 'away': return 'border-2 border-green-500 bg-transparent';
      case 'dnd': return 'bg-red-500';
      default: return 'bg-gray-400';
    }
  };

  const getUnreadCount = (channelId: string) => {
    return 0;
  };

  const filteredChannels = channels.filter(channel =>
    channel.name.toLowerCase().includes(searchQuery.toLowerCase())
  );

  // Filter workspace members for direct messages (exclude current user)
  const directMessages = members
    .filter(member => member.user_id !== user?.id)
    .filter(member =>
      member.profiles?.display_name?.toLowerCase().includes(searchQuery.toLowerCase())
    )
    .map(member => ({
      id: `dm-${member.user_id}`,
      name: member.profiles?.display_name || 'User',
      presence: member.profiles?.presence || 'offline',
      role: member.role
    }));

  const handleDirectMessageSelect = (userId: string) => {
    onChannelSelect(userId);
  };

  return (
    <motion.div 
      initial={{ x: -50, opacity: 0 }}
      animate={{ x: 0, opacity: 1 }}
      transition={{ duration: 0.3 }}
      className="w-64 bg-[#19171d] text-white flex flex-col shadow-xl">
      {/* Workspace Header */}
      <motion.div 
        whileHover={{ backgroundColor: 'rgba(255, 255, 255, 0.05)' }}
        className="p-3 border-b border-gray-700 cursor-pointer"
      >
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-2">
            <motion.h1 
              className="font-bold text-xl truncate"
              whileHover={{ scale: 1.02 }}
            >
              {workspace?.name || 'Workspace'}
            </motion.h1>
          </div>
          <motion.div whileHover={{ rotate: 180 }} transition={{ duration: 0.3 }}>
            <ChevronDown className="w-5 h-5 text-white/60" />
          </motion.div>
        </div>
      </motion.div>

      {/* Search */}
      <div className="p-3">
        <motion.div 
          className="relative"
          whileHover={{ scale: 1.02 }}
          whileTap={{ scale: 0.98 }}
        >
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-white/60" />
          <Input
            type="text"
            placeholder="Search channels..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="pl-10 bg-[#222529] border-transparent text-white placeholder:text-gray-400 rounded-md h-9 text-base focus:ring-1 focus:ring-gray-500 focus:border-transparent"
          />
        </motion.div>
      </div>

      {/* Sidebar Content */}
      <div className="flex-1 overflow-y-auto p-3 pt-2 sidebar-content">
        <div className="mb-4">
          {/* Channels Section */}
          <motion.div className="rounded-md">
            <button
              onClick={() => setChannelsExpanded(!channelsExpanded)}
              className="w-full flex justify-between items-center text-white py-1 px-2 text-base hover:bg-gray-700 rounded-md"
            >
              <div className="flex items-center text-sm font-medium text-gray-300">
                <motion.div
                  animate={{ rotate: channelsExpanded ? 0 : -90 }}
                  transition={{ duration: 0.2 }}
                >
                  <ChevronDown className="w-3 h-3 mr-1" />
                </motion.div>
                Channels ({channels.length})
              </div>
              <motion.div
                whileHover={{ rotate: 45, scale: 1.1 }}
                className="text-gray-400 hover:text-white"
              >
                <Plus className="w-4 h-4" onClick={(e) => {
                  e.stopPropagation();
                  onCreateChannel();
                }} />
              </motion.div>
            </button>
          </motion.div>
          
          <AnimatePresence>
            {channelsExpanded && (
              <motion.div 
                initial={{ height: 0, opacity: 0 }}
                animate={{ height: 'auto', opacity: 1 }}
                exit={{ height: 0, opacity: 0 }}
                transition={{ duration: 0.2 }}
                className="overflow-hidden"
              >
                <div className="space-y-1 pt-1">
                  {filteredChannels.map((channel) => {
                    const isActive = currentChannel === channel.id;
                    return (
                      <motion.div
                        key={channel.id}
                        whileHover={{ x: 2 }}
                      >
                        <button
                          onClick={() => onChannelSelect(channel.id)}
                          className={`w-full flex items-center text-left py-1 px-2 rounded-md ${
                            isActive ? 'bg-[#1164a3] text-white' : 'text-gray-300 hover:bg-gray-700'
                          }`}
                        >
                          <div className="flex items-center w-full">
                            <div className="mr-2 flex-shrink-0">
                              {channel.isPrivate ? (
                                <Lock className="w-3 h-3 text-gray-400" />
                              ) : (
                                <Hash className="w-3 h-3 text-gray-400" />
                              )}
                            </div>
                            <span className="truncate text-sm">{channel.name}</span>
                          </div>
                        </button>
                      </motion.div>
                    );
                  })}
                </div>
              </motion.div>
            )}
          </AnimatePresence>
        </div>

        {/* Direct Messages Section */}
        <div className="mb-4">
          <motion.div whileHover={{ backgroundColor: 'rgba(255, 255, 255, 0.05)' }} className="rounded-md">
            <Button
              variant="ghost"
              onClick={() => setDirectMessagesExpanded(!directMessagesExpanded)}
              className="w-full justify-between text-white hover:bg-white/10 h-10 px-2 mb-1 transition-all duration-200"
            >
              <div className="flex items-center text-base font-semibold text-white/70">
                <motion.div
                  animate={{ rotate: directMessagesExpanded ? 0 : -90 }}
                  transition={{ duration: 0.2 }}
                >
                  <ChevronDown className="w-4 h-4 mr-1" />
                </motion.div>
                <div className="flex items-center">
                  <MessageSquare className="w-4 h-4 mr-1.5 text-white/70" />
                  Direct messages
                </div>
              </div>
              <TooltipProvider>
                <Tooltip>
                  <TooltipTrigger asChild>
                    <motion.div
                      whileHover={{ scale: 1.1, backgroundColor: 'rgba(255, 255, 255, 0.2)' }}
                      whileTap={{ scale: 0.95 }}
                      className="rounded-full"
                    >
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={(e) => {
                          e.stopPropagation();
                          setShowDirectMessageModal(true);
                        }}
                        className="hover:bg-white/20 h-7 w-7 p-0 rounded-full"
                      >
                        <Plus className="w-4 h-4" />
                      </Button>
                    </motion.div>
                  </TooltipTrigger>
                  <TooltipContent side="right">
                    <p>Start a direct message</p>
                  </TooltipContent>
                </Tooltip>
              </TooltipProvider>
            </Button>
          </motion.div>
          
          <AnimatePresence>
            {directMessagesExpanded && (
              <motion.div 
                initial={{ height: 0, opacity: 0 }}
                animate={{ height: 'auto', opacity: 1 }}
                exit={{ height: 0, opacity: 0 }}
                transition={{ duration: 0.2 }}
                className="overflow-hidden"
              >
                <div className="space-y-1 pt-1">
                  {directMessages.length === 0 ? (
                    <div className="text-center py-4">
                      <p className="text-white/60 text-sm">No team members found</p>
                    </div>
                  ) : (
                    directMessages.map((dm) => {
                      const isActive = currentChannel === dm.id;
                      return (
                        <motion.div
                          key={dm.id}
                          whileHover={{ x: 4 }}
                          whileTap={{ scale: 0.98 }}
                        >
                          <Button
                            variant="ghost"
                            onClick={() => handleDirectMessageSelect(dm.id)}
                            className={`w-full justify-start text-white hover:bg-white/10 h-9 text-base font-normal px-2 transition-all duration-200 ${
                              isActive ? 'bg-white/20 font-medium' : ''
                            }`}
                          >
                            <div className="flex items-center justify-between w-full">
                              <div className="flex items-center min-w-0">
                                <motion.div 
                                  className="relative mr-2 flex-shrink-0"
                                  whileHover={{ scale: 1.1 }}
                                >
                                  <div className="w-4 h-4 rounded-full overflow-hidden">
                                    <UserAvatar 
                                      name={dm.name} 
                                      size="xs" 
                                      className="w-full h-full"
                                    />
                                  </div>
                                  <motion.div 
                                    className={`absolute -bottom-0.5 -right-0.5 w-2.5 h-2.5 rounded-full ${getPresenceColor(dm.presence)}`}
                                    animate={dm.presence === 'active' ? { scale: [1, 1.2, 1] } : {}}
                                    transition={{ repeat: dm.presence === 'active' ? Infinity : 0, duration: 2 }}
                                  />
                                </motion.div>
                                <span className="truncate">{dm.name}</span>
                              </div>
                              {dm.role === 'admin' && (
                                <span className="text-xs text-white/60">Admin</span>
                              )}
                            </div>
                          </Button>
                        </motion.div>
                      );
                    })
                  )}
                </div>
              </motion.div>
            )}
          </AnimatePresence>
        </div>
      </div>

      {/* User Profile Section */}
      <div className="mt-auto">
        <motion.div 
          className="p-3 border-t border-gray-700"
          whileHover={{ backgroundColor: 'rgba(255, 255, 255, 0.05)' }}
        >
          <div className="flex items-center">
            <div className="relative mr-3">
              <motion.div
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                className="w-10 h-10 bg-purple-600 rounded-md flex items-center justify-center text-white font-bold shadow-md"
              >
                {user?.displayName?.charAt(0).toUpperCase() || 'K'}
              </motion.div>
              <motion.div 
                className="absolute -bottom-1 -right-1 w-3 h-3 rounded-full bg-green-500 border-2 border-[#19171d]"
                animate={{ scale: [1, 1.15, 1] }}
                transition={{ repeat: Infinity, duration: 2 }}
              />
            </div>
            
            <div className="flex-1">
              <div className="text-white font-medium text-sm">
                {user?.displayName || 'Kartikeya Nandigama'}
              </div>
              <div className="flex items-center text-gray-400 text-xs">
                <span className="mr-1">🙂</span>
                <span>Active</span>
              </div>
            </div>

            <div className="flex items-center">
              <TooltipProvider>
                <Tooltip>
                  <TooltipTrigger asChild>
                    <motion.button
                      whileHover={{ scale: 1.1 }}
                      whileTap={{ scale: 0.95 }}
                      className="w-8 h-8 rounded-full flex items-center justify-center text-gray-400 hover:text-white mx-1"
                      title="Activity and invites"
                    >
                      <svg className="w-4 h-4" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                        <path d="M18 8C18 6.4087 17.3679 4.88258 16.2426 3.75736C15.1174 2.63214 13.5913 2 12 2C10.4087 2 8.88258 2.63214 7.75736 3.75736C6.63214 4.88258 6 6.4087 6 8C6 15 3 17 3 17H21C21 17 18 15 18 8Z" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                        <path d="M13.73 21C13.5542 21.3031 13.3019 21.5547 12.9982 21.7295C12.6946 21.9044 12.3504 21.9965 12 21.9965C11.6496 21.9965 11.3054 21.9044 11.0018 21.7295C10.6982 21.5547 10.4458 21.3031 10.27 21" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                      </svg>
                    </motion.button>
                  </TooltipTrigger>
                  <TooltipContent side="top">
                    <p>Activity & Invites</p>
                  </TooltipContent>
                </Tooltip>
              </TooltipProvider>
              
              <TooltipProvider>
                <Tooltip>
                  <TooltipTrigger asChild>
                    <motion.button
                      whileHover={{ scale: 1.1 }}
                      whileTap={{ scale: 0.95 }}
                      className="w-8 h-8 rounded-full flex items-center justify-center text-gray-400 hover:text-white mx-1"
                      onClick={onInviteTeammates}
                      title="Workspace members"
                    >
                      <svg className="w-4 h-4" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                        <path d="M17 21V19C17 17.9391 16.5786 16.9217 15.8284 16.1716C15.0783 15.4214 14.0609 15 13 15H5C3.93913 15 2.92172 15.4214 2.17157 16.1716C1.42143 16.9217 1 17.9391 1 19V21" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                        <path d="M9 11C11.2091 11 13 9.20914 13 7C13 4.79086 11.2091 3 9 3C6.79086 3 5 4.79086 5 7C5 9.20914 6.79086 11 9 11Z" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                        <path d="M23 21V19C22.9993 18.1137 22.7044 17.2528 22.1614 16.5523C21.6184 15.8519 20.8581 15.3516 20 15.13" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                        <path d="M16 3.13C16.8604 3.35031 17.623 3.85071 18.1676 4.55232C18.7122 5.25392 19.0078 6.11683 19.0078 7.005C19.0078 7.89318 18.7122 8.75608 18.1676 9.45769C17.623 10.1593 16.8604 10.6597 16 10.88" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                      </svg>
                    </motion.button>
                  </TooltipTrigger>
                  <TooltipContent side="top">
                    <p>Workspace Members</p>
                  </TooltipContent>
                </Tooltip>
              </TooltipProvider>
              


              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <motion.button
                    whileHover={{ scale: 1.1 }}
                    whileTap={{ scale: 0.95 }}
                    className="w-8 h-8 rounded-full flex items-center justify-center text-gray-400 hover:text-white mx-1"
                  >
                    <svg className="w-4 h-4" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                      <path d="M12 22C17.5228 22 22 17.5228 22 12C22 6.47715 17.5228 2 12 2C6.47715 2 2 6.47715 2 12C2 17.5228 6.47715 22 12 22Z" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                      <path d="M12 16L16 12L12 8" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                      <path d="M8 12H16" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                    </svg>
                  </motion.button>
                </DropdownMenuTrigger>
                <DropdownMenuContent className="w-56 bg-[#1a1d21] border-gray-700 text-white">
                  <DropdownMenuLabel className="text-gray-400">Account</DropdownMenuLabel>
                  <DropdownMenuSeparator className="bg-gray-700" />
                  <DropdownMenuItem 
                    className="focus:bg-gray-700 focus:text-white cursor-pointer"
                    onClick={onProfileClick}
                  >
                    <UserIcon className="mr-2 h-4 w-4" />
                    <span>Profile</span>
                  </DropdownMenuItem>
                  <DropdownMenuItem 
                    className="focus:bg-gray-700 focus:text-white cursor-pointer"
                  >
                    <Settings className="mr-2 h-4 w-4" />
                    <span>Settings</span>
                  </DropdownMenuItem>
                  <DropdownMenuSeparator className="bg-gray-700" />
                  <DropdownMenuItem 
                    className="focus:bg-gray-700 focus:text-white text-red-500 focus:text-red-300 cursor-pointer"
                    onClick={onLogout}
                  >
                    <LogOut className="mr-2 h-4 w-4" />
                    <span>Logout</span>
                  </DropdownMenuItem>
                </DropdownMenuContent>
              </DropdownMenu>
            </div>
          </div>
        </motion.div>
      </div>

      {/* Direct Message Modal */}
      <DirectMessageModal
        isOpen={showDirectMessageModal}
        onClose={() => setShowDirectMessageModal(false)}
        onUserSelect={handleDirectMessageSelect}
      />
    </motion.div>
  );
};

export default Sidebar;
