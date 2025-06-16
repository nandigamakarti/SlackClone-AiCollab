import React from 'react';

interface ImagePlaceholderProps {
  width?: string;
  height?: string;
  text?: string;
  bgColor?: string;
  textColor?: string;
  className?: string;
  imageType?: 'hero' | 'feature' | 'company' | 'resource';
}

const ImagePlaceholder: React.FC<ImagePlaceholderProps> = ({
  width = '100%',
  height = '300px',
  text = 'Image',
  bgColor,
  textColor = 'white',
  className = '',
  imageType = 'feature'
}) => {
  // Different background colors based on image type
  const getBgColor = () => {
    if (bgColor) return bgColor;
    
    switch (imageType) {
      case 'hero':
        return 'bg-gradient-to-br from-purple-600 to-purple-800';
      case 'feature':
        return 'bg-gradient-to-br from-blue-500 to-purple-600';
      case 'company':
        return 'bg-gradient-to-br from-green-500 to-blue-600';
      case 'resource':
        return 'bg-gradient-to-br from-yellow-500 to-red-500';
      default:
        return 'bg-gray-400';
    }
  };

  // Different patterns based on image type
  const getPattern = () => {
    switch (imageType) {
      case 'hero':
        return (
          <div className="absolute inset-0 opacity-20">
            <div className="absolute top-1/4 left-1/4 w-16 h-16 rounded-full bg-white"></div>
            <div className="absolute bottom-1/4 right-1/4 w-24 h-24 rounded-full bg-white"></div>
            <div className="absolute top-1/2 right-1/3 w-12 h-12 rounded-full bg-white"></div>
            <div className="absolute bottom-1/3 left-1/2 w-20 h-20 rounded-full bg-white"></div>
          </div>
        );
      case 'feature':
        return (
          <div className="absolute inset-0 opacity-20">
            <div className="absolute top-0 left-0 w-full h-full grid grid-cols-4 grid-rows-4">
              {Array(16).fill(0).map((_, i) => (
                <div key={i} className={`border border-white ${i % 3 === 0 ? 'bg-white bg-opacity-30' : ''}`}></div>
              ))}
            </div>
          </div>
        );
      case 'company':
        return (
          <div className="absolute inset-0 opacity-10">
            <div className="absolute top-0 left-0 w-full h-full">
              {Array(10).fill(0).map((_, i) => (
                <div 
                  key={i} 
                  className="absolute rounded-full bg-white" 
                  style={{
                    width: `${Math.random() * 30 + 10}px`,
                    height: `${Math.random() * 30 + 10}px`,
                    top: `${Math.random() * 100}%`,
                    left: `${Math.random() * 100}%`,
                  }}
                ></div>
              ))}
            </div>
          </div>
        );
      case 'resource':
        return (
          <div className="absolute inset-0 opacity-20">
            <div className="absolute top-0 left-0 w-full h-full flex flex-col">
              {Array(5).fill(0).map((_, i) => (
                <div key={i} className="flex-1 border-b border-white"></div>
              ))}
            </div>
            <div className="absolute top-0 left-0 w-full h-full flex flex-row">
              {Array(5).fill(0).map((_, i) => (
                <div key={i} className="flex-1 border-r border-white"></div>
              ))}
            </div>
          </div>
        );
      default:
        return null;
    }
  };

  return (
    <div 
      className={`relative overflow-hidden rounded-lg shadow-md flex items-center justify-center ${getBgColor()} ${className}`}
      style={{ width, height }}
    >
      {getPattern()}
      <div className="relative z-10 text-center p-4">
        <div className={`font-medium text-${textColor}`}>{text}</div>
      </div>
    </div>
  );
};

export default ImagePlaceholder;
