import { useState, useEffect, useRef } from "react";
import { useNavigate } from "react-router-dom";
import ClientNavbar from "../../components/ClientNavbar";
import { useAuth } from "../../hooks/useAuth";
import { statusMeta, shipments, timelineSteps, INITIAL_NOTIFS } from "../../utils/tempData";
import Modal, { ModalHeader } from "../../components/ui/Modal";
import { FormGroup,BtnPrimary,BtnSecondary,ModalActions } from "../../components/ui/ClientModals/SharedPrimitives";
import { NotifPanel } from "../../components/ui/ClientModals/NotificationPannel";

// ── SVG Icon helper ───────────────────────────────────────────────────────────
const Icon = ({ d, size = 16, stroke = "currentColor", fill = "none", strokeWidth = 1.8 }) => (
  <svg width={size} height={size} viewBox="0 0 24 24" fill={fill} stroke={stroke}
    strokeWidth={strokeWidth} strokeLinecap="round" strokeLinejoin="round">
    <path d={d} />
  </svg>
);

const icons = {
  truck: "M1 3h15v13H1z M16 8h4l3 3v5h-7V8z M5.5 21a1.5 1.5 0 100-3 1.5 1.5 0 000 3z M18.5 21a1.5 1.5 0 100-3 1.5 1.5 0 000 3z",
  check: "M22 11.08V12a10 10 0 11-5.93-9.14 M22 4L12 14.01l-3-3",
  clock: "M12 22a10 10 0 100-20 10 10 0 000 20z M12 6v6l4 2",
  invoice: "M14 2H6a2 2 0 00-2 2v16a2 2 0 002 2h12a2 2 0 002-2V8z M14 2v6h6 M16 13H8 M16 17H8",
  arrow: "M5 12h14 M12 5l7 7-7 7",
  plus: "M12 5v14 M5 12h14",
  search: "M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z",
  location: "M12 2C8.13 2 5 5.13 5 9c0 5.25 7 13 7 13s7-7.75 7-13c0-3.87-3.13-7-7-7z M12 11.5a2.5 2.5 0 100-5 2.5 2.5 0 000 5z",
  star: "M12 2l3.09 6.26L22 9.27l-5 4.87 1.18 6.88L12 17.77l-6.18 3.25L7 14.14 2 9.27l6.91-1.01L12 2z",
  download: "M21 15v4a2 2 0 01-2 2H5a2 2 0 01-2-2v-4 M7 10l5 5 5-5 M12 15V3",
  phone: "M22 16.92v3a2 2 0 01-2.18 2 19.79 19.79 0 01-8.63-3.07A19.5 19.5 0 014.43 9.5a19.79 19.79 0 01-3.07-8.67A2 2 0 013.34 0h3a2 2 0 012 1.72c.127.96.361 1.903.7 2.81a2 2 0 01-.45 2.11L7.91 7.91a16 16 0 006.29 6.29l.79-.79a2 2 0 012.1-.45c.907.339 1.85.573 2.81.7A2 2 0 0122 16.92z",
  bell: "M18 8A6 6 0 006 8c0 7-3 9-3 9h18s-3-2-3-9 M13.73 21a2 2 0 01-3.46 0",
  close: "M18 6L6 18 M6 6l12 12",
  send: "M22 2L11 13 M22 2L15 22 8 13 2 10z",
};


// ── Toast hook ────────────────────────────────────────────────────────────────
function useToasts() {
  const [toasts, setToasts] = useState([]);
  const show = (msg, icon = "ℹ️", type = "") => {
    const id = Date.now();
    setToasts(t => [...t, { id, msg, icon, type }]);
    setTimeout(() => setToasts(t => t.filter(x => x.id !== id)), 3500);
  };
  return { toasts, show };
}

const ToastContainer = ({ toasts }) => (
  <div style={{ position: "fixed", bottom: 24, right: 24, zIndex: 9999, display: "flex", flexDirection: "column", gap: 10 }}>
    {toasts.map(t => (
      <div key={t.id} style={{
        background: t.type === "success" ? "#065F46" : t.type === "warn" ? "#92400E" : "#0F172A",
        color: "white", borderRadius: 12, padding: "12px 18px", fontSize: 13, fontWeight: 500,
        display: "flex", alignItems: "center", gap: 10, boxShadow: "0 8px 32px rgba(0,0,0,.2)",
        animation: "slideUp .25s ease", minWidth: 220,
      }}>
        <span style={{ fontSize: 16 }}>{t.icon}</span>
        <span>{t.msg}</span>
      </div>
    ))}
  </div>
);

// ── Shared form primitives ────────────────────────────────────────────────────
// const FormGroup = ({ label, children }) => (
//   <div style={{ marginBottom: 14 }}>
//     <label style={{ fontSize: 11, fontWeight: 600, color: "#64748B", marginBottom: 5, display: "block", textTransform: "uppercase", letterSpacing: ".5px" }}>{label}</label>
//     {children}
//   </div>
// );

