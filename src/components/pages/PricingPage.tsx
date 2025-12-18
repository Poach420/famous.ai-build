import React, { useState } from 'react';
import { Button } from '@/components/ui/Button';
import { Card, CardContent } from '@/components/ui/Card';
import { Badge } from '@/components/ui/Badge';
import { useAuth } from '@/contexts/AuthContext';
import { useToast } from '@/components/ui/Toast';
import { supabase } from '@/lib/supabase';

interface PricingPageProps {
  onGetStarted: () => void;
}

const plans = [
  {
    id: 'free',
    name: 'Free',
    priceUSD: 0,
    priceZAR: 0,
    description: 'Perfect for trying out Digital Ninja',
    features: [
      '3 Apps',
      '5 AI Generations/month',
      'Community Support',
      'Basic Templates',
      'Manual Deployment'
    ],
    cta: 'Get Started',
    popular: false
  },
  {
    id: 'pro',
    name: 'Pro',
    priceUSD: 29,
    priceZAR: 299,
    description: 'For professional developers and small teams',
    features: [
      'Unlimited Apps',
      '100 AI Generations/month',
      'Priority Support',
      'Premium Templates',
      'One-Click Deployment',
      'Custom Domains',
      'Analytics Dashboard',
      'Team Collaboration (3 seats)',
      'Version History'
    ],
    cta: 'Upgrade to Pro',
    popular: true
  },
  {
    id: 'enterprise',
    name: 'Enterprise',
    priceUSD: 99,
    priceZAR: 999,
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
    answer: 'We use Gemini 2.5 Flash for code generation, ensuring high-quality, production-ready React components with best practices.'
  },
  {
    question: 'What payment methods do you accept?',
    answer: 'We accept PayFast (for South African users), credit/debit cards, and EFT payments. All payments are processed securely.'
  }
];

