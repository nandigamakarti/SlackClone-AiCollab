
import React, { useState, useMemo } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { 
  Search, 
  X, 
  Filter,
  Calendar,
  User,
  Hash,
  File
} from 'lucide-react';
import { useMessages } from '@/contexts/MessageContext';

interface SearchModalProps {
  isOpen: boolean;
  onClose: () => void;
}

const SearchModal: React.FC<SearchModalProps> = ({ isOpen, onClose }) => {
  const [searchQuery, setSearchQuery] = useState('');
  const [activeTab, setActiveTab] = useState('all');
  const { messages } = useMessages();

  const searchResults = useMemo(() => {
    if (!searchQuery.trim()) return { messages: [], files: [], channels: [], people: [] };

    const allMessages: any[] = [];
    const allFiles: any[] = [];
    const allChannels: any[] = [];
    const allPeople: any[] = [];

    // Search through all channels and messages
    Object.entries(messages).forEach(([channelId, channelMessages]) => {
      // Add channel if it matches
      if (channelId.toLowerCase().includes(searchQuery.toLowerCase())) {
        allChannels.push({
          type: 'channel',
          name: channelId,
          description: `${channelMessages.length} messages`,
          members: Math.floor(Math.random() * 20) + 5
        });
      }

      // Search through messages
      channelMessages.forEach(message => {
        const contentMatch = message.content.toLowerCase().includes(searchQuery.toLowerCase());
        const userMatch = message.username.toLowerCase().includes(searchQuery.toLowerCase());

        if (contentMatch || userMatch) {
          allMessages.push({
            type: 'message',
            content: message.content,
            channel: channelId,
            user: message.username,
            timestamp: formatTimestamp(message.timestamp),
            id: message.id
          });
        }

        // Check for file attachments
        const filePattern = /📎 (.+)/g;
        let match;
        while ((match = filePattern.exec(message.content)) !== null) {
          const fileName = match[1];
          if (fileName.toLowerCase().includes(searchQuery.toLowerCase())) {
            allFiles.push({
              type: 'file',
              name: fileName,
              channel: channelId,
              user: message.username,
              timestamp: formatTimestamp(message.timestamp)
            });
          }
        }

        // Add unique people
        if (userMatch && !allPeople.find(p => p.name === message.username)) {
          allPeople.push({
            type: 'user',
            name: message.username,
            status: 'Team Member',
            online: Math.random() > 0.5
          });
        }
      });
    });

    return {
      messages: allMessages,
      files: allFiles,
      channels: allChannels,
      people: allPeople
    };
  }, [searchQuery, messages]);

  const formatTimestamp = (date: Date) => {
    const now = new Date();
    const diff = now.getTime() - date.getTime();
    const hours = Math.floor(diff / (1000 * 60 * 60));
    const days = Math.floor(diff / (1000 * 60 * 60 * 24));

    if (hours < 24) return `${hours} hours ago`;
    if (days < 7) return `${days} days ago`;
    return date.toLocaleDateString();
  };

  const getFilteredResults = () => {
    switch (activeTab) {
      case 'messages': return searchResults.messages;
      case 'files': return searchResults.files;
      case 'people': return searchResults.people;
      case 'channels': return searchResults.channels;
      default: return [...searchResults.messages, ...searchResults.files, ...searchResults.people, ...searchResults.channels];
    }
  };

  const filteredResults = getFilteredResults();

  const tabs = [
    { id: 'all', label: 'All', count: searchResults.messages.length + searchResults.files.length + searchResults.people.length + searchResults.channels.length },
    { id: 'messages', label: 'Messages', count: searchResults.messages.length },
    { id: 'files', label: 'Files', count: searchResults.files.length },
    { id: 'people', label: 'People', count: searchResults.people.length },
    { id: 'channels', label: 'Channels', count: searchResults.channels.length }
  ];

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
      <div className="bg-gray-800 rounded-lg shadow-xl w-full max-w-2xl mx-4 max-h-[80vh] flex flex-col">
        {/* Header */}
        <div className="flex items-center justify-between p-4 border-b border-gray-700">
          <h2 className="text-lg font-semibold text-white">Search Workspace</h2>
          <Button
            variant="ghost"
            size="sm"
            onClick={onClose}
            className="text-gray-400 hover:text-white"
          >
            <X className="w-4 h-4" />
          </Button>
        </div>

        {/* Search Input */}
        <div className="p-4 border-b border-gray-700">
          <div className="relative">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-gray-400" />
            <Input
              type="text"
              placeholder="Search messages, files, people, and channels..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="pl-10 bg-gray-700 border-gray-600 text-white placeholder-gray-400"
              autoFocus
            />
          </div>
          
          {/* Search Filters */}
          <div className="flex items-center space-x-2 mt-3">
            <Button
              variant="outline"
              size="sm"
              className="text-gray-400 border-gray-600 hover:bg-gray-700"
            >
              <Filter className="w-3 h-3 mr-1" />
              Filters
            </Button>
            <Button
              variant="outline"
              size="sm"
              className="text-gray-400 border-gray-600 hover:bg-gray-700"
            >
              <Calendar className="w-3 h-3 mr-1" />
              Date
            </Button>
            <Button
              variant="outline"
              size="sm"
              className="text-gray-400 border-gray-600 hover:bg-gray-700"
            >
              <User className="w-3 h-3 mr-1" />
              Person
            </Button>
          </div>
        </div>

        {/* Search Tabs */}
        <div className="flex border-b border-gray-700">
          {tabs.map((tab) => (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id)}
              className={`px-4 py-3 text-sm font-medium border-b-2 transition-colors ${
                activeTab === tab.id
                  ? 'border-blue-500 text-blue-400'
                  : 'border-transparent text-gray-400 hover:text-white'
              }`}
            >
              {tab.label} ({tab.count})
            </button>
          ))}
        </div>

        {/* Search Results */}
        <div className="flex-1 overflow-hidden">
          <div className="h-full overflow-y-auto scrollbar-hide p-4">
            {filteredResults.length === 0 ? (
              <div className="text-center py-8">
                <Search className="w-12 h-12 text-gray-600 mx-auto mb-4" />
                <p className="text-gray-400">
                  {searchQuery ? 'No results found' : 'Start typing to search'}
                </p>
              </div>
            ) : (
              <div className="space-y-3">
                {filteredResults.map((result, index) => (
                  <div key={index} className="p-3 bg-gray-700 rounded-lg hover:bg-gray-600 cursor-pointer">
                    {result.type === 'message' && (
                      <div className="flex items-start space-x-3">
                        <Hash className="w-4 h-4 text-gray-400 mt-1" />
                        <div className="flex-1">
                          <div className="flex items-center space-x-2 mb-1">
                            <span className="text-white font-medium">{result.user}</span>
                            <span className="text-gray-400 text-sm">in #{result.channel}</span>
                            <span className="text-gray-400 text-sm">{result.timestamp}</span>
                          </div>
                          <p className="text-gray-300">{result.content}</p>
                        </div>
                      </div>
                    )}
                    
                    {result.type === 'file' && (
                      <div className="flex items-center space-x-3">
                        <File className="w-4 h-4 text-gray-400" />
                        <div className="flex-1">
                          <div className="flex items-center space-x-2">
                            <span className="text-white font-medium">{result.name}</span>
                            <span className="text-gray-400 text-sm">in #{result.channel}</span>
                          </div>
                          <p className="text-gray-400 text-sm">Shared by {result.user} • {result.timestamp}</p>
                        </div>
                      </div>
                    )}
                    
                    {result.type === 'user' && (
                      <div className="flex items-center space-x-3">
                        <div className="w-8 h-8 bg-slack-aubergine rounded-md flex items-center justify-center">
                          <span className="text-white font-bold text-sm">
                            {result.name.charAt(0).toUpperCase()}
                          </span>
                        </div>
                        <div className="flex-1">
                          <div className="flex items-center space-x-2">
                            <span className="text-white font-medium">{result.name}</span>
                            {result.online && <div className="w-2 h-2 bg-green-500 rounded-full" />}
                          </div>
                          <p className="text-gray-400 text-sm">{result.status}</p>
                        </div>
                      </div>
                    )}
                    
                    {result.type === 'channel' && (
                      <div className="flex items-center space-x-3">
                        <Hash className="w-4 h-4 text-gray-400" />
                        <div className="flex-1">
                          <div className="flex items-center space-x-2">
                            <span className="text-white font-medium">#{result.name}</span>
                            <span className="text-gray-400 text-sm">{result.members} members</span>
                          </div>
                          <p className="text-gray-400 text-sm">{result.description}</p>
                        </div>
                      </div>
                    )}
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default SearchModal;
