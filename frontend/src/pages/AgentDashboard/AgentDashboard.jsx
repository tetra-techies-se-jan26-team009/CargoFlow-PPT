import AgentNavbar from '../../components/AgentNavbar';
import { useState } from 'react';
import {
  Package, MapPin, Navigation, Clock, CheckCircle,
  Scan, DollarSign, TrendingUp, Star, ChevronRight,
  Settings, List, BarChart3, MessageSquare,
  Route as RouteIcon, Zap, Award, Target, Phone
} from 'lucide-react';
// eslint-disable-next-line no-unused-vars
import { motion } from 'motion/react';
import ActiveDeliveryTracker   from './ActiveDeliveryTracker';
import DeliveryCard            from './DeliveryCard';
import ScannerModal            from './ScannerModal';
import DeliveryConfirmationModal from './DeliveryConfirmationModal';

// ── Static data ───────────────────────────────────────────────────────────────
const agentData = {
  name: 'Ravi Kumar', id: 'AG-1024', avatar: 'RK',
  rating: 4.8, totalDeliveries: 1247, phone: '+91 98765 43210',
};

const INITIAL_STATS = {
  completed: 8, pending: 4, total: 12, earnings: 2840, distance: 45.2,
};

const activeDelivery = {
  id: 'SH-20250301', customer: 'Rajesh Sharma', phone: '+91 98765 12345',
  address: '123 MG Road, Kormangala, Bangalore - 560034',
  landmark: 'Near Coffee Day, Blue Building',
  packageType: 'Electronics', weight: '2.5 kg', value: '₹45,000',
  cod: true, codAmount: '₹45,000',
  instructions: 'Call before delivery. Handle with care - fragile items.',
  pickupTime: '09:30 AM', expectedDelivery: '02:30 PM', distance: '3.2 km',
  status: 'In Transit',
  currentLocation: { lat: 12.9352, lng: 77.6245 },
  destination:     { lat: 12.9279, lng: 77.6271 },
};

const INITIAL_UPCOMING = [
  { id: 'SH-20250302', customer: 'Priya Nair',  phone: '+91 98765 23456', address: '45 Residency Road, Richmond Town, Bangalore - 560025', packageType: 'Documents', weight: '0.5 kg', cod: false, expectedTime: '03:15 PM', distance: '5.1 km', priority: 'normal' },
  { id: 'SH-20250303', customer: 'Arjun Das',   phone: '+91 98765 34567', address: '78 Brigade Road, MG Road, Bangalore - 560001',         packageType: 'Clothing',  weight: '1.2 kg', cod: true, codAmount: '₹2,500', expectedTime: '04:00 PM', distance: '4.8 km', priority: 'high' },
  { id: 'SH-20250304', customer: 'Meena Shah',  phone: '+91 98765 45678', address: '12 Indiranagar, 100 Feet Road, Bangalore - 560038',    packageType: 'Food Items',weight: '3.0 kg', cod: false, expectedTime: '05:30 PM', distance: '6.5 km', priority: 'normal' },
];

const INITIAL_COMPLETED = [
  { id: 'SH-20250298', customer: 'Kiran Roy',     address: 'Koramangala, Bangalore', deliveredAt: '11:45 AM', amount: '₹3,200', rating: 5 },
  { id: 'SH-20250297', customer: 'Sunita Reddy',  address: 'Jayanagar, Bangalore',   deliveredAt: '10:30 AM', amount: '₹1,800', rating: 5 },
  { id: 'SH-20250296', customer: 'Vikram Singh',  address: 'HSR Layout, Bangalore',  deliveredAt: '09:15 AM', amount: '₹5,600', rating: 4 },
];

// ── Toast ─────────────────────────────────────────────────────────────────────
function useToast() {
  const [toasts, setToasts] = useState([]);
  const add = (msg, type = 'info') => {
    const id = Date.now();
    setToasts(t => [...t, { id, msg, type }]);
    setTimeout(() => setToasts(t => t.filter(x => x.id !== id)), 3500);
  };
  return { toasts, add };
}

