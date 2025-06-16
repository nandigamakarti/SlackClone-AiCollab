import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { Button } from '@/components/ui/button';
import { Check, ArrowRight } from 'lucide-react';

const SubscriptionSection: React.FC = () => {
  const [billingPeriod, setBillingPeriod] = useState<'monthly' | 'annual'>('annual');
  
  const plans = [
    {
      name: "Free",
      description: "For small teams trying out Slack for an unlimited period",
      price: {
        monthly: "$0",
        annual: "$0",
      },
      features: [
        "Access to 90 days of message history",
        "10 integrations with other apps",
        "1-to-1 video calls between teammates",
        "Basic AI features",
      ],
      cta: "Get started",
      highlight: false,
    },
    {
      name: "Pro",
      description: "For small and medium-sized businesses",
      price: {
        monthly: "$8.75",
        annual: "$7.25",
      },
      period: "per person, per month",
      features: [
        "Unlimited message history",
        "Unlimited integrations",
        "Group video calls with screen sharing",
        "Advanced AI features and agents",
        "Custom user groups",
      ],
      cta: "Try for free",
      highlight: true,
    },
    {
      name: "Business+",
      description: "For larger businesses or those in regulated industries",
      price: {
        monthly: "$15",
        annual: "$12.50",
      },
      period: "per person, per month",
      features: [
        "Everything in Pro",
        "Advanced security features",
        "Compliance exports for all messages",
        "24/7 support with 4-hour response time",
        "Enterprise-grade AI capabilities",
      ],
      cta: "Talk to sales",
      highlight: false,
    },
    {
      name: "Enterprise Grid",
      description: "For the largest companies with the most demanding requirements",
      price: {
        monthly: "Contact sales",
        annual: "Contact sales",
      },
      features: [
        "Everything in Business+",
        "Unlimited workspaces",
        "Enterprise-wide collaboration",
        "Centralized administration",
        "Enterprise key management",
        "Custom AI agent development",
      ],
      cta: "Contact sales",
      highlight: false,
    },
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
            There's a subscription for every kind of team.
          </h2>
          <p className="text-lg text-slate-700 mb-8">
            Choose the plan that suits your team's needs, from small startups to large enterprises.
          </p>
          
          {/* Billing toggle */}
          <div className="inline-flex items-center bg-gray-100 p-1 rounded-lg mb-8">
            <button
              onClick={() => setBillingPeriod('monthly')}
              className={`px-4 py-2 rounded-md text-sm font-medium transition-colors ${
                billingPeriod === 'monthly' 
                  ? 'bg-white text-purple-600 shadow-sm' 
                  : 'text-slate-600 hover:text-slate-900'
              }`}
            >
              Monthly billing
            </button>
            <button
              onClick={() => setBillingPeriod('annual')}
              className={`px-4 py-2 rounded-md text-sm font-medium transition-colors ${
                billingPeriod === 'annual' 
                  ? 'bg-white text-purple-600 shadow-sm' 
                  : 'text-slate-600 hover:text-slate-900'
              }`}
            >
              Annual billing
              <span className="ml-1 text-xs text-green-600 font-normal">Save 20%</span>
            </button>
          </div>
        </motion.div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          {plans.map((plan, index) => (
            <motion.div
              key={index}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.5, delay: index * 0.1 }}
              className={`rounded-xl p-6 ${
                plan.highlight 
                  ? 'border-2 border-purple-600 shadow-lg' 
                  : 'border border-gray-200 shadow-sm'
              }`}
            >
              {plan.highlight && (
                <div className="bg-purple-600 text-white text-xs font-semibold px-3 py-1 rounded-full inline-block mb-4">
                  Most popular
                </div>
              )}
              <h3 className="text-xl font-bold text-slate-900 mb-2">
                {plan.name}
              </h3>
              <p className="text-sm text-slate-600 mb-4 h-12">
                {plan.description}
              </p>
              <div className="mb-6">
                <div className="text-3xl font-bold text-slate-900">
                  {plan.price[billingPeriod]}
                </div>
                {plan.period && (
                  <div className="text-sm text-slate-600">
                    {plan.period}
                  </div>
                )}
              </div>
              <Button 
                className={`w-full mb-6 ${
                  plan.highlight 
                    ? 'bg-purple-600 hover:bg-purple-700 text-white' 
                    : 'bg-white border border-purple-600 text-purple-600 hover:bg-purple-50'
                }`}
              >
                {plan.cta}
              </Button>
              <ul className="space-y-3">
                {plan.features.map((feature, featureIndex) => (
                  <li key={featureIndex} className="flex items-start text-sm">
                    <div className="mr-2 mt-1 text-green-500 flex-shrink-0">
                      <Check className="h-4 w-4" />
                    </div>
                    <span className="text-slate-700">{feature}</span>
                  </li>
                ))}
              </ul>
            </motion.div>
          ))}
        </div>
        
        <div className="mt-12 text-center">
          <Button variant="link" className="text-purple-600 hover:text-purple-700">
            Compare all features <ArrowRight className="ml-1 h-4 w-4" />
          </Button>
        </div>
      </div>
    </section>
  );
};

export default SubscriptionSection;
