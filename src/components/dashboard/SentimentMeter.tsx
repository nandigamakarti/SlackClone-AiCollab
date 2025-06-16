import React from 'react';
import { SentimentAnalysis } from '@/services/aiAnalyzer';
import { AlertTriangle, AlertCircle, CheckCircle, HelpCircle, Zap, Loader2, Info } from 'lucide-react';
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from '@/components/ui/tooltip';
import { motion } from 'framer-motion';
import { Progress } from '@/components/ui/progress';

interface SentimentMeterProps {
  analysis: SentimentAnalysis | null;
  isLoading?: boolean;
  message?: string;
}

// Helper function to convert intensity to a percentage value for the progress bar
const getIntensityValue = (intensity: string): number => {
  switch (intensity) {
    case 'high': return 90;
    case 'medium': return 60;
    case 'low': return 30;
    default: return 50;
  }
};

const SentimentMeter: React.FC<SentimentMeterProps> = ({ analysis, isLoading = false, message = '' }) => {
  // Simple loading indicator that appears above the input field
  if (isLoading) {
    return (
      <motion.div 
        initial={{ opacity: 0.7, y: 5 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.3 }}
        className="flex items-center justify-center text-sm text-gray-300 px-4 py-2 rounded-lg bg-gray-800/90 backdrop-blur-sm shadow-lg mx-1 border border-gray-700/50"
      >
        <Loader2 className="w-4 h-4 text-purple-400 animate-spin mr-2" />
        <span className="text-xs font-medium">Analyzing your message...</span>
      </motion.div>
    );
  }

  if (!analysis) {
    // Show a default analyzer UI instead of returning null
    return (
      <motion.div 
        initial={{ opacity: 0.7, y: 5 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.3 }}
        className="flex items-center justify-center text-sm text-gray-300 px-4 py-2 rounded-lg bg-gray-800/90 backdrop-blur-sm shadow-lg mx-1 border border-gray-700/50"
      >
        <Info className="w-4 h-4 text-blue-400 mr-2" />
        <span className="text-xs font-medium">Type to analyze message sentiment</span>
      </motion.div>
    );
  }
  
  // Get sentiment icon and color
  const getSentimentIcon = () => {
    switch (analysis.sentiment) {
      case 'positive':
        return <CheckCircle className="w-4 h-4 text-green-500" />;
      case 'negative':
        return <AlertTriangle className="w-4 h-4 text-red-500" />;
      case 'mixed':
        return <HelpCircle className="w-4 h-4 text-orange-500" />;
      case 'neutral':
      default:
        return <AlertCircle className="w-4 h-4 text-blue-500" />;
    }
  };

  // Get intensity icon and color
  const getIntensityIcon = () => {
    switch (analysis.intensity) {
      case 'high':
        return <Zap className="w-4 h-4 text-purple-500" />;
      case 'medium':
        return <Zap className="w-4 h-4 text-blue-500" />;
      case 'low':
      default:
        return <Zap className="w-4 h-4 text-gray-500" />;
    }
  };
  
  // Get sentiment color class
  const getSentimentColorClass = () => {
    switch (analysis.sentiment) {
      case 'positive': return 'text-green-500 border-green-500 bg-green-500/10';
      case 'negative': return 'text-red-500 border-red-500 bg-red-500/10';
      case 'mixed': return 'text-orange-500 border-orange-500 bg-orange-500/10';
      case 'neutral':
      default: return 'text-blue-500 border-blue-500 bg-blue-500/10';
    }
  };
  
  // Get intensity color class
  const getIntensityColorClass = () => {
    switch (analysis.intensity) {
      case 'high': return 'text-purple-500 border-purple-500 bg-purple-500/10';
      case 'medium': return 'text-blue-500 border-blue-500 bg-blue-500/10';
      case 'low':
      default: return 'text-gray-500 border-gray-500 bg-gray-500/10';
    }
  };

  // Get sentiment description
  const getSentimentDescription = () => {
    switch (analysis.sentiment) {
      case 'positive': return 'Your message has a positive tone.';
      case 'negative': return 'Your message has a negative tone.';
      case 'mixed': return 'Your message has mixed positive and negative elements.';
      case 'neutral':
      default: return 'Your message has a neutral tone.';
    }
  };

  // Get intensity description
  const getIntensityDescription = () => {
    switch (analysis.intensity) {
      case 'high': return 'Your message has strong emotional content.';
      case 'medium': return 'Your message has moderate emotional content.';
      case 'low':
      default: return 'Your message has minimal emotional content.';
    }
  };

  // Calculate the confidence as a percentage
  const confidencePercentage = Math.min(Math.max(analysis.confidence * 100, 0), 100);

  // Get sentiment color for progress bar
  const getSentimentColor = () => {
    switch (analysis.sentiment) {
      case 'positive': return 'from-green-600 to-green-500';
      case 'negative': return 'from-red-600 to-red-500';
      case 'mixed': return 'from-orange-600 to-orange-500';
      case 'neutral': default: return 'from-blue-600 to-blue-500';
    }
  };

  // Get intensity color for progress bar
  const getIntensityColor = () => {
    switch (analysis.intensity) {
      case 'high': return 'from-purple-600 to-purple-500';
      case 'medium': return 'from-blue-600 to-blue-500';
      case 'low': default: return 'from-gray-600 to-gray-500';
    }
  };

  return (
    <motion.div 
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.3, type: 'spring', stiffness: 300 }}
      className="w-full bg-gray-800/90 backdrop-blur-sm border border-gray-700/50 rounded-lg shadow-lg overflow-hidden mx-1 mb-2"
    >
      {/* Header with title */}
      <div className="flex items-center justify-between px-3 py-2 border-b border-gray-700/50">
        <div className="flex items-center">
          <Info className="w-4 h-4 text-gray-400 mr-2" />
          <span className="text-xs font-semibold text-gray-300">Message Analysis</span>
        </div>
        <span className="text-xs font-bold text-gray-300 bg-gray-700/70 px-2 py-0.5 rounded-full">
          Confidence: {Math.round(confidencePercentage)}%
        </span>
      </div>

      {/* Main content */}
      <div className="p-3">
        {/* Sentiment emoji */}
        <div className="flex justify-center mb-3">
          <div className="text-3xl">{analysis.emoji}</div>
        </div>
        
        {/* Sentiment section */}
        <div className="mb-3">
          <div className="flex items-center justify-between mb-1">
            <div className="flex items-center">
              {getSentimentIcon()}
              <span className="text-xs font-medium capitalize ml-1 text-white">Sentiment: {analysis.sentiment}</span>
            </div>
            <TooltipProvider>
              <Tooltip>
                <TooltipTrigger asChild>
                  <div className="cursor-help">
                    <Info className="w-3.5 h-3.5 text-gray-400" />
                  </div>
                </TooltipTrigger>
                <TooltipContent side="top" className="w-64 p-3 bg-gray-800 border-gray-700 text-white">
                  <p className="text-sm font-medium">{getSentimentDescription()}</p>
                </TooltipContent>
              </Tooltip>
            </TooltipProvider>
          </div>
          <Progress 
            value={confidencePercentage} 
            className="h-1.5 bg-gray-700/50" 
            indicatorClassName={`bg-gradient-to-r ${getSentimentColor()}`} 
          />
        </div>
        
        {/* Intensity section */}
        <div className="mb-3">
          <div className="flex items-center justify-between mb-1">
            <div className="flex items-center">
              {getIntensityIcon()}
              <span className="text-xs font-medium capitalize ml-1 text-white">Intensity: {analysis.intensity}</span>
            </div>
            <TooltipProvider>
              <Tooltip>
                <TooltipTrigger asChild>
                  <div className="cursor-help">
                    <Info className="w-3.5 h-3.5 text-gray-400" />
                  </div>
                </TooltipTrigger>
                <TooltipContent side="top" className="w-64 p-3 bg-gray-800 border-gray-700 text-white">
                  <p className="text-sm font-medium">{getIntensityDescription()}</p>
                </TooltipContent>
              </Tooltip>
            </TooltipProvider>
          </div>
          <Progress 
            value={getIntensityValue(analysis.intensity)} 
            className="h-1.5 bg-gray-700/50" 
            indicatorClassName={`bg-gradient-to-r ${getIntensityColor()}`} 
          />
        </div>
        
        {/* Suggestions */}
        {analysis.suggestions && (
          <div className="mt-2 px-3 py-2 rounded-md bg-gray-700/50 text-xs text-gray-300">
            <div className="font-medium mb-1">Suggestion:</div>
            <div>{analysis.suggestions}</div>
          </div>
        )}
      </div>
    </motion.div>
  );
};

export default SentimentMeter; 