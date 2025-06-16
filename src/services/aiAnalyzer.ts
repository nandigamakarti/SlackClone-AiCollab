import { enhanceMessageWithAI } from './openai';

export interface SentimentAnalysis {
  sentiment: 'positive' | 'neutral' | 'negative' | 'mixed';
  emoji: string;
  intensity: 'low' | 'medium' | 'high';
  suggestions?: string | null;
  confidence: number; // 0-1 scale
}

/**
 * Analyzes the sentiment and emotional tone of a message
 * @param message The message to analyze
 * @param channelMessages Context messages from the channel (optional)
 * @param channelName Name of the channel for context (optional)
 * @returns A SentimentAnalysis object with sentiment, emoji, intensity, etc.
 */
export const analyzeSentiment = async (
  message: string,
  channelMessages: any[] = [],
  channelName: string = ''
): Promise<SentimentAnalysis> => {
  // Don't analyze empty messages
  if (!message || message.trim() === '') {
    return {
      sentiment: 'neutral',
      emoji: '😐',
      intensity: 'low',
      suggestions: 'Message is empty.',
      confidence: 0.5
    };
  }

  try {
    // Prioritize OpenAI for sentiment analysis
    console.log("Using OpenAI for sentiment analysis");
    
    // In a production app, this would call an API endpoint that interfaces with 
    // a sentiment analysis model like OpenAI, HuggingFace, or a custom model
    
    // Create a prompt for the OpenAI API to analyze the sentiment
    const prompt = `
You are an AI assistant that analyzes the sentiment and emotional tone of messages.

Channel context: ${channelName || 'General chat'}
${channelMessages.length > 0 ? 'Recent conversation:\n' + 
  channelMessages.slice(-3).map(msg => `${msg.username || 'User'}: ${msg.content || ''}`).join('\n') 
  : 'No recent messages.'}

Message to analyze: "${message}"

Analyze the sentiment of this message and categorize it as ONE of the following:
- positive (happy, excited, satisfied, thankful)
- negative (sad, angry, frustrated, disappointed)
- neutral (factual, objective, neither positive nor negative)
- mixed (contains both positive and negative elements)

Select the most appropriate emoji that represents the sentiment:
- For positive: 😊, 😄, 🙂, 👍, ❤️, etc.
- For negative: 😠, 😢, 😞, 👎, etc.
- For neutral: 😐, 🤔, etc.
- For mixed: 😕, 🤷, etc.

Rate the intensity of the sentiment as ONE of the following:
- high (strong emotional content)
- medium (moderate emotional content)
- low (slight emotional content)

Provide brief suggestions for improving communication if needed (max 60 chars).

Rate your confidence in this analysis on a scale of 0 to 1.

Return your analysis in this exact JSON format:
{
  "sentiment": "one of: positive, neutral, negative, mixed",
  "emoji": "single emoji representing the sentiment",
  "intensity": "one of: high, medium, low",
  "suggestions": "brief suggestions if needed, otherwise null",
  "confidence": number between 0 and 1
}
`;

    try {
      // Use OpenAI for sentiment analysis
      const analysisResponse = await enhanceMessageWithAI(
        "", // Empty message since we're using the prompt for analysis
        [], // Empty context since we're providing it in the prompt
        channelName,
        prompt
      );

      // Parse the response as JSON
      const jsonMatch = analysisResponse.match(/\{[\s\S]*\}/); 
      const jsonString = jsonMatch ? jsonMatch[0] : analysisResponse;
      
      try {
        const analysis = JSON.parse(jsonString);
        
        // Validate the analysis fields
        const validSentiments = ['positive', 'neutral', 'negative', 'mixed'];
        const validIntensities = ['high', 'medium', 'low'];
        
        const sentiment = validSentiments.includes(analysis.sentiment) ? analysis.sentiment : 'neutral';
        const intensity = validIntensities.includes(analysis.intensity) ? analysis.intensity : 'medium';
        const confidence = Number(analysis.confidence);
        
        return {
          sentiment,
          emoji: analysis.emoji || getDefaultEmoji(sentiment),
          intensity,
          suggestions: analysis.suggestions || null,
          confidence: isNaN(confidence) || confidence < 0 || confidence > 1 ? 0.7 : confidence
        };
      } catch (jsonError) {
        console.error('Error parsing JSON from OpenAI response:', jsonError);
        console.log('Raw response:', analysisResponse);
        throw new Error('Invalid JSON response from OpenAI');
      }
    } catch (openAiError) {
      console.error('Error with OpenAI sentiment analysis:', openAiError);
      
      // Fall back to local server if OpenAI fails
      try {
        console.log("Falling back to local sentiment analysis");
        const localResponse = await fetch('http://localhost:3001/api/sentiment', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({ text: message }),
        });
        
        if (localResponse.ok) {
          const data = await localResponse.json();
          if (data.success && data.data) {
            return data.data;
          }
        }
      } catch (localError) {
        console.log('Local sentiment analysis failed:', localError);
      }
      
      // Fall back to mock analysis if both OpenAI and local server fail
      return generateMockSentimentAnalysis(message);
    }
  } catch (error) {
    console.error('Error analyzing sentiment:', error);
    // Fall back to mock analysis
    return generateMockSentimentAnalysis(message);
  }
};

