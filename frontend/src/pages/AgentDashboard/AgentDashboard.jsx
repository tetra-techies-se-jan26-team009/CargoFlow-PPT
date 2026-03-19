import { useState } from 'react';
import {
  Package,
  MapPin,
  Navigation,
  Clock,
  CheckCircle,
  Camera,
  Scan,
  DollarSign,
  TrendingUp,
  Star,
  ChevronRight,
  Settings,
  List,
  BarChart3,
  MessageSquare,
  Route as RouteIcon,
  Zap,
  Award,
  Target
} from 'lucide-react';
// eslint-disable-next-line no-unused-vars
import { motion } from 'motion/react';
import ActiveDeliveryTracker from './ActiveDeliveryTracker';
import DeliveryCard from './DeliveryCard';
import ScannerModal from './ScannerModal';
import DeliveryConfirmationModal from './DeliveryConfirmationModal';
import AgentNavbar from '../../components/AgentNavbar';
// Mock data for agent
const agentData = {
  name: 'Ravi Kumar',
  id: 'AG-1024',
  avatar: 'RK',
  rating: 4.8,
  totalDeliveries: 1247,
  phone: '+91 98765 43210',
};

const todayStats = {
  completed: 8,
  pending: 4,
  total: 12,
  earnings: 2840,
  distance: 45.2,
};

const activeDelivery = {
  id: 'SH-20250301',
  customer: 'Rajesh Sharma',
  phone: '+91 98765 12345',
  address: '123 MG Road, Kormangala, Bangalore - 560034',
  landmark: 'Near Coffee Day, Blue Building',
  packageType: 'Electronics',
  weight: '2.5 kg',
  value: '₹45,000',
  cod: true,
  codAmount: '₹45,000',
  instructions: 'Call before delivery. Handle with care - fragile items.',
  pickupTime: '09:30 AM',
  expectedDelivery: '02:30 PM',
  distance: '3.2 km',
  status: 'In Transit',
  currentLocation: { lat: 12.9352, lng: 77.6245 },
  destination: { lat: 12.9279, lng: 77.6271 },
};

const upcomingDeliveries = [
  {
    id: 'SH-20250302',
    customer: 'Priya Nair',
    phone: '+91 98765 23456',
    address: '45 Residency Road, Richmond Town, Bangalore - 560025',
    packageType: 'Documents',
    weight: '0.5 kg',
    cod: false,
    expectedTime: '03:15 PM',
    distance: '5.1 km',
    priority: 'normal',
  },
  {
    id: 'SH-20250303',
    customer: 'Arjun Das',
    phone: '+91 98765 34567',
    address: '78 Brigade Road, MG Road, Bangalore - 560001',
    packageType: 'Clothing',
    weight: '1.2 kg',
    cod: true,
    codAmount: '₹2,500',
    expectedTime: '04:00 PM',
    distance: '4.8 km',
    priority: 'high',
  },
  {
    id: 'SH-20250304',
    customer: 'Meena Shah',
    phone: '+91 98765 45678',
    address: '12 Indiranagar, 100 Feet Road, Bangalore - 560038',
    packageType: 'Food Items',
    weight: '3.0 kg',
    cod: false,
    expectedTime: '05:30 PM',
    distance: '6.5 km',
    priority: 'normal',
  },
];

const recentDeliveries = [
  {
    id: 'SH-20250298',
    customer: 'Kiran Roy',
    address: 'Koramangala, Bangalore',
    deliveredAt: '11:45 AM',
    amount: '₹3,200',
    rating: 5,
  },
  {
    id: 'SH-20250297',
    customer: 'Sunita Reddy',
    address: 'Jayanagar, Bangalore',
    deliveredAt: '10:30 AM',
    amount: '₹1,800',
    rating: 5,
  },
  {
    id: 'SH-20250296',
    customer: 'Vikram Singh',
    address: 'HSR Layout, Bangalore',
    deliveredAt: '09:15 AM',
    amount: '₹5,600',
    rating: 4,
  },
];