export function PricingPage({ onGetStarted }: PricingPageProps) {
  const { user, isAuthenticated, accessToken, updatePlan } = useAuth();
  const { addToast } = useToast();
  const [currency, setCurrency] = useState<'USD' | 'ZAR'>('ZAR');
  const [isProcessing, setIsProcessing] = useState<string | null>(null);
  const [showPaymentModal, setShowPaymentModal] = useState<string | null>(null);

  const handleSelectPlan = async (planId: string) => {
    if (!isAuthenticated) {
      onGetStarted();
      return;
    }

    if (planId === 'free') {
      addToast({ type: 'info', message: 'You are already on the Free plan' });
      return;
    }

    if (planId === 'enterprise') {
      addToast({ type: 'info', message: 'Please contact sales@digitalninja.app for Enterprise plans' });
      return;
    }

    setShowPaymentModal(planId);
  };

  const handlePayFastPayment = async (planId: string) => {
    setIsProcessing(planId);
    
    try {
      const plan = plans.find(p => p.id === planId);
      if (!plan) throw new Error('Plan not found');

      const { data, error } = await supabase.functions.invoke('payfast-payment', {
        body: {
          amount: plan.priceZAR,
          plan: planId,
          item_name: `Digital Ninja ${plan.name} Plan`,
          return_url: window.location.origin + '/dashboard?payment=success',
          cancel_url: window.location.origin + '/pricing?payment=cancelled',
          email_address: user?.email,
          name_first: user?.name?.split(' ')[0] || 'Customer'
        },
        headers: accessToken ? { Authorization: `Bearer ${accessToken}` } : {}
      });

      if (error) throw error;

      if (data?.success && data?.payfast_url && data?.payment_data) {
        // Create a form and submit to PayFast
        const form = document.createElement('form');
        form.method = 'POST';
        form.action = data.payfast_url;
        form.target = '_blank';

        Object.entries(data.payment_data).forEach(([key, value]) => {
          const input = document.createElement('input');
          input.type = 'hidden';
          input.name = key;
          input.value = value as string;
          form.appendChild(input);
        });

        document.body.appendChild(form);
        form.submit();
        document.body.removeChild(form);

        addToast({ type: 'success', message: 'Redirecting to PayFast...' });
        setShowPaymentModal(null);
      }
    } catch (err: any) {
      console.error('Payment error:', err);
      addToast({ type: 'error', message: err.message || 'Payment failed' });
    } finally {
      setIsProcessing(null);
    }
  };

  const handleSimulatePayment = async (planId: string) => {
    setIsProcessing(planId);
    
    try {
      const { data, error } = await supabase.functions.invoke('payfast-payment/simulate', {
        body: { plan: planId },
        headers: accessToken ? { Authorization: `Bearer ${accessToken}` } : {}
      });

      if (error) throw error;

      if (data?.success) {
        updatePlan(planId as 'free' | 'pro' | 'enterprise');
        addToast({ type: 'success', message: `Successfully upgraded to ${planId} plan!` });
        setShowPaymentModal(null);
      }
    } catch (err: any) {
      console.error('Simulation error:', err);
      addToast({ type: 'error', message: err.message || 'Payment simulation failed' });
    } finally {
      setIsProcessing(null);
    }
  };

  const getPrice = (plan: typeof plans[0]) => {
    if (currency === 'ZAR') {
      return `R${plan.priceZAR}`;
    }
    return `$${plan.priceUSD}`;
  };

  return (
    <div className="min-h-screen pt-24 pb-12">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <div className="text-center mb-12">
          <h1 className="text-4xl md:text-5xl font-bold text-white mb-4">
            Simple, Transparent Pricing
          </h1>
          <p className="text-xl text-slate-400 max-w-2xl mx-auto mb-6">
            Choose the plan that fits your needs. All plans include core features with no hidden fees.
          </p>
          
          {/* Currency Toggle */}
          <div className="inline-flex items-center gap-2 bg-slate-800 rounded-lg p-1">
            <button
              onClick={() => setCurrency('ZAR')}
              className={`px-4 py-2 rounded-md text-sm font-medium transition-colors ${
                currency === 'ZAR' 
                  ? 'bg-indigo-600 text-white' 
                  : 'text-slate-400 hover:text-white'
              }`}
            >
              ZAR (South Africa)
            </button>
            <button
              onClick={() => setCurrency('USD')}
              className={`px-4 py-2 rounded-md text-sm font-medium transition-colors ${
                currency === 'USD' 
                  ? 'bg-indigo-600 text-white' 
                  : 'text-slate-400 hover:text-white'
              }`}
            >
              USD
            </button>
          </div>
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
                      {getPrice(plan)}
                    </span>
                    <span className="text-slate-400">/month</span>
                  </div>
                  {currency === 'ZAR' && plan.priceZAR > 0 && (
                    <p className="text-xs text-slate-500 mt-1">
                      Billed via PayFast
                    </p>
                  )}
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
                  onClick={() => handleSelectPlan(plan.id)}
                  disabled={user?.plan === plan.id}
                >
                  {user?.plan === plan.id ? 'Current Plan' : plan.cta}
                </Button>
              </CardContent>
            </Card>
          ))}
        </div>

        {/* Payment Methods */}
        <div className="mb-20">
          <h2 className="text-2xl font-bold text-white text-center mb-8">Accepted Payment Methods</h2>
          <div className="grid md:grid-cols-4 gap-6">
            <Card>
              <CardContent className="text-center py-6">
                <div className="w-12 h-12 bg-emerald-500/20 rounded-xl flex items-center justify-center mx-auto mb-3">
                  <svg className="w-6 h-6 text-emerald-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 9V7a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2m2 4h10a2 2 0 002-2v-6a2 2 0 00-2-2H9a2 2 0 00-2 2v6a2 2 0 002 2zm7-5a2 2 0 11-4 0 2 2 0 014 0z" />
                  </svg>
                </div>
                <h3 className="text-white font-semibold mb-1">PayFast</h3>
                <p className="text-sm text-slate-400">South African payments</p>
              </CardContent>
            </Card>
            <Card>
              <CardContent className="text-center py-6">
                <div className="w-12 h-12 bg-blue-500/20 rounded-xl flex items-center justify-center mx-auto mb-3">
                  <svg className="w-6 h-6 text-blue-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 10h18M7 15h1m4 0h1m-7 4h12a3 3 0 003-3V8a3 3 0 00-3-3H6a3 3 0 00-3 3v8a3 3 0 003 3z" />
                  </svg>
                </div>
                <h3 className="text-white font-semibold mb-1">Credit/Debit Card</h3>
                <p className="text-sm text-slate-400">Visa, Mastercard</p>
              </CardContent>
            </Card>
            <Card>
              <CardContent className="text-center py-6">
                <div className="w-12 h-12 bg-purple-500/20 rounded-xl flex items-center justify-center mx-auto mb-3">
                  <svg className="w-6 h-6 text-purple-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 14v3m4-3v3m4-3v3M3 21h18M3 10h18M3 7l9-4 9 4M4 10h16v11H4V10z" />
                  </svg>
                </div>
                <h3 className="text-white font-semibold mb-1">EFT</h3>
                <p className="text-sm text-slate-400">Bank transfer</p>
              </CardContent>
            </Card>
            <Card>
              <CardContent className="text-center py-6">
                <div className="w-12 h-12 bg-indigo-500/20 rounded-xl flex items-center justify-center mx-auto mb-3">
                  <svg className="w-6 h-6 text-indigo-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z" />
                  </svg>
                </div>
                <h3 className="text-white font-semibold mb-1">Secure</h3>
                <p className="text-sm text-slate-400">256-bit encryption</p>
              </CardContent>
            </Card>
          </div>
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
                    { feature: 'Version History', free: false, pro: true, enterprise: true },
                    { feature: 'Team Collaboration', free: false, pro: '3 seats', enterprise: 'Unlimited' },
                    { feature: 'Priority Support', free: false, pro: true, enterprise: true },
                    { feature: 'Custom Domains', free: false, pro: true, enterprise: true },
                    { feature: 'SSO/SAML', free: false, pro: false, enterprise: true },
                    { feature: 'SLA Guarantee', free: false, pro: false, enterprise: true }
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

      {/* Payment Modal */}
      {showPaymentModal && (
        <div className="fixed inset-0 bg-black/60 backdrop-blur-sm flex items-center justify-center z-50 p-4">
          <div className="bg-slate-900 border border-slate-700 rounded-2xl p-6 w-full max-w-md">
            <h3 className="text-xl font-bold text-white mb-4">
              Upgrade to {plans.find(p => p.id === showPaymentModal)?.name}
            </h3>
            
            <div className="bg-slate-800 rounded-lg p-4 mb-6">
              <div className="flex justify-between items-center mb-2">
                <span className="text-slate-400">Plan</span>
                <span className="text-white font-medium">
                  {plans.find(p => p.id === showPaymentModal)?.name}
                </span>
              </div>
              <div className="flex justify-between items-center">
                <span className="text-slate-400">Amount</span>
                <span className="text-white font-bold text-xl">
                  R{plans.find(p => p.id === showPaymentModal)?.priceZAR}/month
                </span>
              </div>
            </div>

            <div className="space-y-3 mb-6">
              <Button 
                className="w-full"
                onClick={() => handlePayFastPayment(showPaymentModal)}
                isLoading={isProcessing === showPaymentModal}
              >
                <svg className="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 9V7a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2m2 4h10a2 2 0 002-2v-6a2 2 0 00-2-2H9a2 2 0 00-2 2v6a2 2 0 002 2zm7-5a2 2 0 11-4 0 2 2 0 014 0z" />
                </svg>
                Pay with PayFast
              </Button>
              
              <div className="relative">
                <div className="absolute inset-0 flex items-center">
                  <div className="w-full border-t border-slate-700"></div>
                </div>
                <div className="relative flex justify-center text-sm">
                  <span className="px-2 bg-slate-900 text-slate-500">or for demo</span>
                </div>
              </div>

              <Button 
                variant="outline"
                className="w-full"
                onClick={() => handleSimulatePayment(showPaymentModal)}
                isLoading={isProcessing === showPaymentModal}
              >
                Simulate Payment (Demo)
              </Button>
            </div>

            <p className="text-xs text-slate-500 text-center mb-4">
              Payments are processed securely via PayFast. Your card details are never stored on our servers.
            </p>

            <Button 
              variant="ghost" 
              className="w-full"
              onClick={() => setShowPaymentModal(null)}
            >
              Cancel
            </Button>
          </div>
        </div>
      )}
    </div>
  );
}
