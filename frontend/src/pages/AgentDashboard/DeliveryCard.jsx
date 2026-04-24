import { Package, MapPin, Phone, Navigation, Clock, DollarSign, ChevronDown, ChevronUp, AlertCircle } from 'lucide-react';
// eslint-disable-next-line no-unused-vars
import { motion } from 'motion/react';
import { useState } from 'react';
import { updateShipmentStatus } from "../../utils/agentAPI";

export default function DeliveryCard({ delivery, index, onStart, onNavigate, onCall }) {
  const [expanded, setExpanded] = useState(false);
  const [callActive, setCallActive] = useState(false);
  const [navActive,  setNavActive]  = useState(false);
  const [started,    setStarted]    = useState(false);

  const priorityColors = {
    high:   'border-red-200 bg-red-50',
    normal: 'border-gray-200 bg-white',
  };
  const priorityBadge = {
    high:   'bg-red-100 text-red-700 border-red-200',
    normal: 'bg-gray-100 text-gray-700 border-gray-200',
  };

  const handleCall = () => {
    setCallActive(true);
    if (onCall) onCall(delivery);
    setTimeout(() => setCallActive(false), 3000);
  };

  const handleNavigate = () => {
    setNavActive(true);
    if (onNavigate) onNavigate(delivery);
    window.open(
      `https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(delivery.address)}`,
      '_blank'
    );
  };

const handleStart = async () => {
  try {
    await updateShipmentStatus(delivery.dbId, "OUT_FOR_DELIVERY");

    if (onStart) onStart(); // reload dashboard
  } catch (err) {
    console.error(err);
  }
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
            <div className="flex items-center gap-2 mb-1 flex-wrap">
              <span className="font-bold text-gray-900">{delivery.id}</span>
              {delivery.priority === 'high' && (
                <span className={`px-2 py-0.5 rounded-full text-xs font-semibold border ${priorityBadge.high} flex items-center gap-1`}>
                  <AlertCircle className="w-3 h-3" />High Priority
                </span>
              )}
              {started && (
                <span className="px-2 py-0.5 rounded-full text-xs font-semibold bg-blue-100 text-blue-700 border border-blue-200">
                  Started
                </span>
              )}
            </div>
            <div className="font-semibold text-gray-800">{delivery.customer}</div>
            <div className="text-sm text-gray-600 mt-0.5">{delivery.packageType}</div>
          </div>
        </div>
        <div className="flex flex-col items-end gap-1">
          <div className="text-sm font-semibold text-blue-600">{delivery.expectedTime}</div>
          <div className="text-xs text-gray-500">{delivery.distance}</div>
          <button
            onClick={() => setExpanded(p => !p)}
            className="text-gray-400 hover:text-gray-600 transition-colors mt-1"
            title={expanded ? 'Collapse' : 'Expand details'}
          >
            {expanded ? <ChevronUp className="w-4 h-4" /> : <ChevronDown className="w-4 h-4" />}
          </button>
        </div>
      </div>

      {/* Address */}
      <div className="mb-3 p-3 bg-gray-50 rounded-lg">
        <div className="flex items-start gap-2">
          <MapPin className="w-4 h-4 text-gray-500 flex-shrink-0 mt-0.5" />
          <div className="text-sm text-gray-700 flex-1">{delivery.address}</div>
        </div>
      </div>

      {/* Expanded details */}
      {expanded && (
        <motion.div
          initial={{ opacity: 0, height: 0 }}
          animate={{ opacity: 1, height: 'auto' }}
          exit={{ opacity: 0, height: 0 }}
          className="mb-3 space-y-2"
        >
          <div className="grid grid-cols-2 gap-3">
            <div className="flex items-center gap-2 p-2 bg-gray-50 rounded-lg">
              <div className="w-7 h-7 rounded-md bg-purple-100 flex items-center justify-center">
                <Package className="w-3.5 h-3.5 text-purple-600" />
              </div>
              <div>
                <div className="text-xs text-gray-500">Weight</div>
                <div className="text-sm font-semibold text-gray-900">{delivery.weight}</div>
              </div>
            </div>
            {delivery.cod && (
              <div className="flex items-center gap-2 p-2 bg-amber-50 rounded-lg border border-amber-100">
                <div className="w-7 h-7 rounded-md bg-amber-100 flex items-center justify-center">
                  <DollarSign className="w-3.5 h-3.5 text-amber-600" />
                </div>
                <div>
                  <div className="text-xs text-gray-500">COD</div>
                  <div className="text-sm font-semibold text-amber-700">{delivery.codAmount}</div>
                </div>
              </div>
            )}
          </div>
          <div className="flex items-center gap-2 p-2 bg-blue-50 rounded-lg">
            <Phone className="w-3.5 h-3.5 text-blue-600" />
            <span className="text-sm text-blue-700 font-medium">{delivery.phone}</span>
          </div>
        </motion.div>
      )}

      {/* Action Buttons */}
      <div className="grid grid-cols-3 gap-2">
        <button
          onClick={handleCall}
          className={`flex items-center justify-center gap-1.5 px-3 py-2 rounded-lg transition-all border text-xs font-semibold ${
            callActive
              ? 'bg-green-100 text-green-700 border-green-300'
              : 'bg-green-50 hover:bg-green-100 text-green-700 border-green-200'
          }`}
        >
          <Phone className={`w-4 h-4 ${callActive ? 'animate-pulse' : ''}`} />
          {callActive ? 'Calling…' : 'Call'}
        </button>
        <button
          onClick={handleNavigate}
          className={`flex items-center justify-center gap-1.5 px-3 py-2 rounded-lg transition-all border text-xs font-semibold ${
            navActive
              ? 'bg-blue-100 text-blue-700 border-blue-300'
              : 'bg-blue-50 hover:bg-blue-100 text-blue-700 border-blue-200'
          }`}
        >
          <Navigation className="w-4 h-4" />
          {navActive ? 'Opened' : 'Navigate'}
        </button>
        <button
          onClick={handleStart}
          disabled={delivery.status === "OUT_FOR_DELIVERY"}
          className={`flex items-center justify-center gap-1.5 px-3 py-2 rounded-lg transition-all shadow-md text-xs font-semibold ${
            started
              ? 'bg-gray-200 text-gray-500 cursor-not-allowed shadow-none'
              : 'bg-gradient-to-r from-blue-600 to-blue-700 hover:from-blue-700 hover:to-blue-800 text-white'
          }`}
        >
          <Clock className="w-4 h-4" />
          {started ? 'Started' : 'Start'}
        </button>
      </div>
    </motion.div>
  );
}