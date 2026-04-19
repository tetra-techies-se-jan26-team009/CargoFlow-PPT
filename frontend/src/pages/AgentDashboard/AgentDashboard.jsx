import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { 
  Package, MapPin, Navigation, Clock, CheckCircle, 
  Scan, DollarSign, TrendingUp, Star, List, 
  BarChart3, MessageSquare, Route as RouteIcon, 
  Zap, Award, Target, Phone, ChevronRight,
  ShieldCheck, AlertCircle, Search, Activity
} from 'lucide-react';

// Hooks & API Utility
import { useToast } from '../../hooks/useToast'; 
import { getAgentDashboard, updateShipmentStatus } from '../../utils/agentAPI';

// Components
import ActiveDeliveryTracker from './ActiveDeliveryTracker';
import DeliveryCard from './DeliveryCard';
import ScannerModal from './ScannerModal';
import DeliveryConfirmationModal from './DeliveryConfirmationModal';
import AgentNavbar from '../../components/AgentNavbar';

export function AgentDashboard() {
  const { addToast } = useToast();
  const [loading, setLoading] = useState(true);
  const [stats, setStats] = useState({ completed: 0, pending: 0, total: 0, earnings: 0, distance: 0, rating: 0 });
  const [activeDelivery, setActiveDelivery] = useState(null);
  const [upcomingList, setUpcomingList] = useState([]);
  const [activeTab, setActiveTab] = useState('active');
  const [showScanner, setShowScanner] = useState(false);
  const [showConfirmation, setShowConfirmation] = useState(false);
  const [selectedDelivery, setSelectedDelivery] = useState(null);

  const loadDashboardData = async () => {
    try {
      const data = await getAgentDashboard();
      setStats(data.summary);
      if (data.active_delivery) {
        setActiveDelivery({
          ...data.active_delivery,
          id: data.active_delivery.tracking_id,
          customer: data.active_delivery.customer.name,
          phone: data.active_delivery.customer.phone,
          address: `${data.active_delivery.delivery_address.line}, ${data.active_delivery.delivery_address.city}`,
          packageType: data.active_delivery.package.weight + " kg",
          codAmount: `₹${data.active_delivery.package.price}`,
          cod: data.active_delivery.package.price > 0
        });
      } else {
        setActiveDelivery(null);
      }
      setLoading(false);
    } catch (err) {
      addToast("Failed to sync dashboard", "error");
      setLoading(false);
    }
  };

  useEffect(() => { loadDashboardData(); }, []);

  if (loading) return (
    <div className="h-screen w-full flex items-center justify-center bg-[#F8FAFC]">
      <div className="w-8 h-8 border-2 border-blue-600/20 border-t-blue-600 rounded-full animate-spin" />
    </div>
  );

  return (
    <div className="min-h-screen bg-[#F8FAFC] text-slate-900 font-sans selection:bg-blue-100">
      <AgentNavbar agent={{ name: 'Logistics Pro', rating: stats.rating }} />

      <main className="max-w-[1280px] mx-auto px-4 py-6 space-y-6">
        
        {/* Compact Header */}
        <header className="flex flex-col md:flex-row md:items-center justify-between gap-4 border-b border-slate-200 pb-6">
          <div className="space-y-0.5">
            <div className="flex items-center gap-2 text-blue-600 font-bold text-[10px] uppercase tracking-widest">
              <span className="w-1.5 h-1.5 rounded-full bg-blue-600 animate-pulse" />
              Live Operations
            </div>
            <h1 className="text-2xl font-extrabold tracking-tight text-slate-950">
              Fleet <span className="text-blue-600">Console</span>
            </h1>
          </div>
          
          <div className="flex items-center gap-4">
            <div className="hidden lg:block text-right border-r border-slate-200 pr-4">
              <span className="block text-[9px] font-black text-slate-400 uppercase tracking-widest">Network</span>
              <span className="text-xs font-bold text-emerald-600 flex items-center gap-1 justify-end">
                <ShieldCheck className="w-3.5 h-3.5" /> Secure
              </span>
            </div>
            <button 
              onClick={() => setShowScanner(true)}
              className="flex items-center gap-2 px-5 py-2.5 bg-slate-950 text-white rounded-xl shadow-lg hover:bg-blue-600 transition-all duration-300"
            >
              <Scan className="w-4 h-4" />
              <span className="font-bold tracking-tight text-xs uppercase">Scan Unit</span>
            </button>
          </div>
        </header>

        {/* Compact Stats Row */}
        <section className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-4">
          <MetricCard title="Gross Earnings" value={`₹${stats.earnings}`} icon={DollarSign} color="blue" />
          <MetricCard title="Completed" value={stats.completed} icon={CheckCircle} color="emerald" />
          <MetricCard title="Route" value={`${stats.distance}km`} icon={RouteIcon} color="slate" />
          <MetricCard title="Rating" value={stats.rating} icon={Star} color="amber" />
          <MetricCard title="Pending" value={stats.pending} icon={Package} color="blue" />
        </section>

        <div className="grid grid-cols-1 xl:grid-cols-12 gap-6 items-start">
          
          {/* Main Content (Assignments) */}
          <div className="xl:col-span-8 space-y-6">
            <section>
              <div className="flex items-center justify-between mb-3">
                <h2 className="text-sm font-black text-slate-900 flex items-center gap-2 uppercase tracking-wider">
                  <Activity className="w-4 h-4 text-blue-600" /> Active Assignment
                </h2>
              </div>
              
              {activeDelivery ? (
                <div className="ring-1 ring-slate-200 rounded-2xl shadow-xl shadow-slate-100 overflow-hidden scale-95 origin-top-left">
                  <ActiveDeliveryTracker
                    delivery={activeDelivery}
                    onComplete={() => { setSelectedDelivery(activeDelivery); setShowConfirmation(true); }}
                  />
                </div>
              ) : (
                <div className="h-48 bg-white border-2 border-dashed border-slate-200 rounded-2xl flex flex-col items-center justify-center p-6 text-center">
                  <Package className="w-8 h-8 text-slate-200 mb-2" />
                  <p className="text-slate-400 font-bold uppercase tracking-widest text-[10px]">Awaiting Dispatch</p>
                </div>
              )}
            </section>

            {/* Shipment Manifest */}
            <section className="bg-white rounded-2xl border border-slate-200 shadow-sm overflow-hidden">
              <div className="px-6 py-4 border-b border-slate-100 flex items-center justify-between bg-slate-50/40">
                <nav className="flex gap-1.5 bg-slate-200/50 p-1 rounded-lg">
                  <TabButton active={activeTab === 'active'} onClick={() => setActiveTab('active')} label="Manifest" />
                  <TabButton active={activeTab === 'completed'} onClick={() => setActiveTab('completed')} label="Logs" />
                </nav>
              </div>

              <div className="p-4 min-h-[300px]">
                <AnimatePresence mode="wait">
                  {activeTab === 'active' ? (
                    <motion.div key="active" initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="space-y-3">
                      {upcomingList.length > 0 ? upcomingList.map((d, i) => (
                        <DeliveryCard key={d.id} delivery={d} index={i} onStart={() => {}} />
                      )) : <p className="text-center py-10 text-[10px] text-slate-400 uppercase font-bold tracking-widest">No pending manifest</p>}
                    </motion.div>
                  ) : <div className="py-10 text-center text-[10px] text-slate-400 uppercase font-bold tracking-widest">Processing logs...</div>}
                </AnimatePresence>
              </div>
            </section>
          </div>

          {/* Performance Sidebar */}
          <aside className="xl:col-span-4 space-y-6">
            <div className="bg-slate-950 rounded-2xl p-6 text-white relative overflow-hidden shadow-xl">
              <div className="relative z-10 space-y-6">
                <div className="flex items-center justify-between">
                  <span className="text-[9px] font-black tracking-[0.2em] text-white/40 uppercase">Performance Pro</span>
                  <Target className="w-4 h-4 text-blue-400" />
                </div>
                <div>
                  <div className="flex items-baseline gap-2">
                    <span className="text-4xl font-black tabular-nums">82<span className="text-xl text-white/30">%</span></span>
                  </div>
                  <div className="w-full h-1.5 bg-white/10 rounded-full mt-4 overflow-hidden">
                    <div className="h-full bg-blue-500 w-[82%]" />
                  </div>
                </div>
                <div className="pt-4 border-t border-white/10 grid grid-cols-2 gap-4">
                  <div>
                    <p className="text-white/30 text-[8px] font-bold uppercase mb-1 tracking-widest">On-Time</p>
                    <p className="text-sm font-black">99.4%</p>
                  </div>
                  <div>
                    <p className="text-white/30 text-[8px] font-bold uppercase mb-1 tracking-widest">Bonus</p>
                    <p className="text-sm font-black text-emerald-400">₹840</p>
                  </div>
                </div>
              </div>
            </div>

            <div className="bg-white rounded-2xl border border-slate-200 p-6 space-y-4">
              <h3 className="font-black text-slate-900 uppercase tracking-widest text-[10px]">Support</h3>
              <div className="space-y-2">
                <SupportLink icon={Phone} title="Helpline" color="red" />
                <SupportLink icon={MessageSquare} title="Dispatch" color="blue" />
              </div>
            </div>
          </aside>
        </div>
      </main>
    </div>
  );
}

