// eslint-disable-next-line no-unused-vars
import { motion } from 'motion/react';
import { CheckCircle, Star } from 'lucide-react';


import { useEffect } from "react";



export function MainHeroSection() {
  useEffect(() => {
    const shouldScroll = sessionStorage.getItem("scrollToHero");

    if (shouldScroll) {
      const el = document.getElementById("hero");

      if (el) {
        setTimeout(() => {
          el.scrollIntoView({ behavior: "smooth" });
        }, 100); // wait for render
      }

      sessionStorage.removeItem("scrollToHero");
    }
  }, []);
  return (
    <section id='hero' className="relative pt-32 pb-20 overflow-hidden bg-tertiary">
      <div className="relative mx-auto max-w-7xl px-6 lg:px-8">
        <div className="grid lg:grid-cols-2 gap-12 items-center">
          {/* Left Content */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            className="text-left"
          >
            {/* Badge */}
            <motion.div
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ delay: 0.2 }}
              className="inline-flex items-center gap-2 px-4 py-2 bg-primary/50 border border-background rounded-full mb-6"
            >
              <span className="w-2 h-2 rounded-full bg-yellow-600 animate-pulse"></span>
              <span className="text-sm font-medium text-accent">
                #1 Logistics Platform in India
              </span>
            </motion.div>

            {/* Heading */}
            <h1 className="text-5xl lg:text-6xl xl:text-7xl font-bold text-background tracking-tight mb-6">
              Ship Smarter,
              <br />
              <span className="bg-gradient-to-r from-background to-gray-600 bg-clip-text text-transparent">
                Deliver Faster
              </span>
            </h1>

            {/* Description */}
            <p className="text-xl text-accent/80 mb-8 leading-relaxed">
              Streamline your logistics operations with real-time tracking, AI-powered route
              optimization, and seamless integrations. Trusted by 10,000+ businesses.
            </p>

            {/* Features List */}
            <div className="grid sm:grid-cols-2 gap-4 mb-8">
              {[
                'Real-time tracking',
                'Same-day delivery',
                'API integration',
                'Global coverage',
              ].map((feature, index) => (
                <motion.div
                  key={feature}
                  initial={{ opacity: 0, x: -20 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: 0.3 + index * 0.1 }}
                  className="flex items-center gap-2"
                >
                  <div className="w-5 h-5 rounded-full bg-green-100 flex items-center justify-center flex-shrink-0">
                    <CheckCircle className="w-3.5 h-3.5 text-green-600" />
                  </div>
                  <span className="text-accent/60 font-medium">{feature}</span>
                </motion.div>
              ))}
            </div>

            {/* CTA Buttons */}
            <div className="flex flex-col lg:flex-row  mb-8">
              <div className="mt-2 flex gap-3">
                <input
                  type="text"
                  placeholder="Enter Tracking ID"
                  className="flex-1 border border-gray-300 rounded-md px-4 py-2 focus:outline-none focus:ring-2 focus:ring-blue-700"
                />
                <button className="bg-[#0f2b4d] text-accent border border-white px-6 py-2 rounded-md font-medium hover:opacity-90">
                  Track
                </button>
              </div>
            </div>

            {/* Social Proof */}
            <div className="flex items-center gap-6 pt-6 border-t border-gray-200">
              <div className="flex -space-x-2">
                {[1, 2, 3, 4].map((i) => (
                  <img
                    key={i}
                    src={`https://randomuser.me/api/portraits/men/${i}.jpg`}
                    alt="user"
                    className="w-10 h-10 rounded-full border-2 border-white object-cover"
                  />
                ))}
              </div>
              <div>
                <div className="flex items-center gap-1 mb-1">
                  {[1, 2, 3, 4, 5].map((i) => (
                    <Star key={i} className="w-4 h-4 fill-amber-400 text-amber-400" />
                  ))}
                </div>
                <p className="text-sm text-background">
                  <span className="font-bold text-accent">4.9/5</span> from 10,000+
                  customers
                </p>
              </div>
            </div>
          </motion.div>

          {/* Right Visual */}
          <motion.div
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.6, delay: 0.2 }}
            className="relative"
          >
            <div className="relative">
              {/* Main Dashboard Image */}
              <div className="relative rounded-2xl shadow-2xl overflow-hidden border border-gray-200 bg-white">
                <div className="aspect-[4/3] bg-gradient-to-br from-blue-50 to-purple-50 p-8">
                  {/* Simulated Dashboard UI */}
                  <div className="space-y-4">
                    {/* Header */}
                    <div className="flex items-center justify-between pb-4 border-b border-gray-200">
                      <div className="flex items-center gap-3">
                        <div className="w-10 h-10 rounded-lg bg-gradient-to-br from-blue-600 to-blue-700"></div>
                        <div>
                          <div className="h-3 w-24 bg-gray-300 rounded"></div>
                          <div className="h-2 w-16 bg-gray-200 rounded mt-2"></div>
                        </div>
                      </div>
                      <div className="flex gap-2">
                        <div className="w-8 h-8 rounded-lg bg-gray-200"></div>
                        <div className="w-8 h-8 rounded-lg bg-gray-200"></div>
                      </div>
                    </div>

                    {/* Stats Cards */}
                    <div className="grid grid-cols-3 gap-3">
                      {[1, 2, 3].map((i) => (
                        <div key={i} className="bg-white rounded-xl p-4 shadow-sm">
                          <div className="h-2 w-12 bg-gray-300 rounded mb-3"></div>
                          <div className="h-6 w-16 bg-gradient-to-r from-tertiary to-blue-600 rounded"></div>
                        </div>
                      ))}
                    </div>

                    {/* Chart Area */}
                    <div className="bg-background rounded-xl p-4 shadow-sm">
                      <div className="h-3 w-20 bg-gray-300 rounded mb-4"></div>
                      <div className="flex items-end gap-2 h-32">
                        {[40, 70, 45, 80, 60, 90, 75].map((height, i) => (
                          <div
                            key={i}
                            className="flex-1 bg-gradient-to-t from-tertiary to-blue-600 rounded-t"
                            style={{ height: `${height}%` }}
                          ></div>
                        ))}
                      </div>
                    </div>
                  </div>
                </div>
              </div>

              {/* Floating Cards */}
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.8, duration: 0.6 }}
                className="absolute -left-6 top-1/4 bg-white rounded-xl shadow-2xl p-4 border border-gray-200"
              >
                <div className="flex items-center gap-3">
                  <div className="w-12 h-12 rounded-lg bg-green-100 flex items-center justify-center">
                    <CheckCircle className="w-6 h-6 text-green-600" />
                  </div>
                  <div>
                    <div className="text-sm font-semibold text-gray-900">Delivery Complete</div>
                    <div className="text-xs text-gray-600">Order #12345</div>
                  </div>
                </div>
              </motion.div>

              <motion.div
                initial={{ opacity: 0, y: -20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 1, duration: 0.6 }}
                className="absolute -right-6 top-1/3 bg-white rounded-xl shadow-2xl p-4 border border-gray-200"
              >
                <div className="flex items-center gap-3">
                  <div className="w-12 h-12 rounded-lg bg-blue-100 flex items-center justify-center">
                    <div className="relative">
                      <div className="w-6 h-6 rounded-full border-4 border-blue-600 border-t-transparent animate-spin"></div>
                    </div>
                  </div>
                  <div>
                    <div className="text-sm font-semibold text-gray-900">In Transit</div>
                    <div className="text-xs text-gray-600">ETA: 2 hours</div>
                  </div>
                </div>
              </motion.div>
            </div>
          </motion.div>
        </div>

        {/* Trust Indicators */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.6 }}
          className="mt-20 text-center"
        >
          <p className="text-sm text-gray-50 mb-6">Trusted by industry leaders</p>
          <div className="flex flex-wrap justify-center items-center gap-8 opacity-60">
            {['Amazon', 'Flipkart', 'Myntra', 'Swiggy', 'Zomato'].map((company) => (
              <div
                key={company}
                className="text-2xl font-bold text-gray-50 hover:text-gray-600 transition-colors"
              >
                {company}
              </div>
            ))}
          </div>
        </motion.div>
      </div>

      <style jsx>{`
        @keyframes blob {
          0%,
          100% {
            transform: translate(0, 0) scale(1);
          }
          33% {
            transform: translate(30px, -50px) scale(1.1);
          }
          66% {
            transform: translate(-20px, 20px) scale(0.9);
          }
        }
        .animate-blob {
          animation: blob 7s infinite;
        }
        .animation-delay-2000 {
          animation-delay: 2s;
        }
        .animation-delay-4000 {
          animation-delay: 4s;
        }
      `}</style>
    </section>
  );
}