export function AgentDashboard() {
  const [showScanner, setShowScanner] = useState(false);
  const [showConfirmation, setShowConfirmation] = useState(false);
  const [selectedDelivery, setSelectedDelivery] = useState(null);
  const [activeTab, setActiveTab] = useState('active');

  const handleStartDelivery = (delivery) => {
    setSelectedDelivery(delivery);
    setShowScanner(true);
  };

  const handleScanComplete = (code) => {
    setShowScanner(false);
    // In real app, validate the scanned code
    console.log('Scanned code:', code);
  };

  const handleDeliveryComplete = (delivery) => {
    setSelectedDelivery(delivery);
    setShowConfirmation(true);
  };

  const handleConfirmDelivery = (data) => {
    console.log('Delivery confirmed:', data);
    setShowConfirmation(false);
    setSelectedDelivery(null);
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 via-blue-50/30 to-gray-50">
      <AgentNavbar agent={agentData} />

      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6 space-y-6">
        {/* Welcome Header */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="flex flex-col sm:flex-row sm:items-center justify-between gap-4"
        >
          <div>
            <h1 className="text-2xl sm:text-3xl font-bold text-gray-900 tracking-tight">
              Welcome back, {agentData.name}! 👋
            </h1>
            <p className="text-sm text-gray-600 mt-1 flex items-center gap-2">
              <MapPin className="w-4 h-4 text-blue-600" />
              Bangalore, Karnataka
              <span className="w-1 h-1 rounded-full bg-gray-400 mx-1"></span>
              <Clock className="w-4 h-4" />
              {new Date().toLocaleTimeString('en-US', { hour: '2-digit', minute: '2-digit' })}
            </p>
          </div>

          <div className="flex items-center gap-3">
            <button
              onClick={() => setShowScanner(true)}
              className="flex items-center gap-2 px-4 py-2.5 bg-gradient-to-r from-blue-600 to-blue-700 text-white rounded-xl hover:from-blue-700 hover:to-blue-800 transition-all shadow-lg shadow-blue-600/30"
            >
              <Scan className="w-4 h-4" />
              <span className="text-sm font-semibold">Scan Package</span>
            </button>
          </div>
        </motion.div>

        {/* Today's Stats */}
        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-5 gap-3 sm:gap-4">
          <StatCard
            title="Completed"
            value={todayStats.completed}
            total={todayStats.total}
            icon={CheckCircle}
            color="green"
            delay={0.1}
          />
          <StatCard
            title="Pending"
            value={todayStats.pending}
            total={todayStats.total}
            icon={Package}
            color="blue"
            delay={0.2}
          />
          <StatCard
            title="Earnings"
            value={`₹${todayStats.earnings}`}
            icon={DollarSign}
            color="emerald"
            delay={0.3}
          />
          <StatCard
            title="Distance"
            value={`${todayStats.distance} km`}
            icon={Navigation}
            color="purple"
            delay={0.4}
          />
          <StatCard
            title="Rating"
            value={agentData.rating}
            icon={Star}
            color="amber"
            delay={0.5}
          />
        </div>

        {/* Active Delivery Tracker */}
        {activeDelivery && (
          <ActiveDeliveryTracker
            delivery={activeDelivery}
            onComplete={() => handleDeliveryComplete(activeDelivery)}
          />
        )}

        {/* Main Content Grid */}
        <div className="grid lg:grid-cols-3 gap-6">
          {/* Left Column - Deliveries List */}
          <div className="lg:col-span-2 space-y-6">
            {/* Tabs */}
            <div className="bg-white rounded-2xl shadow-sm border border-gray-200 overflow-hidden">
              <div className="border-b border-gray-200">
                <div className="flex">
                  <TabButton
                    active={activeTab === 'active'}
                    onClick={() => setActiveTab('active')}
                    icon={List}
                    label="Upcoming Deliveries"
                    count={upcomingDeliveries.length}
                  />
                  <TabButton
                    active={activeTab === 'completed'}
                    onClick={() => setActiveTab('completed')}
                    icon={CheckCircle}
                    label="Completed Today"
                    count={recentDeliveries.length}
                  />
                </div>
              </div>

              <div className="p-6">
                {activeTab === 'active' ? (
                  <div className="space-y-4">
                    {upcomingDeliveries.map((delivery, index) => (
                      <DeliveryCard
                        key={delivery.id}
                        delivery={delivery}
                        index={index}
                        onStart={() => handleStartDelivery(delivery)}
                        onNavigate={() => console.log('Navigate to', delivery.address)}
                        onCall={() => console.log('Call', delivery.phone)}
                      />
                    ))}
                  </div>
                ) : (
                  <div className="space-y-4">
                    {recentDeliveries.map((delivery, index) => (
                      <CompletedDeliveryCard key={delivery.id} delivery={delivery} index={index} />
                    ))}
                  </div>
                )}
              </div>
            </div>
          </div>

          {/* Right Column - Stats & Info */}
          <div className="space-y-6">
            {/* Performance Card */}
            <motion.div
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: 0.2 }}
              className="bg-gradient-to-br from-blue-600 via-blue-700 to-purple-700 rounded-2xl shadow-xl p-6 text-white relative overflow-hidden"
            >
              <div className="absolute top-0 right-0 w-32 h-32 bg-white/10 rounded-full -mr-16 -mt-16"></div>
              <div className="absolute bottom-0 left-0 w-24 h-24 bg-white/10 rounded-full -ml-12 -mb-12"></div>
              <div className="relative">
                <div className="flex items-center justify-between mb-4">
                  <Zap className="w-6 h-6 text-yellow-300" />
                  <span className="px-2.5 py-1 bg-white/20 backdrop-blur-sm rounded-lg text-xs font-semibold">
                    This Week
                  </span>
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
            <motion.div
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: 0.3 }}
              className="bg-white rounded-2xl shadow-sm border border-gray-200 p-6"
            >
              <div className="flex items-center justify-between mb-4">
                <h3 className="text-lg font-bold text-gray-900">Recent Achievements</h3>
                <Award className="w-5 h-5 text-amber-500" />
              </div>
              <div className="space-y-3">
                <AchievementItem
                  icon="🏆"
                  title="Top Performer"
                  desc="100 deliveries this month"
                  earned="2 days ago"
                />
                <AchievementItem
                  icon="⭐"
                  title="5-Star Rating"
                  desc="Maintained 4.8+ rating"
                  earned="1 week ago"
                />
                <AchievementItem
                  icon="🎯"
                  title="Perfect Week"
                  desc="All deliveries on time"
                  earned="1 week ago"
                />
              </div>
            </motion.div>

            {/* Quick Actions */}
            <motion.div
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: 0.4 }}
              className="bg-white rounded-2xl shadow-sm border border-gray-200 p-6"
            >
              <h3 className="text-lg font-bold text-gray-900 mb-4">Quick Actions</h3>
              <div className="space-y-2">
                <QuickActionButton icon={RouteIcon} label="View Today's Route" />
                <QuickActionButton icon={BarChart3} label="Performance Report" />
                <QuickActionButton icon={MessageSquare} label="Contact Support" />
                <QuickActionButton icon={Settings} label="Account Settings" />
              </div>
            </motion.div>

            {/* Tips */}
            <motion.div
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: 0.5 }}
              className="bg-gradient-to-br from-amber-50 to-orange-50 rounded-2xl border border-amber-200 p-6"
            >
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

      {/* Modals */}
      {showScanner && (
        <ScannerModal onClose={() => setShowScanner(false)} onScan={handleScanComplete} />
      )}

      {showConfirmation && selectedDelivery && (
        <DeliveryConfirmationModal
          delivery={selectedDelivery}
          onClose={() => setShowConfirmation(false)}
          onConfirm={handleConfirmDelivery}
        />
      )}
    </div>
  );
}

