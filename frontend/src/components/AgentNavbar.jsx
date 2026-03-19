import { Bell, ChevronDown, MapPin, Phone, Star, LogOut, Settings, BarChart3, Search, X, Package } from 'lucide-react';
import { useState, useRef, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';

// ══════════════════════════════════════════════════════════════════════════════
export default function AgentNavbar({ agent }) {
  const [showProfile,       setShowProfile]       = useState(false);
  const [showNotifications, setShowNotifications] = useState(false);
  const [search,            setSearch]            = useState('');
  const [notifs, setNotifs] = useState([
    { id: 1, title: 'New Delivery Assigned', desc: 'SH-20250305 added to your route', time: '2m ago',  type: 'info',    read: false },
    { id: 2, title: 'Payment Received',      desc: '₹2,840 credited to your account', time: '15m ago', type: 'success', read: false },
    { id: 3, title: 'Route Updated',         desc: 'Optimized route saved 15 mins',   time: '1h ago',  type: 'info',    read: true  },
  ]);
  const [dutyStatus, setDutyStatus] = useState('on');

  const navigate = useNavigate();
  // const location = useLocation();
  const notifRef   = useRef(null);
  const profileRef = useRef(null);

  // Close dropdowns on outside click
  useEffect(() => {
    const handler = (e) => {
      if (notifRef.current   && !notifRef.current.contains(e.target))   setShowNotifications(false);
      if (profileRef.current && !profileRef.current.contains(e.target)) setShowProfile(false);
    };
    document.addEventListener('mousedown', handler);
    return () => document.removeEventListener('mousedown', handler);
  }, []);

  const unreadCount  = notifs.filter(n => !n.read).length;
  const markAllRead  = () => setNotifs(n => n.map(x => ({ ...x, read: true })));
  const markRead     = (id) => setNotifs(n => n.map(x => x.id === id ? { ...x, read: true } : x));
  const dismissNotif = (id) => setNotifs(n => n.filter(x => x.id !== id));

  const dutyLabels  = { on: 'On Duty', off: 'Off Duty', break: 'On Break' };
  const dutyColors  = { on: 'bg-green-50 text-green-700', off: 'bg-red-50 text-red-700', break: 'bg-amber-50 text-amber-700' };
  const dutyDotClr  = { on: 'bg-green-500', off: 'bg-red-500', break: 'bg-amber-500' };
  const dutyOptions = [
    { key: 'on',    label: 'On Duty',  dot: 'bg-green-500' },
    { key: 'break', label: 'On Break', dot: 'bg-amber-500' },
    { key: 'off',   label: 'Off Duty', dot: 'bg-red-500'   },
  ];

  const notifDotColor = { success: 'bg-green-500', info: 'bg-blue-500', warning: 'bg-amber-500' };

  return (
    <nav className="bg-background/80 sticky top-0 z-50 backdrop-blur-xl border-b border-gray-200"
      style={{ height: 58, display: 'flex', alignItems: 'center', padding: '0 28px', flexShrink: 0, zIndex: 100 }}>

      {/* ── Logo ──────────────────────────────────────────────────────────── */}
      <div className="flex items-center gap-3 cursor-pointer" onClick={() => navigate('/agent/dashboard')}>
        <div className="w-9 h-9 rounded-lg bg-gradient-to-br from-blue-600 to-blue-700 flex items-center justify-center shadow-lg shadow-blue-600/20">
          <Package className="w-5 h-5 text-white" />
        </div>
        <div className="hidden sm:flex flex-col">
          <span className="font-bold text-gray-900 text-lg tracking-tight">CargoFlow</span>
          <span className="text-[10px] text-gray-500 -mt-1">Delivery Agent</span>
        </div>
      </div>

      {/* ── Right side ────────────────────────────────────────────────────── */}
      <div style={{ marginLeft: 'auto', display: 'flex', alignItems: 'center', gap: 14 }}>

        {/* Search */}
        <div className="hidden md:flex items-center gap-2 bg-gray-100 rounded-lg px-3 py-2 w-56 transition-all focus-within:ring-2 focus-within:ring-blue-500/20 focus-within:bg-white">
          <Search className="w-4 h-4 text-gray-400 flex-shrink-0" />
          <input
            type="text"
            value={search}
            onChange={e => setSearch(e.target.value)}
            placeholder="Search shipments..."
            className="bg-transparent border-none outline-none text-sm text-gray-700 placeholder:text-gray-400 w-full"
          />
          <kbd className="hidden lg:inline-block px-1.5 py-0.5 text-[10px] font-semibold text-gray-500 bg-gray-200 rounded">⌘K</kbd>
        </div>

        {/* Duty Status */}
        <div className="hidden sm:block">
          <DutyDropdown
            current={dutyStatus}
            options={dutyOptions}
            dutyLabels={dutyLabels}
            dutyColors={dutyColors}
            dutyDotClr={dutyDotClr}
            onChange={setDutyStatus}
          />
        </div>

        {/* Bell */}
        <div className="relative" ref={notifRef}>
          <button
            onClick={() => { setShowNotifications(p => !p); setShowProfile(false); }}
            className="relative p-2 rounded-lg hover:bg-gray-100 transition-colors"
          >
            <Bell className="w-5 h-5 text-gray-600" />
            {unreadCount > 0 && (
              <span className="absolute top-1 right-1 w-2 h-2 bg-red-500 rounded-full ring-2 ring-white" />
            )}
          </button>

          {showNotifications && (
            <div className="absolute right-0 mt-2 w-80 bg-white rounded-xl shadow-2xl border border-gray-200 overflow-hidden animate-in fade-in slide-in-from-top-2 duration-200 z-50">
              <div className="px-4 py-3 border-b border-gray-100 bg-gray-50">
                <div className="flex items-center justify-between">
                  <h3 className="font-semibold text-gray-900 text-sm">
                    Notifications
                    {unreadCount > 0 && (
                      <span className="ml-1.5 px-1.5 py-0.5 bg-red-500 text-white text-[10px] rounded-full">{unreadCount}</span>
                    )}
                  </h3>
                  <span onClick={markAllRead} className="text-xs text-blue-600 font-medium cursor-pointer hover:text-blue-700">
                    Mark all read
                  </span>
                </div>
              </div>

              <div className="max-h-96 overflow-y-auto">
                {notifs.length === 0 && (
                  <div className="px-4 py-8 text-center text-sm text-gray-400">No notifications</div>
                )}
                {notifs.map(notif => (
                  <div key={notif.id} onClick={() => markRead(notif.id)}
                    className={`px-4 py-3 hover:bg-gray-50 cursor-pointer border-b border-gray-100 last:border-0 transition-colors flex gap-3 ${!notif.read ? 'bg-blue-50/30' : ''}`}>
                    <div className={`w-2 h-2 rounded-full mt-1.5 flex-shrink-0 ${notifDotColor[notif.type] || 'bg-blue-500'}`} />
                    <div className="flex-1 min-w-0">
                      <p className={`text-sm font-medium ${notif.read ? 'text-gray-700' : 'text-gray-900'}`}>{notif.title}</p>
                      <p className="text-xs text-gray-600 mt-0.5">{notif.desc}</p>
                      <p className="text-xs text-gray-400 mt-1">{notif.time}</p>
                    </div>
                    <button onClick={e => { e.stopPropagation(); dismissNotif(notif.id); }}
                      className="text-gray-300 hover:text-gray-500 flex-shrink-0 self-start mt-1">
                      <X className="w-3 h-3" />
                    </button>
                  </div>
                ))}
              </div>

              {/* Footer — matches DashboardNavbar */}
              <div className="px-4 py-2 bg-gray-50 border-t border-gray-100">
                <button className="text-xs text-blue-600 font-medium hover:text-blue-700 w-full text-center">
                  View all notifications
                </button>
              </div>
            </div>
          )}
        </div>

        {/* Settings */}
        <div
          className="flex items-center cursor-pointer p-2 rounded-lg hover:bg-gray-100 transition-colors"
          onClick={() => navigate('/agent/settings')}
        >
          <Settings className="w-5 h-5 text-gray-600" />
        </div>

        {/* Profile */}
        <div className="relative" ref={profileRef}>
          <button
            onClick={() => { setShowProfile(p => !p); setShowNotifications(false); }}
            className="flex items-center gap-2 pl-2 pr-3 py-1.5 rounded-lg hover:bg-gray-100 transition-colors"
          >
            <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-purple-500 to-pink-500 flex items-center justify-center text-white font-semibold text-sm">
              {agent.avatar}
            </div>
            <div className="hidden sm:block text-left">
              <div className="text-sm font-semibold text-gray-900">{agent.name}</div>
              <div className="text-xs text-gray-500">{agent.id}</div>
            </div>
            <ChevronDown className={`w-4 h-4 text-gray-500 hidden sm:block transition-transform duration-150 ${showProfile ? 'rotate-180' : ''}`} />
          </button>

          {showProfile && (
            <div className="absolute right-0 mt-2 w-72 bg-white rounded-xl shadow-2xl border border-gray-200 overflow-hidden animate-in fade-in slide-in-from-top-2 duration-200 z-50">
              {/* Profile header */}
              <div className="px-4 py-3 border-b border-gray-100">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-lg bg-gradient-to-br from-purple-500 to-pink-500 flex items-center justify-center text-white font-bold text-base flex-shrink-0">
                    {agent.avatar}
                  </div>
                  <div className="flex-1 min-w-0">
                    <p className="text-sm font-semibold text-gray-900">{agent.name}</p>
                    <p className="text-xs text-gray-500">{agent.id}</p>
                  </div>
                </div>
                {/* Stats strip */}
                <div className="mt-3 grid grid-cols-3 gap-2">
                  <div className="bg-gray-50 rounded-lg p-2 text-center">
                    <div className="flex items-center justify-center gap-1 text-xs font-semibold text-gray-900">
                      <Star className="w-3 h-3 fill-amber-400 text-amber-400" />{agent.rating}
                    </div>
                    <div className="text-[10px] text-gray-500 mt-0.5">Rating</div>
                  </div>
                  <div className="bg-gray-50 rounded-lg p-2 text-center">
                    <div className="text-xs font-semibold text-gray-900">{agent.totalDeliveries}</div>
                    <div className="text-[10px] text-gray-500 mt-0.5">Deliveries</div>
                  </div>
                  <div className="bg-gray-50 rounded-lg p-2 text-center">
                    <div className="text-xs font-semibold text-gray-900 truncate">{agent.phone?.slice(-5) || '—'}</div>
                    <div className="text-[10px] text-gray-500 mt-0.5">Contact</div>
                  </div>
                </div>
              </div>

              {/* Menu items */}
              <div className="p-2">
                {[
                  { icon: MapPin,    label: 'My Routes'   },
                  { icon: BarChart3, label: 'Performance' },
                  { icon: Phone,     label: 'Support'     },
                // eslint-disable-next-line no-unused-vars
                ].map(({ icon: Icon, label }) => (
                  <button key={label}
                    className="w-full text-left px-3 py-2 text-sm text-gray-700 hover:bg-gray-100 rounded-lg transition-colors flex items-center gap-2">
                    <Icon className="w-4 h-4 text-gray-500" />{label}
                  </button>
                ))}
                <div className="border-t border-gray-200 my-1" />
                <button
                  onClick={() => navigate('/login')}
                  className="w-full text-left px-3 py-2 text-sm text-red-600 hover:bg-red-50 rounded-lg transition-colors flex items-center gap-2">
                  <LogOut className="w-4 h-4" />Sign Out
                </button>
              </div>
            </div>
          )}
        </div>

      </div>
    </nav>
  );
}

/* ── Duty status dropdown ─────────────────────────────────────────────────── */
function DutyDropdown({ current, options, dutyLabels, dutyColors, dutyDotClr, onChange }) {
  const [open, setOpen] = useState(false);
  const ref = useRef(null);
  useEffect(() => {
    const h = e => { if (ref.current && !ref.current.contains(e.target)) setOpen(false); };
    document.addEventListener('mousedown', h);
    return () => document.removeEventListener('mousedown', h);
  }, []);
  return (
    <div className="relative" ref={ref}>
      <button onClick={() => setOpen(p => !p)}
        className={`flex items-center gap-2 px-3 py-1.5 rounded-lg text-sm font-medium transition-colors ${dutyColors[current]}`}>
        <span className={`w-2 h-2 rounded-full ${dutyDotClr[current]} ${current === 'on' ? 'animate-pulse' : ''}`} />
        {dutyLabels[current]}
        <ChevronDown className={`w-3 h-3 transition-transform ${open ? 'rotate-180' : ''}`} />
      </button>
      {open && (
        <div className="absolute left-0 mt-1 w-36 bg-white rounded-lg shadow-xl border border-gray-200 overflow-hidden z-50">
          {options.map(o => (
            <button key={o.key} onClick={() => { onChange(o.key); setOpen(false); }}
              className={`w-full text-left px-3 py-2 text-sm flex items-center gap-2 hover:bg-gray-50 transition-colors ${current === o.key ? 'font-semibold text-gray-900' : 'text-gray-700'}`}>
              <span className={`w-2 h-2 rounded-full ${o.dot}`} />{o.label}
            </button>
          ))}
        </div>
      )}
    </div>
  );
}