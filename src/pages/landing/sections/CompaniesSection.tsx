import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { Button } from '@/components/ui/button';
import { Play, ArrowRight } from 'lucide-react';
import ImagePlaceholder from '../components/ImagePlaceholder';

const CompaniesSection: React.FC = () => {
  const [activeVideo, setActiveVideo] = useState(0);
  
  const companyVideos = [
    {
      id: 0,
      title: "How OpenAI connects with customers and expands ChatGPT with Slack",
      company: "OpenAI",
      thumbnail: "/images/openai-thumbnail.jpg",
      videoId: "SyuBcwa0bqQ",
      fallbackThumbnail: "https://img.youtube.com/vi/SyuBcwa0bqQ/maxresdefault.jpg"
    },
    {
      id: 1,
      title: "How Spotify boosted ad sales and streamlined operations with Slack",
      company: "Spotify",
      thumbnail: "/images/spotify-thumbnail.jpg",
      videoId: "enYP8gI8VmE",
      fallbackThumbnail: "https://img.youtube.com/vi/enYP8gI8VmE/maxresdefault.jpg"
    },
    {
      id: 2,
      title: "To seamlessly serve millions, ezCater taps into Slack and Agentforce",
      company: "ezCater",
      thumbnail: "/images/ezcater-thumbnail.jpg",
      videoId: "N4kpe-J8kP0",
      fallbackThumbnail: "https://img.youtube.com/vi/N4kpe-J8kP0/maxresdefault.jpg"
    },
    {
      id: 3,
      title: "Ari Bikes uses Slack as a creative space for collaboration",
      company: "Ari Bikes",
      thumbnail: "/images/aribikes-thumbnail.jpg",
      videoId: "Xw-qLW3KA_A",
      fallbackThumbnail: "https://img.youtube.com/vi/Xw-qLW3KA_A/maxresdefault.jpg"
    }
  ];

  return (
    <section className="py-20 bg-slate-50">
      <div className="container mx-auto px-4 md:px-6">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.5 }}
          className="text-center max-w-3xl mx-auto mb-16"
        >
          <h2 className="text-3xl md:text-4xl font-bold text-slate-900 mb-4">
            The most innovative companies run their business in Slack.
          </h2>
          <p className="text-lg text-slate-700">
            See how leading organizations are transforming their work with Slack.
          </p>
        </motion.div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 mb-12">
          {/* Main video display */}
          <div className="lg:col-span-2">
            <motion.div
              key={activeVideo}
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ duration: 0.5 }}
              className="relative aspect-video bg-black rounded-xl overflow-hidden shadow-xl"
            >
              <ImagePlaceholder 
                imageType="company"
                text={`${companyVideos[activeVideo].company} Video`}
                className="absolute inset-0 w-full h-full"
              />
              <div className="absolute inset-0 flex items-center justify-center">
                <div className="bg-white bg-opacity-80 rounded-full p-3 cursor-pointer hover:bg-opacity-100 transition-all">
                  <Play className="w-10 h-10 text-purple-600" />
                </div>
              </div>
            </motion.div>
            <div className="mt-4">
              <h3 className="text-xl font-semibold text-slate-900">
                {companyVideos[activeVideo].title}
              </h3>
              <p className="text-slate-600">
                {companyVideos[activeVideo].company}
              </p>
            </div>
          </div>

          {/* Video selection sidebar */}
          <div className="space-y-4">
            <h3 className="text-xl font-semibold text-slate-900 mb-4">
              Customer Stories
            </h3>
            {companyVideos.map((video, index) => (
              <div 
                key={video.id}
                onClick={() => setActiveVideo(index)}
                className={`flex items-start space-x-3 p-3 rounded-lg cursor-pointer transition-colors ${
                  activeVideo === index ? 'bg-purple-100' : 'hover:bg-gray-100'
                }`}
              >
                <div className="relative flex-shrink-0 w-24 h-16 rounded-md overflow-hidden">
                  <img 
                    src={video.thumbnail} 
                    alt={video.title}
                    className="w-full h-full object-cover"
                    onError={(e) => {
                      e.currentTarget.src = video.fallbackThumbnail;
                    }}
                  />
                  {activeVideo !== index && (
                    <div className="absolute inset-0 flex items-center justify-center bg-black bg-opacity-30">
                      <Play className="w-6 h-6 text-white" />
                    </div>
                  )}
                </div>
                <div className="flex-1">
                  <h4 className={`text-sm font-medium ${
                    activeVideo === index ? 'text-purple-700' : 'text-slate-900'
                  }`}>
                    {video.title}
                  </h4>
                  <p className="text-xs text-slate-500">
                    {video.company}
                  </p>
                </div>
              </div>
            ))}
            <Button variant="outline" className="w-full mt-4 border-purple-600 text-purple-600 hover:bg-purple-50">
              View all customer stories <ArrowRight className="ml-2 w-4 h-4" />
            </Button>
          </div>
        </div>

        {/* Logo cloud */}
        <div className="mt-16">
          <h3 className="text-center text-lg font-medium text-slate-700 mb-8">
            Trusted by over 750,000 companies worldwide
          </h3>
          <div className="flex flex-wrap justify-center items-center gap-8 md:gap-12 opacity-70">
            {['Airbnb', 'NASA', 'Uber', 'Target', 'BBC', 'Lyft', 'Oracle', 'Shopify'].map((company, index) => (
              <motion.div
                key={index}
                initial={{ opacity: 0 }}
                whileInView={{ opacity: 1 }}
                viewport={{ once: true }}
                transition={{ duration: 0.5, delay: index * 0.1 }}
                className="h-8"
              >
                <div className="text-slate-400 font-bold text-xl">{company}</div>
              </motion.div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
};

export default CompaniesSection;