function ToastStack({ toasts }) {
  const bg = { info: '#1E40AF', success: '#065F46', warn: '#92400E', error: '#991B1B' };
  return (
    <div className="fixed bottom-6 right-6 z-[200] flex flex-col gap-2 pointer-events-none">
      {toasts.map(t => (
        <motion.div key={t.id}
          initial={{ opacity: 0, y: 12 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0 }}
          style={{ background: bg[t.type] || bg.info }}
          className="text-white text-sm font-medium px-4 py-3 rounded-xl shadow-2xl flex items-center gap-2 min-w-[220px]"
        >
          {t.type === 'success' && '✅'}
          {t.type === 'warn'    && '⚠️'}
          {t.type === 'error'   && '❌'}
          {t.type === 'info'    && 'ℹ️'}
          {t.msg}
        </motion.div>
      ))}
    </div>
  );
}

// ── Quick-action route modal ──────────────────────────────────────────────────
function RouteModal({ deliveries, onClose }) {
  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
      <div onClick={onClose} className="absolute inset-0 bg-black/50 backdrop-blur-sm" />
      <motion.div initial={{ opacity: 0, scale: 0.95 }} animate={{ opacity: 1, scale: 1 }}
        className="relative bg-white rounded-2xl shadow-2xl max-w-md w-full p-6">
        <div className="flex items-center justify-between mb-4">
          <h3 className="text-lg font-bold text-gray-900">Today's Route</h3>
          <button onClick={onClose} className="w-8 h-8 rounded-full bg-gray-100 flex items-center justify-center text-gray-500 hover:bg-gray-200">✕</button>
        </div>
        <div className="space-y-3">
          {[activeDelivery, ...deliveries].map((d, i) => (
            <div key={d.id} className="flex items-center gap-3 p-3 bg-gray-50 rounded-xl">
              <div className="w-7 h-7 rounded-full bg-blue-600 text-white text-xs font-bold flex items-center justify-center flex-shrink-0">{i + 1}</div>
              <div className="flex-1 min-w-0">
                <div className="text-sm font-semibold text-gray-900 truncate">{d.customer}</div>
                <div className="text-xs text-gray-500 truncate">{d.address}</div>
              </div>
              <div className="text-xs text-blue-600 font-medium whitespace-nowrap">{d.distance}</div>
            </div>
          ))}
        </div>
        <button onClick={onClose} className="mt-4 w-full py-2.5 bg-blue-600 text-white rounded-xl text-sm font-semibold hover:bg-blue-700 transition-colors">Close</button>
      </motion.div>
    </div>
  );
}

// ── Performance modal ─────────────────────────────────────────────────────────
function PerformanceModal({ onClose }) {
  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
      <div onClick={onClose} className="absolute inset-0 bg-black/50 backdrop-blur-sm" />
      <motion.div initial={{ opacity: 0, scale: 0.95 }} animate={{ opacity: 1, scale: 1 }}
        className="relative bg-white rounded-2xl shadow-2xl max-w-md w-full p-6">
        <div className="flex items-center justify-between mb-4">
          <h3 className="text-lg font-bold text-gray-900">Performance Report</h3>
          <button onClick={onClose} className="w-8 h-8 rounded-full bg-gray-100 flex items-center justify-center text-gray-500 hover:bg-gray-200">✕</button>
        </div>
        <div className="grid grid-cols-2 gap-3 mb-4">
          {[
            { label: 'This Week',       value: '84 deliveries',  color: 'bg-blue-50 text-blue-700' },
            { label: 'Success Rate',    value: '98%',            color: 'bg-green-50 text-green-700' },
            { label: 'Avg Rating',      value: '4.8 ⭐',         color: 'bg-amber-50 text-amber-700' },
            { label: 'Weekly Earnings', value: '₹18,450',        color: 'bg-purple-50 text-purple-700' },
          ].map(s => (
            <div key={s.label} className={`p-3 rounded-xl ${s.color}`}>
              <div className="text-lg font-bold">{s.value}</div>
              <div className="text-xs mt-0.5 opacity-70">{s.label}</div>
            </div>
          ))}
        </div>
        <div className="p-3 bg-green-50 border border-green-200 rounded-xl flex items-center gap-2">
          <TrendingUp className="w-4 h-4 text-green-600" />
          <span className="text-sm text-green-700 font-medium">+12% earnings vs last week</span>
        </div>
        <button onClick={onClose} className="mt-4 w-full py-2.5 bg-blue-600 text-white rounded-xl text-sm font-semibold hover:bg-blue-700 transition-colors">Close</button>
      </motion.div>
    </div>
  );
}

