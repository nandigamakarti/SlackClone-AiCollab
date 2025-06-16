import React from 'react';

interface SlackLogoProps {
  className?: string;
}

const SlackLogo: React.FC<SlackLogoProps> = ({ className = 'h-8 w-auto' }) => {
  return (
    <svg 
      className={className} 
      viewBox="0 0 240 60" 
      xmlns="http://www.w3.org/2000/svg"
      fill="none"
    >
      {/* Logo background */}
      <rect x="10" y="6" width="48" height="48" rx="12" fill="#7e22ce" />
      
      {/* Star icon */}
      <path 
        d="M34 13L38.5 23.3L50 25.2L42 33L44.1 44.5L34 39.1L23.9 44.5L26 33L18 25.2L29.5 23.3L34 13Z" 
        stroke="white" 
        strokeWidth="2" 
        strokeLinecap="round" 
        strokeLinejoin="round" 
        fill="white" 
      />
      
      {/* Wordmark */}
      <g fill="#6B46C1">
        <path d="M65 30.5c-1.5 1.2-3.4 1.8-5.5 1.8-4.8 0-8.5-3.8-8.5-8.5s3.8-8.5 8.5-8.5c2.1 0 4 0.7 5.5 1.8l-2 3.1c-1-0.7-2.2-1.1-3.5-1.1-2.8 0-5 2.2-5 5s2.2 5 5 5c1.3 0 2.5-0.4 3.5-1.1l2 2.5z" />
        <path d="M70 15h3.5v13.5c0 1.1 0.9 2 2 2s2-0.9 2-2V15H81v13.5c0 3.1-2.4 5.5-5.5 5.5s-5.5-2.4-5.5-5.5V15z" />
        <path d="M95 15h3.5v16.5h-3.5v-1.8c-1.1 1.2-2.7 2-4.5 2-3.8 0-7-3.1-7-7s3.1-7 7-7c1.8 0 3.3 0.7 4.5 2V15zm-4 13.7c2.3 0 4-1.7 4-4s-1.7-4-4-4-4 1.7-4 4 1.7 4 4 4z" />
        <path d="M114 18.5c-1.1-0.9-2.6-1.5-4-1.5-3.3 0-6 2.7-6 6s2.7 6 6 6c1.5 0 2.9-0.6 4-1.5v1.5h3.5V15H114v3.5zm-3.5 7.5c-1.7 0-3-1.3-3-3s1.3-3 3-3 3 1.3 3 3-1.3 3-3 3z" />
        <path d="M123 15h3.5v3h3v3h-3v10.5h-3.5V21h-2v-3h2v-3z" />
      </g>
    </svg>
  );
};

export default SlackLogo;
