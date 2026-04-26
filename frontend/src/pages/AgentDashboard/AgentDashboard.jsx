import { useState, useEffect, useCallback } from "react";
//eslint-disable-next-line no-unused-vars
import { motion, AnimatePresence } from "motion/react";
import Toast from "../../components/ui/Toast";
import {
  Package,
  MapPin,
  Navigation,
  Clock,
  CheckCircle,
  Scan,
  DollarSign,
  TrendingUp,
  Star,
  List,
  BarChart3,
  MessageSquare,
  Route as RouteIcon,
  Zap,
  Award,
  Target,
  Phone,
  ChevronRight,
  ShieldCheck,
  AlertCircle,
  Search,
  Activity,
} from "lucide-react";

// Hooks & API Utility
import { useToast } from "../../hooks/useToast";
import {
  getAgentDashboard,
  updateShipmentStatus,
  updateLiveLocation,
} from "../../utils/agentAPI";
import { useAuth } from "../../hooks/useAuth";
import { getCoordsFromPincode } from "../../utils/geocoding";
// Components
import ActiveDeliveryTracker from "./ActiveDeliveryTracker";
import DeliveryCard from "./DeliveryCard";
import DeliveryConfirmationModal from "./DeliveryConfirmationModal";
import AgentNavbar from "../../components/AgentNavbar";
import TrackingMap from "../../components/TrackingMap";
import { buildAgentNotifications } from "../../utils/agentAPI";

