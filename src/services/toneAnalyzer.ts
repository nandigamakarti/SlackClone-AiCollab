import { enhanceMessageWithAI } from './openai';

export interface ToneAnalysis {
  tone: 'aggressive' | 'neutral' | 'weak' | 'confusing' | 'clear';
  impact: 'high' | 'medium' | 'low';
  suggestions?: string;
  score: number; // 1-10 scale
}

/**
 * Analyzes the tone and impact of a message
 * @param message The message to analyze
 * @param channelMessages Context messages from the channel
 * @param channelName Name of the channel for context
 * @returns A ToneAnalysis object with tone, impact, suggestions, and score
 */
export const analyzeTone = async (
  message: string,
  channelMessages: any[],
  channelName: string
): Promise<ToneAnalysis> => {
  // Don't analyze empty messages
  if (!message || message.trim() === '') {
    return {
      tone: 'neutral',
      impact: 'low',
      suggestions: 'Message is empty.',
      score: 3
    };
  }

  try {
    // Validate input parameters
    if (!message || typeof message !== 'string') {
      console.error('Invalid message provided to analyzeTone:', message);
      return {
        tone: 'neutral',
        impact: 'medium',
        suggestions: 'Could not analyze tone due to invalid input.',
        score: 5
      };
    }
    
    // Ensure channelMessages is an array
    if (!Array.isArray(channelMessages)) {
      console.error('Invalid channelMessages provided to analyzeTone:', channelMessages);
      channelMessages = [];
    }
    
    // Get recent context messages (last 3) with validation
    const recentMessages = channelMessages
      .slice(-3)
      .filter(msg => msg && typeof msg === 'object' && msg.username && msg.content)
      .map(msg => `${msg.username || 'User'}: ${msg.content || ''}`)
      .join('\n');

    // Create a prompt for the OpenAI API to analyze the tone
    const prompt = `
You are an AI assistant that analyzes the tone and impact of messages in a professional chat environment.

Channel context: ${channelName}
Recent conversation:
${recentMessages}

Message to analyze: "${message}"

Be very critical and precise in your analysis. Pay close attention to language, word choice, punctuation, and context.

Analyze the tone of this message and categorize it as ONE of the following:
- aggressive (forceful, demanding, confrontational, rude, or using strong language)
- neutral (balanced, standard, and professional)
- weak (uncertain, overly apologetic, or lacking confidence)
- confusing (unclear, ambiguous, or difficult to understand)
- clear (well-articulated, direct, and easy to understand)

If the message contains profanity, insults, or aggressive language, it MUST be categorized as 'aggressive'.
If the message is very short but clear, it should be 'clear' not 'neutral'.
If the message is well-structured with good points, it should be 'clear'.
Only use 'neutral' when the message doesn't fit clearly into other categories.

Also rate the impact of this message as ONE of the following:
- high (compelling, likely to get immediate attention and response)
- medium (adequate but not exceptional)
- low (likely to be overlooked or ignored)

Rate the overall effectiveness on a scale of 1-10, where:
1-3: Poor communication that needs significant improvement
4-6: Average communication that could be improved
7-10: Effective communication that achieves its purpose

Provide brief, specific suggestions for improvement.

Return your analysis in this exact JSON format:
{
  "tone": "one of: aggressive, neutral, weak, confusing, clear",
  "impact": "one of: high, medium, low",
  "suggestions": "brief suggestions for improvement if needed, otherwise null",
  "score": number between 1-10
}
`;

    // Call OpenAI to analyze the tone
    const analysisResponse = await enhanceMessageWithAI(
      "", // Empty message since we're using the prompt for analysis
      [], // Empty context since we're providing it in the prompt
      channelName,
      prompt
    );

    // Parse the response as JSON
    try {
      // Extract JSON from the response (in case there's additional text)
      const jsonMatch = analysisResponse.match(/\{[\s\S]*\}/); 
      const jsonString = jsonMatch ? jsonMatch[0] : analysisResponse;
      
      const analysis = JSON.parse(jsonString);
      
      // Validate the analysis fields
      const validTones = ['aggressive', 'neutral', 'weak', 'confusing', 'clear'];
      const validImpacts = ['high', 'medium', 'low'];
      
      const tone = validTones.includes(analysis.tone) ? analysis.tone : 'neutral';
      const impact = validImpacts.includes(analysis.impact) ? analysis.impact : 'medium';
      const score = Number(analysis.score);
      
      return {
        tone,
        impact,
        suggestions: analysis.suggestions || null,
        score: isNaN(score) || score < 1 || score > 10 ? 5 : score
      };
    } catch (error) {
      console.error('Error parsing tone analysis response:', error, analysisResponse);
      throw new Error('Failed to parse tone analysis response from OpenAI');
    }
  } catch (error) {
    console.error('Error analyzing tone:', error);
    throw new Error('Failed to analyze tone. Please check your OpenAI API key.');
  }
};

