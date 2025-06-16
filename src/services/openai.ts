import axios from 'axios';

// OpenAI API configuration
const OPENAI_API_KEY = import.meta.env.VITE_OPENAI_API_KEY || '';
const OPENAI_API_URL = 'https://api.openai.com/v1/chat/completions';

// Interface for channel messages
interface Message {
  id: string;
  channelId: string;
  userId: string;
  username: string;
  content: string;
  timestamp: Date;
}

/**
 * Generate enhanced message using OpenAI based on channel context
 */
export const enhanceMessageWithAI = async (
  userMessage: string,
  channelMessages: Message[],
  channelName: string,
  customPrompt?: string
): Promise<string> => {
  try {
    if (!OPENAI_API_KEY) {
      console.error('OpenAI API key is missing. Please add VITE_OPENAI_API_KEY to your .env file.');
      throw new Error('OpenAI API key is required');
    }

    // Format channel messages as context
    const recentMessages = channelMessages
      .slice(-10) // Get last 10 messages for context
      .map(msg => `${msg.username}: ${msg.content}`)
      .join('\n');

    // Use custom prompt if provided, otherwise create default prompt
    const prompt = customPrompt || `
You are an AI assistant in a Slack-like chat application, specifically in the "${channelName}" channel.
Recent conversation in this channel:
${recentMessages}

The user is typing a message: "${userMessage}"

Based on the context of this channel, enhance or rewrite the user's message to make it more relevant, 
clear, or engaging. Keep the same intent but improve it based on the ongoing conversation.
Only return the enhanced message text, nothing else.
`;

    // Make API call to OpenAI
    const response = await axios.post(
      OPENAI_API_URL,
      {
        model: 'gpt-4o',
        messages: [{ role: 'user', content: prompt }],
        max_tokens: 500,
        temperature: 0.7,
      },
      {
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${OPENAI_API_KEY}`,
        },
      }
    );

    return response.data.choices[0].message.content.trim();
  } catch (error) {
    console.error('Error enhancing message with AI:', error);
    // Log more detailed error information
    if (axios.isAxiosError(error)) {
      console.error('API response error:', error.response?.data);
      console.error('API request config:', error.config);
    }
    throw error; // Rethrow the error to be handled by the caller
  }
};

/**
 * Generate AI response to user query with access to all public channels
 * Private channels are excluded from analysis
 */
export const getAIResponse = async (
  userQuery: string,
  allPublicChannelMessages: { [channelId: string]: Message[] },
  channelNames: { [channelId: string]: string },
  pinnedDocs?: { title: string; content: string; isPinned?: boolean }[],
  isPrivateChannel: (channelId: string) => boolean = () => false
): Promise<string> => {
  try {
    if (!OPENAI_API_KEY) {
      console.error('OpenAI API key is missing. Please add VITE_OPENAI_API_KEY to your .env file.');
      throw new Error('OpenAI API key is required');
    }
    
    // Format all channel messages as context
    let channelsContext = '';
    
    Object.entries(allPublicChannelMessages).forEach(([channelId, messages]) => {
      // Skip private channels
      if (isPrivateChannel(channelId)) {
        console.log(`Skipping private channel ${channelId} for AI analysis`);
        return;
      }
      
      if (!messages || !Array.isArray(messages) || messages.length === 0) return;
      
      try {
        const channelName = channelNames[channelId] || channelId;
        // Make sure we have valid messages with required properties
        const validMessages = messages.filter(msg => 
          msg && typeof msg === 'object' && msg.username && msg.content
        );
        
        if (validMessages.length === 0) return;
        
        const channelSummary = validMessages
          .slice(-5) // Get last 5 messages from each channel for context
          .map(msg => `${msg.username}: ${msg.content}`)
          .join('\n');
        
        channelsContext += `\n--- Channel: #${channelName} ---\n${channelSummary}\n`;
      } catch (error) {
        console.error(`Error processing messages for channel ${channelId}:`, error);
      }
    });

    // Add pinned docs if available - only analyze pinned documents
    let pinnedDocsContext = '';
    if (pinnedDocs && pinnedDocs.length > 0) {
      // Filter to only include pinned documents
      const onlyPinnedDocs = pinnedDocs.filter(doc => doc.isPinned === true);
      
      if (onlyPinnedDocs.length > 0) {
        pinnedDocsContext = '\n--- Pinned Documents ---\n';
        onlyPinnedDocs.forEach(doc => {
          pinnedDocsContext += `Title: ${doc.title}\nContent: ${doc.content}\n\n`;
        });
      }
    }

    // Create prompt with all available context
    const prompt = `
You are an AI assistant in a Slack-like chat application with access to all public channels and pinned documents.

${channelsContext}

${pinnedDocsContext}

User query: "${userQuery}"

Provide a helpful, informative response based on the information available in the channels and documents.
Your response should be conversational and friendly. If the query is about specific channel content, reference it.
If you don't have enough information to answer accurately, acknowledge that limitation.
`;

    // Make API call to OpenAI
    const response = await axios.post(
      OPENAI_API_URL,
      {
        model: 'gpt-4o',
        messages: [{ role: 'user', content: prompt }],
        max_tokens: 1000,
        temperature: 0.7,
      },
      {
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${OPENAI_API_KEY}`,
        },
      }
    );

    return response.data.choices[0].message.content.trim();
  } catch (error) {
    console.error('Error getting AI response:', error);
    // Log more detailed error information
    if (axios.isAxiosError(error)) {
      console.error('API response error:', error.response?.data);
      console.error('API request config:', error.config);
      if (error.response?.status === 401) {
        throw new Error('Authentication error: Invalid OpenAI API key');
      } else if (error.response?.status === 429) {
        throw new Error('Rate limit exceeded: Too many requests to OpenAI API');
      }
    }
    throw error; // Rethrow the error to be handled by the caller
  }
};
