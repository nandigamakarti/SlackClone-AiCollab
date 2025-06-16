import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '@/contexts/AuthContext';
import { useWorkspaces } from '@/hooks/useWorkspaces';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Plus, Users, LogOut, RefreshCw } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';

const WorkspacesPage: React.FC = () => {
  const { user, logout, setWorkspace } = useAuth();
  const { workspaces, loading, createWorkspace, joinWorkspace, refetch } = useWorkspaces();
  const { toast } = useToast();
  const navigate = useNavigate();
  const [joinWorkspaceUrl, setJoinWorkspaceUrl] = useState('');
  const [showJoinForm, setShowJoinForm] = useState(false);
  const [showCreateWorkspace, setShowCreateWorkspace] = useState(false);
  const [createWorkspaceData, setCreateWorkspaceData] = useState({
    name: '',
    description: '',
    slug: ''
  });
  const [isCreating, setIsCreating] = useState(false);
  const [isJoining, setIsJoining] = useState(false);
  const [launchingWorkspaceId, setLaunchingWorkspaceId] = useState<string | null>(null);

  const handleRefresh = () => {
    console.log('Manual refresh triggered');
    refetch();
    toast({
      title: 'Refreshing',
      description: 'Fetching latest workspaces...',
    });
  };

  const handleLaunchWorkspace = async (workspaceId: string) => {
    try {
      setLaunchingWorkspaceId(workspaceId);
      console.log('Launching workspace:', workspaceId);
      
      const selectedWorkspace = workspaces.find(ws => ws.id === workspaceId);
      if (!selectedWorkspace) {
        throw new Error('Workspace not found');
      }

      const workspaceData = {
        id: selectedWorkspace.id,
        name: selectedWorkspace.name,
        url: selectedWorkspace.url,
        slug: selectedWorkspace.slug,
        isAdmin: selectedWorkspace.created_by === user?.id
      };
      
      console.log('Setting workspace in auth context:', workspaceData);
      
      // Set workspace in context and wait for it to be set
      setWorkspace(workspaceData);
      
      // Store in localStorage for persistence
      localStorage.setItem('slack_workspace', JSON.stringify(workspaceData));
      localStorage.setItem('workspace_selected', 'true');
      
      // Clear any existing navigation state
      localStorage.removeItem('navigation_state');
      
      toast({
        title: 'Workspace Selected',
        description: `Launching ${selectedWorkspace.name} workspace...`,
      });
      
      // Wait a bit longer to ensure state is properly set
      await new Promise(resolve => setTimeout(resolve, 300));
      
      console.log('Navigating to dashboard...');
      navigate('/dashboard', { replace: true });
      
    } catch (error) {
      console.error('Error launching workspace:', error);
      toast({
        title: 'Error',
        description: 'Failed to launch workspace. Please try again.',
        variant: 'destructive'
      });
    } finally {
      setLaunchingWorkspaceId(null);
    }
  };

  const handleCreateWorkspace = async () => {
    if (!createWorkspaceData.name || !createWorkspaceData.slug) {
      toast({
        title: "Error",
        description: "Please fill in all required fields",
        variant: "destructive"
      });
      return;
    }
    
    setIsCreating(true);
    try {
      const url = `${createWorkspaceData.slug}.slack.com`;
      console.log('Creating workspace with data:', {
        name: createWorkspaceData.name,
        url,
        slug: createWorkspaceData.slug
      });
      
      const workspace = await createWorkspace(createWorkspaceData.name, url, createWorkspaceData.slug);
      console.log('Workspace created:', workspace);
      
      setShowCreateWorkspace(false);
      setCreateWorkspaceData({ name: '', description: '', slug: '' });
      
      toast({
        title: "Success",
        description: `Workspace ${createWorkspaceData.name} created successfully!`,
        variant: "default"
      });
    } catch (error: any) {
      console.error('Error creating workspace:', error);
      
      const errorMessage = error?.message || error?.details || "Failed to create workspace. Please try again.";
      toast({
        title: "Error",
        description: errorMessage,
        variant: "destructive"
      });
    } finally {
      setIsCreating(false);
    }
  };

  const handleJoinWorkspace = async () => {
    if (!joinWorkspaceUrl) {
      toast({
        title: "Error",
        description: "Please enter a valid workspace URL or ID",
        variant: "destructive"
      });
      return;
    }
    
    setIsJoining(true);
    try {
      console.log('Attempting to join workspace:', joinWorkspaceUrl);
      const result = await joinWorkspace(joinWorkspaceUrl);
      
      toast({
        title: "Success",
        description: result.message || "Successfully joined workspace!",
        variant: "default"
      });
      
      setJoinWorkspaceUrl('');
      setShowJoinForm(false);
    } catch (error: any) {
      console.error('Error joining workspace:', error);
      toast({
        title: "Error",
        description: error.message || "Failed to join workspace. Please check the URL/ID and try again.",
        variant: "destructive"
      });
    } finally {
      setIsJoining(false);
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-indigo-950 via-purple-900 to-indigo-900 flex items-center justify-center">
        <div className="w-full max-w-md bg-white rounded-lg shadow-xl p-6">
        <div className="text-center">
            <div className="mx-auto w-16 h-16 bg-indigo-600 rounded-2xl flex items-center justify-center mb-6 relative">
              <svg 
                className="w-8 h-8 text-white opacity-50"
                viewBox="0 0 24 24" 
                fill="none" 
                xmlns="http://www.w3.org/2000/svg"
              >
                <path d="M12 2L14.8 7.6L21 8.4L16.5 12.8L17.6 19L12 16.1L6.4 19L7.5 12.8L3 8.4L9.2 7.6L12 2Z" 
                  stroke="white" 
                  strokeWidth="1.5" 
                  strokeLinecap="round" 
                  strokeLinejoin="round" 
                  fill="white" 
                />
              </svg>
              <div className="w-full h-full absolute top-0 left-0 flex items-center justify-center">
                <div className="w-8 h-8 border-2 border-white border-t-transparent rounded-full animate-spin" />
              </div>
            </div>
            <h1 className="text-2xl font-bold text-gray-800 mb-2">
              Loading
            </h1>
            <p className="text-sm text-gray-500">
              Loading your workspaces...
            </p>
            <p className="text-gray-400 text-xs mt-2">User: {user?.email || 'Not loaded'}</p>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-indigo-950 via-purple-900 to-indigo-900">
      {/* Header */}
      <header className="bg-black/20 backdrop-blur-sm border-b border-white/10">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-16">
            <div className="flex items-center space-x-2">
              <div className="w-8 h-8 bg-purple-600 rounded-lg flex items-center justify-center overflow-hidden">
                <svg 
                  className="w-5 h-5 text-white"
                  viewBox="0 0 24 24" 
                  fill="none" 
                  xmlns="http://www.w3.org/2000/svg"
                >
                  <path d="M12 2L14.8 7.6L21 8.4L16.5 12.8L17.6 19L12 16.1L6.4 19L7.5 12.8L3 8.4L9.2 7.6L12 2Z" 
                    stroke="white" 
                    strokeWidth="1.5" 
                    strokeLinecap="round" 
                    strokeLinejoin="round" 
                    fill="white" 
                  />
                </svg>
              </div>
              <span className="text-white font-bold text-xl">SlackAI</span>
              <span className="text-white/60 text-sm">from Salesforce</span>
            </div>

            <div className="flex items-center space-x-2">
              <Button
                variant="ghost"
                onClick={handleRefresh}
                className="text-white/80 hover:text-white hover:bg-white/10"
              >
                <RefreshCw className="w-4 h-4 mr-2" />
                Refresh
              </Button>
              <Button
                variant="ghost"
                onClick={logout}
                className="text-white/80 hover:text-white hover:bg-white/10"
              >
                <LogOut className="w-4 h-4 mr-2" />
                Sign Out
              </Button>
            </div>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="max-w-4xl mx-auto px-4 py-12">
        <div className="text-center mb-12">
          <div className="flex items-center justify-center mb-2">
            <span className="text-6xl mr-4">👋</span>
            <h1 className="text-5xl font-bold text-white">Welcome back</h1>
          </div>
          <p className="text-white/80 text-xl">Choose your workspace to continue</p>
        </div>

        {/* User Workspaces Section */}
        <div className="mb-12">
          <div className="bg-white/95 backdrop-blur-sm rounded-lg p-8 shadow-xl">
            <div className="flex justify-between items-center mb-6">
              <h2 className="text-xl font-semibold text-slate-800">
                Your Workspaces
            </h2>
              <div className="flex items-center text-slate-500 text-sm">
                <svg className="w-5 h-5 mr-1" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                </svg>
                <span>{workspaces.length} workspaces</span>
              </div>
            </div>
            <p className="text-slate-500 text-sm mb-4">for {user?.email}</p>
            
            {workspaces.length === 0 ? (
              <div className="text-center py-8">
                <p className="text-slate-600 mb-4">
                  You don't have any workspaces yet. Create one or join an existing workspace to get started.
                </p>
                <Button
                  onClick={handleRefresh}
                  variant="outline"
                  className="mr-2"
                >
                  <RefreshCw className="w-4 h-4 mr-2" />
                  Try Refreshing
                </Button>
              </div>
            ) : (
              <div className="space-y-4">
                {workspaces.map((workspace) => (
                  <div key={workspace.id} className="flex items-center justify-between p-4 border border-slate-200 rounded-lg hover:bg-slate-50 transition-colors">
                    <div className="flex items-center space-x-4">
                      <div className="w-12 h-12 bg-indigo-600 rounded-lg flex items-center justify-center text-white text-xl">
                        {workspace.name.charAt(0).toUpperCase()}
                      </div>
                      <div>
                        <h3 className="font-semibold text-slate-800">{workspace.name}</h3>
                        <div className="flex items-center text-sm text-slate-500">
                          <Users className="w-4 h-4 mr-1" />
                          <span className="mr-2">Workspace</span>
                          {workspace.created_by === user?.id && (
                            <span className="px-2 py-0.5 bg-green-100 text-green-700 rounded-full text-xs">
                              Owner
                            </span>
                          )}
                        </div>
                        <div className="text-xs text-slate-500 mt-1">
                          {workspace.url}
                        </div>
                      </div>
                    </div>
                    <Button
                      onClick={() => handleLaunchWorkspace(workspace.id)}
                      className="bg-indigo-600 hover:bg-indigo-700 text-white font-medium uppercase tracking-wide text-sm px-5 py-2.5 rounded-md"
                      disabled={launchingWorkspaceId === workspace.id}
                    >
                      {launchingWorkspaceId === workspace.id ? 'Launching...' : 'Launch Workspace'}
                    </Button>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>

        {/* Create New Workspace Section */}
        <div className="mb-8">
          <Card className="bg-white/95 backdrop-blur-sm border-0 shadow-xl">
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div className="flex items-center space-x-4">
                  <div className="w-12 h-12 bg-red-100 rounded-lg flex items-center justify-center">
                    <span className="text-xl">🚀</span>
                  </div>
                  <div>
                    <h3 className="font-semibold text-slate-800 text-lg">
                      Ready to start fresh?
                    </h3>
                    <p className="text-slate-600 text-sm">Create a new workspace for your team or project</p>
                  </div>
                </div>
                <Button
                  onClick={() => setShowCreateWorkspace(true)}
                  className="bg-indigo-600 hover:bg-indigo-700 text-white font-medium uppercase tracking-wide text-sm px-5 py-2.5 rounded-md"
                >
                  <Plus className="w-4 h-4 mr-2" />
                  Create Workspace
                </Button>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Join Workspace Section */}
        <div className="text-center">
          <p className="text-white/80 mb-4">
            Looking for a different workspace?
          </p>
          
          {!showJoinForm ? (
              <Button
                onClick={() => setShowJoinForm(true)}
                variant="ghost"
              className="text-white hover:bg-white/10 font-medium"
              >
                <Plus className="w-4 h-4 mr-2" />
              Join existing workspace
              </Button>
          ) : (
            <div className="bg-white/95 backdrop-blur-sm rounded-lg p-6 max-w-md mx-auto">
              <h3 className="font-semibold text-slate-800 mb-4">Join a workspace</h3>
              <div className="space-y-4">
                <Input
                  placeholder="Enter workspace URL, ID, or slug"
                  value={joinWorkspaceUrl}
                  onChange={(e) => setJoinWorkspaceUrl(e.target.value)}
                  className="bg-white text-slate-800 border-2 border-slate-300 focus:border-purple-500"
                />
                <div className="flex space-x-2">
                  <Button
                    onClick={handleJoinWorkspace}
                    className="bg-indigo-600 hover:bg-indigo-700 text-white flex-1 font-medium uppercase tracking-wide text-sm px-5 py-2.5 rounded-md"
                    disabled={!joinWorkspaceUrl.trim() || isJoining}
                  >
                    {isJoining ? 'Joining...' : 'Join Workspace'}
                  </Button>
                  <Button
                    onClick={() => {
                      setShowJoinForm(false);
                      setJoinWorkspaceUrl('');
                    }}
                    variant="outline"
                    className="border-slate-300 text-slate-600 hover:bg-slate-100"
                  >
                    Cancel
                  </Button>
                </div>
              </div>
            </div>
          )}
        </div>
      </main>

      {/* Create Workspace Modal */}
      <Dialog open={showCreateWorkspace} onOpenChange={setShowCreateWorkspace}>
        <DialogContent className="sm:max-w-md bg-white border-0 shadow-2xl">
          <DialogHeader>
            <DialogTitle className="text-xl font-semibold text-slate-800">Create a new workspace</DialogTitle>
          </DialogHeader>
          <div className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-slate-700 mb-2">Workspace name</label>
              <Input
                placeholder="e.g. My Company"
                value={createWorkspaceData.name}
                onChange={(e) => setCreateWorkspaceData(prev => ({ ...prev, name: e.target.value }))}
                className="bg-white text-slate-800 border-2 border-slate-300 focus:border-purple-500"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-slate-700 mb-2">Description (optional)</label>
              <Input
                placeholder="What's this workspace for?"
                value={createWorkspaceData.description}
                onChange={(e) => setCreateWorkspaceData(prev => ({ ...prev, description: e.target.value }))}
                className="bg-white text-slate-800 border-2 border-slate-300 focus:border-purple-500"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-slate-700 mb-2">Workspace URL</label>
              <div className="flex items-center">
                <Input
                  placeholder="my-company"
                  value={createWorkspaceData.slug}
                  onChange={(e) => setCreateWorkspaceData(prev => ({ ...prev, slug: e.target.value }))}
                  className="rounded-r-none bg-white text-slate-800 border-2 border-slate-300 focus:border-purple-500"
                />
                <span className="bg-slate-100 border-2 border-l-0 border-slate-300 px-3 py-2 text-sm text-slate-600 rounded-r-md">
                  .slack.com
                </span>
              </div>
            </div>
            <div className="flex space-x-2 pt-4">
              <Button
                onClick={handleCreateWorkspace}
                disabled={!createWorkspaceData.name.trim() || isCreating}
                className="flex-1 bg-indigo-600 hover:bg-indigo-700 text-white font-medium uppercase tracking-wide text-sm px-5 py-2.5 rounded-md"
              >
                {isCreating ? 'Creating...' : 'Create Workspace'}
              </Button>
              <Button
                variant="outline"
                onClick={() => setShowCreateWorkspace(false)}
                className="border-slate-300 text-slate-600 hover:bg-slate-100"
              >
                Cancel
              </Button>
            </div>
          </div>
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default WorkspacesPage;