// ── Support modal ─────────────────────────────────────────────────────────────
function SupportModal({ onClose, onToast }) {
  const [msg, setMsg] = useState('');
  const send = () => {
    if (!msg.trim()) return;
    onClose();
    onToast('Support request sent! We will get back to you shortly.', 'success');
  };
  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
      <div onClick={onClose} className="absolute inset-0 bg-black/50 backdrop-blur-sm" />
      <motion.div initial={{ opacity: 0, scale: 0.95 }} animate={{ opacity: 1, scale: 1 }}
        className="relative bg-white rounded-2xl shadow-2xl max-w-md w-full p-6">
        <div className="flex items-center justify-between mb-4">
          <h3 className="text-lg font-bold text-gray-900">Contact Support</h3>
          <button onClick={onClose} className="w-8 h-8 rounded-full bg-gray-100 flex items-center justify-center text-gray-500 hover:bg-gray-200">✕</button>
        </div>
        <div className="space-y-3">
          <div className="flex items-center gap-3 p-3 bg-blue-50 rounded-xl">
            <Phone className="w-5 h-5 text-blue-600" />
            <div>
              <div className="text-sm font-semibold text-gray-900">Helpline</div>
              <div className="text-sm text-blue-600">1800-123-4567 (24×7)</div>
            </div>
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Send a message</label>
            <textarea value={msg} onChange={e => setMsg(e.target.value)} rows={3}
              placeholder="Describe your issue…"
              className="w-full border border-gray-300 rounded-xl px-4 py-2.5 text-sm outline-none focus:ring-2 focus:ring-blue-500 resize-none" />
          </div>
        </div>
        <div className="flex gap-2 mt-4">
          <button onClick={onClose} className="flex-1 py-2.5 bg-gray-100 text-gray-700 rounded-xl text-sm font-medium hover:bg-gray-200 transition-colors">Cancel</button>
          <button onClick={send} className="flex-1 py-2.5 bg-blue-600 text-white rounded-xl text-sm font-semibold hover:bg-blue-700 transition-colors">Send</button>
        </div>
      </motion.div>
    </div>
  );
}

// ── Settings modal ────────────────────────────────────────────────────────────
function SettingsModal({ onClose, onToast }) {
  const [notifOn, setNotifOn]   = useState(true);
  const [soundOn, setSoundOn]   = useState(true);
  const [darkMode, setDarkMode] = useState(false);
  const save = () => { onClose(); onToast('Settings saved!', 'success'); };
  const Toggle = ({ val, onToggle }) => (
    <label className="relative inline-flex items-center cursor-pointer">
      <input type="checkbox" checked={val} onChange={onToggle} className="sr-only peer" />
      <div className="w-11 h-6 bg-gray-200 peer-focus:ring-4 peer-focus:ring-blue-300 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-blue-600" />
    </label>
  );
  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
      <div onClick={onClose} className="absolute inset-0 bg-black/50 backdrop-blur-sm" />
      <motion.div initial={{ opacity: 0, scale: 0.95 }} animate={{ opacity: 1, scale: 1 }}
        className="relative bg-white rounded-2xl shadow-2xl max-w-md w-full p-6">
        <div className="flex items-center justify-between mb-5">
          <h3 className="text-lg font-bold text-gray-900">Account Settings</h3>
          <button onClick={onClose} className="w-8 h-8 rounded-full bg-gray-100 flex items-center justify-center text-gray-500 hover:bg-gray-200">✕</button>
        </div>
        <div className="space-y-4">
          {[
            { label: 'Push Notifications', desc: 'New delivery alerts',      val: notifOn,  set: () => setNotifOn(p => !p)   },
            { label: 'Sound Alerts',       desc: 'Delivery sound effects',   val: soundOn,  set: () => setSoundOn(p => !p)   },
            { label: 'Dark Mode',          desc: 'App appearance',           val: darkMode, set: () => setDarkMode(p => !p)  },
          ].map(({ label, desc, val, set }) => (
            <div key={label} className="flex items-center justify-between p-3 bg-gray-50 rounded-xl">
              <div>
                <div className="text-sm font-medium text-gray-900">{label}</div>
                <div className="text-xs text-gray-500">{desc}</div>
              </div>
              <Toggle val={val} onToggle={set} />
            </div>
          ))}
        </div>
        <div className="flex gap-2 mt-5">
          <button onClick={onClose} className="flex-1 py-2.5 bg-gray-100 text-gray-700 rounded-xl text-sm font-medium hover:bg-gray-200 transition-colors">Cancel</button>
          <button onClick={save}  className="flex-1 py-2.5 bg-blue-600 text-white rounded-xl text-sm font-semibold hover:bg-blue-700 transition-colors">Save</button>
        </div>
      </motion.div>
    </div>
  );
}

