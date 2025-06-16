import React, { useState } from 'react';
import { Smile, Plus } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover';
import data from '@emoji-mart/data';
import Picker from '@emoji-mart/react';
import { motion } from 'framer-motion';

interface Reaction {
  emoji: string;
  count: number;
  users: string[];
}

interface ReactionBarProps {
  reactions: Reaction[];
  currentUserId: string;
  onAddReaction: (emoji: string) => void;
  onRemoveReaction: (emoji: string) => void;
}

const ReactionBar: React.FC<ReactionBarProps> = ({
  reactions,
  currentUserId,
  onAddReaction,
  onRemoveReaction
}) => {
  const [showEmojiPicker, setShowEmojiPicker] = useState(false);
  
  const handleEmojiSelect = (emoji: any) => {
    onAddReaction(emoji.native);
    setShowEmojiPicker(false);
  };
  
  const handleReactionClick = (emoji: string, users: string[]) => {
    if (users.includes(currentUserId)) {
      onRemoveReaction(emoji);
    } else {
      onAddReaction(emoji);
    }
  };
  
  if (reactions.length === 0 && !showEmojiPicker) {
    return (
      <div className="mt-1 flex items-center">
        <Button
          variant="ghost"
          size="sm"
          onClick={() => setShowEmojiPicker(true)}
          className="h-6 px-1 text-gray-400 hover:text-white hover:bg-gray-700 rounded"
        >
          <Smile className="w-3.5 h-3.5 mr-1" />
          <span className="text-xs">Add reaction</span>
        </Button>
      </div>
    );
  }
  
  return (
    <div className="mt-1 flex flex-wrap items-center gap-1">
      {reactions.map((reaction) => (
        <motion.button
          key={reaction.emoji}
          whileHover={{ scale: 1.1 }}
          whileTap={{ scale: 0.9 }}
          onClick={() => handleReactionClick(reaction.emoji, reaction.users)}
          className={`inline-flex items-center px-1.5 py-0.5 rounded text-xs ${
            reaction.users.includes(currentUserId)
              ? 'bg-gray-600 text-white'
              : 'bg-gray-700 text-gray-300 hover:bg-gray-600'
          }`}
        >
          <span className="mr-1">{reaction.emoji}</span>
          <span>{reaction.count}</span>
        </motion.button>
      ))}
      
      <Popover open={showEmojiPicker} onOpenChange={setShowEmojiPicker}>
        <PopoverTrigger asChild>
          <Button
            variant="ghost"
            size="sm"
            className="h-6 w-6 p-0 rounded-full text-gray-400 hover:text-white hover:bg-gray-700"
          >
            <Plus className="w-3.5 h-3.5" />
          </Button>
        </PopoverTrigger>
        <PopoverContent side="top" className="w-auto p-0 border-gray-700 bg-gray-800">
          <Picker 
            data={data} 
            onEmojiSelect={handleEmojiSelect}
            theme="dark"
            previewPosition="none"
            skinTonePosition="none"
          />
        </PopoverContent>
      </Popover>
    </div>
  );
};

export default ReactionBar; 