const inputStyle = {
  width: "100%", border: "1.5px solid #E2E8F0", borderRadius: 10,
  padding: "10px 14px", fontSize: 13.5, fontFamily: "inherit", outline: "none", color: "#0F172A",
};

// const BtnPrimary = ({ children, onClick, style = {} }) => (
//   <button onClick={onClick} style={{
//     background: "linear-gradient(135deg,#1D4ED8,#2563EB)", color: "white", border: "none",
//     borderRadius: 10, padding: "11px 22px", fontSize: 13.5, fontWeight: 700,
//     cursor: "pointer", fontFamily: "inherit", width: "100%", ...style,
//   }}>{children}</button>
// );

// const BtnSecondary = ({ children, onClick }) => (
//   <button onClick={onClick} style={{
//     background: "#F1F5F9", color: "#334155", border: "none", borderRadius: 10,
//     padding: "11px 22px", fontSize: 13.5, fontWeight: 600, cursor: "pointer", fontFamily: "inherit",
//   }}>{children}</button>
// );

// const ModalActions = ({ children }) => (
//   <div style={{ display: "flex", gap: 10, marginTop: 20 }}>{children}</div>
// );

// ── Status Badge ──────────────────────────────────────────────────────────────
const StatusBadge = ({ status }) => {
  const m = statusMeta[status] || statusMeta["Pending"];
  return (
    <span style={{
      fontSize: 11, fontWeight: 600, padding: "3px 9px", borderRadius: 20,
      background: m.bg, color: m.color, display: "inline-flex", alignItems: "center", gap: 4,
    }}>
      <span style={{ width: 6, height: 6, borderRadius: "50%", background: m.dot, display: "inline-block" }} />
      {status}
    </span>
  );
};

// ── Progress Bar ──────────────────────────────────────────────────────────────
const ProgressBar = ({ progress }) => (
  <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
    <div style={{ flex: 1, background: "#F1F5F9", borderRadius: 4, height: 5, overflow: "hidden", minWidth: 55 }}>
      <div style={{ width: `${progress}%`, height: "100%", borderRadius: 4, background: progress === 100 ? "#10B981" : "#2563EB" }} />
    </div>
    <span style={{ fontSize: 10, color: "#64748B", fontWeight: 600, minWidth: 28 }}>{progress}%</span>
  </div>
);

// ── Delivery Timeline ─────────────────────────────────────────────────────────
const TrackingTimeline = () => {
  const activeIdx = timelineSteps.findIndex(s => !s.done);
  return (
    <div style={{ display: "flex", flexDirection: "column" }}>
      {timelineSteps.map((step, i) => {
        const isDone = step.done, isActive = i === activeIdx;
        return (
          <div key={step.label} style={{ display: "flex", gap: 12, alignItems: "flex-start" }}>
            <div style={{ display: "flex", flexDirection: "column", alignItems: "center", width: 20 }}>
              <div style={{
                width: 20, height: 20, borderRadius: "50%", flexShrink: 0,
                background: isDone ? "linear-gradient(135deg,#10B981,#059669)" : isActive ? "#2563EB" : "#E2E8F0",
                display: "flex", alignItems: "center", justifyContent: "center",
                boxShadow: isDone ? "0 0 0 3px rgba(16,185,129,.15)" : isActive ? "0 0 0 3px rgba(37,99,235,.2)" : "none",
              }}>
                {isDone
                  ? <svg width="10" height="10" viewBox="0 0 24 24" fill="none" stroke="white" strokeWidth="3"><polyline points="20,6 9,17 4,12" /></svg>
                  : isActive ? <div style={{ width: 6, height: 6, borderRadius: "50%", background: "white" }} /> : null}
              </div>
              {i < timelineSteps.length - 1 && (
                <div style={{ width: 2, height: 28, background: isDone ? "#10B981" : "#E2E8F0", marginTop: 2, borderRadius: 1 }} />
              )}
            </div>
            <div style={{ paddingBottom: i < timelineSteps.length - 1 ? 22 : 0, paddingTop: 1 }}>
              <div style={{ fontSize: 12.5, fontWeight: 600, color: isDone ? "#0F172A" : isActive ? "#2563EB" : "#94A3B8" }}>{step.label}</div>
              <div style={{ fontSize: 11, color: "#94A3B8", marginTop: 2 }}>{step.time}</div>
            </div>
          </div>
        );
      })}
    </div>
  );
};

// ══════════════════════════════════════════════════════════════════════════════
// MODALS
// ══════════════════════════════════════════════════════════════════════════════

