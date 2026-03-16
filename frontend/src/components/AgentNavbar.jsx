import { Bell, Menu, ChevronDown, MapPin, Phone, Star, LogOut } from 'lucide-react';
import { useState } from 'react';

export default function AgentNavbar({ agent }) {
  const [showProfile, setShowProfile] = useState(false);
  const [showNotifications, setShowNotifications] = useState(false);

  const notifications = [
    { id: 1, title: 'New Delivery Assigned', desc: 'SH-20250305 added to your route', time: '2m ago', type: 'info' },
    { id: 2, title: 'Payment Received', desc: '₹2,840 credited to your account', time: '15m ago', type: 'success' },
    { id: 3, title: 'Route Updated', desc: 'Optimized route saved 15 mins', time: '1h ago', type: 'info' },
  ];

  return (
    <nav className="bg-white border-b border-gray-200 sticky top-0 z-50 backdrop-blur-xl bg-white/90">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          {/* Logo and Brand */}
          <div className="flex items-center gap-3">
            <div className="w-9 h-9 rounded-lg bg-gradient-to-br from-blue-600 to-blue-700 flex items-center justify-center shadow-lg shadow-blue-600/20">
              <MapPin className="w-5 h-5 text-white" />
            </div>
            <div className="hidden sm:flex flex-col">
              <span className="font-bold text-gray-900 text-lg tracking-tight">CargoFlow</span>
              <span className="text-[10px] text-gray-500 -mt-1">Delivery Agent</span>
            </div>
          </div>

          {/* Right Section */}
          <div className="flex items-center gap-3">
            {/* Status Indicator */}
            <div className="hidden sm:flex items-center gap-2 px-3 py-1.5 bg-green-50 rounded-lg">
              <span className="w-2 h-2 rounded-full bg-green-500 animate-pulse"></span>
              <span className="text-sm font-medium text-green-700">On Duty</span>
            </div>

            {/* Notifications */}
            <div className="relative">
              <button
                onClick={() => setShowNotifications(!showNotifications)}
                className="relative p-2 rounded-lg hover:bg-gray-100 transition-colors"
              >
                <Bell className="w-5 h-5 text-gray-600" />
                <span className="absolute top-1 right-1 w-2 h-2 bg-red-500 rounded-full ring-2 ring-white"></span>
              </button>

              {showNotifications && (
                <div className="absolute right-0 mt-2 w-80 bg-white rounded-xl shadow-2xl border border-gray-200 overflow-hidden animate-in fade-in slide-in-from-top-2 duration-200">
                  <div className="px-4 py-3 border-b border-gray-100 bg-gray-50">
                    <div className="flex items-center justify-between">
                      <h3 className="font-semibold text-gray-900 text-sm">Notifications</h3>
                      <span className="text-xs text-blue-600 font-medium cursor-pointer hover:text-blue-700">
                        Mark all read
                      </span>
                    </div>
                  </div>
                  <div className="max-h-96 overflow-y-auto">
                    {notifications.map((notif) => (
                      <div
                        key={notif.id}
                        className="px-4 py-3 hover:bg-gray-50 cursor-pointer border-b border-gray-100 last:border-0 transition-colors"
                      >
                        <div className="flex gap-3">
                          <div
                            className={`w-2 h-2 rounded-full mt-1.5 flex-shrink-0 ${
                              notif.type === 'success' ? 'bg-green-500' : 'bg-blue-500'
                            }`}
                          ></div>
                          <div className="flex-1 min-w-0">
                            <p className="text-sm font-medium text-gray-900">{notif.title}</p>
                            <p className="text-xs text-gray-600 mt-0.5">{notif.desc}</p>
                            <p className="text-xs text-gray-400 mt-1">{notif.time}</p>
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              )}
            </div>

            {/* Profile */}
            <div className="relative">
              <button
                onClick={() => setShowProfile(!showProfile)}
                className="flex items-center gap-2 pl-2 pr-3 py-1.5 rounded-lg hover:bg-gray-100 transition-colors"
              >
                <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-purple-500 to-pink-500 flex items-center justify-center text-white font-semibold text-sm">
                  {agent.avatar}
                </div>
                <div className="hidden sm:block text-left">
                  <div className="text-sm font-semibold text-gray-900">{agent.name}</div>
                  <div className="text-xs text-gray-500">{agent.id}</div>
                </div>
                <ChevronDown className="w-4 h-4 text-gray-500 hidden sm:block" />
              </button>

              {showProfile && (
                <div className="absolute right-0 mt-2 w-72 bg-white rounded-xl shadow-2xl border border-gray-200 overflow-hidden animate-in fade-in slide-in-from-top-2 duration-200">
                  <div className="p-4 bg-gradient-to-br from-blue-600 to-purple-600 text-white">
                    <div className="flex items-center gap-3">
                      <div className="w-12 h-12 rounded-lg bg-white/20 backdrop-blur-sm flex items-center justify-center text-white font-bold text-lg">
                        {agent.avatar}
                      </div>
                      <div className="flex-1">
                        <p className="font-semibold">{agent.name}</p>
                        <p className="text-xs text-blue-100">{agent.id}</p>
                      </div>
                    </div>
                    <div className="mt-3 grid grid-cols-3 gap-2">
                      <div className="bg-white/10 backdrop-blur-sm rounded-lg p-2">
                        <div className="flex items-center gap-1 text-xs">
                          <Star className="w-3 h-3 fill-amber-300 text-amber-300" />
                          <span className="font-semibold">{agent.rating}</span>
                        </div>
                        <div className="text-[10px] text-blue-100 mt-0.5">Rating</div>
                      </div>
                      <div className="bg-white/10 backdrop-blur-sm rounded-lg p-2">
                        <div className="text-xs font-semibold">{agent.totalDeliveries}</div>
                        <div className="text-[10px] text-blue-100 mt-0.5">Deliveries</div>
                      </div>
                      <div className="bg-white/10 backdrop-blur-sm rounded-lg p-2">
                        <div className="flex items-center gap-1">
                          <Phone className="w-3 h-3" />
                        </div>
                        <div className="text-[10px] text-blue-100 mt-0.5">Contact</div>
                      </div>
                    </div>
                  </div>
                  <div className="p-2">
                    <button className="w-full text-left px-3 py-2 text-sm text-gray-700 hover:bg-gray-100 rounded-lg transition-colors flex items-center gap-2">
                      <MapPin className="w-4 h-4" />
                      My Routes
                    </button>
                    <button className="w-full text-left px-3 py-2 text-sm text-gray-700 hover:bg-gray-100 rounded-lg transition-colors flex items-center gap-2">
                      <Star className="w-4 h-4" />
                      Performance
                    </button>
                    <button className="w-full text-left px-3 py-2 text-sm text-gray-700 hover:bg-gray-100 rounded-lg transition-colors flex items-center gap-2">
                      <Phone className="w-4 h-4" />
                      Support
                    </button>
                    <div className="border-t border-gray-200 my-2"></div>
                    <button className="w-full text-left px-3 py-2 text-sm text-red-600 hover:bg-red-50 rounded-lg transition-colors flex items-center gap-2">
                      <LogOut className="w-4 h-4" />
                      Sign Out
                    </button>
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </nav>
  );
}