// ══════════════════════════════════════════════════════════════════════════════
// MAIN DASHBOARD
// ══════════════════════════════════════════════════════════════════════════════
export function AgentDashboard() {
  const [showScanner,      setShowScanner]      = useState(false);
  const [showConfirmation, setShowConfirmation] = useState(false);
  const [selectedDelivery, setSelectedDelivery] = useState(null);
  const [activeTab,        setActiveTab]        = useState('active');
  const [stats,            setStats]            = useState(INITIAL_STATS);
  const [upcomingList,     setUpcomingList]      = useState(INITIAL_UPCOMING);
  const [completedList,    setCompletedList]     = useState(INITIAL_COMPLETED);

  // Quick-action modals
  const [showRoute,        setShowRoute]        = useState(false);
  const [showPerf,         setShowPerf]         = useState(false);
  const [showSupport,      setShowSupport]      = useState(false);
  const [showSettings,     setShowSettings]     = useState(false);

  const { toasts, add: toast } = useToast();

  // ── Handlers ──────────────────────────────────────────────────────────────
  const handleStartDelivery = (delivery) => {
    setSelectedDelivery(delivery);
    setShowScanner(true);
    toast(`Opening scanner for ${delivery.id}`, 'info');
  };

  const handleScanComplete = (code) => {
    setShowScanner(false);
    toast(`Package ${code} scanned successfully ✓`, 'success');
  };

  const handleDeliveryComplete = (delivery) => {
    setSelectedDelivery(delivery);
    setShowConfirmation(true);
  };

  const handleConfirmDelivery = (data) => {
    setShowConfirmation(false);
    setSelectedDelivery(null);
    // Move to completed list
    const delivered = upcomingList.find(d => d.id === data.deliveryId);
    if (delivered) {
      setUpcomingList(l => l.filter(d => d.id !== data.deliveryId));
      setCompletedList(l => [{
        id: data.deliveryId,
        customer: delivered.customer,
        address: delivered.address,
        deliveredAt: new Date().toLocaleTimeString('en-US', { hour: '2-digit', minute: '2-digit' }),
        amount: delivered.codAmount || '—',
        rating: data.rating || 5,
      }, ...l]);
      setStats(s => ({
        ...s,
        completed: s.completed + 1,
        pending:   Math.max(0, s.pending - 1),
        earnings:  s.earnings + 320,
      }));
    }
    toast(`Delivery ${data.deliveryId} confirmed! ${data.status === 'delivered' ? '✓' : '⚠'}`, data.status === 'delivered' ? 'success' : 'warn');
    setActiveTab('completed');
  };

  const handleCall = (delivery) => toast(`Calling ${delivery.customer} (${delivery.phone})…`, 'info');
  const handleMsg  = ({ delivery, text }) => toast(`Message sent to ${delivery.customer}: "${text}"`, 'success');
  const handleNav  = (delivery) => toast(`Opened navigation to ${delivery.customer}`, 'info');

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 via-blue-50/30 to-gray-50">
      <title>Dashboard</title>
      <AgentNavbar agent={agentData} />

      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6 space-y-6">

        {/* Welcome */}
        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }}
          className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div>
            <h1 className="text-2xl sm:text-3xl font-bold text-gray-900 tracking-tight">
              Welcome back, {agentData.name}!
            </h1>
            <p className="text-sm text-gray-600 mt-1 flex items-center gap-2">
              <MapPin className="w-4 h-4 text-blue-600" />Bangalore, Karnataka
              <span className="w-1 h-1 rounded-full bg-gray-400 mx-1" />
              <Clock className="w-4 h-4" />
              {new Date().toLocaleTimeString('en-US', { hour: '2-digit', minute: '2-digit' })}
            </p>
          </div>
          <button onClick={() => setShowScanner(true)}
            className="flex items-center gap-2 px-4 py-2.5 bg-gradient-to-r from-blue-600 to-blue-700 text-white rounded-xl hover:from-blue-700 hover:to-blue-800 transition-all shadow-lg shadow-blue-600/30">
            <Scan className="w-4 h-4" />
            <span className="text-sm font-semibold">Scan Package</span>
          </button>
        </motion.div>

        {/* Stats */}
        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-5 gap-3 sm:gap-4">
          <StatCard title="Completed"   value={stats.completed} total={stats.total}    icon={CheckCircle} color="green"   delay={0.1} />
          <StatCard title="Pending"     value={stats.pending}   total={stats.total}    icon={Package}     color="blue"    delay={0.2} />
          <StatCard title="Earnings"    value={`₹${stats.earnings}`}                   icon={DollarSign}  color="emerald" delay={0.3} />
          <StatCard title="Distance"    value={`${stats.distance} km`}                 icon={Navigation}  color="purple"  delay={0.4} />
          <StatCard title="Rating"      value={agentData.rating}                       icon={Star}        color="amber"   delay={0.5} />
        </div>

        {/* Active Tracker */}
        <ActiveDeliveryTracker
          delivery={activeDelivery}
          onComplete={() => handleDeliveryComplete(activeDelivery)}
          onCall={handleCall}
          onMessage={handleMsg}
          onNavigate={handleNav}
        />

        {/* Main Grid */}
        <div className="grid lg:grid-cols-3 gap-6">

          {/* Left — Deliveries */}
          <div className="lg:col-span-2 space-y-6">
            <div className="bg-white rounded-2xl shadow-sm border border-gray-200 overflow-hidden">
              <div className="border-b border-gray-200 flex">
                <TabButton active={activeTab === 'active'}    onClick={() => setActiveTab('active')}    icon={List}         label="Upcoming"  count={upcomingList.length} />
                <TabButton active={activeTab === 'completed'} onClick={() => setActiveTab('completed')} icon={CheckCircle}  label="Completed" count={completedList.length} />
              </div>
              <div className="p-6">
                {activeTab === 'active' ? (
                  upcomingList.length === 0 ? (
                    <div className="text-center py-12 text-gray-400">
                      <Package className="w-12 h-12 mx-auto mb-3 opacity-30" />
                      <p className="font-medium">No upcoming deliveries</p>
                      <p className="text-sm mt-1">All deliveries completed for today!</p>
                    </div>
                  ) : (
                    <div className="space-y-4">
                      {upcomingList.map((d, i) => (
                        <DeliveryCard key={d.id} delivery={d} index={i}
                          onStart={() => handleStartDelivery(d)}
                          onNavigate={() => { toast(`Navigation opened for ${d.customer}`, 'info'); window.open(`https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(d.address)}`, '_blank'); }}
                          onCall={() => toast(`Calling ${d.customer} (${d.phone})…`, 'info')}
                        />
                      ))}
                    </div>
                  )
                ) : (
                  <div className="space-y-4">
                    {completedList.map((d, i) => (
                      <CompletedDeliveryCard key={d.id} delivery={d} index={i} />
                    ))}
                  </div>
                )}
              </div>
            </div>
          </div>

          {/* Right — Sidebar */}
          <div className="space-y-6">
            {/* Weekly Earnings */}
            <motion.div initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }} transition={{ delay: 0.2 }}
              className="bg-gradient-to-br from-blue-600 via-blue-700 to-purple-700 rounded-2xl shadow-xl p-6 text-white relative overflow-hidden">
              <div className="absolute top-0 right-0 w-32 h-32 bg-white/10 rounded-full -mr-16 -mt-16" />
              <div className="absolute bottom-0 left-0 w-24 h-24 bg-white/10 rounded-full -ml-12 -mb-12" />
              <div className="relative">
                <div className="flex items-center justify-between mb-4">
                  <Zap className="w-6 h-6 text-yellow-300" />
                  <span className="px-2.5 py-1 bg-white/20 backdrop-blur-sm rounded-lg text-xs font-semibold">This Week</span>
                </div>
                <div className="mb-4">
                  <div className="text-sm font-medium text-blue-100">Total Earnings</div>
                  <div className="text-4xl font-bold mt-1 mb-2">₹18,450</div>
                  <div className="flex items-center gap-1 text-sm text-blue-100">
                    <TrendingUp className="w-4 h-4 text-green-300" />
                    <span>+12% from last week</span>
                  </div>
                </div>
                <div className="grid grid-cols-2 gap-3">
                  <div className="bg-white/10 backdrop-blur-sm rounded-lg p-3">
                    <div className="text-2xl font-bold">84</div>
                    <div className="text-xs text-blue-100 mt-1">Deliveries</div>
                  </div>
                  <div className="bg-white/10 backdrop-blur-sm rounded-lg p-3">
                    <div className="text-2xl font-bold">98%</div>
                    <div className="text-xs text-blue-100 mt-1">Success Rate</div>
                  </div>
                </div>
              </div>
            </motion.div>

            {/* Achievements */}
            <motion.div initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }} transition={{ delay: 0.3 }}
              className="bg-white rounded-2xl shadow-sm border border-gray-200 p-6">
              <div className="flex items-center justify-between mb-4">
                <h3 className="text-lg font-bold text-gray-900">Achievements</h3>
                <Award className="w-5 h-5 text-amber-500" />
              </div>
              <div className="space-y-3">
                <AchievementItem icon="🏆" title="Top Performer"  desc="100 deliveries this month" earned="2 days ago" />
                <AchievementItem icon="⭐" title="5-Star Rating"  desc="Maintained 4.8+ rating"    earned="1 week ago" />
                <AchievementItem icon="🎯" title="Perfect Week"   desc="All deliveries on time"     earned="1 week ago" />
              </div>
            </motion.div>

            {/* Quick Actions */}
            <motion.div initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }} transition={{ delay: 0.4 }}
              className="bg-white rounded-2xl shadow-sm border border-gray-200 p-6">
              <h3 className="text-lg font-bold text-gray-900 mb-4">Quick Actions</h3>
              <div className="space-y-2">
                <QuickActionButton icon={RouteIcon}  label="View Today's Route"   onClick={() => setShowRoute(true)} />
                <QuickActionButton icon={BarChart3}  label="Performance Report"   onClick={() => setShowPerf(true)} />
                <QuickActionButton icon={MessageSquare} label="Contact Support"   onClick={() => setShowSupport(true)} />
                <QuickActionButton icon={Settings}   label="Account Settings"     onClick={() => setShowSettings(true)} />
              </div>
            </motion.div>

            {/* Pro Tip */}
            <motion.div initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }} transition={{ delay: 0.5 }}
              className="bg-gradient-to-br from-amber-50 to-orange-50 rounded-2xl border border-amber-200 p-6">
              <div className="flex items-start gap-3">
                <div className="w-10 h-10 rounded-lg bg-amber-500 flex items-center justify-center flex-shrink-0">
                  <Target className="w-5 h-5 text-white" />
                </div>
                <div>
                  <h4 className="font-bold text-gray-900 mb-1">Pro Tip</h4>
                  <p className="text-sm text-gray-700">
                    Call customers 10 minutes before arrival to ensure smooth delivery and better ratings!
                  </p>
                </div>
              </div>
            </motion.div>
          </div>
        </div>
      </main>

      {/* ── Modals ─────────────────────────────────────────────────────────── */}
      {showScanner && (
        <ScannerModal onClose={() => setShowScanner(false)} onScan={handleScanComplete} />
      )}
      {showConfirmation && selectedDelivery && (
        <DeliveryConfirmationModal
          delivery={selectedDelivery}
          onClose={() => { setShowConfirmation(false); setSelectedDelivery(null); }}
          onConfirm={handleConfirmDelivery}
        />
      )}
      {showRoute    && <RouteModal       deliveries={upcomingList} onClose={() => setShowRoute(false)} />}
      {showPerf     && <PerformanceModal onClose={() => setShowPerf(false)} />}
      {showSupport  && <SupportModal     onClose={() => setShowSupport(false)} onToast={toast} />}
      {showSettings && <SettingsModal    onClose={() => setShowSettings(false)} onToast={toast} />}

      <ToastStack toasts={toasts} />
    </div>
  );
}