function MetricCard({ title, value, icon: Icon, color }) {
  const accent = { blue: 'bg-blue-600', emerald: 'bg-emerald-600', slate: 'bg-slate-900', amber: 'bg-amber-500' };
  return (
    <div className="bg-white p-5 rounded-2xl border border-slate-200 shadow-sm transition-all hover:translate-y-[-2px]">
      <div className={`w-9 h-9 rounded-xl ${accent[color]} flex items-center justify-center mb-4 shadow-md`}>
        <Icon className="w-4.5 h-4.5 text-white" />
      </div>
      <div className="text-xl font-black text-slate-950 tracking-tight">{value}</div>
      <div className="text-[9px] font-black text-slate-400 uppercase tracking-widest mt-1">{title}</div>
    </div>
  );
}

function TabButton({ active, onClick, label }) {
  return (
    <button onClick={onClick} className={`px-5 py-1.5 rounded-md text-[9px] font-black tracking-widest transition-all ${active ? 'bg-white text-blue-600 shadow-sm' : 'text-slate-400 hover:text-slate-600'}`}>
      {label}
    </button>
  );
}

function SupportLink({ icon: Icon, title, color }) {
  const themes = { red: 'bg-red-50 text-red-600', blue: 'bg-blue-50 text-blue-600' };
  return (
    <button className="w-full flex items-center justify-between p-3 rounded-xl hover:bg-slate-50 transition-all border border-transparent hover:border-slate-100">
      <div className="flex items-center gap-3">
        <div className={`w-8 h-8 rounded-lg ${themes[color]} flex items-center justify-center`}><Icon className="w-4 h-4" /></div>
        <p className="text-[9px] font-black text-slate-950 tracking-widest uppercase">{title}</p>
      </div>
      <ChevronRight className="w-3.5 h-3.5 text-slate-200" />
    </button>
  );
}