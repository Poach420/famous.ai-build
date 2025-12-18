import React from 'react';
import { Button } from '@/components/ui/Button';
import { Card, CardContent } from '@/components/ui/Card';
import { Badge } from '@/components/ui/Badge';

interface PricingPageProps {
  onGetStarted: () => void;
}

const plans = [
  {
    id: 'free',
    name: 'Free',
    price: 0,
    description: 'Perfect for trying out Digital Ninja',
    features: [
      '3 Apps',
      '5 AI Generations/month',
      'Community Support',
      'Basic Templates',
      'Manual Deployment'
    ],
    limits: {
      apps: 3,
      generations: 5,
      deployments: 1
    },
    cta: 'Get Started',
    popular: false
  },
  {
    id: 'pro',
    name: 'Pro',
    price: 29,
    description: 'For professional developers and small teams',
    features: [
      'Unlimited Apps',
      '100 AI Generations/month',
      'Priority Support',
      'Premium Templates',
      'One-Click Deployment',
      'Custom Domains',
      'Analytics Dashboard',
      'Team Collaboration (3 seats)'
    ],
    limits: {
      apps: -1,
      generations: 100,
      deployments: -1
    },
    cta: 'Start Pro Trial',
    popular: true
  },
  {
    id: 'enterprise',
    name: 'Enterprise',
    price: 99,
    description: 'For large teams and organizations',
    features: [
      'Everything in Pro',
      'Unlimited AI Generations',
      'Dedicated Support',
      'Custom Integrations',
      'SSO/SAML',
      'Audit Logs',
      'SLA Guarantee',
      'Unlimited Team Seats',
      'On-premise Option'
    ],
    limits: {
      apps: -1,
      generations: -1,
      deployments: -1
    },
    cta: 'Contact Sales',
    popular: false
  }
];

const faqs = [
  {
    question: 'Can I cancel my subscription anytime?',
    answer: 'Yes, you can cancel your subscription at any time. Your access will continue until the end of your billing period.'
  },
  {
    question: 'What happens to my apps if I downgrade?',
    answer: 'Your existing apps remain intact. You just won\'t be able to create new apps beyond your plan\'s limit until you upgrade again.'
  },
  {
    question: 'Do you offer refunds?',
    answer: 'We offer a 14-day money-back guarantee for all paid plans. If you\'re not satisfied, contact support for a full refund.'
  },
  {
    question: 'Can I export my code?',
    answer: 'Absolutely! All generated code is yours. You can export and deploy it anywhere, with no lock-in whatsoever.'
  },
  {
    question: 'What AI model do you use?',
    answer: 'We use GPT-4 for code generation, ensuring high-quality, production-ready React components with best practices.'
  },
  {
    question: 'Do you offer custom enterprise solutions?',
    answer: 'Yes! Contact our sales team for custom pricing, on-premise deployment, and dedicated support options.'
  }
];

