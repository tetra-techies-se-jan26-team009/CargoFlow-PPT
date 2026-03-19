// import { ArrowPathIcon, CloudArrowUpIcon, FingerPrintIcon, LockClosedIcon } from '@heroicons/react/24/outline'

// const features = [
//     {
//         name: 'Push to deploy',
//         description:
//             'Morbi viverra dui mi arcu sed. Tellus semper adipiscing suspendisse semper morbi. Odio urna massa nunc massa.',
//         icon: CloudArrowUpIcon,
//     },
//     {
//         name: 'SSL certificates',
//         description:
//             'Sit quis amet rutrum tellus ullamcorper ultricies libero dolor eget. Sem sodales gravida quam turpis enim lacus amet.',
//         icon: LockClosedIcon,
//     },
//     {
//         name: 'Simple queues',
//         description:
//             'Quisque est vel vulputate cursus. Risus proin diam nunc commodo. Lobortis auctor congue commodo diam neque.',
//         icon: ArrowPathIcon,
//     },
//     {
//         name: 'Advanced security',
//         description:
//             'Arcu egestas dolor vel iaculis in ipsum mauris. Tincidunt mattis aliquet hac quis. Id hac maecenas ac donec pharetra eget.',
//         icon: FingerPrintIcon,
//     },
// ]

// export function Feature() {
//     return (
//         <section className="relative overflow-hidden mb-4">
            
//             {/* CONTENT */}
//             <div className="relative z-10 mx-auto max-w-7xl px-6 lg:px-8">
//                 {/* Section header */}
//                 <div className="mx-0 max-w-2xl text-left">
//                     <p className="text-sm font-semibold text-primary">
//                         We Provide
//                     </p>
                    
//                     <h2 className="mt-2 text-4xl font-bold tracking-tight text-black sm:text-5xl">
//                         Everything to Ship
//                     </h2>
                    
//                 </div>

//                 {/* Cards */}
//                 <div className="mx-auto mt-16 grid max-w-5xl grid-cols-1 gap-8 sm:grid-cols-2">
//                     {features.map((feature) => (
//                         <div
//                             key={feature.name}
//                             className="relative rounded-2xl border border-gray-600:shadow-lg/6 bg-background p-8 shadow-sm"
//                         >
//                             <div className="mb-6 inline-flex h-12 w-12 items-center justify-center rounded-xl bg-primary">
//                                 <feature.icon className="h-6 w-6 text-accent" />
//                             </div>

//                             <h3 className="text-lg font-semibold text-black">
//                                 {feature.name}
//                             </h3>
//                             <p className="mt-3 text-gray-600">
//                                 {feature.description}
//                             </p>
//                         </div>
//                     ))}
//                 </div>
//             </div>
//         </section>
//     );
// }

// eslint-disable-next-line no-unused-vars
import { motion } from 'framer-motion';
import {
  Truck,
  Package,
  MapPin,
  Clock,
  Shield,
  Zap,
  Globe,
  BarChart3,
  Smartphone,
  ArrowRight,
  Boxes,
} from 'lucide-react';

const features = [
  {
    icon: Truck,
    title: 'Real-Time Tracking',
    description:
      'Monitor every shipment with GPS tracking and instant notifications. Know exactly where your packages are at all times.',
    color: 'from-blue-500 to-blue-600',
    bg: 'bg-blue-50',
  },
  {
    icon: Zap,
    title: 'Lightning Fast Delivery',
    description:
      'Same-day and next-day delivery options with optimized routes powered by AI algorithms for maximum efficiency.',
    color: 'from-yellow-500 to-orange-500',
    bg: 'bg-yellow-50',
  },
  {
    icon: Shield,
    title: 'Secure & Insured',
    description:
      'Every package is protected with comprehensive insurance and security protocols. Your cargo is in safe hands.',
    color: 'from-green-500 to-emerald-600',
    bg: 'bg-green-50',
  },
  {
    icon: Globe,
    title: 'Global Network',
    description:
      'Ship to 190+ countries with our extensive partner network. International shipping made simple and affordable.',
    color: 'from-purple-500 to-pink-500',
    bg: 'bg-purple-50',
  },
  {
    icon: BarChart3,
    title: 'Analytics Dashboard',
    description:
      'Gain insights with detailed analytics and reports. Track performance metrics and optimize your logistics.',
    color: 'from-indigo-500 to-blue-600',
    bg: 'bg-indigo-50',
  },
  {
    icon: Smartphone,
    title: 'Mobile App',
    description:
      'Manage shipments on the go with our intuitive mobile apps for iOS and Android. Full control at your fingertips.',
    color: 'from-pink-500 to-rose-500',
    bg: 'bg-pink-50',
  },
];

