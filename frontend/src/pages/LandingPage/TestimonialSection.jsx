// export function Logo() {
//   return (
//     <div className=" py-16 sm:pt-32">
//       <div className="mx-auto max-w-7xl px-6 lg:px-8">
//         <h2 className="text-center text-lg/8 font-semibold text-gray-900">
//           Trusted by the India's most innovative teams
//         </h2>
//         <div className="mx-auto bg-background mt-10 grid max-w-lg grid-cols-4 items-center gap-x-8 gap-y-10 sm:max-w-xl sm:grid-cols-6 sm:gap-x-10 lg:mx-0 lg:max-w-none lg:grid-cols-5">
//           <img
//             alt="Transistor"
//             src="https://tailwindcss.com/plus-assets/img/logos/158x48/transistor-logo-gray-900.svg"
//             width={158}
//             height={48}
//             className="col-span-2 max-h-12 w-full object-contain lg:col-span-1"
//           />
//           <img
//             alt="Reform"
//             src="https://tailwindcss.com/plus-assets/img/logos/158x48/reform-logo-gray-900.svg"
//             width={158}
//             height={48}
//             className="col-span-2 max-h-12 w-full object-contain lg:col-span-1"
//           />
//           <img
//             alt="Tuple"
//             src="https://tailwindcss.com/plus-assets/img/logos/158x48/tuple-logo-gray-900.svg"
//             width={158}
//             height={48}
//             className="col-span-2 max-h-12 w-full object-contain lg:col-span-1"
//           />
//           <img
//             alt="SavvyCal"
//             src="https://tailwindcss.com/plus-assets/img/logos/158x48/savvycal-logo-gray-900.svg"
//             width={158}
//             height={48}
//             className="col-span-2 max-h-12 w-full object-contain sm:col-start-2 lg:col-span-1"
//           />
//           <img
//             alt="Statamic"
//             src="https://tailwindcss.com/plus-assets/img/logos/158x48/statamic-logo-gray-900.svg"
//             width={158}
//             height={48}
//             className="col-span-2 col-start-2 max-h-12 w-full object-contain sm:col-start-auto lg:col-span-1"
//           />
//         </div>
//       </div>
//     </div>
//   )
// }

// eslint-disable-next-line no-unused-vars
import { motion } from 'motion/react';
import { Star, Quote } from 'lucide-react';

const testimonials = [
  {
    name: 'Rajesh Sharma',
    role: 'CEO, TechVision India',
    company: 'E-commerce',
    image: '👨‍💼',
    rating: 5,
    text: 'CargoFlow transformed our logistics operations. We reduced delivery times by 40% and customer satisfaction is at an all-time high. The real-time tracking feature is a game-changer!',
    stats: '40% faster delivery',
  },
  {
    name: 'Priya Patel',
    role: 'Operations Manager',
    company: 'Fashion Retail',
    image: '👩‍💼',
    rating: 5,
    text: "The API integration was seamless, and the analytics dashboard gives us insights we never had before. Their customer support is exceptional - always there when we need them.",
    stats: '10,000+ monthly shipments',
  },
  {
    name: 'Arjun Mehta',
    role: 'Founder, HealthPlus',
    company: 'Healthcare',
    image: '👨‍⚕️',
    rating: 5,
    text: 'Reliable, fast, and secure. CargoFlow handles our sensitive medical supplies with utmost care. The insurance coverage gives us peace of mind for every shipment.',
    stats: '99.8% on-time rate',
  },
  {
    name: 'Anita Desai',
    role: 'Supply Chain Director',
    company: 'Manufacturing',
    image: '👩‍💻',
    rating: 5,
    text: 'Best logistics partner we ever had. The international shipping network is extensive, and customs clearance is handled smoothly. Highly recommend for B2B operations!',
    stats: 'Ships to 50+ countries',
  },
  {
    name: 'Vikram Singh',
    role: 'Co-founder, FoodHub',
    company: 'Food Delivery',
    image: '👨‍🍳',
    rating: 5,
    text: 'Same-day delivery works flawlessly. The route optimization saves us significant costs, and the mobile app makes it easy for our delivery agents to manage orders.',
    stats: '2,000+ daily deliveries',
  },
  {
    name: 'Sneha Reddy',
    role: 'Logistics Head',
    company: 'Jewelry Brand',
    image: '👩‍💼',
    rating: 5,
    text: 'Security is paramount for us, and CargoFlow delivers. Every package is tracked, insured, and delivered with signature confirmation. Never had a single issue!',
    stats: '₹50Cr+ insured cargo',
  },
];