const TrackModal = ({ onClose, initialId = "" }) => {
  const [val, setVal] = useState(initialId);
  const [result, setResult] = useState(initialId ? (shipments.find(s => s.id === initialId) || "notfound") : null);
  const doSearch = () => setResult(shipments.find(s => s.id === val.toUpperCase().trim()) || "notfound");
  return (
    <>
      <ModalHeader title="🔍 Track Shipment" onClose={onClose} />
      <FormGroup label="Tracking ID">
        <input style={inputStyle} placeholder="e.g. V1-20250301" value={val}
          onChange={e => setVal(e.target.value)} onKeyDown={e => e.key === "Enter" && doSearch()} />
      </FormGroup>
      {result && result !== "notfound" && (
        <div style={{ background: "#F8FAFC", borderRadius: 14, padding: 18, marginBottom: 12, border: "1.5px solid #E2E8F0" }}>
          <div style={{ fontSize: 11, fontWeight: 700, color: "#64748B", letterSpacing: 1, textTransform: "uppercase" }}>Tracking ID</div>
          <div style={{ fontSize: 22, fontWeight: 900, color: "#0F172A", margin: "4px 0", letterSpacing: "-0.5px" }}>{result.id}</div>
          <div style={{ display: "flex", alignItems: "center", gap: 8, margin: "8px 0" }}>
            <StatusBadge status={result.status} />
            <span style={{ fontSize: 13, color: "#64748B" }}>{result.from} → {result.to}</span>
          </div>
          <div style={{ fontSize: 13, color: "#64748B" }}>Agent: {result.agent} · ETA: {result.eta}</div>
          <div style={{ marginTop: 10 }}><ProgressBar progress={result.progress} /></div>
        </div>
      )}
      {result === "notfound" && (
        <div style={{ background: "#FEF2F2", borderRadius: 14, padding: 16, marginBottom: 12, border: "1.5px solid #FCA5A5" }}>
          <div style={{ fontSize: 11, fontWeight: 700, color: "#991B1B", letterSpacing: 1, textTransform: "uppercase" }}>Not Found</div>
          <div style={{ fontSize: 13, color: "#991B1B", marginTop: 4 }}>No shipment found for "<b>{val}</b>". Try: V1-20250301</div>
        </div>
      )}
      <ModalActions>
        <BtnSecondary onClick={onClose}>Close</BtnSecondary>
        <BtnPrimary onClick={doSearch} style={{ flex: 2 }}>Track</BtnPrimary>
      </ModalActions>
    </>
  );
};



const CallAgentModal = ({ onClose, showToast }) => (
  <>
    <ModalHeader title="📞 Call Agent" onClose={onClose} />
    <div style={{ textAlign: "center", padding: "20px 0" }}>
      <div style={{ width: 70, height: 70, borderRadius: "50%", background: "linear-gradient(135deg,#2563EB,#3B82F6)", display: "flex", alignItems: "center", justifyContent: "center", margin: "0 auto 12px", color: "white", fontWeight: 700, fontSize: 24 }}>R</div>
      <div style={{ fontSize: 18, fontWeight: 800, color: "#0F172A" }}>Ravi Kumar</div>
      <div style={{ fontSize: 13, color: "#94A3B8", marginTop: 4 }}>Your Delivery Agent · V1-20250301</div>
      <div style={{ fontSize: 20, fontWeight: 700, color: "#2563EB", marginTop: 12 }}>+91 98456 12378</div>
    </div>
    <ModalActions>
      <BtnSecondary onClick={onClose}>Cancel</BtnSecondary>
      <BtnPrimary onClick={() => { showToast("Initiating call to Ravi Kumar...", "📞"); onClose(); }} style={{ flex: 2 }}>Call Now</BtnPrimary>
    </ModalActions>
  </>
);

const MessageAgentModal = ({ onClose }) => {
  const [messages, setMessages] = useState([
    { from: "me", text: "Hi Ravi, what's the ETA?" },
    { from: "agent", text: "Should reach by 5:30–6PM, sir. Traffic is clear on NH48 now." },
  ]);
  const [input, setInput] = useState("");
  const chatRef = useRef(null);
  const send = () => {
    if (!input.trim()) return;
    const msg = input.trim();
    setMessages(m => [...m, { from: "me", text: msg }]);
    setInput("");
    setTimeout(() => setMessages(m => [...m, { from: "agent", text: "Got it! I'll keep you updated, sir. 👍" }]), 1000);
  };
  useEffect(() => { if (chatRef.current) chatRef.current.scrollTop = chatRef.current.scrollHeight; }, [messages]);
  return (
    <>
      <ModalHeader title="💬 Message Agent" onClose={onClose} />
      <div ref={chatRef} style={{ background: "#F8FAFC", borderRadius: 12, padding: 12, marginBottom: 14, maxHeight: 180, overflowY: "auto" }}>
        {messages.map((m, i) => (
          <div key={i} style={{ textAlign: m.from === "me" ? "right" : "left", marginBottom: 8 }}>
            <span style={{
              background: m.from === "me" ? "#2563EB" : "#E2E8F0", color: m.from === "me" ? "white" : "#0F172A",
              borderRadius: m.from === "me" ? "12px 12px 2px 12px" : "12px 12px 12px 2px",
              padding: "7px 12px", fontSize: 12.5, display: "inline-block",
            }}>{m.text}</span>
          </div>
        ))}
      </div>
      <div style={{ display: "flex", gap: 8 }}>
        <input style={{ ...inputStyle, flex: 1 }} placeholder="Type a message..." value={input}
          onChange={e => setInput(e.target.value)} onKeyDown={e => e.key === "Enter" && send()} />
        <button onClick={send} style={{ padding: "10px 16px", background: "#2563EB", border: "none", borderRadius: 10, cursor: "pointer", display: "flex", alignItems: "center" }}>
          <Icon d={icons.send} size={16} stroke="white" />
        </button>
      </div>
    </>
  );
};