// ── Sub-components ────────────────────────────────────────────────────────────
function StatCard({ title, value, total, icon, color, delay }) {
  const Icon = icon;
  const colors = {
    blue:    'from-blue-500 to-blue-600',
    green:   'from-green-500 to-green-600',
    purple:  'from-purple-500 to-purple-600',
    emerald: 'from-emerald-500 to-emerald-600',
    amber:   'from-amber-500 to-amber-600',
  };
  return (
    <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay }}
      className="bg-white rounded-xl shadow-sm border border-gray-200 p-4 hover:shadow-md transition-all">
      <div className="flex items-center justify-between mb-3">
        <div className={`w-10 h-10 rounded-lg bg-gradient-to-br ${colors[color]} flex items-center justify-center shadow-lg`}>
          <Icon className="w-5 h-5 text-white" />
        </div>
      </div>
      <div className="text-2xl font-bold text-gray-900">{value}</div>
      {total && <div className="text-xs text-gray-500 mt-1">of {total} total</div>}
      <div className="text-sm text-gray-600 font-medium mt-1">{title}</div>
    </motion.div>
  );
}

function TabButton({ active, onClick, icon, label, count }) {
  const Icon = icon;
  return (
    <button onClick={onClick}
      className={`flex-1 flex items-center justify-center gap-2 px-4 py-3 text-sm font-medium transition-all ${
        active ? 'text-blue-700 border-b-2 border-blue-600 bg-blue-50' : 'text-gray-600 hover:text-gray-900 hover:bg-gray-50'
      }`}>
      <Icon className="w-4 h-4" />
      {label}
      {count !== undefined && (
        <span className={`px-2 py-0.5 rounded-full text-xs font-semibold ${active ? 'bg-blue-600 text-white' : 'bg-gray-200 text-gray-700'}`}>
          {count}
        </span>
      )}
    </button>
  );
}

