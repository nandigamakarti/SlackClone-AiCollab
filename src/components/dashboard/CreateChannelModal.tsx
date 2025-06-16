
import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { 
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';
import { Hash, Lock } from 'lucide-react';

interface CreateChannelModalProps {
  isOpen: boolean;
  onClose: () => void;
  onCreateChannel: (channel: { name: string; description: string; isPrivate: boolean }) => void;
}

const CreateChannelModal: React.FC<CreateChannelModalProps> = ({
  isOpen,
  onClose,
  onCreateChannel
}) => {
  const [channelName, setChannelName] = useState('');
  const [description, setDescription] = useState('');
  const [isPrivate, setIsPrivate] = useState(false);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (channelName.trim()) {
      onCreateChannel({
        name: channelName.toLowerCase().replace(/[^a-z0-9-_]/g, ''),
        description: description.trim(),
        isPrivate
      });
      setChannelName('');
      setDescription('');
      setIsPrivate(false);
      onClose();
    }
  };

  const formatChannelName = (name: string) => {
    return name.toLowerCase().replace(/[^a-z0-9-_]/g, '');
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle>Create a channel</DialogTitle>
        </DialogHeader>
        
        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="block text-sm font-medium mb-2">Channel name</label>
            <div className="relative">
              {isPrivate ? (
                <Lock className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-gray-400" />
              ) : (
                <Hash className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-gray-400" />
              )}
              <Input
                value={channelName}
                onChange={(e) => setChannelName(formatChannelName(e.target.value))}
                placeholder="e.g. marketing"
                className="pl-10"
                maxLength={21}
              />
            </div>
            <p className="text-xs text-gray-500 mt-1">
              Names must be lowercase, without spaces or periods, and shorter than 22 characters.
            </p>
          </div>

          <div>
            <label className="block text-sm font-medium mb-2">Description (optional)</label>
            <Textarea
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              placeholder="What's this channel about?"
              rows={3}
            />
          </div>

          <div className="space-y-3">
            <div className="flex items-center space-x-3">
              <input
                type="radio"
                id="public"
                name="privacy"
                checked={!isPrivate}
                onChange={() => setIsPrivate(false)}
                className="w-4 h-4"
              />
              <div className="flex-1">
                <div className="flex items-center space-x-2">
                  <Hash className="w-4 h-4" />
                  <label htmlFor="public" className="font-medium">Public</label>
                </div>
                <p className="text-sm text-gray-500">Anyone in the workspace can see and join</p>
              </div>
            </div>

            <div className="flex items-center space-x-3">
              <input
                type="radio"
                id="private"
                name="privacy"
                checked={isPrivate}
                onChange={() => setIsPrivate(true)}
                className="w-4 h-4"
              />
              <div className="flex-1">
                <div className="flex items-center space-x-2">
                  <Lock className="w-4 h-4" />
                  <label htmlFor="private" className="font-medium">Private</label>
                </div>
                <p className="text-sm text-gray-500">Only specific people can see and join</p>
              </div>
            </div>
          </div>

          <div className="flex justify-end space-x-3 pt-4">
            <Button type="button" variant="outline" onClick={onClose}>
              Cancel
            </Button>
            <Button 
              type="submit" 
              disabled={!channelName.trim()}
              className="bg-slack-green hover:bg-slack-green/90"
            >
              Create
            </Button>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  );
};

export default CreateChannelModal;
