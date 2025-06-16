import React from 'react';
import { motion } from 'framer-motion';
import { Button } from '@/components/ui/button';
import { ArrowRight, BookOpen, Video, FileText, MessageSquare } from 'lucide-react';
import ImagePlaceholder from '../components/ImagePlaceholder';

const ResourcesSection: React.FC = () => {
  const resources = [
    {
      icon: <BookOpen className="h-8 w-8 text-purple-600" />,
      title: "Ready for the future of AI in SlackAI?",
      description: "Learn how AI is transforming work in SlackAI and how you can leverage it for your team.",
      link: "#",
      color: "bg-purple-50"
    },
    {
      icon: <Video className="h-8 w-8 text-blue-600" />,
      title: "Unlock agentic productivity for every employee",
      description: "See how AI agents can automate tasks and boost productivity across your organization.",
      link: "#",
      color: "bg-blue-50"
    },
    {
      icon: <FileText className="h-8 w-8 text-green-600" />,
      title: "Agentforce 2.0: Agentforce arrives in SlackAI",
      description: "Discover the next generation of AI assistance with Agentforce integration.",
      link: "#",
      color: "bg-green-50"
    },
    {
      icon: <MessageSquare className="h-8 w-8 text-yellow-600" />,
      title: "Top SlackAI tips to boost productivity",
      description: "Master these essential SlackAI features to streamline your workflow and save time.",
      link: "#",
      color: "bg-yellow-50"
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
            Your SlackAI deep dive starts here.
          </h2>
          <p className="text-lg text-slate-700">
            Explore resources, guides, and best practices to get the most out of SlackAI.
          </p>
        </motion.div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-12">
          {resources.map((resource, index) => (
            <motion.div
              key={index}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.5, delay: index * 0.1 }}
              className={`${resource.color} rounded-xl p-6 shadow-sm hover:shadow-md transition-shadow`}
            >
              <div className="mb-4 overflow-hidden rounded-lg">
                <ImagePlaceholder 
                  imageType="resource"
                  text={resource.title}
                  height="200px"
                  className="w-full transition-transform hover:scale-105 duration-300"
                />
              </div>
              <h3 className="text-xl font-semibold text-slate-900 mb-2">
                {resource.title}
              </h3>
              <p className="text-slate-700 mb-4">
                {resource.description}
              </p>
              <a 
                href={resource.link} 
                className="inline-flex items-center text-purple-600 font-medium hover:text-purple-700"
              >
                Learn more <ArrowRight className="ml-1 h-4 w-4" />
              </a>
            </motion.div>
          ))}
        </div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.5 }}
          className="bg-white rounded-xl shadow-lg overflow-hidden"
        >
          <div className="flex flex-col lg:flex-row">
            <div className="w-full lg:w-1/2 p-8 lg:p-12">
              <h3 className="text-2xl font-bold text-slate-900 mb-4">
                See all that you can accomplish in Slack.
              </h3>
              <p className="text-slate-700 mb-6">
                Whether you're just getting started or looking to deepen your Slack expertise, we have resources to help you and your team succeed.
              </p>
              <div className="space-y-4 mb-8">
                {[
                  "Get started guides for new users",
                  "Advanced tips for power users",
                  "Admin resources for workspace management",
                  "Developer documentation for custom integrations"
                ].map((item, index) => (
                  <div key={index} className="flex items-start">
                    <div className="mr-2 mt-1 text-green-500">
                      <svg width="16" height="16" viewBox="0 0 16 16" fill="none" xmlns="http://www.w3.org/2000/svg">
                        <path d="M13.3334 4L6.00008 11.3333L2.66675 8" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                      </svg>
                    </div>
                    <span className="text-slate-700">{item}</span>
                  </div>
                ))}
              </div>
              <div className="flex flex-col sm:flex-row gap-4">
                <Button className="bg-purple-600 hover:bg-purple-700 text-white">
                  Browse resources
                </Button>
                <Button variant="outline" className="border-purple-600 text-purple-600 hover:bg-purple-50">
                  Watch demos
                </Button>
              </div>
            </div>
            <div className="w-full lg:w-1/2 bg-purple-100 p-8 lg:p-0 flex items-center justify-center">
              <img 
                src="/images/slack-resources.png" 
                alt="Slack resources" 
                className="max-w-full h-auto max-h-96 object-contain"
                onError={(e) => {
                  e.currentTarget.src = 'https://a.slack-edge.com/8a9f6/marketing/img/homepage/e2e-prospects/animations/static/resources-ui.jpg';
                }}
              />
            </div>
          </div>
        </motion.div>
      </div>
    </section>
  );
};

export default ResourcesSection;
