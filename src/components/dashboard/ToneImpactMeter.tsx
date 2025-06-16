import React from 'react';
import { ToneAnalysis } from '@/services/toneAnalyzer';
import { AlertTriangle, AlertCircle, CheckCircle, HelpCircle, Zap, Loader2, ThumbsUp, Info } from 'lucide-react';
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from '@/components/ui/tooltip';
import { motion } from 'framer-motion';
import { Progress } from '@/components/ui/progress';

interface ToneImpactMeterProps {
  analysis: ToneAnalysis | null;
  isLoading?: boolean;
  message?: string;
}

const ToneImpactMeter: React.FC<ToneImpactMeterProps> = ({ analysis, isLoading = false, message = '' }) => {
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
    return null;
  }
  
  // Get tone icon and color
  const getToneIcon = () => {
    switch (analysis.tone) {
      case 'aggressive':
        return <AlertTriangle className="w-6 h-6 text-red-500" />;
      case 'weak':
        return <AlertCircle className="w-6 h-6 text-yellow-500" />;
      case 'confusing':
        return <HelpCircle className="w-6 h-6 text-orange-500" />;
      case 'clear':
        return <CheckCircle className="w-6 h-6 text-green-500" />;
      case 'neutral':
      default:
        return <AlertCircle className="w-6 h-6 text-blue-500" />;
    }
  };

  // Get impact icon and color
  const getImpactIcon = () => {
    switch (analysis.impact) {
      case 'high':
        return <Zap className="w-6 h-6 text-purple-500" />;
      case 'medium':
        return <Zap className="w-6 h-6 text-blue-500" />;
      case 'low':
      default:
        return <Zap className="w-6 h-6 text-gray-500" />;
    }
  };
  
  // Get tone color class
  const getToneColorClass = () => {
    switch (analysis.tone) {
      case 'aggressive': return 'text-red-500 border-red-500 bg-red-500/10';
      case 'weak': return 'text-yellow-500 border-yellow-500 bg-yellow-500/10';
      case 'confusing': return 'text-orange-500 border-orange-500 bg-orange-500/10';
      case 'clear': return 'text-green-500 border-green-500 bg-green-500/10';
      case 'neutral':
      default: return 'text-blue-500 border-blue-500 bg-blue-500/10';
    }
  };
  
  // Get impact color class
  const getImpactColorClass = () => {
    switch (analysis.impact) {
      case 'high': return 'text-purple-500 border-purple-500 bg-purple-500/10';
      case 'medium': return 'text-blue-500 border-blue-500 bg-blue-500/10';
      case 'low':
      default: return 'text-gray-500 border-gray-500 bg-gray-500/10';
    }
  };

  // Get tone description
  const getToneDescription = () => {
    switch (analysis.tone) {
      case 'aggressive': return 'Your message has an aggressive tone.';
      case 'weak': return 'Your message has a weak tone.';
      case 'confusing': return 'Your message has a confusing tone.';
      case 'clear': return 'Your message has a clear tone.';
      case 'neutral':
      default: return 'Your message has a neutral tone.';
    }
  };

  // Get impact description
  const getImpactDescription = () => {
    switch (analysis.impact) {
      case 'high': return 'Your message has a high impact.';
      case 'medium': return 'Your message has a medium impact.';
      case 'low':
      default: return 'Your message has a low impact.';
    }
  };

  // Calculate the effectiveness score as a percentage
  const effectivenessPercentage = Math.min(Math.max((analysis.score / 10) * 100, 0), 100);

  // Get emoji for tone
  const getToneEmoji = () => {
    switch (analysis.tone) {
      case 'aggressive': return '😠';
      case 'weak': return '😟';
      case 'confusing': return '🤔';
      case 'clear': return '😊';
      case 'neutral': return '😐';
      default: return '😐';
    }
  };

  // Get emoji for impact
  const getImpactEmoji = () => {
    switch (analysis.impact) {
      case 'high': return '💥';
      case 'medium': return '✨';
      case 'low': return '💤';
      default: return '✨';
    }
  };

  // Get tone color based on analysis
  const getToneColor = () => {
    switch (analysis.tone) {
      case 'aggressive': return 'from-red-600 to-red-500';
      case 'weak': return 'from-yellow-600 to-yellow-500';
      case 'confusing': return 'from-orange-600 to-orange-500';
      case 'clear': return 'from-emerald-600 to-emerald-500';
      case 'neutral': default: return 'from-blue-600 to-blue-500';
    }
  };

  // Get impact color based on analysis
  const getImpactColor = () => {
    switch (analysis.impact) {
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
          Score: {Math.round(effectivenessPercentage)}%
        </span>
      </div>

      {/* Main content */}
      <div className="p-3">
        {/* Tone section */}
        <div className="mb-3">
          <div className="flex items-center justify-between mb-1">
            <div className="flex items-center">
              <div className="flex items-center justify-center bg-gray-700/50 rounded-full h-6 w-6 mr-2">
                <span className="text-sm">{getToneEmoji()}</span>
              </div>
              <span className="text-xs font-medium capitalize text-white">Tone: {analysis.tone}</span>
            </div>
            <TooltipProvider>
              <Tooltip>
                <TooltipTrigger asChild>
                  <div className="cursor-help">
                    <Info className="w-3.5 h-3.5 text-gray-400" />
                  </div>
                </TooltipTrigger>
                <TooltipContent side="top" className="w-64 p-3 bg-gray-800 border-gray-700 text-white">
                  <p className="text-sm font-medium">{getToneDescription()}</p>
                </TooltipContent>
              </Tooltip>
            </TooltipProvider>
          </div>
          <Progress 
            value={effectivenessPercentage} 
            className="h-1.5 bg-gray-700/50" 
            indicatorClassName={`bg-gradient-to-r ${getToneColor()}`} 
          />
        </div>

        {/* Impact section */}
        <div className="mb-2">
          <div className="flex items-center justify-between mb-1">
            <div className="flex items-center">
              <div className="flex items-center justify-center bg-gray-700/50 rounded-full h-6 w-6 mr-2">
                <span className="text-sm">{getImpactEmoji()}</span>
              </div>
              <span className="text-xs font-medium capitalize text-white">Impact: {analysis.impact}</span>
            </div>
            <TooltipProvider>
              <Tooltip>
                <TooltipTrigger asChild>
                  <div className="cursor-help">
                    <Info className="w-3.5 h-3.5 text-gray-400" />
                  </div>
                </TooltipTrigger>
                <TooltipContent side="top" className="w-64 p-3 bg-gray-800 border-gray-700 text-white">
                  <p className="text-sm font-medium">{getImpactDescription()}</p>
                </TooltipContent>
              </Tooltip>
            </TooltipProvider>
          </div>
          <Progress 
            value={analysis.impact === 'high' ? 90 : analysis.impact === 'medium' ? 60 : 30} 
            className="h-1.5 bg-gray-700/50" 
            indicatorClassName={`bg-gradient-to-r ${getImpactColor()}`} 
          />
        </div>

        {/* Suggestions */}
        {analysis.suggestions && (
          <div className="mt-3 pt-2 border-t border-gray-700/30">
            <p className="text-xs text-gray-300 italic">
              <span className="font-medium text-purple-400">Suggestion:</span> {analysis.suggestions}
            </p>
          </div>
        )}
      </div>
    </motion.div>
  );
};

export default ToneImpactMeter;