export function AgentDashboard() {
  const { toast, showToast: addToast, hideToast } = useToast();
  const { user, loading: authLoading } = useAuth();
  // UI States
  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState("active");
  const [showConfirmation, setShowConfirmation] = useState(false);
  const [selectedDelivery, setSelectedDelivery] = useState(null);
  const [notifs, setNotifs] = useState([]);

  // Data States
  const [stats, setStats] = useState({
    completed: 0,
    pending: 0,
    total: 0,
    earnings: 0,
    distance: 0,
    rating: 0,
  });
  const [activeDelivery, setActiveDelivery] = useState(null);
  const [upcomingList, setUpcomingList] = useState([]);
  const [completedList, setCompletedList] = useState([]);
  const [showLocationModal, setShowLocationModal] = useState(false);
  const [pincode, setPincode] = useState("");

  const loadDashboardData = useCallback(async () => {
    if (!user) return;

    try {
      setLoading((prev) => (stats.total === 0 ? true : prev));

      const data = await getAgentDashboard();

      if (data) {
        setStats(data.summary);
        const activeShipment = data.shipments?.find(
          (s) => s.tracking_number === data.active_delivery?.tracking_id,
        );

        if (!activeShipment) {
          console.error("Active shipment not found in shipments list");
        }
        if (data.active_delivery) {
          setActiveDelivery({
            ...data.active_delivery,
            dbId: activeShipment?.id ?? null,
            id: data.active_delivery.tracking_id,
            customer: data.active_delivery.customer?.name || "Customer",
            phone: data.active_delivery.customer?.phone || "",
            address: `${data.active_delivery.delivery_address?.line || ""}, ${data.active_delivery.delivery_address?.city || ""}`,
            packageType: (data.active_delivery.package?.weight || 0) + " kg",
            codAmount: `₹${data.active_delivery.package?.price || 0}`,
            cod: (data.active_delivery.package?.price || 0) > 0,
            pickup_coords: activeShipment?.pickup_address?.latitude
              ? {
                lat: activeShipment.pickup_address.latitude,
                lng: activeShipment.pickup_address.longitude,
              }
              : null,

            delivery_coords: activeShipment?.delivery_address?.latitude
              ? {
                lat: activeShipment.delivery_address.latitude,
                lng: activeShipment.delivery_address.longitude,
              }
              : null,
          });
          console.log("ACTIVE DELIVERY FINAL:", {
            tracking: data.active_delivery?.tracking_id,
            dbId: activeShipment?.id,
            shipmentMatch: activeShipment,
          });
        } else {
          setActiveDelivery(null);
        }
        const notifications = buildAgentNotifications(
          data.shipments,
          data.agent
        );

        setNotifs(notifications);

        if (data.shipments) {
          setUpcomingList(
            data.shipments
              .filter(
                (s) =>
                  s.status?.toLowerCase() !== "delivered" &&
                  s.status?.toLowerCase() !== "failed" &&
                  s.tracking_number !== data.active_delivery?.tracking_id,
              )
              .map((s) => ({
                ...s,
                dbId: s.id,
                phone: s.receiver_phone,
                address: `${s.delivery_address?.line || ""}, ${s.delivery_address?.city || ""}`,
                packageType: `${s.weight} kg`,
                codAmount: `₹${s.price}`,
              })),
          );
          setCompletedList(
            data.shipments
              .filter(
                (s) =>
                  s.status?.toLowerCase() === "delivered" ||
                  s.status?.toLowerCase() === "failed",
              )
              .map((s) => ({
                ...s,
                dbId: s.id,
              })),
          );
        }
      }
    } catch (err) {
      if (err.response?.status !== 401) {
        addToast("Failed to sync dashboard", "error");
      }
    } finally {
      setLoading(false);
    }
    //eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  useEffect(() => {
    if (user) {
      loadDashboardData();
    }
  }, [user, loadDashboardData]);

  const handleLocationUpdate = async () => {
    try {
      if (!activeDelivery?.dbId) {
        addToast("No active delivery to update location", "error");
        return;
      }

      if (!/^[1-9][0-9]{5}$/.test(pincode)) {
        addToast("Enter valid Indian pincode (6 digits)", "error");
        return;
      }

      // 🔹 Convert pincode → coordinates
      const coords = await getCoordsFromPincode(pincode);

      if (!coords) {
        addToast("Invalid or unsupported pincode", "error");
        return;
      }

      console.log("Resolved coords:", coords);

      // 🔹 Send to backend
      await updateLiveLocation(String(pincode), activeDelivery?.dbId);

      addToast(`Location updated: ${coords.city}`, "success");

      setShowLocationModal(false);
      setPincode("");

      // optional refresh
      await loadDashboardData();
    } catch (err) {
      console.error(err);
      addToast("Location update failed", "error");
    }
  };

  const handleConfirmDelivery = async (data) => {
    const targetId = data?.dbId;

    if (!targetId) {
      addToast("Error: Shipment ID not found", "error");
      return;
    }

    try {
      const backendPaymentMethod = data.payment_method === 'digital' ? 'UPI' : 'CASH';

      const remarks = `Recipient: ${data.customerName || 'N/A'}. Method: ${backendPaymentMethod}. Note: ${data.notes || ''}`;
      const finalStatus = data.status; // "DELIVERED" or "FAILED"

      // Always move to OUT_FOR_DELIVERY first (valid transition)
      // await updateShipmentStatus(targetId, "OUT_FOR_DELIVERY");

      // Apply final status correctly
      if (finalStatus === "FAILED") {
        await updateShipmentStatus(targetId, "FAILED", remarks);
      } else {
        await updateShipmentStatus(
          targetId,
          "DELIVERED",
          remarks,
          backendPaymentMethod
        );
      }

      // 2. Immediately trigger a data reload from the server
      // We await this so the "Loading" state finishes before we close the modal logic
      await loadDashboardData();

      addToast("Shipment finalized and recorded!", "success");

      // 3. Clean up UI states
      setShowConfirmation(false);
      setSelectedDelivery(null);

      // 4. Force switch to the 'completed' tab so the user sees the result
      setActiveTab("completed");

    } catch (err) {
      console.error("Delivery confirmation failed:", err);
      addToast(err?.response?.data?.detail || "Update failed", "error");
      // IMPORTANT: Re-throw the error so the Modal's catch block can stop the "Success" animation
      throw err;
    }
  };

  if (authLoading || (loading && !stats.total)) {
    return (
      <div className="h-screen w-full flex items-center justify-center bg-[#F8FAFC]">
        <div className="w-8 h-8 border-2 border-blue-600/20 border-t-blue-600 rounded-full animate-spin" />
      </div>
    );
  }

  const agentFirstName = user?.name?.split(" ")[0] || "Agent";

  return (
    <div className="min-h-screen bg-[#F8FAFC] text-slate-900 font-sans selection:bg-blue-100">
      <title>Dashboard | CargoFlow</title>
      <AgentNavbar notifications={notifs}
        unreadCount={notifs.filter(n => !n.read).length} agent={{ name: agentFirstName, rating: stats.rating }} />

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
          <button
            onClick={() => {
              if (!activeDelivery) {
                addToast("No active delivery", "error");
                return;
              }
              setShowLocationModal(true);
            }} className="flex items-center gap-2 px-5 py-2.5 bg-slate-950 text-white rounded-xl shadow-lg hover:bg-blue-600 transition-all"
          >
            <span className="font-bold tracking-tight text-xs uppercase">
              Update Location
            </span>
          </button>
        </header>

        {/* Stats Grid */}
        <section className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-4">
          <MetricCard
            title="Gross Earnings"
            value={`₹${stats.earnings}`}
            icon={DollarSign}
            color="blue"
          />
          <MetricCard
            title="Completed"
            value={stats.completed}
            icon={CheckCircle}
            color="emerald"
          />
          <MetricCard
            title="Route"
            value={`${stats.distance}km`}
            icon={RouteIcon}
            color="slate"
          />
          <MetricCard
            title="Rating"
            value={stats.rating}
            icon={Star}
            color="amber"
          />
          <MetricCard
            title="Pending"
            value={stats.pending}
            icon={Package}
            color="blue"
          />
        </section>

        <div className="grid grid-cols-1 xl:grid-cols-12 gap-6 items-start">
          {/* Main Content */}
          <div className="xl:col-span-8 space-y-6">
            <section>
              <h2 className="text-sm font-black text-slate-900 mb-3 uppercase tracking-wider flex items-center gap-2">
                <Activity className="w-4 h-4 text-blue-600" /> Active Assignment
              </h2>
              {activeDelivery ? (
                <div className="space-y-4">
                  {/* Existing UI */}
                  <div className="ring-1 ring-slate-200 rounded-2xl shadow-xl overflow-hidden">
                    <ActiveDeliveryTracker
                      delivery={activeDelivery}
                      onComplete={() => {
                        setSelectedDelivery({
                          ...activeDelivery,
                          dbId: activeDelivery?.dbId,
                        });
                        setShowConfirmation(true);
                      }}
                    />

                  </div>
                </div>
              ) : (
                <div className="h-48 bg-white border-2 border-dashed border-slate-200 rounded-2xl flex flex-col items-center justify-center p-6 text-center">
                  <Package className="w-8 h-8 text-slate-200 mb-2" />
                  <p className="text-slate-400 font-bold uppercase tracking-widest text-[10px]">
                    Awaiting Dispatch
                  </p>
                </div>
              )}
            </section>

            {/* Manifest / Logs Tabs */}
            <section className="bg-white rounded-2xl border border-slate-200 shadow-sm overflow-hidden">
              <div className="px-6 py-4 border-b border-slate-100 flex items-center justify-between bg-slate-50/40">
                <nav className="flex gap-1.5 bg-slate-200/50 p-1 rounded-lg">
                  <TabButton
                    active={activeTab === "active"}
                    onClick={() => setActiveTab("active")}
                    label="Manifest"
                  />
                  <TabButton
                    active={activeTab === "completed"}
                    onClick={() => setActiveTab("completed")}
                    label="Logs"
                  />
                </nav>
              </div>
              <div className="p-4 min-h-[300px]">
                <AnimatePresence mode="wait">
                  {activeTab === "active" ? (
                    <motion.div
                      key="active"
                      initial={{ opacity: 0 }}
                      animate={{ opacity: 1 }}
                      className="space-y-3"
                    >
                      {upcomingList.length > 0 ? (
                        upcomingList.map((d, i) => (
                          <DeliveryCard
                            key={d.id}
                            delivery={d}
                            index={i}
                            onStart={() => loadDashboardData()}
                          />
                        ))
                      ) : (
                        <p className="text-center py-10 text-[10px] text-slate-400 font-bold uppercase">
                          No pending manifest
                        </p>
                      )}
                    </motion.div>
                  ) : (
                    <motion.div
                      key="completed"
                      initial={{ opacity: 0 }}
                      animate={{ opacity: 1 }}
                      className="space-y-3"
                    >
                      {completedList.length > 0 ? (
                        completedList.map((d) => (
                          <div
                            key={d.id}
                            className="p-3 border border-slate-100 rounded-xl flex justify-between items-center bg-slate-50/50"
                          >
                            <div>
                              <p className="text-xs font-bold text-slate-900">
                                {d.tracking_number}
                              </p>
                              <p className="text-[10px] text-slate-500">
                                {d.receiver_name}
                              </p>
                            </div>
                            <span
                              className={`text-[9px] font-black px-2 py-1 rounded-md uppercase ${d.status?.toLowerCase() === "delivered" ? "bg-emerald-100 text-emerald-700" : "bg-red-100 text-red-700"}`}
                            >
                              {d.status}
                            </span>
                          </div>
                        ))
                      ) : (
                        <p className="text-center py-10 text-[10px] text-slate-400 font-bold uppercase">
                          No completed logs yet
                        </p>
                      )}
                    </motion.div>
                  )}
                </AnimatePresence>
              </div>
            </section>
          </div>

          {/* Sidebar */}
          <aside className="xl:col-span-4 space-y-6">
            <div className="bg-slate-950 rounded-2xl p-6 text-white relative overflow-hidden shadow-xl">
              <div className="relative z-10 space-y-6">
                <div className="flex items-center justify-between">
                  <span className="text-[9px] font-black tracking-[0.2em] text-white/40 uppercase">
                    Performance
                  </span>
                  <Target className="w-4 h-4 text-blue-400" />
                </div>
                <div className="flex items-baseline gap-2">
                  <span className="text-4xl font-black tabular-nums">
                    82<span className="text-xl text-white/30">%</span>
                  </span>
                </div>
                <div className="w-full h-1.5 bg-white/10 rounded-full overflow-hidden">
                  <div className="h-full bg-blue-500 w-[82%]" />
                </div>
              </div>
            </div>
            <div className="bg-white rounded-2xl border border-slate-200 p-6 space-y-4">
              <h3 className="font-black text-slate-900 uppercase tracking-widest text-[10px]">
                Support
              </h3>
              <div className="space-y-2">
                <SupportLink icon={Phone} title="Helpline" color="red" />
                <SupportLink
                  icon={MessageSquare}
                  title="Dispatch"
                  color="blue"
                />
              </div>
            </div>
          </aside>
        </div>
      </main>

      {showLocationModal && (
        <div className="fixed inset-0 bg-black/40 flex items-center justify-center z-50">
          <div className="bg-white p-6 rounded-xl w-[300px] space-y-4">
            <h2 className="text-sm font-bold">Enter Pincode</h2>

            <input
              type="text"
              value={pincode}
              onChange={(e) => {
                const value = e.target.value.replace(/\D/g, ""); // only digits
                if (value.length <= 6) {
                  setPincode(value);
                }
              }}
              maxLength={6}
              className="w-full border p-2 rounded"
              placeholder="e.g. 800001"
            />
            <button
              onClick={handleLocationUpdate}
              className="w-full bg-blue-600 text-white py-2 rounded"
            >
              Update
            </button>

            <button
              onClick={() => setShowLocationModal(false)}
              className="w-full text-gray-500 text-xs"
            >
              Cancel
            </button>
          </div>
        </div>
      )}

      {showConfirmation && selectedDelivery && (
        <DeliveryConfirmationModal
          delivery={selectedDelivery}
          onClose={() => {
            setShowConfirmation(false);
            setSelectedDelivery(null);
          }}
          onConfirm={(data) =>
            handleConfirmDelivery({
              ...data,
              dbId: selectedDelivery?.dbId,
            })
          }
        />
      )}
      <Toast
        message={toast.message}
        type={toast.type}
        show={toast.show}
        onClose={hideToast}
      />
    </div>
  );
}

