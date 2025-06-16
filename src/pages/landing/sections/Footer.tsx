import React from 'react';
import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { 
  Twitter, 
  Facebook, 
  Instagram, 
  Linkedin, 
  Youtube, 
  Globe,
  ChevronDown
} from 'lucide-react';
import SlackLogo from '../components/SlackLogo';

const Footer: React.FC = () => {
  const footerSections = [
    {
      title: "Product",
      links: [
        { name: "Features", href: "#" },
        { name: "Channels", href: "#" },
        { name: "Integrations", href: "#" },
        { name: "Security", href: "#" },
        { name: "Slack Connect", href: "#" },
        { name: "Customers", href: "#" },
      ]
    },
    {
      title: "Solutions",
      links: [
        { name: "Small Business", href: "#" },
        { name: "Remote Work", href: "#" },
        { name: "Engineering", href: "#" },
        { name: "Financial Services", href: "#" },
        { name: "Sales", href: "#" },
        { name: "IT", href: "#" },
        { name: "Marketing", href: "#" },
        { name: "Customer Support", href: "#" },
        { name: "Human Resources", href: "#" },
        { name: "Project Management", href: "#" },
      ]
    },
    {
      title: "Resources",
      links: [
        { name: "Blog", href: "#" },
        { name: "Webinars", href: "#" },
        { name: "Tutorials", href: "#" },
        { name: "Help Center", href: "#" },
        { name: "API Documentation", href: "#" },
        { name: "App Directory", href: "#" },
        { name: "Download SlackAI", href: "#" },
      ]
    },
    {
      title: "Company",
      links: [
        { name: "About Us", href: "#" },
        { name: "Leadership", href: "#" },
        { name: "News", href: "#" },
        { name: "Media Kit", href: "#" },
        { name: "Careers", href: "#" },
        { name: "SlackAI Store", href: "#" },
      ]
    },
  ];

  return (
    <footer className="bg-slate-900 text-white pt-16 pb-8">
      <div className="container mx-auto px-4 md:px-6">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-8 mb-12">
          {/* Logo and social links */}
          <div className="lg:col-span-1">
            <Link to="/" className="inline-block mb-6">
              <SlackLogo className="h-8 w-auto" />
            </Link>
            <div className="flex space-x-4 mb-6">
              <a href="#" className="text-gray-400 hover:text-white transition-colors">
                <Twitter className="h-5 w-5" />
              </a>
              <a href="#" className="text-gray-400 hover:text-white transition-colors">
                <Facebook className="h-5 w-5" />
              </a>
              <a href="#" className="text-gray-400 hover:text-white transition-colors">
                <Instagram className="h-5 w-5" />
              </a>
              <a href="#" className="text-gray-400 hover:text-white transition-colors">
                <Linkedin className="h-5 w-5" />
              </a>
              <a href="#" className="text-gray-400 hover:text-white transition-colors">
                <Youtube className="h-5 w-5" />
              </a>
            </div>
            <div className="flex items-center text-gray-400 hover:text-white transition-colors cursor-pointer">
              <Globe className="h-5 w-5 mr-2" />
              <span className="text-sm">Change region</span>
              <ChevronDown className="h-4 w-4 ml-1" />
            </div>
          </div>

          {/* Footer navigation sections */}
          {footerSections.map((section, index) => (
            <div key={index} className="lg:col-span-1">
              <h3 className="text-lg font-semibold mb-4">{section.title}</h3>
              <ul className="space-y-2">
                {section.links.map((link, linkIndex) => (
                  <li key={linkIndex}>
                    <a 
                      href={link.href} 
                      className="text-gray-400 hover:text-white transition-colors text-sm"
                    >
                      {link.name}
                    </a>
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>

        {/* Bottom section */}
        <div className="pt-8 border-t border-gray-800">
          <div className="flex flex-col md:flex-row justify-between items-center">
            <div className="mb-4 md:mb-0">
              <ul className="flex flex-wrap justify-center md:justify-start gap-4 md:gap-6 text-sm text-gray-400">
                <li>
                  <a href="#" className="hover:text-white transition-colors">Status</a>
                </li>
                <li>
                  <a href="#" className="hover:text-white transition-colors">Privacy</a>
                </li>
                <li>
                  <a href="#" className="hover:text-white transition-colors">Terms</a>
                </li>
                <li>
                  <a href="#" className="hover:text-white transition-colors">Cookie Preferences</a>
                </li>
                <li>
                  <a href="#" className="hover:text-white transition-colors">Contact Us</a>
                </li>
              </ul>
            </div>
            <div className="text-sm text-gray-400">
              &copy; {new Date().getFullYear()} SlackAI Technologies, LLC. All rights reserved.
            </div>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
