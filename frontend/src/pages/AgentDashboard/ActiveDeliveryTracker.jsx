import { Navigation, Phone, MapPin, Clock, Package, AlertCircle, CheckCircle } from 'lucide-react';
// eslint-disable-next-line no-unused-vars
import { motion } from 'motion/react';

export default function ActiveDeliveryTracker({ delivery, onComplete }) {
  const progress = 65; // In real app, calculate based on location

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: 0.1 }}
      className="bg-gradient-to-br from-blue-600 via-blue-700 to-blue-800 rounded-2xl shadow-xl overflow-hidden"
    >
      <div className="p-6 text-white">
        <div className="flex items-center justify-between mb-4">
          <div className="flex items-center gap-2">
            <div className="w-10 h-10 rounded-lg bg-white/20 backdrop-blur-sm flex items-center justify-center">
              <Package className="w-5 h-5 text-white" />
            </div>
            <div>
              <div className="text-sm text-blue-100">Active Delivery</div>
              <div className="font-bold text-lg">{delivery.id}</div>
            </div>
          </div>
          <div className="flex items-center gap-2 px-3 py-1.5 bg-white/20 backdrop-blur-sm rounded-lg">
            <span className="w-2 h-2 rounded-full bg-green-400 animate-pulse"></span>
            <span className="text-sm font-semibold">In Transit</span>
          </div>
        </div>

        {/* Progress Bar */}
        <div className="mb-6">
          <div className="flex items-center justify-between text-sm mb-2">
            <span className="text-blue-100">Progress to destination</span>
            <span className="font-semibold">{progress}%</span>
          </div>
          <div className="w-full bg-white/20 rounded-full h-2.5 overflow-hidden">
            <motion.div
              initial={{ width: 0 }}
              animate={{ width: `${progress}%` }}
              transition={{ duration: 1, ease: 'easeOut' }}
              className="h-full bg-gradient-to-r from-green-400 to-emerald-500 rounded-full relative"
            >
              <div className="absolute inset-0 bg-white/30 animate-pulse"></div>
            </motion.div>
          </div>
        </div>

        <div className="grid md:grid-cols-2 gap-6">
          {/* Left - Customer Info */}
          <div className="space-y-4">
            <div>
              <div className="text-blue-100 text-sm mb-1">Customer</div>
              <div className="font-semibold text-lg">{delivery.customer}</div>
            </div>

            <div>
              <div className="text-blue-100 text-sm mb-1 flex items-center gap-1">
                <MapPin className="w-3 h-3" />
                Delivery Address
              </div>
              <div className="text-sm leading-relaxed">{delivery.address}</div>
              {delivery.landmark && (
                <div className="text-sm text-blue-200 mt-1">📍 {delivery.landmark}</div>
              )}
            </div>

            {delivery.instructions && (
              <div className="bg-white/10 backdrop-blur-sm rounded-lg p-3">
                <div className="flex items-start gap-2">
                  <AlertCircle className="w-4 h-4 text-amber-300 flex-shrink-0 mt-0.5" />
                  <div>
                    <div className="text-xs text-blue-100 mb-1">Special Instructions</div>
                    <div className="text-sm">{delivery.instructions}</div>
                  </div>
                </div>
              </div>
            )}
          </div>

          {/* Right - Delivery Details */}
          <div className="space-y-4">
            <div className="grid grid-cols-2 gap-3">
              <InfoCard icon={Package} label="Package Type" value={delivery.packageType} />
              <InfoCard icon={Clock} label="ETA" value={delivery.expectedDelivery} />
            </div>

            <div className="grid grid-cols-2 gap-3">
              <InfoCard label="Weight" value={delivery.weight} />
              <InfoCard label="Distance" value={delivery.distance} />
            </div>

            {delivery.cod && (
              <div className="bg-amber-500/20 border border-amber-400/30 backdrop-blur-sm rounded-lg p-3">
                <div className="flex items-center justify-between">
                  <div>
                    <div className="text-xs text-amber-200 mb-1">Cash on Delivery</div>
                    <div className="text-xl font-bold text-amber-300">{delivery.codAmount}</div>
                  </div>
                  <div className="text-3xl">💰</div>
                </div>
              </div>
            )}
          </div>
        </div>

        {/* Action Buttons */}
        <div className="grid grid-cols-3 gap-3 mt-6">
          <button className="flex items-center justify-center gap-2 px-4 py-3 bg-white/10 hover:bg-white/20 backdrop-blur-sm rounded-xl transition-all">
            <Phone className="w-4 h-4" />
            <span className="text-sm font-semibold">Call</span>
          </button>
          <button className="flex items-center justify-center gap-2 px-4 py-3 bg-white/10 hover:bg-white/20 backdrop-blur-sm rounded-xl transition-all">
            <Navigation className="w-4 h-4" />
            <span className="text-sm font-semibold">Navigate</span>
          </button>
          <button
            onClick={onComplete}
            className="flex items-center justify-center gap-2 px-4 py-3 bg-green-500 hover:bg-green-600 rounded-xl transition-all shadow-lg"
          >
            <CheckCircle className="w-4 h-4" />
            <span className="text-sm font-semibold">Complete</span>
          </button>
        </div>
      </div>

      {/* Mini Map Placeholder */}
      <div className="h-48 bg-gradient-to-br from-blue-100 via-indigo-100 to-purple-100 relative overflow-hidden">
        <svg width="100%" height="100%" viewBox="0 0 600 200" preserveAspectRatio="xMidYMid slice">
          {/* Grid */}
          {Array.from({ length: 5 }).map((_, i) => (
            <line
              key={`h-${i}`}
              x1="0"
              y1={i * 50}
              x2="600"
              y2={i * 50}
              stroke="#BFDBFE"
              strokeWidth="0.5"
              opacity="0.5"
            />
          ))}
          {Array.from({ length: 12 }).map((_, i) => (
            <line
              key={`v-${i}`}
              x1={i * 50}
              y1="0"
              x2={i * 50}
              y2="200"
              stroke="#BFDBFE"
              strokeWidth="0.5"
              opacity="0.5"
            />
          ))}

          {/* Route */}
          <path
            d="M100 100 Q300 50 500 100"
            stroke="#3B82F6"
            strokeWidth="3"
            fill="none"
            strokeDasharray="8,4"
            opacity="0.8"
          >
            <animate attributeName="stroke-dashoffset" from="0" to="24" dur="1s" repeatCount="indefinite" />
          </path>

          {/* Start Point */}
          <g>
            <circle cx="100" cy="100" r="20" fill="#10B981" opacity="0.2" />
            <circle cx="100" cy="100" r="8" fill="#10B981" />
            <text x="100" y="130" textAnchor="middle" fontSize="10" fill="#1E40AF" fontWeight="700">
              Pickup
            </text>
          </g>

          {/* End Point */}
          <g>
            <circle cx="500" cy="100" r="20" fill="#EF4444" opacity="0.2">
              <animate attributeName="r" from="20" to="25" dur="2s" repeatCount="indefinite" />
            </circle>
            <circle cx="500" cy="100" r="8" fill="#EF4444" />
            <text x="500" y="130" textAnchor="middle" fontSize="10" fill="#1E40AF" fontWeight="700">
              Destination
            </text>
          </g>

          {/* Moving Truck */}
          <g>
            <rect x="285" y="40" width="30" height="20" rx="5" fill="#1E40AF">
              <animateTransform
                attributeName="transform"
                type="translate"
                from="0 0"
                to="200 50"
                dur="4s"
                repeatCount="indefinite"
              />
            </rect>
            <text x="300" y="55" textAnchor="middle" fontSize="12" fill="white">
              🚚
              <animateTransform
                attributeName="transform"
                type="translate"
                from="0 0"
                to="200 50"
                dur="4s"
                repeatCount="indefinite"
              />
            </text>
          </g>
        </svg>

        <div className="absolute top-3 right-3 bg-white rounded-lg px-3 py-1.5 shadow-lg">
          <div className="text-xs text-gray-600">Estimated Time</div>
          <div className="text-sm font-bold text-gray-900">15 mins</div>
        </div>
      </div>
    </motion.div>
  );
}

function InfoCard({ icon, label, value }) {
  const Icon = icon;
  return (
    <div className="bg-white/10 backdrop-blur-sm rounded-lg p-3">
      {Icon && (
        <div className="flex items-center gap-2 mb-1">
          <Icon className="w-3 h-3 text-blue-200" />
          <div className="text-xs text-blue-100">{label}</div>
        </div>
      )}
      {!Icon && <div className="text-xs text-blue-100 mb-1">{label}</div>}
      <div className="text-sm font-semibold">{value}</div>
    </div>
  );
}
