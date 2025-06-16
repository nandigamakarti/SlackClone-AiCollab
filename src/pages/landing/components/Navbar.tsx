import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { 
  ChevronDown, 
  Menu, 
  X,
  Search,
  Globe
} from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import SlackLogo from './SlackLogo';

interface NavbarProps {
  isScrolled: boolean;
}

const Navbar: React.FC<NavbarProps> = ({ isScrolled }) => {
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [activeDropdown, setActiveDropdown] = useState<string | null>(null);

  const toggleDropdown = (name: string) => {
    setActiveDropdown(activeDropdown === name ? null : name);
  };

  return (
    <header 
      className={`fixed top-0 left-0 right-0 z-50 transition-all duration-300 ${
        isScrolled ? 'bg-white shadow-md py-2' : 'bg-transparent py-4'
      }`}
    >
      <div className="container mx-auto px-4 md:px-6">
        <div className="flex items-center justify-between">
          {/* Logo */}
          <div className="flex items-center">
            <Link to="/" className="mr-8 flex items-center">
              <SlackLogo className="h-8 w-auto" />
              <span className="ml-2 font-bold text-slate-800 text-xl">SlackAI</span>
            </Link>
            
            {/* Desktop Navigation */}
            <nav className="hidden lg:flex items-center space-x-8">
              <div className="relative group">
                <button 
                  className="flex items-center text-slate-700 hover:text-purple-600 font-medium"
                  onClick={() => toggleDropdown('product')}
                >
                  Product
                  <ChevronDown className="ml-1 h-4 w-4" />
                </button>
                {activeDropdown === 'product' && (
                  <div className="absolute top-full left-0 mt-2 w-64 bg-white rounded-lg shadow-lg p-4 border border-gray-100">
                    <div className="grid gap-2">
                      <Link to="#" className="block p-2 hover:bg-gray-50 rounded-md">Features</Link>
                      <Link to="#" className="block p-2 hover:bg-gray-50 rounded-md">Channels</Link>
                      <Link to="#" className="block p-2 hover:bg-gray-50 rounded-md">Integrations</Link>
                      <Link to="#" className="block p-2 hover:bg-gray-50 rounded-md">Security</Link>
                      <Link to="#" className="block p-2 hover:bg-gray-50 rounded-md">Enterprise</Link>
                    </div>
                  </div>
                )}
              </div>
              
              <div className="relative group">
                <button 
                  className="flex items-center text-slate-700 hover:text-purple-600 font-medium"
                  onClick={() => toggleDropdown('solutions')}
                >
                  Solutions
                  <ChevronDown className="ml-1 h-4 w-4" />
                </button>
                {activeDropdown === 'solutions' && (
                  <div className="absolute top-full left-0 mt-2 w-64 bg-white rounded-lg shadow-lg p-4 border border-gray-100">
                    <div className="grid gap-2">
                      <Link to="#" className="block p-2 hover:bg-gray-50 rounded-md">Departments</Link>
                      <Link to="#" className="block p-2 hover:bg-gray-50 rounded-md">Industries</Link>
                      <Link to="#" className="block p-2 hover:bg-gray-50 rounded-md">Case studies</Link>
                      <Link to="#" className="block p-2 hover:bg-gray-50 rounded-md">Partner solutions</Link>
                    </div>
                  </div>
                )}
              </div>
              
              <div className="relative group">
                <button 
                  className="flex items-center text-slate-700 hover:text-purple-600 font-medium"
                  onClick={() => toggleDropdown('resources')}
                >
                  Resources
                  <ChevronDown className="ml-1 h-4 w-4" />
                </button>
                {activeDropdown === 'resources' && (
                  <div className="absolute top-full left-0 mt-2 w-64 bg-white rounded-lg shadow-lg p-4 border border-gray-100">
                    <div className="grid gap-2">
                      <Link to="#" className="block p-2 hover:bg-gray-50 rounded-md">Blog</Link>
                      <Link to="#" className="block p-2 hover:bg-gray-50 rounded-md">Webinars</Link>
                      <Link to="#" className="block p-2 hover:bg-gray-50 rounded-md">Tutorials</Link>
                      <Link to="#" className="block p-2 hover:bg-gray-50 rounded-md">Help center</Link>
                      <Link to="#" className="block p-2 hover:bg-gray-50 rounded-md">API documentation</Link>
                    </div>
                  </div>
                )}
              </div>
              
              <Link to="#" className="text-slate-700 hover:text-purple-600 font-medium">
                Enterprise
              </Link>
              
              <Link to="#" className="text-slate-700 hover:text-purple-600 font-medium">
                Pricing
              </Link>
            </nav>
          </div>
          
          {/* Right Side Actions */}
          <div className="hidden lg:flex items-center space-x-4">
            <button className="text-slate-700 hover:text-purple-600">
              <Search className="h-5 w-5" />
            </button>
            <button className="flex items-center text-slate-700 hover:text-purple-600 font-medium">
              <Globe className="h-5 w-5 mr-1" />
              <span>EN</span>
              <ChevronDown className="ml-1 h-4 w-4" />
            </button>
            <Link to="/signin" className="text-slate-700 hover:text-purple-600 font-medium">
              Sign in
            </Link>
            <Button className="bg-purple-600 hover:bg-purple-700 text-white">
              Talk to sales
            </Button>
            <Button className="bg-purple-600 hover:bg-purple-700 text-white">
              Try for free
            </Button>
          </div>
          
          {/* Mobile Menu Button */}
          <div className="lg:hidden">
            <button 
              onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
              className="p-2 text-slate-700"
            >
              {isMobileMenuOpen ? (
                <X className="h-6 w-6" />
              ) : (
                <Menu className="h-6 w-6" />
              )}
            </button>
          </div>
        </div>
      </div>
      
      {/* Mobile Menu */}
      <AnimatePresence>
        {isMobileMenuOpen && (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: 'auto' }}
            exit={{ opacity: 0, height: 0 }}
            className="lg:hidden bg-white border-t border-gray-200"
          >
            <div className="container mx-auto px-4 py-4">
              <nav className="flex flex-col space-y-4">
                <div className="border-b border-gray-100 pb-2">
                  <button 
                    className="flex items-center justify-between w-full text-slate-700 font-medium py-2"
                    onClick={() => toggleDropdown('mobile-product')}
                  >
                    <span>Product</span>
                    <ChevronDown className={`h-4 w-4 transition-transform ${activeDropdown === 'mobile-product' ? 'rotate-180' : ''}`} />
                  </button>
                  {activeDropdown === 'mobile-product' && (
                    <div className="mt-2 pl-4 space-y-2">
                      <Link to="#" className="block py-1 text-slate-600">Features</Link>
                      <Link to="#" className="block py-1 text-slate-600">Channels</Link>
                      <Link to="#" className="block py-1 text-slate-600">Integrations</Link>
                      <Link to="#" className="block py-1 text-slate-600">Security</Link>
                      <Link to="#" className="block py-1 text-slate-600">Enterprise</Link>
                    </div>
                  )}
                </div>
                
                <div className="border-b border-gray-100 pb-2">
                  <button 
                    className="flex items-center justify-between w-full text-slate-700 font-medium py-2"
                    onClick={() => toggleDropdown('mobile-solutions')}
                  >
                    <span>Solutions</span>
                    <ChevronDown className={`h-4 w-4 transition-transform ${activeDropdown === 'mobile-solutions' ? 'rotate-180' : ''}`} />
                  </button>
                  {activeDropdown === 'mobile-solutions' && (
                    <div className="mt-2 pl-4 space-y-2">
                      <Link to="#" className="block py-1 text-slate-600">Departments</Link>
                      <Link to="#" className="block py-1 text-slate-600">Industries</Link>
                      <Link to="#" className="block py-1 text-slate-600">Case studies</Link>
                      <Link to="#" className="block py-1 text-slate-600">Partner solutions</Link>
                    </div>
                  )}
                </div>
                
                <div className="border-b border-gray-100 pb-2">
                  <button 
                    className="flex items-center justify-between w-full text-slate-700 font-medium py-2"
                    onClick={() => toggleDropdown('mobile-resources')}
                  >
                    <span>Resources</span>
                    <ChevronDown className={`h-4 w-4 transition-transform ${activeDropdown === 'mobile-resources' ? 'rotate-180' : ''}`} />
                  </button>
                  {activeDropdown === 'mobile-resources' && (
                    <div className="mt-2 pl-4 space-y-2">
                      <Link to="#" className="block py-1 text-slate-600">Blog</Link>
                      <Link to="#" className="block py-1 text-slate-600">Webinars</Link>
                      <Link to="#" className="block py-1 text-slate-600">Tutorials</Link>
                      <Link to="#" className="block py-1 text-slate-600">Help center</Link>
                      <Link to="#" className="block py-1 text-slate-600">API documentation</Link>
                    </div>
                  )}
                </div>
                
                <Link to="#" className="text-slate-700 font-medium py-2 border-b border-gray-100">
                  Enterprise
                </Link>
                
                <Link to="#" className="text-slate-700 font-medium py-2 border-b border-gray-100">
                  Pricing
                </Link>
                
                <div className="pt-2 space-y-3">
                  <Link to="/signin" className="block text-slate-700 font-medium">
                    Sign in
                  </Link>
                  <Button className="w-full bg-purple-600 hover:bg-purple-700 text-white">
                    Talk to sales
                  </Button>
                  <Button className="w-full bg-purple-600 hover:bg-purple-700 text-white">
                    Try for free
                  </Button>
                </div>
              </nav>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </header>
  );
};

export default Navbar;
