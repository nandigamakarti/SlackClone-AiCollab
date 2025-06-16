import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { X, Plus, File } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';

interface AINotesProps {
  isOpen: boolean;
  onClose: () => void;
}

const AINotesPanel: React.FC<AINotesProps> = ({ isOpen, onClose }) => {
  const [notes, setNotes] = useState([
    { id: '1', title: 'Meeting Notes', content: 'Discussed new feature ideas for the product', date: '2023-05-10' },
    { id: '2', title: 'Project Timeline', content: 'Release scheduled for Q3 2023', date: '2023-05-12' },
  ]);
  const [activeNote, setActiveNote] = useState<string | null>(null);

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50">
      <motion.div
        initial={{ opacity: 0, scale: 0.95 }}
        animate={{ opacity: 1, scale: 1 }}
        exit={{ opacity: 0, scale: 0.95 }}
        transition={{ duration: 0.2 }}
        className="w-full max-w-3xl h-[85vh] bg-[#0a121f] rounded-lg shadow-2xl overflow-hidden flex flex-col"
      >
        {/* Header */}
        <div className="flex items-center justify-between px-4 py-3 bg-[#0a121f] border-b border-gray-700">
          <div className="flex items-center space-x-2">
            <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-purple-600">
              <File className="h-6 w-6 text-white" />
            </div>
            <div>
              <div className="flex items-center">
                <span className="text-xl font-bold text-white">AI Notes</span>
              </div>
              <div className="text-gray-400 text-sm">
                Smart notes powered by AI
              </div>
            </div>
          </div>
          <div className="flex items-center space-x-2">
            <Button 
              variant="ghost" 
              size="icon" 
              className="text-gray-400 hover:text-white hover:bg-gray-700 rounded-full"
              onClick={onClose}
            >
              <X className="h-5 w-5" />
            </Button>
          </div>
        </div>

        {/* Content Area */}
        <div className="flex-1 flex overflow-hidden">
          {/* Notes List */}
          <div className="w-1/3 border-r border-gray-700 overflow-y-auto">
            <div className="p-3 border-b border-gray-700 flex justify-between items-center">
              <h3 className="text-white font-medium">My Notes</h3>
              <Button
                variant="ghost"
                size="sm"
                className="text-gray-400 hover:text-white p-1 h-auto"
              >
                <Plus className="h-4 w-4" />
              </Button>
            </div>
            <div className="space-y-1 p-2">
              {notes.map(note => (
                <div 
                  key={note.id}
                  className={`p-2 rounded cursor-pointer ${activeNote === note.id ? 'bg-indigo-600' : 'hover:bg-gray-800'}`}
                  onClick={() => setActiveNote(note.id)}
                >
                  <h4 className="font-medium text-white truncate">{note.title}</h4>
                  <p className="text-xs text-gray-400 truncate">{note.content}</p>
                  <p className="text-xs text-gray-500 mt-1">{note.date}</p>
                </div>
              ))}
            </div>
          </div>
          
          {/* Note Editor */}
          <div className="flex-1 flex flex-col bg-[#0f1825]">
            {activeNote ? (
              <div className="flex-1 flex flex-col">
                <div className="p-3 border-b border-gray-700">
                  <input 
                    type="text" 
                    className="w-full bg-transparent border-none text-white text-lg font-medium focus:outline-none focus:ring-0"
                    value={notes.find(n => n.id === activeNote)?.title || ''}
                    onChange={() => {}}
                    placeholder="Note title"
                  />
                </div>
                <div className="flex-1 p-3">
                  <textarea 
                    className="w-full h-full bg-transparent border-none text-white resize-none focus:outline-none focus:ring-0"
                    value={notes.find(n => n.id === activeNote)?.content || ''}
                    onChange={() => {}}
                    placeholder="Start typing your note..."
                  />
                </div>
              </div>
            ) : (
              <div className="flex-1 flex items-center justify-center text-gray-500">
                <p>Select a note or create a new one</p>
              </div>
            )}
          </div>
        </div>
      </motion.div>
    </div>
  );
};

export default AINotesPanel; 