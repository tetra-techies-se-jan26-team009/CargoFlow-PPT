import { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { getTrackingInfo, CLIENT_STATUS_META } from "../utils/clientAPI";
import { Package, MapPin, Clock, ArrowLeft, CheckCircle } from "lucide-react";
import TrackingMap from "../components/TrackingMap";

export default function TrackingPage() {
  const { trackingId } = useParams();
  const navigate = useNavigate();
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function fetchDetails() {
      try {
        setLoading(true);
        const details = await getTrackingInfo(trackingId); //
        setData(details);
      } catch (err) {
        console.error("Tracking error:", err);
      } finally {
        setLoading(false);
      }
    }
    if (trackingId) fetchDetails();
    console.log("TRACKING DATA:", data);
  }, [trackingId]);

  useEffect(() => {
    console.log("TRACKING DATA UPDATED:", data);
  }, [data]);

  useEffect(() => {
    const interval = setInterval(async () => {
      try {
        const updated = await getTrackingInfo(trackingId);
        setData(updated);
      } catch (e) {
        console.error("Polling error:", e);
      }
    }, 5000);

    return () => clearInterval(interval);
  }, [trackingId]);

  if (loading) return <div className="h-screen flex items-center justify-center">Locating Shipment...</div>;
  if (!data) return <div className="text-center py-20">Tracking ID not found.</div>;


  const statusStyle = CLIENT_STATUS_META[data.status] || CLIENT_STATUS_META["Pending"]; //

  return (
    <div className="min-h-screen bg-[#F8FAFC] p-6 lg:p-12">
      <title>Shipment Tracking</title>
      <button onClick={() => navigate(-1)} className="flex items-center gap-2 text-slate-500 mb-8 hover:text-slate-900 transition-colors">
        <ArrowLeft className="w-4 h-4" /> Back to Home
      </button>

      <main className="max-w-4xl mx-auto space-y-6">
        <section className="bg-white rounded-3xl p-8 border border-slate-100 shadow-sm flex flex-col md:flex-row justify-between gap-6">
          <div>
            <span className="text-[10px] font-black uppercase tracking-widest text-slate-400">Shipment ID</span>
            <h1 className="text-2xl font-black text-slate-950">{data.id}</h1>
          </div>
          <div className="flex items-center gap-3">
            <div className="text-right">
              <p className="text-[10px] font-black uppercase tracking-widest text-slate-400">Status</p>
              <p className="font-bold" style={{ color: statusStyle.color }}>{data.status}</p>
            </div>
            <div className="w-12 h-12 rounded-2xl flex items-center justify-center" style={{ background: statusStyle.bg }}>
              <Package className="w-6 h-6" style={{ color: statusStyle.color }} />
            </div>
          </div>
        </section>

        {/* Journey Progress */}
        <section className="bg-white rounded-3xl p-8 border border-slate-100 shadow-sm space-y-8">
          <div className="relative flex justify-between">
            <div className="absolute top-5 left-0 w-full h-1 bg-slate-100 -z-0" />
            <div className="absolute top-5 left-0 h-1 bg-blue-600 transition-all duration-1000" style={{ width: `${data.progress}%` }} />

            <div className="z-10 bg-white p-1"><CheckCircle className="w-8 h-8 text-blue-600 fill-white" /></div>
            <div className={`z-10 bg-white p-1 ${data.progress >= 65 ? 'text-blue-600' : 'text-slate-200'}`}><Package className="w-8 h-8 fill-white" /></div>
            <div className={`z-10 bg-white p-1 ${data.progress === 100 ? 'text-blue-600' : 'text-slate-200'}`}><MapPin className="w-8 h-8 fill-white" /></div>
          </div>

          <div className="grid grid-cols-2 gap-12 pt-4">
            <div className="space-y-1">
              <p className="text-[10px] font-black text-slate-400 uppercase">From</p>
              <p className="font-bold text-slate-900">{data.from}</p>
              <p className="text-xs text-slate-500">{data.pickupLine1}</p>
            </div>
            <div className="space-y-1 text-right">
              <p className="text-[10px] font-black text-slate-400 uppercase">To</p>
              <p className="font-bold text-slate-900">{data.to}</p>
              <p className="text-xs text-slate-500">{data.deliveryLine1}</p>
            </div>
          </div>
        </section>
        {/* Shipment Details */}
        <section className="bg-white rounded-3xl p-8 border border-slate-100 shadow-sm space-y-6">
          {(data?.pickupCoords || data?.pickup_coords) &&
            (data?.deliveryCoords || data?.delivery_coords) ? (
            <TrackingMap
              pickup={data.pickupCoords || data.pickup_coords}
              delivery={data.deliveryCoords || data.delivery_coords}
              currentAgent={data.agentCoords}
            />
          ) : (
            <div className="text-sm text-gray-500">Location data not available</div>
          )}
          <h2 className="text-lg font-bold text-slate-900">Shipment Details</h2>

          <div className="grid grid-cols-2 md:grid-cols-3 gap-6 text-sm">

            <div>
              <p className="text-slate-400 text-xs">Receiver Name</p>
              <p className="font-semibold">{data.receiverName}</p>
            </div>

            <div>
              <p className="text-slate-400 text-xs">Delivery Agent</p>
              <p className="font-semibold">
                {typeof data.agent === "object"
                  ? data.agent.name
                  : data.agent}
              </p>

              {typeof data.agent === "object" && (
                <p className="text-xs text-gray-500">{data.agent.phone}</p>
              )}
            </div>

            <div>
              <p className="text-slate-400 text-xs">Weight</p>
              <p className="font-semibold">{data.kg} kg</p>
            </div>

            <div>
              <p className="text-slate-400 text-xs">Price</p>
              <p className="font-semibold">{data.priceLabel}</p>
            </div>

            <div>
              <p className="text-slate-400 text-xs">ETA</p>
              <p className="font-semibold">{data.eta}</p>
            </div>

            <div>
              <p className="text-slate-400 text-xs">Created On</p>
              <p className="font-semibold">{data.date}</p>
            </div>

          </div>
        </section>
      </main>
    </div>
  );
}