export function PricingPage({ onGetStarted }: PricingPageProps) {
  return (
    <div className="min-h-screen pt-24 pb-12">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <div className="text-center mb-16">
          <h1 className="text-4xl md:text-5xl font-bold text-white mb-4">
            Simple, Transparent Pricing
          </h1>
          <p className="text-xl text-slate-400 max-w-2xl mx-auto">
            Choose the plan that fits your needs. All plans include core features with no hidden fees.
          </p>
        </div>

        {/* Pricing Cards */}
        <div className="grid md:grid-cols-3 gap-8 mb-20">
          {plans.map((plan) => (
            <Card 
              key={plan.id}
              className={`relative ${plan.popular ? 'border-indigo-500 shadow-lg shadow-indigo-500/20' : ''}`}
            >
              {plan.popular && (
                <div className="absolute -top-4 left-1/2 -translate-x-1/2">
                  <Badge variant="purple" className="px-4 py-1">Most Popular</Badge>
                </div>
              )}
              <CardContent className="pt-8">
                <div className="text-center mb-6">
                  <h3 className="text-2xl font-bold text-white mb-2">{plan.name}</h3>
                  <p className="text-slate-400 text-sm mb-4">{plan.description}</p>
                  <div className="flex items-baseline justify-center gap-1">
                    <span className="text-5xl font-bold text-white">
                      ${plan.price}
                    </span>
                    <span className="text-slate-400">/month</span>
                  </div>
                </div>

                <ul className="space-y-3 mb-8">
                  {plan.features.map((feature, index) => (
                    <li key={index} className="flex items-center gap-3 text-slate-300">
                      <svg className="w-5 h-5 text-emerald-400 flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                      </svg>
                      {feature}
                    </li>
                  ))}
                </ul>

                <Button 
                  className="w-full"
                  variant={plan.popular ? 'primary' : 'outline'}
                  onClick={onGetStarted}
                >
                  {plan.cta}
                </Button>
              </CardContent>
            </Card>
          ))}
        </div>

        {/* Feature Comparison */}
        <div className="mb-20">
          <h2 className="text-2xl font-bold text-white text-center mb-8">Feature Comparison</h2>
          <Card>
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead>
                  <tr className="border-b border-slate-700">
                    <th className="text-left p-4 text-slate-400 font-medium">Feature</th>
                    <th className="text-center p-4 text-slate-400 font-medium">Free</th>
                    <th className="text-center p-4 text-slate-400 font-medium">Pro</th>
                    <th className="text-center p-4 text-slate-400 font-medium">Enterprise</th>
                  </tr>
                </thead>
                <tbody>
                  {[
                    { feature: 'Number of Apps', free: '3', pro: 'Unlimited', enterprise: 'Unlimited' },
                    { feature: 'AI Generations', free: '5/month', pro: '100/month', enterprise: 'Unlimited' },
                    { feature: 'Deployments', free: '1', pro: 'Unlimited', enterprise: 'Unlimited' },
                    { feature: 'Custom Domains', free: false, pro: true, enterprise: true },
                    { feature: 'Team Collaboration', free: false, pro: '3 seats', enterprise: 'Unlimited' },
                    { feature: 'Priority Support', free: false, pro: true, enterprise: true },
                    { feature: 'Analytics', free: false, pro: true, enterprise: true },
                    { feature: 'SSO/SAML', free: false, pro: false, enterprise: true },
                    { feature: 'SLA Guarantee', free: false, pro: false, enterprise: true },
                    { feature: 'On-premise', free: false, pro: false, enterprise: true }
                  ].map((row, index) => (
                    <tr key={index} className="border-b border-slate-700/50">
                      <td className="p-4 text-white">{row.feature}</td>
                      <td className="p-4 text-center">
                        {typeof row.free === 'boolean' ? (
                          row.free ? (
                            <svg className="w-5 h-5 text-emerald-400 mx-auto" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                            </svg>
                          ) : (
                            <svg className="w-5 h-5 text-slate-600 mx-auto" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                            </svg>
                          )
                        ) : (
                          <span className="text-slate-300">{row.free}</span>
                        )}
                      </td>
                      <td className="p-4 text-center">
                        {typeof row.pro === 'boolean' ? (
                          row.pro ? (
                            <svg className="w-5 h-5 text-emerald-400 mx-auto" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                            </svg>
                          ) : (
                            <svg className="w-5 h-5 text-slate-600 mx-auto" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                            </svg>
                          )
                        ) : (
                          <span className="text-slate-300">{row.pro}</span>
                        )}
                      </td>
                      <td className="p-4 text-center">
                        {typeof row.enterprise === 'boolean' ? (
                          row.enterprise ? (
                            <svg className="w-5 h-5 text-emerald-400 mx-auto" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                            </svg>
                          ) : (
                            <svg className="w-5 h-5 text-slate-600 mx-auto" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                            </svg>
                          )
                        ) : (
                          <span className="text-slate-300">{row.enterprise}</span>
                        )}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </Card>
        </div>

        {/* FAQs */}
        <div>
          <h2 className="text-2xl font-bold text-white text-center mb-8">Frequently Asked Questions</h2>
          <div className="grid md:grid-cols-2 gap-6">
            {faqs.map((faq, index) => (
              <Card key={index}>
                <CardContent>
                  <h3 className="text-lg font-semibold text-white mb-2">{faq.question}</h3>
                  <p className="text-slate-400">{faq.answer}</p>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>

        {/* CTA */}
        <div className="text-center mt-16">
          <h2 className="text-2xl font-bold text-white mb-4">Ready to get started?</h2>
          <p className="text-slate-400 mb-6">Start building for free. No credit card required.</p>
          <Button size="lg" onClick={onGetStarted}>
            Start Building Free
          </Button>
        </div>
      </div>
    </div>
  );
}