// ── Shared UI Sub-components ──
//eslint-disable-next-line no-unused-vars
function MetricCard({ title, value, icon: Icon, color }) {
  const accent = {
    blue: "bg-blue-600",
    emerald: "bg-emerald-600",
    slate: "bg-slate-900",
    amber: "bg-amber-500",
  };
  return (
    <div className="bg-white p-5 rounded-2xl border border-slate-200 shadow-sm transition-all hover:-translate-y-0.5">
      <div
        className={`w-9 h-9 rounded-xl ${accent[color]} flex items-center justify-center mb-4 shadow-md`}
      >
        <Icon className="w-4.5 h-4.5 text-white" />
      </div>
      <div className="text-xl font-black text-slate-950 tracking-tight">
        {value}
      </div>
      <div className="text-[9px] font-black text-slate-400 uppercase tracking-widest mt-1">
        {title}
      </div>
    </div>
  );
}

function TabButton({ active, onClick, label }) {
  return (
    <button
      onClick={onClick}
      className={`px-5 py-1.5 rounded-md text-[9px] font-black tracking-widest transition-all ${active ? "bg-white text-blue-600 shadow-sm" : "text-slate-400 hover:text-slate-600"}`}
    >
      {label}
    </button>
  );
}
//eslint-disable-next-line no-unused-vars
function SupportLink({ icon: Icon, title, color }) {
  const themes = {
    red: "bg-red-50 text-red-600",
    blue: "bg-blue-50 text-blue-600",
  };
  return (
    <button className="w-full flex items-center justify-between p-3 rounded-xl hover:bg-slate-50 transition-all border border-transparent hover:border-slate-100">
      <div className="flex items-center gap-3">
        <div
          className={`w-8 h-8 rounded-lg ${themes[color]} flex items-center justify-center`}
        >
          <Icon className="w-4 h-4" />
        </div>
        <p className="text-[9px] font-black text-slate-950 tracking-widest uppercase">
          {title}
        </p>
      </div>
      <ChevronRight className="w-3.5 h-3.5 text-slate-200" />
    </button>
  );
}
