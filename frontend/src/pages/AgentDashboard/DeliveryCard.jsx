import { Package, MapPin, Phone, Navigation, Clock, DollarSign, AlertCircle } from 'lucide-react';
// eslint-disable-next-line no-unused-vars
import { motion } from 'motion/react';

export default function DeliveryCard({ delivery, index, onStart, onNavigate, onCall }) {
  const priorityColors = {
    high: 'border-red-200 bg-red-50',
    normal: 'border-gray-200 bg-white',
  };

  const priorityBadge = {
    high: 'bg-red-100 text-red-700 border-red-200',
    normal: 'bg-gray-100 text-gray-700 border-gray-200',
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: index * 0.05 }}
      className={`border rounded-xl p-4 hover:shadow-lg transition-all ${
        priorityColors[delivery.priority] || priorityColors.normal
      }`}
    >
      {/* Header */}
      <div className="flex items-start justify-between mb-3">
        <div className="flex items-start gap-3">
          <div className="w-12 h-12 rounded-lg bg-blue-100 flex items-center justify-center flex-shrink-0">
            <Package className="w-6 h-6 text-blue-600" />
          </div>
          <div className="flex-1 min-w-0">
            <div className="flex items-center gap-2 mb-1">
              <span className="font-bold text-gray-900">{delivery.id}</span>
              {delivery.priority === 'high' && (
                <span
                  className={`px-2 py-0.5 rounded-full text-xs font-semibold border ${priorityBadge.high}`}
                >
                  High Priority
                </span>
              )}
            </div>
            <div className="font-semibold text-gray-800">{delivery.customer}</div>
            <div className="text-sm text-gray-600 mt-1">{delivery.packageType}</div>
          </div>
        </div>
        <div className="text-right">
          <div className="text-sm font-semibold text-blue-600">{delivery.expectedTime}</div>
          <div className="text-xs text-gray-500 mt-1">{delivery.distance}</div>
        </div>
      </div>

      {/* Address */}
      <div className="mb-3 p-3 bg-gray-50 rounded-lg">
        <div className="flex items-start gap-2">
          <MapPin className="w-4 h-4 text-gray-500 flex-shrink-0 mt-0.5" />
          <div className="text-sm text-gray-700 flex-1">{delivery.address}</div>
        </div>
      </div>

      {/* Details Grid */}
      <div className="grid grid-cols-2 gap-3 mb-4">
        <div className="flex items-center gap-2">
          <div className="w-8 h-8 rounded-lg bg-purple-100 flex items-center justify-center">
            <Package className="w-4 h-4 text-purple-600" />
          </div>
          <div>
            <div className="text-xs text-gray-500">Weight</div>
            <div className="text-sm font-semibold text-gray-900">{delivery.weight}</div>
          </div>
        </div>

        {delivery.cod && (
          <div className="flex items-center gap-2">
            <div className="w-8 h-8 rounded-lg bg-amber-100 flex items-center justify-center">
              <DollarSign className="w-4 h-4 text-amber-600" />
            </div>
            <div>
              <div className="text-xs text-gray-500">COD Amount</div>
              <div className="text-sm font-semibold text-amber-700">{delivery.codAmount}</div>
            </div>
          </div>
        )}
      </div>

      {/* Action Buttons */}
      <div className="grid grid-cols-3 gap-2">
        <button
          onClick={onCall}
          className="flex items-center justify-center gap-1.5 px-3 py-2 bg-green-50 hover:bg-green-100 text-green-700 rounded-lg transition-all border border-green-200"
        >
          <Phone className="w-4 h-4" />
          <span className="text-xs font-semibold">Call</span>
        </button>
        <button
          onClick={onNavigate}
          className="flex items-center justify-center gap-1.5 px-3 py-2 bg-blue-50 hover:bg-blue-100 text-blue-700 rounded-lg transition-all border border-blue-200"
        >
          <Navigation className="w-4 h-4" />
          <span className="text-xs font-semibold">Navigate</span>
        </button>
        <button
          onClick={onStart}
          className="flex items-center justify-center gap-1.5 px-3 py-2 bg-gradient-to-r from-blue-600 to-blue-700 hover:from-blue-700 hover:to-blue-800 text-white rounded-lg transition-all shadow-md"
        >
          <Clock className="w-4 h-4" />
          <span className="text-xs font-semibold">Start</span>
        </button>
      </div>
    </motion.div>
  );
}
