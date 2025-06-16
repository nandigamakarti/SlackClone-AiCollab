import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { motion, useScroll, useTransform } from 'framer-motion';
import { ArrowRight, Play, ChevronDown } from 'lucide-react';
import './landing.css';
import HeroSection from './sections/HeroSection';
import AIAgentsSection from './sections/AIAgentsSection';
import ResourcesSection from './sections/ResourcesSection';
import Footer from './sections/Footer';
import Navbar from './components/Navbar';

const LandingPage: React.FC = () => {
  const [isScrolled, setIsScrolled] = useState(false);
  const { scrollYProgress } = useScroll();
  const opacity = useTransform(scrollYProgress, [0, 0.05], [1, 0]);

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 50);
    };

    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  return (
    <div className="bg-white min-h-screen">
      {/* Sticky Navigation */}
      <Navbar isScrolled={isScrolled} />

      {/* Scroll Indicator */}
      <motion.div 
        className="fixed bottom-8 left-1/2 transform -translate-x-1/2 z-50"
        style={{ opacity }}
      >
        <motion.div 
          className="flex flex-col items-center"
          animate={{ y: [0, 10, 0] }}
          transition={{ repeat: Infinity, duration: 2 }}
        >
          <ChevronDown className="w-6 h-6 text-purple-600" />
          <span className="text-xs text-purple-600 font-medium">Scroll to explore</span>
        </motion.div>
      </motion.div>

      {/* Main Content */}
      <main>
        <HeroSection />
        <AIAgentsSection />
        <ResourcesSection />
      </main>

      {/* Footer */}
      <Footer />
    </div>
  );
};

export default LandingPage;
