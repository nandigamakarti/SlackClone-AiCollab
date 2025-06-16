import { Request, Response } from 'express';
import { generateMeetingNotes } from '@/utils/meetingNotesGenerator';
import { Message } from '@/contexts/MessageContext';

// Mock database to store notes (in a real app, this would be a database)
const notesStore: Record<string, string> = {};

/**
 * Get AI-generated notes for a channel
 * @param req The request object containing channelId
 * @param res The response object
 */
export const getNotes = async (req: Request, res: Response) => {
  try {
    const { channelId } = req.params;
    
    if (!channelId) {
      return res.status(400).json({
        success: false,
        error: 'Channel ID is required'
      });
    }
    
    // Check if notes exist in the store
    if (notesStore[channelId]) {
      return res.json({
        success: true,
        notes: notesStore[channelId]
      });
    }
    
    // If no notes found
    return res.status(404).json({
      success: false,
      error: 'No notes found for this channel'
    });
  } catch (error) {
    console.error('Error getting AI notes:', error);
    return res.status(500).json({
      success: false,
      error: 'Failed to get AI notes'
    });
  }
};

/**
 * Generate AI notes for a channel
 * @param req The request object containing channelId
 * @param res The response object
 */
export const generateNotes = async (req: Request, res: Response) => {
  try {
    const { channelId } = req.params;
    
    if (!channelId) {
      return res.status(400).json({
        success: false,
        error: 'Channel ID is required'
      });
    }
    
    // In a real app, you would fetch messages from the database
    // For now, we'll use a mock implementation
    
    // Mock messages for the channel
    const mockMessages: Message[] = [
      {
        id: '1',
        channelId,
        userId: 'user1',
        username: 'John Doe',
        content: 'Let\'s discuss the new feature requirements.',
        timestamp: new Date(Date.now() - 3600000),
        reactions: [],
        replies: [],
        replyCount: 0,
        threadParticipants: [],
        isPinned: false
      },
      {
        id: '2',
        channelId,
        userId: 'user2',
        username: 'Jane Smith',
        content: 'I think we should focus on the UI improvements first.',
        timestamp: new Date(Date.now() - 3500000),
        reactions: [],
        replies: [],
        replyCount: 0,
        threadParticipants: [],
        isPinned: false
      },
      {
        id: '3',
        channelId,
        userId: 'user1',
        username: 'John Doe',
        content: 'Agreed. Let\'s prioritize the user experience.',
        timestamp: new Date(Date.now() - 3400000),
        reactions: [],
        replies: [],
        replyCount: 0,
        threadParticipants: [],
        isPinned: false
      }
    ];
    
    // Generate notes using the utility function
    const notes = await generateMeetingNotes(mockMessages, `Channel-${channelId}`);
    
    // Store the notes for future retrieval
    notesStore[channelId] = notes;
    
    return res.json({
      success: true,
      notes
    });
  } catch (error) {
    console.error('Error generating AI notes:', error);
    return res.status(500).json({
      success: false,
      error: 'Failed to generate AI notes'
    });
  }
};

/**
 * Handle OPTIONS requests for CORS
 */
export const handleOptions = (req: Request, res: Response) => {
  res.status(200).end();
}; 