// This file contains declarations for modules that TypeScript can't find
declare module './sections/HeroSection' {
  import React from 'react';
  const HeroSection: React.FC;
  export default HeroSection;
}

declare module './sections/AIAgentsSection' {
  import React from 'react';
  const AIAgentsSection: React.FC;
  export default AIAgentsSection;
}

declare module './sections/ResourcesSection' {
  import React from 'react';
  const ResourcesSection: React.FC;
  export default ResourcesSection;
}

declare module './sections/Footer' {
  import React from 'react';
  const Footer: React.FC;
  export default Footer;
}

declare module './components/Navbar' {
  import React from 'react';
  interface NavbarProps {
    isScrolled: boolean;
  }
  const Navbar: React.FC<NavbarProps>;
  export default Navbar;
}

declare module './components/SlackLogo' {
  import React from 'react';
  interface SlackLogoProps {
    className?: string;
  }
  const SlackLogo: React.FC<SlackLogoProps>;
  export default SlackLogo;
}
