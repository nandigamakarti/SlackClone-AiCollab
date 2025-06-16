import { Request, Response } from 'express';
import fetch from 'node-fetch';

// This would be your API key for a sentiment analysis service
const API_KEY = process.env.SENTIMENT_API_KEY || '';
const HUGGINGFACE_API_URL = 'https://api-inference.huggingface.co/models/distilbert-base-uncased-finetuned-sst-2-english';

/**
 * Analyze the sentiment of a text using an external API
 * @param req The request object containing text to analyze
 * @param res The response object
 */
export const analyzeSentiment = async (req: Request, res: Response) => {
  try {
    const { text } = req.body;
    
    if (!text || typeof text !== 'string') {
      return res.status(400).json({
        success: false,
        error: 'Text is required and must be a string'
      });
    }
    
    // If API key is not set, return a mock response
    if (!API_KEY) {
      const mockResponse = generateMockResponse(text);
      return res.json({
        success: true,
        data: mockResponse
      });
    }
    
    // Call HuggingFace API (or any sentiment analysis API of your choice)
    const response = await fetch(HUGGINGFACE_API_URL, {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${API_KEY}`,
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({ inputs: text })
    });
    
    if (!response.ok) {
      throw new Error(`API request failed with status ${response.status}`);
    }
    
    const data = await response.json();
    
    // Format the response
    const result = formatHuggingFaceResponse(data, text);
    
    return res.json({
      success: true,
      data: result
    });
  } catch (error) {
    console.error('Error analyzing sentiment:', error);
    return res.status(500).json({
      success: false,
      error: 'Failed to analyze sentiment'
    });
  }
};

/**
 * Format the response from HuggingFace API
 */
const formatHuggingFaceResponse = (data: any, text: string) => {
  try {
    // HuggingFace returns an array of objects with label and score
    const results = Array.isArray(data) ? data[0] : data;
    
    // Get positive and negative scores
    const positiveResult = results.find((r: any) => r.label === 'POSITIVE');
    const negativeResult = results.find((r: any) => r.label === 'NEGATIVE');
    
    const positiveScore = positiveResult ? positiveResult.score : 0;
    const negativeScore = negativeResult ? negativeResult.score : 0;
    
    // Determine sentiment
    let sentiment: 'positive' | 'negative' | 'neutral' | 'mixed' = 'neutral';
    let emoji = '😐';
    let intensity: 'high' | 'medium' | 'low' = 'medium';
    let suggestions: string | null = null;
    
    if (positiveScore > 0.7) {
      sentiment = 'positive';
      emoji = '😊';
      intensity = 'high';
    } else if (positiveScore > 0.6) {
      sentiment = 'positive';
      emoji = '🙂';
      intensity = 'medium';
    } else if (negativeScore > 0.7) {
      sentiment = 'negative';
      emoji = '😠';
      intensity = 'high';
      suggestions = 'Consider using a more collaborative tone';
    } else if (negativeScore > 0.6) {
      sentiment = 'negative';
      emoji = '😞';
      intensity = 'medium';
      suggestions = 'Your message may come across as negative';
    } else if (positiveScore > 0.4 && negativeScore > 0.4) {
      sentiment = 'mixed';
      emoji = '😕';
      intensity = 'medium';
      suggestions = 'Your message contains mixed emotions';
    } else {
      sentiment = 'neutral';
      emoji = '😐';
      intensity = 'low';
    }
    
    return {
      sentiment,
      emoji,
      intensity,
      suggestions,
      confidence: Math.max(positiveScore, negativeScore)
    };
  } catch (error) {
    console.error('Error formatting HuggingFace response:', error);
    return generateMockResponse(text);
  }
};

/**
 * Generate a mock response for development or when API key is not set
 */
const generateMockResponse = (text: string) => {
  // Simple sentiment analysis based on keywords
  const lowerText = text.toLowerCase();
  
  // Check for positive and negative keywords
  const positiveWords = ['good', 'great', 'awesome', 'happy', 'excellent', 'love', 'thank', 'thanks', 'appreciate'];
  const negativeWords = ['bad', 'awful', 'terrible', 'hate', 'annoying', 'frustrating', 'disappointed', 'sorry', 'issue'];
  
  const positiveCount = positiveWords.filter(word => lowerText.includes(word)).length;
  const negativeCount = negativeWords.filter(word => lowerText.includes(word)).length;
  
  let sentiment: 'positive' | 'negative' | 'neutral' | 'mixed' = 'neutral';
  let emoji = '😐';
  let intensity: 'high' | 'medium' | 'low' = 'medium';
  let suggestions: string | null = null;
  let confidence = 0.6;
  
  if (positiveCount > 0 && negativeCount > 0) {
    sentiment = 'mixed';
    emoji = '😕';
    suggestions = 'Your message contains mixed emotions';
    confidence = 0.7;
  } else if (positiveCount > 2) {
    sentiment = 'positive';
    emoji = '😄';
    intensity = 'high';
    confidence = 0.9;
  } else if (positiveCount > 0) {
    sentiment = 'positive';
    emoji = '🙂';
    intensity = 'medium';
    confidence = 0.8;
  } else if (negativeCount > 2) {
    sentiment = 'negative';
    emoji = '😠';
    intensity = 'high';
    suggestions = 'Consider using a more collaborative tone';
    confidence = 0.9;
  } else if (negativeCount > 0) {
    sentiment = 'negative';
    emoji = '😞';
    intensity = 'medium';
    suggestions = 'Your message may come across as negative';
    confidence = 0.8;
  } else {
    sentiment = 'neutral';
    emoji = '😐';
    intensity = 'low';
    confidence = 0.6;
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
 * Handle OPTIONS requests for CORS
 */
export const handleOptions = (req: Request, res: Response) => {
  res.status(200).end();
}; 