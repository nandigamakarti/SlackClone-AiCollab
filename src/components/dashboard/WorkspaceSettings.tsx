import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { 
  X, 
  Upload,
  Users,
  Shield,
  Bell,
  Palette,
  Settings,
  Trash2
} from 'lucide-react';

interface WorkspaceSettingsProps {
  isOpen: boolean;
  onClose: () => void;
}

const WorkspaceSettings: React.FC<WorkspaceSettingsProps> = ({ isOpen, onClose }) => {
  const [activeTab, setActiveTab] = useState('general');
  const [workspaceName, setWorkspaceName] = useState('My Workspace');
  const [workspaceDescription, setWorkspaceDescription] = useState('A collaborative workspace for our team');

  if (!isOpen) return null;

  const tabs = [
    { id: 'general', label: 'General', icon: Settings },
    { id: 'members', label: 'Members', icon: Users },
    { id: 'permissions', label: 'Permissions', icon: Shield },
    { id: 'notifications', label: 'Notifications', icon: Bell },
    { id: 'appearance', label: 'Appearance', icon: Palette },
  ];

  return (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
      <div className="bg-gray-800 rounded-lg shadow-xl w-full max-w-4xl mx-4 max-h-[90vh] flex">
        {/* Sidebar */}
        <div className="w-64 bg-gray-900 rounded-l-lg border-r border-gray-700">
          <div className="p-4 border-b border-gray-700">
            <h2 className="text-lg font-semibold text-white">Workspace Settings</h2>
          </div>
          <nav className="p-2">
            {tabs.map((tab) => {
              const Icon = tab.icon;
              return (
                <button
                  key={tab.id}
                  onClick={() => setActiveTab(tab.id)}
                  className={`w-full flex items-center space-x-3 px-3 py-2 rounded-md text-left transition-colors ${
                    activeTab === tab.id
                      ? 'bg-gray-700 text-white'
                      : 'text-gray-400 hover:text-white hover:bg-gray-800'
                  }`}
                >
                  <Icon className="w-4 h-4" />
                  <span>{tab.label}</span>
                </button>
              );
            })}
          </nav>
        </div>

        {/* Main Content */}
        <div className="flex-1 flex flex-col">
          {/* Header */}
          <div className="flex items-center justify-between p-4 border-b border-gray-700">
            <h3 className="text-lg font-semibold text-white">
              {tabs.find(tab => tab.id === activeTab)?.label}
            </h3>
            <Button
              variant="ghost"
              size="sm"
              onClick={onClose}
              className="text-gray-400 hover:text-white"
            >
              <X className="w-4 h-4" />
            </Button>
          </div>

          {/* Content */}
          <div className="flex-1 overflow-y-auto p-6">
            {activeTab === 'general' && (
              <div className="space-y-6">
                <div>
                  <label className="block text-sm font-medium text-gray-300 mb-2">
                    Workspace Name
                  </label>
                  <Input
                    value={workspaceName}
                    onChange={(e) => setWorkspaceName(e.target.value)}
                    className="bg-gray-700 border-gray-600 text-white"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-300 mb-2">
                    Description
                  </label>
                  <Textarea
                    value={workspaceDescription}
                    onChange={(e) => setWorkspaceDescription(e.target.value)}
                    className="bg-gray-700 border-gray-600 text-white"
                    rows={3}
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-300 mb-2">
                    Workspace Icon
                  </label>
                  <div className="flex items-center space-x-4">
                    <div className="w-16 h-16 bg-gradient-to-br from-purple-400 to-purple-700 rounded-lg flex items-center justify-center overflow-hidden">
                      <svg width="40" height="40" viewBox="0 0 40 40" fill="none" xmlns="http://www.w3.org/2000/svg">
                        <path d="M10 4c2.2 0 4 1.8 4 4s-1.8 4-4 4H6V8c0-2.2 1.8-4 4-4z" fill="white"/>
                        <path d="M2 14c0 2.2 1.8 4 4 4s4-1.8 4-4v-4H6c-2.2 0-4 1.8-4 4z" fill="white"/>
                        <path d="M6 24c-2.2 0-4-1.8-4-4s1.8-4 4-4h4v4c0 2.2-1.8 4-4 4z" fill="white"/>
                        <path d="M14 14c0-2.2 1.8-4 4-4s4 1.8 4 4-1.8 4-4 4h-4v-4z" fill="white"/>
                      </svg>
                    </div>
                    <Button className="bg-gray-700 text-white hover:bg-gray-600">
                      <Upload className="w-4 h-4 mr-2" />
                      Upload Image
                    </Button>
                  </div>
                </div>

                <div className="pt-4 border-t border-gray-700">
                  <h4 className="text-red-400 font-medium mb-2">Danger Zone</h4>
                  <Button variant="destructive" className="bg-red-600 hover:bg-red-700">
                    <Trash2 className="w-4 h-4 mr-2" />
                    Delete Workspace
                  </Button>
                </div>
              </div>
            )}

            {activeTab === 'members' && (
              <div className="space-y-4">
                <div className="flex items-center justify-between">
                  <h4 className="text-white font-medium">Workspace Members</h4>
                  <Button className="bg-slack-aubergine hover:bg-slack-dark-aubergine text-white">
                    Invite Members
                  </Button>
                </div>
                <div className="space-y-2">
                  {['Sarah Wilson', 'Mike Chen', 'Emma Davis', 'John Smith'].map((member, index) => (
                    <div key={index} className="flex items-center justify-between p-3 bg-gray-700 rounded-lg">
                      <div className="flex items-center space-x-3">
                        <div className="w-8 h-8 bg-slack-aubergine rounded-md flex items-center justify-center">
                          <span className="text-white font-bold text-sm">
                            {member.charAt(0).toUpperCase()}
                          </span>
                        </div>
                        <span className="text-white">{member}</span>
                      </div>
                      <select className="bg-gray-600 text-white border-gray-500 rounded px-2 py-1">
                        <option>Admin</option>
                        <option>Member</option>
                        <option>Guest</option>
                      </select>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {activeTab === 'permissions' && (
              <div className="space-y-4">
                <h4 className="text-white font-medium">Channel Permissions</h4>
                <div className="space-y-3">
                  {[
                    'Create public channels',
                    'Create private channels',
                    'Archive channels',
                    'Delete messages',
                    'Pin messages'
                  ].map((permission, index) => (
                    <div key={index} className="flex items-center justify-between p-3 bg-gray-700 rounded-lg">
                      <span className="text-white">{permission}</span>
                      <select className="bg-gray-600 text-white border-gray-500 rounded px-2 py-1">
                        <option>Everyone</option>
                        <option>Admins only</option>
                        <option>Nobody</option>
                      </select>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {activeTab === 'notifications' && (
              <div className="space-y-4">
                <h4 className="text-white font-medium">Default Notification Settings</h4>
                <div className="space-y-3">
                  {[
                    'All new messages',
                    'Direct messages and mentions',
                    'Nothing'
                  ].map((setting, index) => (
                    <label key={index} className="flex items-center space-x-3 p-3 bg-gray-700 rounded-lg cursor-pointer">
                      <input type="radio" name="notifications" className="text-slack-aubergine" />
                      <span className="text-white">{setting}</span>
                    </label>
                  ))}
                </div>
              </div>
            )}

            {activeTab === 'appearance' && (
              <div className="space-y-4">
                <h4 className="text-white font-medium">Theme</h4>
                <div className="grid grid-cols-2 gap-4">
                  <div className="p-4 bg-gray-700 rounded-lg border border-slack-aubergine">
                    <div className="text-white font-medium mb-2">Dark Theme</div>
                    <div className="text-gray-400 text-sm">Current theme</div>
                  </div>
                  <div className="p-4 bg-gray-700 rounded-lg border border-gray-600">
                    <div className="text-white font-medium mb-2">Light Theme</div>
                    <div className="text-gray-400 text-sm">Classic appearance</div>
                  </div>
                </div>
              </div>
            )}
          </div>

          {/* Footer */}
          <div className="flex items-center justify-end space-x-3 p-4 border-t border-gray-700">
            <Button variant="outline" onClick={onClose} className="border-gray-600 text-gray-400 hover:text-white">
              Cancel
            </Button>
            <Button className="bg-slack-aubergine hover:bg-slack-dark-aubergine text-white">
              Save Changes
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default WorkspaceSettings;
