import React from 'react';
import { motion } from 'framer-motion';
import { Button } from '@/components/ui/button';
import { ArrowRight, Bot, Zap, Shield, Sparkles } from 'lucide-react';
import ImagePlaceholder from '../components/ImagePlaceholder';

const AIAgentsSection: React.FC = () => {
  const fadeInUpVariant = {
    hidden: { opacity: 0, y: 20 },
    visible: (i: number) => ({
      opacity: 1,
      y: 0,
      transition: {
        delay: 0.1 * i,
        duration: 0.5,
      }
    })
  };

  const agentCards = [
    {
      icon: <Bot className="w-8 h-8 text-purple-600" />,
      title: "Sales Assistant",
      description: "Update sales proposals, track leads, and manage your pipeline with ease.",
      color: "bg-purple-100"
    },
    {
      icon: <Zap className="w-8 h-8 text-blue-600" />,
      title: "IT Helper",
      description: "Resolve IT issues, reset passwords, and manage access requests automatically.",
      color: "bg-blue-100"
    },
    {
      icon: <Shield className="w-8 h-8 text-green-600" />,
      title: "HR Buddy",
      description: "Set reminders for team events, answer policy questions, and manage time off.",
      color: "bg-green-100"
    },
    {
      icon: <Sparkles className="w-8 h-8 text-yellow-600" />,
      title: "Creative Assistant",
      description: "Generate ideas, summarize discussions, and help with content creation.",
      color: "bg-yellow-100"
    }
  ];

  return (
    <section className="py-20 bg-white">
      <div className="container mx-auto px-4 md:px-6">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.5 }}
          className="text-center max-w-3xl mx-auto mb-16"
        >
          <h2 className="text-3xl md:text-4xl font-bold text-slate-900 mb-4">
            There's an AI agent for everyone in SlackAI.
          </h2>
          <p className="text-lg text-slate-700">
            Update sales proposals, set team reminders, resolve IT issues and so much more with always-on, action-taking AI agents in SlackAI.
          </p>
        </motion.div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-12">
          {agentCards.map((card, index) => (
            <motion.div
              key={index}
              custom={index}
              variants={fadeInUpVariant}
              initial="hidden"
              whileInView="visible"
              viewport={{ once: true }}
              className={`${card.color} rounded-xl p-6 shadow-sm hover:shadow-md transition-shadow`}
            >
              <div className="mb-4">
                {card.icon}
              </div>
              <h3 className="text-xl font-semibold text-slate-900 mb-2">
                {card.title}
              </h3>
              <p className="text-slate-700">
                {card.description}
              </p>
            </motion.div>
          ))}
        </div>

        <div className="flex flex-col md:flex-row items-center justify-center gap-6">
          <motion.div
            initial={{ opacity: 0, scale: 0.95 }}
            whileInView={{ opacity: 1, scale: 1 }}
            viewport={{ once: true }}
            transition={{ duration: 0.5 }}
            className="w-full md:w-1/2 lg:w-2/3 relative"
          >
            <div className="rounded-xl overflow-hidden shadow-xl">
              <ImagePlaceholder 
                imageType="feature"
                text="Slack AI in action"
                height="350px"
                className="w-full"
              />
            </div>
            
            {/* Animated indicators */}
            <div className="absolute top-1/4 right-1/4 w-16 h-16 bg-purple-500 rounded-full opacity-20 animate-pulse"></div>
            <div className="absolute bottom-1/3 left-1/3 w-12 h-12 bg-blue-500 rounded-full opacity-20 animate-pulse"></div>
          </motion.div>
          
          <motion.div
            initial={{ opacity: 0, x: 20 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.5, delay: 0.2 }}
            className="w-full md:w-1/2 lg:w-1/3 p-6"
          >
            <h3 className="text-2xl font-bold text-slate-900 mb-4">
              Powered by advanced AI
            </h3>
            <p className="text-slate-700 mb-6">
              Slack AI agents can understand context, learn from interactions, and take actions on your behalf. They integrate seamlessly with your existing workflows and tools.
            </p>
            <ul className="space-y-3 mb-6">
              {[
                "Automate routine tasks",
                "Answer questions using your company knowledge",
                "Connect to your business systems",
                "Learn from your team's interactions"
              ].map((item, index) => (
                <li key={index} className="flex items-start">
                  <div className="mr-2 mt-1 text-green-500">
                    <svg width="16" height="16" viewBox="0 0 16 16" fill="none" xmlns="http://www.w3.org/2000/svg">
                      <path d="M13.3334 4L6.00008 11.3333L2.66675 8" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                    </svg>
                  </div>
                  <span>{item}</span>
                </li>
              ))}
            </ul>
            <Button className="bg-purple-600 hover:bg-purple-700 text-white">
              Learn more about AI agents <ArrowRight className="ml-2 w-4 h-4" />
            </Button>
          </motion.div>
        </div>
      </div>
    </section>
  );
};

export default AIAgentsSection;