// ── Notification Panel (rendered inside dashboard, anchored below navbar) ─────


// ══════════════════════════════════════════════════════════════════════════════
// MAIN DASHBOARD
// ══════════════════════════════════════════════════════════════════════════════
export default function ClientDashboard() {
  const navigate = useNavigate();
  const [setAlertVisible] = useState(true);
  const [modal, setModal] = useState(null); 
  const [notifOpen, setNotifOpen] = useState(false);
  const [notifs, setNotifs] = useState(INITIAL_NOTIFS);
  const { toasts, show: showToast } = useToasts();
  const notifPanelRef = useRef(null);
  const { user } = useAuth();

  const unreadCount = notifs.filter(n => n.unread).length;

  const openModal = (type, payload) => { setModal({ type, payload }); setNotifOpen(false); };
  const closeModal = () => setModal(null);

  useEffect(() => {
    const handler = e => {
      if (notifPanelRef.current && !notifPanelRef.current.contains(e.target)) setNotifOpen(false);
    };
    document.addEventListener("mousedown", handler);
    return () => document.removeEventListener("mousedown", handler);
  }, []);

  const getGreeting = () => {
    const h = new Date().getHours();
    if (h < 12) return "Good Morning";
    if (h < 17) return "Good Afternoon";
    return "Good Evening";
  };

  const getDate = () => new Date().toLocaleDateString("en-IN", {
    weekday: "long", month: "long", day: "numeric", year: "numeric",
  });

  // ── Navbar bridge props ───────────────────────────────────────────────────
  const navbarProps = {
  onTrackSearch: (id) => openModal("track", { id }),
  onBellClick: () => setNotifOpen(p => !p),
  unreadCount,
  onConfirmPickup: () => openModal("confirmPickup"),
  onReschedule: () => openModal("reschedule"),
};

  // ── Active modal renderer ─────────────────────────────────────────────────
  const renderModal = () => {
    if (!modal) return null;
    const { type, payload } = modal;
    const p = { onClose: closeModal, showToast };
    return (
      <Modal onClose={closeModal}>
        {type === "requestPickup" && <RequestPickupModal  {...p} />}
        {type === "track" && <TrackModal          {...p} initialId={payload?.id || ""} />}
        {type === "confirmPickup" && (
          <ConfirmPickupModal
            {...p}
            user={user}
            dismissAlert={() => setAlertVisible(false)}
          />
        )}
        {type === "reschedule" && <RescheduleModal     {...p} />}
        {type === "callAgent" && <CallAgentModal      {...p} />}
        {type === "messageAgent" && <MessageAgentModal   {...p} />}
      </Modal>
    );
  };

  return (
    <>
    <title>Dashboard</title>
    <div style={{
      display: "flex", flexDirection: "column", minHeight: "100vh",
      fontFamily: "'DM Sans','Segoe UI',sans-serif", background: "#F0F4FA", color: "#0F172A",
    }}>

      {/* ── Global keyframe animations ──────────────────────────────────── */}
      <style>{`
        @keyframes pop      { from { transform: scale(.9); opacity: 0 } to { transform: scale(1); opacity: 1 } }
        @keyframes slideUp  { from { opacity: 0; transform: translateY(10px) } to { opacity: 1; transform: translateY(0) } }
        @keyframes slideDown{ from { opacity: 0; transform: translateY(-8px) } to { opacity: 1; transform: translateY(0) } }
        @keyframes blink    { 0%,100% { opacity: 1 } 50% { opacity: .3 } }
        input:focus, select:focus, textarea:focus {
          border-color: #2563EB !important;
          box-shadow: 0 0 0 3px rgba(37,99,235,.1);
        }
      `}</style>

      {/* ── CLIENT NAVBAR ───────────────────────────────────────────────── */}

      <div ref={notifPanelRef} style={{ position: "relative" }}>
        <ClientNavbar
          {...navbarProps}
        />

        {/* Notification panel anchors relative to the navbar wrapper */}
        {notifOpen && (
          <NotifPanel
            notifs={notifs}
            setNotifs={setNotifs}
            onTrack={id => openModal("track", { id })}
            onClose={() => setNotifOpen(false)}
            showToast={showToast}
          />
        )}
      </div>

      {/* ── MAIN CONTENT ────────────────────────────────────────────────── */}
      <main style={{ flex: 1, overflow: "auto", padding: "24px 100px", display: "flex", flexDirection: "column", gap: 20 }}>

        {/* HERO BANNER */}
        <div style={{
          background: "linear-gradient(135deg,#0B1F3B 0%,#1E3A5F 50%,#1a3a6b 100%)",
          borderRadius: 20, padding: "28px 36px", display: "flex", alignItems: "center",
          justifyContent: "space-between", position: "relative", overflow: "hidden",
          boxShadow: "0 8px 32px rgba(11,31,59,.2)",
        }}>
          <div style={{ position: "absolute", top: -40, right: -40, width: 200, height: 200, borderRadius: "50%", background: "rgba(37,99,235,.15)", pointerEvents: "none" }} />
          <div style={{ position: "absolute", bottom: -60, right: 120, width: 150, height: 150, borderRadius: "50%", background: "rgba(96,165,250,.08)", pointerEvents: "none" }} />
          <div style={{ position: "relative", zIndex: 1 }}>
            <div style={{ fontSize: 11, fontWeight: 600, color: "rgba(255,255,255,.45)", letterSpacing: "1px", textTransform: "uppercase", marginBottom: 6 }}>{getDate()}</div>
            <h1 style={{ fontSize: 24, fontWeight: 800, color: "white", margin: "0 0 6px", letterSpacing: "-0.6px" }}>{getGreeting()}, {user?.name?.split(" ")[0] || ""} </h1>
            <p style={{ fontSize: 13, color: "rgba(255,255,255,.5)", margin: 0 }}>
              You have{" "}
              <span style={{ color: "#60A5FA", fontWeight: 700 }}>3 active shipments</span> and{" "}
              <span style={{ color: "#FBBF24", fontWeight: 700 }}>1 pending invoice</span>
            </p>
          </div>
          {/* Hero track box — mirrors the navbar search but larger */}
          <div style={{ position: "relative", zIndex: 1, display: "flex", gap: 10 }}>
            <HeroTrackBox onTrack={id => openModal("track", { id })} showToast={showToast} />
          </div>
        </div>

        {/* KPI CARDS */}
        <div style={{ display: "grid", gridTemplateColumns: "repeat(4,1fr)", gap: 14 }}>
          {[
            { label: "Active Shipments", value: "3", icon: icons.truck, color: "#2563EB", bg: "linear-gradient(135deg,#EFF6FF,#DBEAFE)", iconBg: "#DBEAFE", trend: "+1 this week",},
            { label: "Delivered", value: "28", icon: icons.check, color: "#10B981", bg: "linear-gradient(135deg,#F0FDF4,#D1FAE5)", iconBg: "#D1FAE5", trend: "All time",},
            { label: "Pending Pickup", value: "1", icon: icons.clock, color: "#F59E0B", bg: "linear-gradient(135deg,#FFFBEB,#FEF3C7)", iconBg: "#FEF3C7", trend: "Scheduled Mar 5"},
            { label: "Open Invoices", value: "₹4.2K", icon: icons.invoice, color: "#7C3AED", bg: "linear-gradient(135deg,#FAF5FF,#EDE9FE)", iconBg: "#EDE9FE", trend: "Due in 7 days"},
          ].map(kpi => (
            <div key={kpi.label} onClick={kpi.action} style={{
              background: kpi.bg, borderRadius: 16, padding: 20,
              border: "1px solid rgba(255,255,255,.8)", boxShadow: "0 2px 12px rgba(0,0,0,.04)",
              transition: "all .2s",
            }}
              onMouseEnter={e => { e.currentTarget.style.transform = "translateY(-2px)"; e.currentTarget.style.boxShadow = "0 8px 24px rgba(0,0,0,.08)"; }}
              onMouseLeave={e => { e.currentTarget.style.transform = "translateY(0)"; e.currentTarget.style.boxShadow = "0 2px 12px rgba(0,0,0,.04)"; }}>
              <div style={{ marginBottom: 14 }}>
                <div style={{ width: 40, height: 40, background: kpi.iconBg, borderRadius: 12, display: "flex", alignItems: "center", justifyContent: "center", boxShadow: "0 2px 8px rgba(0,0,0,.06)" }}>
                  <Icon d={kpi.icon} size={18} stroke={kpi.color} />
                </div>
              </div>
              <div style={{ fontSize: 28, fontWeight: 900, color: "#0F172A", letterSpacing: "-1px", lineHeight: 1 }}>{kpi.value}</div>
              <div style={{ fontSize: 12, fontWeight: 600, color: "#64748B", marginTop: 5 }}>{kpi.label}</div>
              <div style={{ fontSize: 11, color: kpi.color, marginTop: 3, fontWeight: 500 }}>{kpi.trend}</div>
            </div>
          ))}
        </div>

        {/* ACTIVE TRACKER + TIMELINE */}
        <div style={{ display: "grid", gridTemplateColumns: "1fr 300px", gap: 16 }}>

          {/* Tracker Card */}
          <div style={{ background: "white", borderRadius: 16, padding: 22, boxShadow: "0 2px 16px rgba(0,0,0,.06)", border: "1px solid #F1F5F9" }}>
            <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 18 }}>
              <div>
                <div style={{ fontSize: 15, fontWeight: 800, color: "#0F172A", letterSpacing: "-0.3px", marginBottom: 2 }}>Active Shipment</div>
                <div style={{ fontSize: 12, color: "#94A3B8" }}>V1-20250301 · Chennai → Mumbai</div>
              </div>
              <StatusBadge status="In Transit" />
            </div>

            {/* Progress bar */}
            <div style={{ marginBottom: 18 }}>
              <div style={{ display: "flex", justifyContent: "space-between", marginBottom: 6 }}>
                <span style={{ fontSize: 12, color: "#64748B", fontWeight: 500 }}>Delivery Progress</span>
                <span style={{ fontSize: 12, color: "#2563EB", fontWeight: 700 }}>72%</span>
              </div>
              <div style={{ background: "#F1F5F9", borderRadius: 8, height: 10, overflow: "hidden" }}>
                <div style={{ width: "72%", height: "100%", background: "linear-gradient(90deg,#2563EB,#60A5FA)", borderRadius: 8, position: "relative" }}>
                  <div style={{ position: "absolute", right: 0, top: "50%", transform: "translateY(-50%)", width: 14, height: 14, borderRadius: "50%", background: "white", border: "3px solid #2563EB", boxShadow: "0 0 0 3px rgba(37,99,235,.2)" }} />
                </div>
              </div>
            </div>

            {/* Route visualisation */}
            <div style={{ background: "linear-gradient(135deg,#EFF6FF,#F0F9FF)", borderRadius: 12, padding: "14px 18px", marginBottom: 18, display: "flex", alignItems: "center" }}>
              <div style={{ textAlign: "center", minWidth: 72 }}>
                <div style={{ fontSize: 10, color: "#94A3B8", marginBottom: 4, fontWeight: 500 }}>FROM</div>
                <div style={{ width: 34, height: 34, background: "#2563EB", borderRadius: "50%", display: "flex", alignItems: "center", justifyContent: "center", margin: "0 auto 5px" }}>
                  <Icon d={icons.location} size={16} stroke="white" fill="white" />
                </div>
                <div style={{ fontSize: 13, fontWeight: 700 }}>Chennai</div>
              </div>
              <div style={{ flex: 1, display: "flex", flexDirection: "column", alignItems: "center", gap: 3, padding: "0 10px" }}>
                <div style={{ fontSize: 10, color: "#94A3B8", fontWeight: 500 }}>ETA Today 6PM</div>
                <div style={{ width: "100%", height: 2, borderRadius: 1, background: "linear-gradient(90deg,#2563EB 72%,#E2E8F0 72%)", position: "relative" }}>
                  <span style={{ position: "absolute", left: "72%", top: "50%", transform: "translate(-50%,-50%)", fontSize: 16 }}>🚚</span>
                </div>
                <div style={{ fontSize: 10, color: "#2563EB", fontWeight: 600 }}>~248km remaining</div>
              </div>
              <div style={{ textAlign: "center", minWidth: 72 }}>
                <div style={{ fontSize: 10, color: "#94A3B8", marginBottom: 4, fontWeight: 500 }}>TO</div>
                <div style={{ width: 34, height: 34, background: "#E2E8F0", borderRadius: "50%", display: "flex", alignItems: "center", justifyContent: "center", margin: "0 auto 5px" }}>
                  <Icon d={icons.location} size={16} stroke="#64748B" />
                </div>
                <div style={{ fontSize: 13, fontWeight: 700 }}>Mumbai</div>
              </div>
            </div>

            {/* Agent row */}
            <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", padding: "12px 14px", background: "#F8FAFC", borderRadius: 10 }}>
              <div style={{ display: "flex", alignItems: "center", gap: 10 }}>
                <div style={{ width: 36, height: 36, borderRadius: "50%", background: "linear-gradient(135deg,#2563EB,#3B82F6)", display: "flex", alignItems: "center", justifyContent: "center", color: "white", fontWeight: 700, fontSize: 13 }}>R</div>
                <div>
                  <div style={{ fontSize: 12, fontWeight: 600, color: "#0F172A" }}>Ravi Kumar</div>
                  <div style={{ fontSize: 10, color: "#94A3B8" }}>Your Delivery Agent</div>
                </div>
              </div>
              <div style={{ display: "flex", gap: 6 }}>
                <button onClick={() => openModal("callAgent")} style={{ padding: "6px 12px", border: "1px solid #E2E8F0", borderRadius: 8, background: "white", color: "#334155", fontSize: 11, fontWeight: 500, cursor: "pointer", fontFamily: "inherit" }}>📞 Call</button>
                <button onClick={() => openModal("messageAgent")} style={{ padding: "6px 12px", border: "none", borderRadius: 8, background: "#EFF6FF", color: "#2563EB", fontSize: 11, fontWeight: 600, cursor: "pointer", fontFamily: "inherit" }}>Message</button>
              </div>
            </div>
          </div>

          {/* Delivery Timeline */}
          <div style={{ background: "white", borderRadius: 16, padding: 22, boxShadow: "0 2px 16px rgba(0,0,0,.06)", border: "1px solid #F1F5F9" }}>
            <div style={{ fontSize: 15, fontWeight: 800, color: "#0F172A", letterSpacing: "-0.3px", marginBottom: 18 }}>Delivery Timeline</div>
            <TrackingTimeline />
            <div style={{ marginTop: 18, padding: "14px 16px", background: "linear-gradient(135deg,#EFF6FF,#DBEAFE)", borderRadius: 12, border: "1px solid #BFDBFE" }}>
              <div style={{ fontSize: 10, fontWeight: 600, color: "#1D4ED8", letterSpacing: "1px", textTransform: "uppercase", marginBottom: 3 }}>Estimated Arrival</div>
              <div style={{ fontSize: 20, fontWeight: 800, color: "#0F172A", letterSpacing: "-0.5px" }}>Today, 6:00 PM</div>
              <div style={{ fontSize: 11, color: "#64748B", marginTop: 3 }}>Mumbai — Nariman Point</div>
            </div>
          </div>
        </div>

        {/* RECENT SHIPMENTS + QUICK ACTIONS */}
        <div style={{ display: "grid", gridTemplateColumns: "1fr 260px", gap: 16 }}>

          {/* Shipments Table */}
          <div style={{ background: "white", borderRadius: 16, boxShadow: "0 2px 16px rgba(0,0,0,.06)", border: "1px solid #F1F5F9", overflow: "hidden" }}>
            <div style={{ padding: "18px 22px", borderBottom: "1px solid #F8FAFC", display: "flex", justifyContent: "space-between", alignItems: "center" }}>
              <div style={{ fontSize: 15, fontWeight: 800, color: "#0F172A" }}>Recent Shipments</div>
              <button onClick={() => openModal("allShipments")} style={{ fontSize: 12, color: "#2563EB", fontWeight: 600, background: "none", border: "none", cursor: "pointer", fontFamily: "inherit" }}>View all →</button>
            </div>
            <table style={{ width: "100%", borderCollapse: "collapse" }}>
              <thead>
                <tr style={{ background: "#F8FAFC" }}>
                  {["Tracking ID", "Route", "Agent", "Progress", "Status", "ETA"].map(h => (
                    <th key={h} style={{ padding: "9px 14px", fontSize: 11, fontWeight: 600, color: "#94A3B8", textAlign: "left", borderBottom: "1px solid #F1F5F9", whiteSpace: "nowrap" }}>{h}</th>
                  ))}
                </tr>
              </thead>
              <tbody>
                {shipments.map(s => (
                  <tr key={s.id} onClick={() => openModal("track", { id: s.id })} style={{ borderBottom: "1px solid #F8FAFC", cursor: "pointer", transition: "background .1s" }}
                    onMouseEnter={e => e.currentTarget.style.background = "#F8FAFC"}
                    onMouseLeave={e => e.currentTarget.style.background = "white"}>
                    <td style={{ padding: "12px 14px", fontSize: 12, fontWeight: 700, color: "#2563EB" }}>{s.id}</td>
                    <td style={{ padding: "12px 14px", fontSize: 12, color: "#334155" }}>{s.from} → {s.to}</td>
                    <td style={{ padding: "12px 14px", fontSize: 12, color: "#64748B" }}>{s.agent}</td>
                    <td style={{ padding: "12px 14px" }}><ProgressBar progress={s.progress} /></td>
                    <td style={{ padding: "12px 14px" }}><StatusBadge status={s.status} /></td>
                    <td style={{ padding: "12px 14px", fontSize: 11, color: "#64748B", whiteSpace: "nowrap" }}>{s.eta}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          {/* Quick Actions */}
          <div style={{ display: "flex", flexDirection: "column", gap: 10 }}>
            <div style={{ fontSize: 15, fontWeight: 800, color: "#0F172A" }}>Quick Actions</div>
            {[
              { label: "Request Pickup", desc: "Schedule a new pickup", icon: icons.plus, color: "#2563EB", bg: "linear-gradient(135deg,#EFF6FF,#DBEAFE)", action: () => navigate('/pickup') },
              { label: "View Invoices", desc: "Download & pay invoices", icon: icons.invoice, color: "#7C3AED", bg: "linear-gradient(135deg,#FAF5FF,#EDE9FE)", action: () => navigate('/invoices') },
              { label: "Track Shipment", desc: "Enter tracking ID", icon: icons.search, color: "#0891B2", bg: "linear-gradient(135deg,#F0F9FF,#E0F2FE)", action: () => openModal("track", {}) },
              { label: "Download Report", desc: "Monthly shipment summary", icon: icons.download, color: "#059669", bg: "linear-gradient(135deg,#F0FDF4,#D1FAE5)", action: () => showToast("Generating monthly report... Download will start shortly.", "📊", "success") },
            ].map(a => (
              <button key={a.label} onClick={a.action} style={{
                display: "flex", alignItems: "center", gap: 12, padding: "13px 14px",
                border: "1px solid rgba(255,255,255,.8)", borderRadius: 14, background: a.bg,
                cursor: "pointer", textAlign: "left", transition: "all .2s",
                boxShadow: "0 2px 8px rgba(0,0,0,.04)", width: "100%", fontFamily: "inherit",
              }}
                onMouseEnter={e => { e.currentTarget.style.transform = "translateX(4px)"; e.currentTarget.style.boxShadow = "0 4px 16px rgba(0,0,0,.1)"; }}
                onMouseLeave={e => { e.currentTarget.style.transform = "translateX(0)"; e.currentTarget.style.boxShadow = "0 2px 8px rgba(0,0,0,.04)"; }}>
                <div style={{ width: 38, height: 38, background: "white", borderRadius: 12, display: "flex", alignItems: "center", justifyContent: "center", flexShrink: 0, boxShadow: "0 2px 8px rgba(0,0,0,.06)" }}>
                  <Icon d={a.icon} size={17} stroke={a.color} />
                </div>
                <div style={{ flex: 1 }}>
                  <div style={{ fontSize: 13, fontWeight: 700, color: "#0F172A" }}>{a.label}</div>
                  <div style={{ fontSize: 11, color: "#94A3B8", marginTop: 2 }}>{a.desc}</div>
                </div>
                <Icon d={icons.arrow} size={14} stroke="#CBD5E1" />
              </button>
            ))}

            {/* Satisfaction widget */}
            <div style={{ background: "linear-gradient(135deg,#0B1F3B,#1E3A5F)", borderRadius: 14, padding: 16, marginTop: 4 }}>
              <div style={{ display: "flex", alignItems: "center", gap: 8, marginBottom: 10 }}>
                <Icon d={icons.star} size={16} stroke="#FBBF24" fill="#FBBF24" />
                <span style={{ fontSize: 12, fontWeight: 700, color: "white" }}>Your Experience</span>
              </div>
              <div style={{ fontSize: 28, fontWeight: 900, color: "white", letterSpacing: "-1px" }}>
                4.9 <span style={{ fontSize: 13, color: "rgba(255,255,255,.45)", fontWeight: 400 }}>/ 5.0</span>
              </div>
              <div style={{ fontSize: 11, color: "rgba(255,255,255,.45)", marginTop: 3 }}>Based on 28 deliveries</div>
              <div style={{ display: "flex", gap: 3, marginTop: 10 }}>
                {[1, 2, 3, 4, 5].map(s => <div key={s} style={{ flex: 1, height: 4, borderRadius: 2, background: "#FBBF24" }} />)}
              </div>
            </div>
          </div>
        </div>
      </main>

      {/* ── ACTIVE MODAL ────────────────────────────────────────────────── */}
      {renderModal()}

      {/* ── TOASTS ──────────────────────────────────────────────────────── */}
      <ToastContainer toasts={toasts} />
    </div>
    </>
  );
}

// ── Hero track search box (small isolated component) ──────────────────────────
function HeroTrackBox({ onTrack, showToast }) {
  const [val, setVal] = useState("");
  const submit = () => {
    if (!val.trim()) { showToast("Please enter a tracking ID", "⚠️", "warn"); return; }
    onTrack(val.trim().toUpperCase());
  };
  return (
    <>
      <div style={{ position: "relative" }}>
        <input value={val} onChange={e => setVal(e.target.value)} onKeyDown={e => e.key === "Enter" && submit()}
          placeholder="Enter tracking ID..."
          style={{ background: "rgba(255,255,255,.12)", border: "1px solid rgba(255,255,255,.22)", borderRadius: 12, padding: "11px 14px 11px 38px", color: "white", fontSize: 13, width: 230, outline: "none", fontFamily: "inherit" }} />
        <span style={{ position: "absolute", left: 12, top: "50%", transform: "translateY(-50%)" }}>
          <Icon d={icons.search} size={14} stroke="rgba(255,255,255,0.5)" />
        </span>
      </div>
      <button onClick={submit} style={{
        padding: "11px 18px", border: "none", borderRadius: 12,
        background: "linear-gradient(135deg,#2563EB,#3B82F6)", color: "white",
        fontSize: 13, fontWeight: 700, cursor: "pointer", display: "flex", alignItems: "center", gap: 6,
        boxShadow: "0 4px 16px rgba(37,99,235,.4)", fontFamily: "inherit",
      }}>
        <Icon d={icons.search} size={13} stroke="white" /> Track
      </button>
    </>
  );
}