function StatCard({ title, value, total, icon, color, delay }) {
  const Icon = icon;
  const colors = {
    blue: 'from-blue-500 to-blue-600',
    green: 'from-green-500 to-green-600',
    purple: 'from-purple-500 to-purple-600',
    emerald: 'from-emerald-500 to-emerald-600',
    amber: 'from-amber-500 to-amber-600',
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay }}
      className="bg-white rounded-xl shadow-sm border border-gray-200 p-4 hover:shadow-md transition-all"
    >
      <div className="flex items-center justify-between mb-3">
        <div className={`w-10 h-10 rounded-lg bg-gradient-to-br ${colors[color]} flex items-center justify-center shadow-lg`}>
          <Icon className="w-5 h-5 text-white" />
        </div>
      </div>
      <div className="text-2xl font-bold text-gray-900">{value}</div>
      {total && (
        <div className="text-xs text-gray-500 mt-1">of {total} total</div>
      )}
      <div className="text-sm text-gray-600 font-medium mt-1">{title}</div>
    </motion.div>
  );
}

function TabButton({ active, onClick, icon, label, count }) {
  const Icon = icon;
  return (
    <button
      onClick={onClick}
      className={`flex-1 flex items-center justify-center gap-2 px-4 py-3 text-sm font-medium transition-all ${
        active
          ? 'text-blue-700 border-b-2 border-blue-600 bg-blue-50'
          : 'text-gray-600 hover:text-gray-900 hover:bg-gray-50'
      }`}
    >
      <Icon className="w-4 h-4" />
      {label}
      {count !== undefined && (
        <span
          className={`px-2 py-0.5 rounded-full text-xs font-semibold ${
            active ? 'bg-blue-600 text-white' : 'bg-gray-200 text-gray-700'
          }`}
        >
          {count}
        </span>
      )}
    </button>
  );
}

function CompletedDeliveryCard({ delivery, index }) {
  return (
    <motion.div
      initial={{ opacity: 0, x: -20 }}
      animate={{ opacity: 1, x: 0 }}
      transition={{ delay: index * 0.05 }}
      className="flex items-center justify-between p-4 bg-green-50 border border-green-200 rounded-xl hover:shadow-md transition-all"
    >
      <div className="flex items-center gap-3 flex-1">
        <div className="w-10 h-10 rounded-lg bg-green-500 flex items-center justify-center">
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
      <div className="flex items-center gap-1 ml-3">
        {[...Array(5)].map((_, i) => (
          <Star
            key={i}
            className={`w-4 h-4 ${
              i < delivery.rating ? 'fill-amber-400 text-amber-400' : 'text-gray-300'
            }`}
          />
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

function QuickActionButton({ icon, label }) {
  const Icon = icon;
  return (
    <button className="w-full flex items-center justify-between p-3 rounded-lg hover:bg-gray-50 transition-colors group">
      <div className="flex items-center gap-3">
        <Icon className="w-5 h-5 text-gray-600 group-hover:text-blue-600" />
        <span className="text-sm font-medium text-gray-700 group-hover:text-gray-900">
          {label}
        </span>
      </div>
      <ChevronRight className="w-4 h-4 text-gray-400 group-hover:text-gray-600 group-hover:translate-x-1 transition-all" />
    </button>
  );
}
