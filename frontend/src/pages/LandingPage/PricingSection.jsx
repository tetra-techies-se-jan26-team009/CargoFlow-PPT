import { motion as Motion } from 'motion/react';
import { Check, X, ArrowRight, Zap } from 'lucide-react';

const plans = [
  {
    name: 'Starter',
    price: '₹999',
    period: '/month',
    description: 'Perfect for small businesses and startups',
    popular: false,
    features: [
      { text: '100 shipments per month', included: true },
      { text: 'Real-time tracking', included: true },
      { text: 'Email support', included: true },
      { text: 'Basic analytics', included: true },
      { text: 'API access', included: false },
      { text: 'Dedicated account manager', included: false },
      { text: 'Priority support', included: false },
      { text: 'Custom integrations', included: false },
    ],
  },
  {
    name: 'Professional',
    price: '₹2,999',
    period: '/month',
    description: 'For growing businesses with higher volume',
    popular: true,
    features: [
      { text: '500 shipments per month', included: true },
      { text: 'Real-time tracking', included: true },
      { text: 'Priority email & chat support', included: true },
      { text: 'Advanced analytics', included: true },
      { text: 'API access', included: true },
      { text: 'Dedicated account manager', included: false },
      { text: '24/7 support', included: false },
      { text: 'Custom integrations', included: false },
    ],
  },
  {
    name: 'Enterprise',
    price: 'Custom',
    period: '',
    description: 'Tailored solutions for large organizations',
    popular: false,
    features: [
      { text: 'Unlimited shipments', included: true },
      { text: 'Real-time tracking', included: true },
      { text: '24/7 Priority support', included: true },
      { text: 'Custom analytics & reports', included: true },
      { text: 'Full API access', included: true },
      { text: 'Dedicated account manager', included: true },
      { text: 'SLA guarantees', included: true },
      { text: 'Custom integrations', included: true },
    ],
  },
];

export function PricingSection() {
  return (
    <section className="py-24 bg-white relative overflow-hidden">
      {/* Background Pattern */}
      <div className="absolute inset-0 bg-grid-pattern opacity-5"></div>

      <div className="relative mx-auto max-w-7xl px-6 lg:px-8">
        {/* Section Header */}
        <Motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
          className="text-center mb-16"
        >
          <span className="inline-block px-4 py-2 bg-green-100 text-green-700 rounded-full text-sm font-semibold mb-4">
            Pricing
          </span>
          <h2 className="text-4xl lg:text-5xl font-bold text-gray-900 mb-4">
            Simple,{' '}
            <span className="bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">
              Transparent Pricing
            </span>
          </h2>
          <p className="text-xl text-gray-600 max-w-3xl mx-auto">
            Choose the perfect plan for your business. All plans include core features with no
            hidden fees.
          </p>
        </Motion.div>

        {/* Pricing Cards */}
        <div className="grid lg:grid-cols-3 gap-8 max-w-6xl mx-auto">
          {plans.map((plan, index) => (
            <Motion.div
              key={plan.name}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.5, delay: index * 0.1 }}
              className={`relative rounded-3xl p-8 ${
                plan.popular
                  ? 'bg-gradient-to-b from-blue-600 to-purple-600 text-white shadow-2xl scale-105 lg:scale-110 z-10'
                  : 'bg-white border-2 border-gray-200'
              }`}
            >
              {/* Popular Badge */}
              {plan.popular && (
                <div className="absolute -top-4 left-1/2 -translate-x-1/2 px-6 py-2 bg-amber-400 text-gray-900 rounded-full text-sm font-bold shadow-lg flex items-center gap-2">
                  <Zap className="w-4 h-4" />
                  Most Popular
                </div>
              )}

              {/* Plan Name */}
              <div className="mb-6">
                <h3
                  className={`text-2xl font-bold mb-2 ${plan.popular ? 'text-white' : 'text-gray-900'}`}
                >
                  {plan.name}
                </h3>
                <p className={`text-sm ${plan.popular ? 'text-blue-100' : 'text-gray-600'}`}>
                  {plan.description}
                </p>
              </div>

              {/* Price */}
              <div className="mb-8">
                <div className="flex items-baseline gap-2">
                  <span
                    className={`text-5xl font-bold ${plan.popular ? 'text-white' : 'text-gray-900'}`}
                  >
                    {plan.price}
                  </span>
                  {plan.period && (
                    <span className={`text-lg ${plan.popular ? 'text-blue-100' : 'text-gray-600'}`}>
                      {plan.period}
                    </span>
                  )}
                </div>
              </div>

              {/* CTA Button */}
              <button
                className={`w-full py-4 rounded-xl font-semibold transition-all mb-8 flex items-center justify-center gap-2 group ${
                  plan.popular
                    ? 'bg-white text-blue-600 hover:bg-gray-100 shadow-lg'
                    : 'bg-gradient-to-r from-blue-600 to-purple-600 text-white hover:from-blue-700 hover:to-purple-700 shadow-lg shadow-blue-600/30'
                }`}
              >
                {plan.name === 'Enterprise' ? 'Contact Sales' : 'Get Started'}
                <ArrowRight className="w-5 h-5 group-hover:translate-x-1 transition-transform" />
              </button>

              {/* Features List */}
              <div className="space-y-4">
                {plan.features.map((feature, i) => (
                  <div key={i} className="flex items-start gap-3">
                    <div
                      className={`flex-shrink-0 w-5 h-5 rounded-full flex items-center justify-center ${
                        feature.included
                          ? plan.popular
                            ? 'bg-white/20'
                            : 'bg-green-100'
                          : 'bg-gray-100'
                      }`}
                    >
                      {feature.included ? (
                        <Check
                          className={`w-3.5 h-3.5 ${plan.popular ? 'text-white' : 'text-green-600'}`}
                        />
                      ) : (
                        <X className="w-3.5 h-3.5 text-gray-400" />
                      )}
                    </div>
                    <span
                      className={`text-sm ${
                        feature.included
                          ? plan.popular
                            ? 'text-white'
                            : 'text-gray-700'
                          : 'text-gray-400 line-through'
                      }`}
                    >
                      {feature.text}
                    </span>
                  </div>
                ))}
              </div>
            </Motion.div>
          ))}
        </div>

        {/* Additional Info */}
        <Motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6, delay: 0.3 }}
          className="mt-16 text-center"
        >
          <p className="text-gray-600 mb-4">
            All plans include 14-day free trial • No credit card required • Cancel anytime
          </p>
          <div className="flex flex-wrap justify-center gap-6 text-sm text-gray-600">
            <div className="flex items-center gap-2">
              <Check className="w-5 h-5 text-green-600" />
              <span>No setup fees</span>
            </div>
            <div className="flex items-center gap-2">
              <Check className="w-5 h-5 text-green-600" />
              <span>Cancel anytime</span>
            </div>
            <div className="flex items-center gap-2">
              <Check className="w-5 h-5 text-green-600" />
              <span>Money-back guarantee</span>
            </div>
          </div>
        </Motion.div>
      </div>

      <style jsx>{`
        .bg-grid-pattern {
          background-image: radial-gradient(circle, #e5e7eb 1px, transparent 1px);
          background-size: 30px 30px;
        }
      `}</style>
    </section>
  );
}
