
import React, { useState } from 'react';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Copy, Check } from 'lucide-react';
import { useAuth } from '@/contexts/AuthContext';

interface InviteTeammatesModalProps {
  isOpen: boolean;
  onClose: () => void;
}

const InviteTeammatesModal: React.FC<InviteTeammatesModalProps> = ({
  isOpen,
  onClose
}) => {
  const { workspace } = useAuth();
  const [copiedUrl, setCopiedUrl] = useState(false);
  const [copiedCode, setCopiedCode] = useState(false);

  // Generate invite URL and code based on workspace
  const inviteUrl = `https://${workspace?.url}.slack.com/signup`;
  const inviteCode = `${workspace?.url?.toUpperCase()}-${Math.random().toString(36).substring(2, 8).toUpperCase()}`;

  const copyToClipboard = async (text: string, type: 'url' | 'code') => {
    try {
      await navigator.clipboard.writeText(text);
      if (type === 'url') {
        setCopiedUrl(true);
        setTimeout(() => setCopiedUrl(false), 2000);
      } else {
        setCopiedCode(true);
        setTimeout(() => setCopiedCode(false), 2000);
      }
    } catch (err) {
      console.error('Failed to copy text: ', err);
    }
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle className="text-lg font-bold text-slack-text-primary">
            Invite teammates to {workspace?.name}
          </DialogTitle>
        </DialogHeader>
        
        <div className="space-y-6">
          <div className="space-y-3">
            <h3 className="text-sm font-medium text-slack-text-primary">
              Share this workspace URL
            </h3>
            <div className="flex items-center space-x-2">
              <Input
                value={inviteUrl}
                readOnly
                className="flex-1 text-sm"
              />
              <Button
                onClick={() => copyToClipboard(inviteUrl, 'url')}
                variant="outline"
                size="sm"
                className="flex items-center space-x-1"
              >
                {copiedUrl ? (
                  <Check className="w-4 h-4 text-slack-green" />
                ) : (
                  <Copy className="w-4 h-4" />
                )}
                <span>{copiedUrl ? 'Copied!' : 'Copy'}</span>
              </Button>
            </div>
          </div>

          <div className="space-y-3">
            <h3 className="text-sm font-medium text-slack-text-primary">
              Or share this invitation code
            </h3>
            <div className="flex items-center space-x-2">
              <Input
                value={inviteCode}
                readOnly
                className="flex-1 text-sm font-mono"
              />
              <Button
                onClick={() => copyToClipboard(inviteCode, 'code')}
                variant="outline"
                size="sm"
                className="flex items-center space-x-1"
              >
                {copiedCode ? (
                  <Check className="w-4 h-4 text-slack-green" />
                ) : (
                  <Copy className="w-4 h-4" />
                )}
                <span>{copiedCode ? 'Copied!' : 'Copy'}</span>
              </Button>
            </div>
          </div>

          <div className="bg-slack-light-gray p-4 rounded-slack-md">
            <p className="text-sm text-slack-text-secondary">
              Share the URL or code with your teammates. They can use either to join your{' '}
              <span className="font-medium">{workspace?.name}</span> workspace.
            </p>
          </div>

          <div className="flex justify-end space-x-3">
            <Button
              onClick={onClose}
              variant="outline"
              className="px-6"
            >
              Done
            </Button>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
};

export default InviteTeammatesModal;