/**
 * Generate a mock tone analysis based on message characteristics
 * Used when OpenAI API key is not available
 */
const generateMockToneAnalysis = (message: string): ToneAnalysis => {
  // Convert to lowercase for easier analysis
  const lowerMessage = message.toLowerCase();
  
  // Check for aggressive tone markers
  const aggressiveWords = ['urgent', 'immediately', 'asap', 'now', '!', '!!', 'must', 'failure'];
  const hasAggressiveWords = aggressiveWords.some(word => lowerMessage.includes(word));
  const hasMultipleExclamations = (message.match(/!/g) || []).length > 1;
  const hasAllCaps = /[A-Z]{3,}/.test(message);
  
  // Check for weak tone markers
  const weakWords = ['maybe', 'perhaps', 'sorry', 'just', 'kind of', 'sort of', 'i think', 'possibly'];
  const hasWeakWords = weakWords.some(word => lowerMessage.includes(word));
  const hasTooManyQualifiers = (lowerMessage.match(/maybe|perhaps|possibly/g) || []).length > 1;
  
  // Check for confusing markers
  const isLong = message.length > 200;
  const hasManyQuestions = (message.match(/\?/g) || []).length > 2;
  const hasRunOnSentences = message.split('.').some(s => s.trim().length > 100);
  
  // Check for clear tone markers
  const hasStructure = message.includes('\n') || message.includes('•') || message.includes('-');
  const hasActionItems = lowerMessage.includes('action') || lowerMessage.includes('next steps');
  const isConveyingData = /\d+/.test(message) && (message.includes('%') || message.includes('$'));
  
  // Determine tone based on markers
  let tone: 'aggressive' | 'neutral' | 'weak' | 'confusing' | 'clear' = 'neutral';
  let impact: 'high' | 'medium' | 'low' = 'medium';
  let score = 5;
  let suggestions = '';
  
  if (hasAggressiveWords || hasMultipleExclamations || hasAllCaps) {
    tone = 'aggressive';
    impact = 'high';
    score = 4;
    suggestions = 'Consider using a more collaborative tone to improve reception.';
  } else if (hasWeakWords || hasTooManyQualifiers) {
    tone = 'weak';
    impact = 'low';
    score = 3;
    suggestions = 'Be more direct and confident in your message.';
  } else if ((isLong && !hasStructure) || hasManyQuestions || hasRunOnSentences) {
    tone = 'confusing';
    impact = 'low';
    score = 2;
    suggestions = 'Break your message into clearer points and be more concise.';
  } else if (hasStructure || hasActionItems || isConveyingData) {
    tone = 'clear';
    impact = 'high';
    score = 8;
    suggestions = 'Well structured message. Consider adding a clear call to action.';
  } else if (message.length < 20) {
    tone = 'neutral';
    impact = 'low';
    score = 4;
    suggestions = 'Add more context to make your message more impactful.';
  } else {
    // Default case
    tone = 'neutral';
    impact = 'medium';
    score = 5;
    suggestions = 'Consider adding specific details and a clear purpose to your message.';
  }
  
  return {
    tone,
    impact,
    suggestions,
    score
  };
};
