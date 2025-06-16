
import React, { useState } from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { User, Users, Copy, Check } from 'lucide-react';
import { useAuth } from '@/contexts/AuthContext';

interface DirectMessageModalProps {
  isOpen: boolean;
  onClose: () => void;
  onUserSelect: (userId: string) => void;
}

const DirectMessageModal: React.FC<DirectMessageModalProps> = ({
  isOpen,
  onClose,
  onUserSelect
}) => {
  const { user, workspace } = useAuth();
  const [searchQuery, setSearchQuery] = useState('');
  const [copiedField, setCopiedField] = useState<string | null>(null);

  const workspaceMembers = [
    { id: 'dm-1', name: 'Sarah Wilson', email: 'sarah@company.com', presence: 'active', avatar: 'SW' },
    { id: 'dm-2', name: 'Mike Chen', email: 'mike@company.com', presence: 'away', avatar: 'MC' },
    { id: 'dm-3', name: 'Emma Davis', email: 'emma@company.com', presence: 'offline', avatar: 'ED' },
    { id: 'dm-4', name: 'John Smith', email: 'john@company.com', presence: 'active', avatar: 'JS' },
    { id: 'dm-5', name: 'Lisa Brown', email: 'lisa@company.com', presence: 'dnd', avatar: 'LB' },
  ];

  const getPresenceColor = (presence: string) => {
    switch (presence) {
      case 'active': return 'bg-green-500';
      case 'away': return 'border-2 border-green-500 bg-transparent';
      case 'dnd': return 'bg-red-500';
      default: return 'bg-gray-400';
    }
  };

  const filteredMembers = workspaceMembers.filter(member =>
    member.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
    member.email.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const workspaceUrl = `${workspace?.url || 'my-workspace'}.slack.com`;
  const workspaceId = workspace?.id || 'workspace-123';

  const handleCopy = (text: string, field: string) => {
    navigator.clipboard.writeText(text);
    setCopiedField(field);
    setTimeout(() => setCopiedField(null), 2000);
  };

  const handleUserClick = (userId: string) => {
    onUserSelect(userId);
    onClose();
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-lg">
        <DialogHeader>
          <DialogTitle>Direct Messages</DialogTitle>
        </DialogHeader>
        
        <div className="space-y-6">
          {/* Workspace Info */}
          <div className="bg-gray-50 rounded-lg p-4 space-y-3">
            <h3 className="font-semibold text-gray-900 flex items-center">
              <Users className="w-4 h-4 mr-2" />
              Workspace Details
            </h3>
            
            <div className="space-y-2">
              <div className="flex items-center justify-between">
                <span className="text-sm text-gray-600">Workspace URL:</span>
                <div className="flex items-center space-x-2">
                  <span className="text-sm font-mono bg-white px-2 py-1 rounded border">
                    {workspaceUrl}
                  </span>
                  <Button
                    size="sm"
                    variant="outline"
                    onClick={() => handleCopy(workspaceUrl, 'url')}
                    className="h-8 w-8 p-0"
                  >
                    {copiedField === 'url' ? (
                      <Check className="w-3 h-3 text-green-600" />
                    ) : (
                      <Copy className="w-3 h-3" />
                    )}
                  </Button>
                </div>
              </div>
              
              <div className="flex items-center justify-between">
                <span className="text-sm text-gray-600">Workspace ID:</span>
                <div className="flex items-center space-x-2">
                  <span className="text-sm font-mono bg-white px-2 py-1 rounded border">
                    {workspaceId}
                  </span>
                  <Button
                    size="sm"
                    variant="outline"
                    onClick={() => handleCopy(workspaceId, 'id')}
                    className="h-8 w-8 p-0"
                  >
                    {copiedField === 'id' ? (
                      <Check className="w-3 h-3 text-green-600" />
                    ) : (
                      <Copy className="w-3 h-3" />
                    )}
                  </Button>
                </div>
              </div>
            </div>
          </div>

          {/* Search */}
          <div>
            <Input
              type="text"
              placeholder="Search members..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full"
            />
          </div>

          {/* Members List */}
          <div className="max-h-64 overflow-y-auto">
            <h4 className="text-sm font-medium text-gray-700 mb-3">
              Team Members ({filteredMembers.length})
            </h4>
            
            <div className="space-y-2">
              {filteredMembers.map((member) => (
                <Button
                  key={member.id}
                  variant="ghost"
                  onClick={() => handleUserClick(member.id)}
                  className="w-full justify-start h-auto p-3 hover:bg-gray-50"
                >
                  <div className="flex items-center space-x-3 w-full">
                    <div className="relative">
                      <div className="w-10 h-10 bg-gray-200 rounded-lg flex items-center justify-center">
                        <span className="text-gray-700 font-medium text-sm">
                          {member.avatar}
                        </span>
                      </div>
                      <div className={`absolute -bottom-1 -right-1 w-3 h-3 rounded-full ${getPresenceColor(member.presence)}`} />
                    </div>
                    <div className="flex-1 text-left">
                      <div className="font-medium text-gray-900">{member.name}</div>
                      <div className="text-sm text-gray-500">{member.email}</div>
                    </div>
                    <User className="w-4 h-4 text-gray-400" />
                  </div>
                </Button>
              ))}
            </div>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
};

export default DirectMessageModal;
