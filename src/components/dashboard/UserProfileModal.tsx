import React from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Mail, Phone, Clock, Calendar, MapPin, Briefcase, X } from 'lucide-react';

interface UserProfileProps {
  isOpen: boolean;
  onClose: () => void;
  userId: string;
}

// Mock user data - in a real app, this would come from an API or context
const mockUsers: Record<string, {
  id: string;
  name: string;
  email: string;
  avatar: string;
  title: string;
  phone: string;
  timezone: string;
  location: string;
  startDate: string;
  department: string;
  bio: string;
  status: {
    emoji: string;
    text: string;
  };
}> = {
  'user1': {
    id: 'user1',
    name: 'Sarah Wilson',
    email: 'sarah.wilson@example.com',
    avatar: 'https://ui-avatars.com/api/?name=Sarah+Wilson&background=6941C6&color=fff',
    title: 'Senior Product Designer',
    phone: '+1 (555) 123-4567',
    timezone: 'Pacific Time (GMT-7)',
    location: 'San Francisco, CA',
    startDate: 'January 2021',
    department: 'Design',
    bio: 'Product designer with 7+ years of experience in creating user-centered digital products.',
    status: {
      emoji: '💻',
      text: 'Working remotely'
    }
  },
  'user2': {
    id: 'user2',
    name: 'Mike Chen',
    email: 'mike.chen@example.com',
    avatar: 'https://ui-avatars.com/api/?name=Mike+Chen&background=0284C7&color=fff',
    title: 'Frontend Developer',
    phone: '+1 (555) 987-6543',
    timezone: 'Eastern Time (GMT-4)',
    location: 'New York, NY',
    startDate: 'March 2022',
    department: 'Engineering',
    bio: 'Frontend developer specializing in React and TypeScript. Coffee enthusiast.',
    status: {
      emoji: '🏝️',
      text: 'On vacation until June 10'
    }
  },
  'user3': {
    id: 'user3',
    name: 'Emma Davis',
    email: 'emma.davis@example.com',
    avatar: 'https://ui-avatars.com/api/?name=Emma+Davis&background=BE185D&color=fff',
    title: 'Marketing Manager',
    phone: '+1 (555) 456-7890',
    timezone: 'Central Time (GMT-5)',
    location: 'Chicago, IL',
    startDate: 'September 2020',
    department: 'Marketing',
    bio: 'Marketing professional focused on growth strategies and digital campaigns.',
    status: {
      emoji: '🔴',
      text: 'In a meeting'
    }
  },
  'user4': {
    id: 'user4',
    name: 'John Smith',
    email: 'john.smith@example.com',
    avatar: 'https://ui-avatars.com/api/?name=John+Smith&background=059669&color=fff',
    title: 'Product Manager',
    phone: '+1 (555) 234-5678',
    timezone: 'Mountain Time (GMT-6)',
    location: 'Denver, CO',
    startDate: 'May 2019',
    department: 'Product',
    bio: 'Product manager with a background in UX design and agile methodologies.',
    status: {
      emoji: '✅',
      text: 'Available'
    }
  },
  'user5': {
    id: 'user5',
    name: 'Lisa Brown',
    email: 'lisa.brown@example.com',
    avatar: 'https://ui-avatars.com/api/?name=Lisa+Brown&background=B45309&color=fff',
    title: 'UX Researcher',
    phone: '+1 (555) 876-5432',
    timezone: 'Pacific Time (GMT-7)',
    location: 'Seattle, WA',
    startDate: 'February 2020',
    department: 'Design',
    bio: 'UX researcher passionate about understanding user behavior and creating intuitive experiences.',
    status: {
      emoji: '📱',
      text: 'Working mobile'
    }
  }
};

const UserProfileModal: React.FC<UserProfileProps> = ({ isOpen, onClose, userId }) => {
  const user = mockUsers[userId] || {
    id: userId,
    name: 'Unknown User',
    email: 'unknown@example.com',
    avatar: 'https://ui-avatars.com/api/?name=Unknown+User&background=6941C6&color=fff',
    title: 'SlackAI User',
    phone: 'Not available',
    timezone: 'Not available',
    location: 'Not available',
    startDate: 'Not available',
    department: 'Not available',
    bio: 'No bio available',
    status: {
      emoji: '❓',
      text: 'Status unknown'
    }
  };

  return (
    <Dialog open={isOpen} onOpenChange={(open) => !open && onClose()}>
      <DialogContent className="sm:max-w-md bg-white">
        <DialogHeader className="flex flex-row items-center justify-between">
          <DialogTitle className="text-xl font-semibold">Profile</DialogTitle>
          <Button 
            variant="ghost" 
            size="sm" 
            onClick={onClose} 
            className="h-8 w-8 p-0 rounded-full"
          >
            <X className="h-4 w-4" />
          </Button>
        </DialogHeader>
        
        <div className="space-y-6">
          {/* Header with avatar and name */}
          <div className="flex items-center space-x-4">
            <div className="w-16 h-16 rounded-full overflow-hidden">
              <img 
                src={user.avatar} 
                alt={user.name} 
                className="w-full h-full object-cover"
              />
            </div>
            <div>
              <h2 className="text-xl font-bold">{user.name}</h2>
              <div className="flex items-center text-sm text-gray-500">
                <span className="mr-2">{user.status.emoji}</span>
                <span>{user.status.text}</span>
              </div>
              <p className="text-sm text-gray-600">{user.title}</p>
            </div>
          </div>
          
          {/* Bio */}
          <div>
            <h3 className="text-sm font-medium text-gray-500 mb-1">About</h3>
            <p className="text-sm text-gray-700">{user.bio}</p>
          </div>
          
          {/* Contact and details */}
          <div className="space-y-3">
            <div className="flex items-center text-sm">
              <Mail className="w-4 h-4 mr-3 text-gray-400" />
              <span className="text-gray-700">{user.email}</span>
            </div>
            <div className="flex items-center text-sm">
              <Phone className="w-4 h-4 mr-3 text-gray-400" />
              <span className="text-gray-700">{user.phone}</span>
            </div>
            <div className="flex items-center text-sm">
              <Clock className="w-4 h-4 mr-3 text-gray-400" />
              <span className="text-gray-700">{user.timezone}</span>
            </div>
            <div className="flex items-center text-sm">
              <MapPin className="w-4 h-4 mr-3 text-gray-400" />
              <span className="text-gray-700">{user.location}</span>
            </div>
            <div className="flex items-center text-sm">
              <Calendar className="w-4 h-4 mr-3 text-gray-400" />
              <span className="text-gray-700">Joined {user.startDate}</span>
            </div>
            <div className="flex items-center text-sm">
              <Briefcase className="w-4 h-4 mr-3 text-gray-400" />
              <span className="text-gray-700">{user.department}</span>
            </div>
          </div>
          
          {/* Action buttons */}
          <div className="flex space-x-2 pt-2">
            <Button variant="outline" className="flex-1">
              Message
            </Button>
            <Button className="flex-1 bg-slack-aubergine hover:bg-slack-dark-aubergine">
              Call
            </Button>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
};

export default UserProfileModal;