/**
 * Generate a mock sentiment analysis based on message characteristics
 * Used when OpenAI API is not available or fails
 */
const generateMockSentimentAnalysis = (message: string): SentimentAnalysis => {
  // Convert to lowercase for easier analysis
  const lowerMessage = message.toLowerCase();
  
  // Check for positive sentiment markers
  const positiveWords = ['happy', 'great', 'excellent', 'good', 'thanks', 'love', 'awesome', 'nice'];
  const hasPositiveWords = positiveWords.some(word => lowerMessage.includes(word));
  const hasExclamation = lowerMessage.includes('!');
  const hasPositiveEmojis = /😊|😄|🙂|👍|❤️|😀/.test(message);
  
  // Check for negative sentiment markers
  const negativeWords = ['sad', 'bad', 'awful', 'terrible', 'hate', 'angry', 'disappointed', 'sorry'];
  const hasNegativeWords = negativeWords.some(word => lowerMessage.includes(word));
  const hasNegativeEmojis = /😠|😢|😞|👎|😡|😭/.test(message);
  
  // Determine sentiment based on markers
  let sentiment: 'positive' | 'neutral' | 'negative' | 'mixed' = 'neutral';
  let emoji = '😐';
  let intensity: 'high' | 'medium' | 'low' = 'medium';
  let suggestions = null;
  let confidence = 0.7;
  
  if (hasPositiveWords && hasNegativeWords) {
    sentiment = 'mixed';
    emoji = '😕';
    intensity = 'medium';
    suggestions = 'Try to be clearer about your feelings';
    confidence = 0.6;
  } else if (hasPositiveWords || hasPositiveEmojis) {
    sentiment = 'positive';
    emoji = hasExclamation ? '😄' : '🙂';
    intensity = hasExclamation ? 'high' : 'medium';
    confidence = 0.8;
  } else if (hasNegativeWords || hasNegativeEmojis) {
    sentiment = 'negative';
    emoji = hasExclamation ? '😠' : '😞';
    intensity = hasExclamation ? 'high' : 'medium';
    suggestions = 'Consider a more constructive approach';
    confidence = 0.75;
  } else {
    sentiment = 'neutral';
    emoji = '😐';
    intensity = 'low';
    confidence = 0.65;
  }
  
  return {
    sentiment,
    emoji,
    intensity,
    suggestions,
    confidence
  };
};

/**
 * Get default emoji for each sentiment category
 */
const getDefaultEmoji = (sentiment: string): string => {
  switch (sentiment) {
    case 'positive': return '😊';
    case 'negative': return '😞';
    case 'mixed': return '😕';
    case 'neutral':
    default: return '😐';
  }
}; 