export function TestimonialSection() {
  return (
    <section className="py-24 bg-gradient-to-b from-gray-50 to-white relative overflow-hidden">
      {/* Background Decoration */}
      <div className="absolute top-0 left-0 w-full h-full">
        <div className="absolute top-20 left-10 w-72 h-72 bg-blue-200 rounded-full mix-blend-multiply filter blur-3xl opacity-20"></div>
        <div className="absolute bottom-20 right-10 w-72 h-72 bg-purple-200 rounded-full mix-blend-multiply filter blur-3xl opacity-20"></div>
      </div>

      <div className="relative mx-auto max-w-7xl px-6 lg:px-8">
        {/* Section Header */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
          className="text-center mb-16"
        >
          <span className="inline-block px-4 py-2 bg-amber-100 text-amber-700 rounded-full text-sm font-semibold mb-4">
            Testimonials
          </span>
          <h2 className="text-4xl lg:text-5xl font-bold text-gray-900 mb-4">
            Loved by{' '}
            <span className="bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">
              10,000+ Businesses
            </span>
          </h2>
          <p className="text-xl text-gray-600 max-w-3xl mx-auto">
            See what our customers have to say about their experience with CargoFlow.
          </p>

          {/* Overall Rating */}
          <div className="mt-8 inline-flex items-center gap-6 bg-white rounded-2xl px-8 py-4 shadow-lg border border-gray-200">
            <div className="flex items-center gap-2">
              {[1, 2, 3, 4, 5].map((i) => (
                <Star key={i} className="w-6 h-6 fill-amber-400 text-amber-400" />
              ))}
            </div>
            <div className="h-8 w-px bg-gray-300"></div>
            <div className="text-left">
              <div className="text-2xl font-bold text-gray-900">4.9/5</div>
              <div className="text-sm text-gray-600">from 10,000+ reviews</div>
            </div>
          </div>
        </motion.div>

        {/* Testimonials Grid */}
        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
          {testimonials.map((testimonial, index) => (
            <motion.div
              key={testimonial.name}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.5, delay: index * 0.1 }}
              className="group bg-white rounded-2xl p-8 shadow-lg border border-gray-200 hover:shadow-2xl transition-all duration-300 hover:-translate-y-2 relative overflow-hidden"
            >
              {/* Quote Icon */}
              <div className="absolute -top-2 -right-2 w-20 h-20 bg-blue-50 rounded-full flex items-center justify-center opacity-50">
                <Quote className="w-10 h-10 text-blue-600" />
              </div>

              {/* Rating */}
              <div className="flex items-center gap-1 mb-4">
                {[...Array(testimonial.rating)].map((_, i) => (
                  <Star key={i} className="w-4 h-4 fill-amber-400 text-amber-400" />
                ))}
              </div>

              {/* Testimonial Text */}
              <p className="text-gray-700 leading-relaxed mb-6 relative z-10">
                "{testimonial.text}"
              </p>

              {/* Stats Badge */}
              <div className="inline-flex items-center gap-2 px-3 py-1.5 bg-green-50 border border-green-200 rounded-full mb-6">
                <div className="w-2 h-2 rounded-full bg-green-500"></div>
                <span className="text-sm font-semibold text-green-700">{testimonial.stats}</span>
              </div>

              {/* Author */}
              <div className="flex items-center gap-4 pt-6 border-t border-gray-200">
                <div className="w-14 h-14 rounded-full bg-gradient-to-br from-blue-500 to-purple-500 flex items-center justify-center text-2xl">
                  {testimonial.image}
                </div>
                <div>
                  <div className="font-bold text-gray-900">{testimonial.name}</div>
                  <div className="text-sm text-gray-600">{testimonial.role}</div>
                  <div className="text-xs text-gray-500">{testimonial.company}</div>
                </div>
              </div>
            </motion.div>
          ))}
        </div>

        {/* Bottom CTA */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
          className="mt-16 text-center"
        >
          <p className="text-gray-600 mb-4">Want to see more success stories?</p>
          <button className="text-blue-600 font-semibold hover:text-blue-700 transition-colors inline-flex items-center gap-2">
            Read All Case Studies
            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M17 8l4 4m0 0l-4 4m4-4H3"
              />
            </svg>
          </button>
        </motion.div>
      </div>
    </section>
  );
}