function CompletedDeliveryCard({ delivery, index }) {
  return (
    <motion.div initial={{ opacity: 0, x: -20 }} animate={{ opacity: 1, x: 0 }} transition={{ delay: index * 0.05 }}
      className="flex items-center justify-between p-4 bg-green-50 border border-green-200 rounded-xl hover:shadow-md transition-all">
      <div className="flex items-center gap-3 flex-1">
        <div className="w-10 h-10 rounded-lg bg-green-500 flex items-center justify-center flex-shrink-0">
          <CheckCircle className="w-5 h-5 text-white" />
        </div>
        <div className="flex-1 min-w-0">
          <div className="font-semibold text-gray-900">{delivery.customer}</div>
          <div className="text-sm text-gray-600 truncate">{delivery.address}</div>
          <div className="flex items-center gap-2 mt-1">
            <span className="text-xs text-gray-500">{delivery.deliveredAt}</span>
            <span className="text-xs font-semibold text-green-700">{delivery.amount}</span>
          </div>
        </div>
      </div>
      <div className="flex items-center gap-0.5 ml-3">
        {[...Array(5)].map((_, i) => (
          <Star key={i} className={`w-4 h-4 ${i < delivery.rating ? 'fill-amber-400 text-amber-400' : 'text-gray-300'}`} />
        ))}
      </div>
    </motion.div>
  );
}

function AchievementItem({ icon, title, desc, earned }) {
  return (
    <div className="flex items-center gap-3 p-3 bg-gray-50 rounded-xl hover:bg-gray-100 transition-colors">
      <div className="text-2xl">{icon}</div>
      <div className="flex-1 min-w-0">
        <div className="font-semibold text-gray-900 text-sm">{title}</div>
        <div className="text-xs text-gray-600">{desc}</div>
        <div className="text-xs text-gray-500 mt-0.5">{earned}</div>
      </div>
    </div>
  );
}

function QuickActionButton({ icon, label, onClick }) {
  const Icon = icon;
  return (
    <button onClick={onClick}
      className="w-full flex items-center justify-between p-3 rounded-lg hover:bg-gray-50 transition-colors group">
      <div className="flex items-center gap-3">
        <Icon className="w-5 h-5 text-gray-600 group-hover:text-blue-600 transition-colors" />
        <span className="text-sm font-medium text-gray-700 group-hover:text-gray-900">{label}</span>
      </div>
      <ChevronRight className="w-4 h-4 text-gray-400 group-hover:text-gray-600 group-hover:translate-x-1 transition-all" />
    </button>
  );
}