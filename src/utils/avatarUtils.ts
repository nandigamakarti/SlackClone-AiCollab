/**
 * Utilities for generating user avatars with initials
 */

// Color palette for avatar backgrounds - similar to the colors in Image 2
const AVATAR_COLORS = [
  { bg: '#8BC34A', text: '#FFFFFF' }, // Green (like JD)
  { bg: '#F0E68C', text: '#000000' }, // Light yellow (like AJ)
  { bg: '#FF8C69', text: '#FFFFFF' }, // Salmon (like SW)
  { bg: '#6495ED', text: '#FFFFFF' }, // Cornflower blue
  { bg: '#9370DB', text: '#FFFFFF' }, // Medium purple
  { bg: '#20B2AA', text: '#FFFFFF' }, // Light sea green
  { bg: '#FF7F50', text: '#FFFFFF' }, // Coral
  { bg: '#00CED1', text: '#FFFFFF' }, // Dark turquoise
];

/**
 * Get initials from a name
 * @param name Full name
 * @returns Initials (1-2 characters)
 */
export const getInitials = (name: string): string => {
  if (!name) return '';
  
  // Split the name and take first letters of first and last parts
  const parts = name.split(' ').filter(part => part.length > 0);
  
  if (parts.length === 0) return '';
  if (parts.length === 1) return parts[0].charAt(0).toUpperCase();
  
  // Get first letter of first and last name
  return (parts[0].charAt(0) + parts[parts.length - 1].charAt(0)).toUpperCase();
};

/**
 * Get a consistent color for a name
 * @param name User name
 * @returns Color object with bg and text colors
 */
export const getAvatarColor = (name: string): { bg: string; text: string } => {
  if (!name) return AVATAR_COLORS[0];
  
  // Use the sum of character codes to get a consistent color
  const charCodeSum = name.split('').reduce((sum, char) => sum + char.charCodeAt(0), 0);
  const colorIndex = charCodeSum % AVATAR_COLORS.length;
  
  return AVATAR_COLORS[colorIndex];
};

/**
 * Generate a data URL for an avatar with initials
 * @param name User name
 * @returns Data URL for the avatar image
 */
export const generateAvatarDataUrl = (name: string): string => {
  const canvas = document.createElement('canvas');
  const size = 200; // High resolution for better quality
  canvas.width = size;
  canvas.height = size;
  
  const ctx = canvas.getContext('2d');
  if (!ctx) return '';
  
  const initials = getInitials(name);
  const colors = getAvatarColor(name);
  
  // Draw background
  ctx.fillStyle = colors.bg;
  ctx.fillRect(0, 0, size, size);
  
  // Draw text
  ctx.fillStyle = colors.text;
  ctx.font = `bold ${size / 2}px Arial, sans-serif`;
  ctx.textAlign = 'center';
  ctx.textBaseline = 'middle';
  ctx.fillText(initials, size / 2, size / 2);
  
  return canvas.toDataURL('image/png');
};

/**
 * Generate avatar style object for inline usage
 * @param name User name
 * @returns Style object for avatar
 */
export const getAvatarStyle = (name: string): React.CSSProperties => {
  const colors = getAvatarColor(name);
  
  return {
    backgroundColor: colors.bg,
    color: colors.text,
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    fontWeight: 'bold',
    width: '100%',
    height: '100%',
    fontSize: '1rem',
  };
};
