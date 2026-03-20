// eslint-disable-next-line no-unused-vars
import { motion } from 'motion/react';
import { useNavigate } from 'react-router-dom';
import { CheckCircle, ArrowRight } from 'lucide-react';
import { TruckIcon, MapPinIcon, CheckCircleIcon, CubeIcon } from "@heroicons/react/24/solid";

const steps = [
  {
    number: '01',
    title: 'Create Your Shipment',
    description:
      'Enter package details, pickup and delivery addresses through our intuitive dashboard.',
    icon: CubeIcon,
  },
  {
    number: '02',
    title: 'We Pick It Up',
    description:
      'Our delivery partner arrives at your location to collect the package with proper documentation.',
    icon: TruckIcon,
  },
  {
    number: '03',
    title: 'Track in Real-Time',
    description:
      'Monitor your shipment journey with live GPS tracking and receive instant status updates.',
    icon: MapPinIcon,
  },
  {
    number: '04',
    title: 'Delivered Successfully',
    description:
      'Your package reaches its destination on time with proof of delivery and customer signature.',
    icon: CheckCircleIcon,
  },
];

export function Statistic() {
  const navigate = useNavigate()
  return (
    <section className="py-24 bg-white relative overflow-hidden">
      {/* Background Decoration */}
      <div className="absolute inset-0 bg-gradient-to-b from-blue-50/50 to-transparent"></div>

      <div className="relative mx-auto max-w-7xl px-6 lg:px-8">
        {/* Section Header */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
          className="text-center mb-16"
        >
          <span className="inline-block px-4 py-2 bg-purple-100 text-purple-700 rounded-full text-sm font-semibold mb-4">
            How It Works
          </span>
          <h2 className="text-4xl lg:text-5xl font-bold text-gray-900 mb-4">
            Ship in{' '}
            <span className="bg-gradient-to-r from-blue-800 to-purple-500 bg-clip-text text-transparent">
              4 Simple Steps
            </span>
          </h2>
          <p className="text-xl text-gray-600 max-w-3xl mx-auto">
            From pickup to delivery, we make shipping effortless. Get started in minutes with our
            streamlined process.
          </p>
        </motion.div>

        {/* Steps */}
        <div className="relative">
          {/* Connection Line */}
          <div className="hidden lg:block absolute top-32 left-0 right-0 h-0.5 bg-gradient-to-r from-blue-200 via-purple-200 to-blue-200"></div>

          <div className="grid lg:grid-cols-4 gap-8 lg:gap-6">
            {steps.map((step, index) => (
              <motion.div
                key={step.number}
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.5, delay: index * 0.15 }}
                className="relative"
              >
                {/* Card */}
                <div className="bg-white rounded-2xl p-8 shadow-lg border border-gray-200 hover:shadow-2xl transition-all duration-300 hover:-translate-y-2 group">
                  {/* Number Badge */}
                  <div className="relative mb-6">
                    <div className="w-20 h-20 mx-auto rounded-full bg-gradient-to-br from-blue-600 to-purple-600 flex items-center justify-center shadow-lg relative z-10">
                      <step.icon className="w-8 h-8 text-white" />
                    </div>
                    <div className="absolute top-0 left-1/2 -translate-x-1/2 -translate-y-2 w-12 h-12 rounded-full bg-white border-4 border-blue-600 flex items-center justify-center font-bold text-blue-600 text-sm">
                      {step.number}
                    </div>
                  </div>

                  {/* Content */}
                  <h3 className="text-xl font-bold text-gray-900 mb-3 text-center group-hover:text-blue-600 transition-colors">
                    {step.title}
                  </h3>
                  <p className="text-gray-600 text-center leading-relaxed">{step.description}</p>

                </div>
              </motion.div>
            ))}
          </div>
        </div>

        {/* CTA */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6, delay: 0.4 }}
          className="mt-16 text-center"
        >
          <button className="group px-8 py-4 bg-gradient-to-r from-blue-600 to-purple-600 text-white rounded-xl hover:from-blue-700 hover:to-purple-700 transition-all shadow-2xl shadow-blue-600/30 hover:shadow-blue-600/50 inline-flex items-center gap-2 font-semibold text-lg"
            onClick={() => navigate('/login')}
          >
            Get Started Now
            <ArrowRight className="w-5 h-5 group-hover:translate-x-1 transition-transform" />
          </button>
        </motion.div>
      </div>
    </section>
  );
}