const stats = [
  { label: 'Deliveries Per Day', value: '50K+', icon: Package },
  { label: 'Active Customers', value: '10K+', icon: Globe },
  { label: 'Countries Covered', value: '190+', icon: MapPin },
  { label: 'On-Time Rate', value: '99.2%', icon: Clock },
];

export function Feature() {
  return (
    <section className="py-24 bg-tertiary">
      <div className="mx-auto max-w-7xl px-6 lg:px-8">
        {/* Section Header */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
          className="text-center mb-16"
        >
          <span className="inline-block px-4 py-2 bg-blue-100 text-blue-700 rounded-full text-sm font-semibold mb-4">
            Features
          </span>
          <h2 className="text-4xl lg:text-5xl font-bold text-background mb-4">
            Everything You Need to
            <br />
            <span className="bg-gradient-to-r from-accent to-primary bg-clip-text text-transparent">
              Ship with Confidence
            </span>
          </h2>
          <p className="text-xl text-accent/80 max-w-3xl mx-auto">
            Comprehensive logistics solutions designed for modern businesses. From local deliveries
            to global shipping, we've got you covered.
          </p>
        </motion.div>

        {/* Stats Grid */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6, delay: 0.2 }}
          className="grid grid-cols-2 lg:grid-cols-4 gap-6 mb-20"
        >
          {stats.map((stat, index) => (
            <motion.div
              key={stat.label}
              initial={{ opacity: 0, scale: 0.9 }}
              whileInView={{ opacity: 1, scale: 1 }}
              viewport={{ once: true }}
              transition={{ duration: 0.4, delay: index * 0.1 }}
              className="bg-white rounded-2xl p-6 shadow-lg border border-gray-200 hover:shadow-xl transition-all hover:scale-105"
            >
              <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-blue-600 to-purple-600 flex items-center justify-center mb-4">
                <stat.icon className="w-6 h-6 text-white" />
              </div>
              <div className="text-3xl font-bold text-gray-900 mb-1">{stat.value}</div>
              <div className="text-sm text-gray-600">{stat.label}</div>
            </motion.div>
          ))}
        </motion.div>

        {/* Features Grid */}
        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
          {features.map((feature, index) => (
            <motion.div
              key={feature.title}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.5, delay: index * 0.1 }}
              className="group relative bg-white rounded-2xl p-8 shadow-lg border border-gray-200 hover:shadow-2xl transition-all duration-300 hover:-translate-y-2"
            >
              {/* Icon */}
              <div
                className={`w-14 h-14 rounded-xl bg-gradient-to-br ${feature.color} flex items-center justify-center mb-6 group-hover:scale-110 transition-transform duration-300 shadow-lg`}
              >
                <feature.icon className="w-7 h-7 text-white" />
              </div>

              {/* Content */}
              <h3 className="text-xl font-bold text-gray-900 mb-3 group-hover:text-blue-600 transition-colors">
                {feature.title}
              </h3>
              <p className="text-gray-600 leading-relaxed mb-4">{feature.description}</p>

              {/* Learn More Link */}
              <div className="flex items-center gap-2 text-blue-600 font-semibold text-sm opacity-0 group-hover:opacity-100 transition-opacity">
                Learn more
                <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
              </div>

              {/* Background Decoration */}
              <div
                className={`absolute -z-10 inset-0 ${feature.bg} rounded-2xl opacity-0 group-hover:opacity-100 transition-opacity duration-300`}
              ></div>
            </motion.div>
          ))}
        </div>

        {/* Bottom CTA Section */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
          className="mt-20 bg-gradient-to-r from-blue-600 to-purple-600 rounded-3xl p-12 text-center text-white shadow-2xl"
        >
          <div className="max-w-3xl mx-auto">
            <div className="w-16 h-16 rounded-full bg-white/20 backdrop-blur-sm flex items-center justify-center mx-auto mb-6">
              <Boxes className="w-8 h-8 text-white" />
            </div>
            <h3 className="text-3xl lg:text-4xl font-bold mb-4">
              Ready to Transform Your Logistics?
            </h3>
            <p className="text-xl text-blue-100 mb-8">
              Join 10,000+ businesses who trust CargoFlow for their shipping needs.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <button className="px-8 py-4 bg-white text-blue-600 rounded-xl font-semibold hover:bg-gray-100 transition-all shadow-lg hover:shadow-xl">
                Start Free Trial
              </button>
              <button className="px-8 py-4 bg-transparent border-2 border-white text-white rounded-xl font-semibold hover:bg-white/10 transition-all">
                Schedule Demo
              </button>
            </div>
          </div>
        </motion.div>
      </div>
    </section>
  );
}
