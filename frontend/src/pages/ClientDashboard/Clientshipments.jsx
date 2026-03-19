import { useState } from "react";
import ClientNavbar from "../../components/ClientNavbar";
import { NotifPanel } from "../../components/ui/ClientModals/NotificationPannel";
import { INITIAL_NOTIFS } from "../../utils/tempData";
import { useNavigate } from "react-router-dom";

const Icon = ({ d, size = 16, stroke = "currentColor", fill = "none", strokeWidth = 1.6 }) => (
  <svg width={size} height={size} viewBox="0 0 24 24" fill={fill} stroke={stroke} strokeWidth={strokeWidth} strokeLinecap="round" strokeLinejoin="round">
    <path d={d} />
  </svg>
);


const icons = {
  search: "M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z",
  download: "M21 15v4a2 2 0 01-2 2H5a2 2 0 01-2-2v-4 M7 10l5 5 5-5 M12 15V3",
  plus: "M12 5v14 M5 12h14",
  eye: "M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z M12 15a3 3 0 100-6 3 3 0 000 6z",
  filter: "M22 3H2l8 9.46V19l4 2v-8.54L22 3",
};

const ALL = [
  { id: "V1-20250301", from: "Chennai", to: "Mumbai", status: "In Transit", pct: 72, eta: "Today 6PM", agent: "Ravi Kumar", kg: 24, price: 1200, date: "Mar 1, 2025" },
  { id: "V1-20250289", from: "Delhi", to: "Bangalore", status: "Delivered", pct: 100, eta: "Completed", agent: "Priya Nair", kg: 12, price: 800, date: "Feb 18, 2025" },
  { id: "V1-20250276", from: "Mumbai", to: "Pune", status: "Pending", pct: 8, eta: "Mar 5, 10AM", agent: "Meena Shah", kg: 8, price: 500, date: "Mar 2, 2025" },
  { id: "V1-20250261", from: "Kolkata", to: "Delhi", status: "Delivered", pct: 100, eta: "Completed", agent: "Kiran Roy", kg: 32, price: 2100, date: "Feb 10, 2025" },
  { id: "V1-20250248", from: "Bangalore", to: "Hyderabad", status: "Delivered", pct: 100, eta: "Completed", agent: "Arjun Das", kg: 18, price: 1100, date: "Feb 3, 2025" },
  { id: "V1-20250235", from: "Chennai", to: "Delhi", status: "Delayed", pct: 45, eta: "Mar 6, 3PM", agent: "Ravi Kumar", kg: 40, price: 3200, date: "Mar 1, 2025" },
  { id: "V1-20250220", from: "Mumbai", to: "Kolkata", status: "Delivered", pct: 100, eta: "Completed", agent: "Priya Nair", kg: 22, price: 1800, date: "Jan 28, 2025" },
  { id: "V1-20250208", from: "Delhi", to: "Kochi", status: "Delivered", pct: 100, eta: "Completed", agent: "Meena Shah", kg: 15, price: 2400, date: "Jan 20, 2025" },
];

const statusMeta = {
  "In Transit": { bg: "#DBEAFE", color: "#1D4ED8", dot: "#3B82F6" },
  "Delivered": { bg: "#D1FAE5", color: "#065F46", dot: "#10B981" },
  "Pending": { bg: "#FEF3C7", color: "#92400E", dot: "#F59E0B" },
  "Delayed": { bg: "#FEE2E2", color: "#991B1B", dot: "#EF4444" },
};

const PER = 6;

export default function ClientShipments() {
  const [q, setQ] = useState("");
  const navigate = useNavigate();
  const [tab, setTab] = useState("All");
  const [pg, setPg] = useState(1);
  const [notifOpen, setNotifOpen] = useState(false);
  const [notifs, setNotifs] = useState(INITIAL_NOTIFS);
  const showToast = (msg) => alert(msg);

  const counts = { All: ALL.length };
  ["In Transit", "Delivered", "Pending", "Delayed"].forEach(s => { counts[s] = ALL.filter(r => r.status === s).length; });

  const rows = ALL.filter(r => {
    const ms = tab === "All" || r.status === tab;
    const mq = !q || r.id.toLowerCase().includes(q.toLowerCase()) || r.from.toLowerCase().includes(q.toLowerCase()) || r.to.toLowerCase().includes(q.toLowerCase());
    return ms && mq;
  });

  const pages = Math.max(1, Math.ceil(rows.length / PER));
  const slice = rows.slice((pg - 1) * PER, pg * PER);

  const navbarProps = {
    onBellClick: () => setNotifOpen(p => !p),
    unreadCount: notifs.filter(n => n.unread).length,
  };

  return (
    <div style={{ display: "flex", flexDirection: "column", minHeight: "100vh", fontFamily: "'DM Sans','Segoe UI',sans-serif", background: "#F8FAFC", color: "#0F172A" }}>
      <title>Shipments</title>
      <ClientNavbar
        {...navbarProps}
      />
      {notifOpen && (
        <NotifPanel
          notifs={notifs}
          setNotifs={setNotifs}
          onTrack={(id) => console.log("Track:", id)} // or open modal
          onClose={() => setNotifOpen(false)}
          showToast={showToast}
        />
      )}
      <main style={{ flex: 1, overflow: "auto", padding: "28px 100px", display: "flex", flexDirection: "column", gap: 20 }}>

        {/* Header */}
        <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start" }}>
          <div>
            <h1 style={{ fontSize: 24, fontWeight: 800, color: "#0F172A", margin: "0 0 4px", letterSpacing: "-0.6px" }}>My Shipments</h1>
            <p style={{ fontSize: 13, color: "#94A3B8", margin: 0 }}>Complete history of all your orders with V1 Logistics</p>
          </div>
          <div style={{ display: "flex", gap: 10 }}>
            <button style={{ display: "flex", alignItems: "center", gap: 6, padding: "9px 16px", borderRadius: 10, background: "white", border: "1px solid #E2E8F0", color: "#334155", fontSize: 12, fontWeight: 500, cursor: "pointer", boxShadow: "0 1px 4px rgba(0,0,0,0.04)" }}>
              <Icon d={icons.download} size={13} stroke="#334155" /> Export CSV
            </button>
            <button style={{ display: "flex", alignItems: "center", gap: 6, padding: "9px 18px", borderRadius: 10, background: "linear-gradient(135deg,#2563EB,#3B82F6)", border: "none", color: "white", fontSize: 12, fontWeight: 700, cursor: "pointer", boxShadow: "0 4px 14px rgba(37,99,235,0.3)" }}
            onClick={()=> navigate('/pickup')}
            >
              
              <Icon d={icons.plus} size={13} stroke="white" /> Request Pickup
            </button>
          </div>
        </div>

        {/* Status summary tabs */}
        <div style={{ display: "grid", gridTemplateColumns: "repeat(5,1fr)", gap: 12 }}>
          {[
            { k: "All", v: counts.All, color: "#0F172A", bg: "linear-gradient(135deg,#F8FAFC,#F1F5F9)", border: "#E2E8F0" },
            { k: "In Transit", v: counts["In Transit"], color: "#1D4ED8", bg: "linear-gradient(135deg,#EFF6FF,#DBEAFE)", border: "#BFDBFE" },
            { k: "Delivered", v: counts.Delivered, color: "#065F46", bg: "linear-gradient(135deg,#F0FDF4,#D1FAE5)", border: "#A7F3D0" },
            { k: "Pending", v: counts.Pending, color: "#92400E", bg: "linear-gradient(135deg,#FFFBEB,#FEF3C7)", border: "#FDE68A" },
            { k: "Delayed", v: counts.Delayed, color: "#991B1B", bg: "linear-gradient(135deg,#FFF5F5,#FEE2E2)", border: "#FECACA" },
          ].map(c => (
            <button key={c.k} onClick={() => { setTab(c.k); setPg(1); }}
              style={{ padding: "14px 16px", background: tab === c.k ? c.bg : "white", border: `1.5px solid ${tab === c.k ? c.border : "#E2E8F0"}`, borderRadius: 12, cursor: "pointer", textAlign: "left", transition: "all 0.18s", boxShadow: tab === c.k ? "0 2px 10px rgba(0,0,0,0.06)" : "0 1px 4px rgba(0,0,0,0.03)" }}>
              <div style={{ fontSize: 24, fontWeight: 900, color: tab === c.k ? c.color : "#0F172A", letterSpacing: "-0.8px", lineHeight: 1 }}>{c.v}</div>
              <div style={{ fontSize: 11, color: "#94A3B8", marginTop: 5, fontWeight: 500 }}>{c.k}</div>
            </button>
          ))}
        </div>

        {/* Search */}
        <div style={{ display: "flex", gap: 10, alignItems: "center" }}>
          <div style={{ position: "relative", flex: 1, maxWidth: 320 }}>
            <input value={q} onChange={e => { setQ(e.target.value); setPg(1); }} placeholder="Search by ID, city or route…"
              style={{ width: "100%", background: "white", border: "1px solid #E2E8F0", borderRadius: 10, padding: "9px 14px 9px 36px", color: "#334155", fontSize: 12, outline: "none", boxSizing: "border-box", boxShadow: "0 1px 4px rgba(0,0,0,0.03)" }}
              onFocus={e => e.target.style.borderColor = "#93C5FD"}
              onBlur={e => e.target.style.borderColor = "#E2E8F0"} />
            <span style={{ position: "absolute", left: 12, top: "50%", transform: "translateY(-50%)" }}>
              <Icon d={icons.search} size={13} stroke="#94A3B8" />
            </span>
          </div>
          <span style={{ marginLeft: "auto", fontSize: 12, color: "#94A3B8" }}>{rows.length} shipments</span>
        </div>

        {/* Table */}
        <div style={{ background: "white", borderRadius: 16, boxShadow: "0 2px 16px rgba(0,0,0,0.06)", border: "1px solid #F1F5F9", overflow: "hidden" }}>
          <table style={{ width: "100%", borderCollapse: "collapse" }}>
            <thead>
              <tr style={{ background: "#F8FAFC" }}>
                {["Tracking ID", "Route", "Agent", "Weight", "Price", "Date", "Progress", "Status", ""].map(h => (
                  <th key={h} style={{ padding: "11px 16px", fontSize: 11, fontWeight: 600, color: "#94A3B8", textAlign: "left", borderBottom: "1px solid #F1F5F9", whiteSpace: "nowrap" }}>{h}</th>
                ))}
              </tr>
            </thead>
            <tbody>
              {slice.length === 0
                ? <tr><td colSpan={9} style={{ padding: 48, textAlign: "center", color: "#94A3B8", fontSize: 13 }}>No shipments match your filters.</td></tr>
                : slice.map(s => (
                  <tr key={s.id}
                    style={{ borderBottom: "1px solid #F8FAFC", cursor: "pointer", transition: "background 0.1s" }}
                    onMouseEnter={e => e.currentTarget.style.background = "#F8FAFC"}
                    onMouseLeave={e => e.currentTarget.style.background = "white"}>
                    <td style={{ padding: "13px 16px", fontSize: 12, fontWeight: 700, color: "#2563EB" }}>{s.id}</td>
                    <td style={{ padding: "13px 16px" }}>
                      <div style={{ fontSize: 12, fontWeight: 600, color: "#334155" }}>{s.from}</div>
                      <div style={{ fontSize: 11, color: "#94A3B8", marginTop: 1 }}>→ {s.to}</div>
                    </td>
                    <td style={{ padding: "13px 16px", fontSize: 12, color: "#64748B" }}>{s.agent}</td>
                    <td style={{ padding: "13px 16px", fontSize: 12, color: "#64748B" }}>{s.kg} kg</td>
                    <td style={{ padding: "13px 16px", fontSize: 12, fontWeight: 700, color: "#0F172A" }}>₹{s.price.toLocaleString()}</td>
                    <td style={{ padding: "13px 16px", fontSize: 11, color: "#94A3B8", whiteSpace: "nowrap" }}>{s.date}</td>
                    <td style={{ padding: "13px 16px" }}>
                      <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
                        <div style={{ flex: 1, background: "#F1F5F9", borderRadius: 4, height: 5, overflow: "hidden", minWidth: 70 }}>
                          <div style={{ width: `${s.pct}%`, height: "100%", background: s.pct === 100 ? "#10B981" : "#2563EB", borderRadius: 4 }} />
                        </div>
                        <span style={{ fontSize: 10, color: "#94A3B8", fontWeight: 600, minWidth: 28 }}>{s.pct}%</span>
                      </div>
                    </td>
                    <td style={{ padding: "13px 16px" }}>
                      <span style={{ fontSize: 11, fontWeight: 600, padding: "3px 9px", borderRadius: 20, background: statusMeta[s.status]?.bg, color: statusMeta[s.status]?.color }}>
                        {s.status}
                      </span>
                    </td>
                    <td style={{ padding: "13px 16px" }}>
                      <button style={{ display: "flex", alignItems: "center", gap: 5, padding: "5px 12px", borderRadius: 8, background: "#F8FAFC", border: "1px solid #E2E8F0", color: "#334155", fontSize: 11, fontWeight: 500, cursor: "pointer" }}>
                        <Icon d={icons.eye} size={11} stroke="#334155" /> View
                      </button>
                    </td>
                  </tr>
                ))}
            </tbody>
          </table>

          {/* Pagination */}
          <div style={{ padding: "12px 20px", borderTop: "1px solid #F1F5F9", display: "flex", justifyContent: "space-between", alignItems: "center" }}>
            <span style={{ fontSize: 12, color: "#94A3B8" }}>
              Showing {Math.min((pg - 1) * PER + 1, rows.length)}–{Math.min(pg * PER, rows.length)} of {rows.length}
            </span>
            <div style={{ display: "flex", gap: 4 }}>
              <button onClick={() => setPg(p => Math.max(1, p - 1))} disabled={pg === 1}
                style={{ padding: "5px 12px", borderRadius: 8, border: "1px solid #E2E8F0", background: "white", color: pg === 1 ? "#CBD5E1" : "#334155", fontSize: 12, cursor: pg === 1 ? "not-allowed" : "pointer" }}>‹ Prev</button>
              {Array.from({ length: pages }, (_, i) => i + 1).map(p => (
                <button key={p} onClick={() => setPg(p)}
                  style={{ width: 32, height: 32, borderRadius: 8, border: "1px solid", borderColor: p === pg ? "#2563EB" : "#E2E8F0", background: p === pg ? "#2563EB" : "white", color: p === pg ? "white" : "#334155", fontSize: 12, cursor: "pointer", fontWeight: p === pg ? 700 : 400 }}>
                  {p}
                </button>
              ))}
              <button onClick={() => setPg(p => Math.min(pages, p + 1))} disabled={pg === pages}
                style={{ padding: "5px 12px", borderRadius: 8, border: "1px solid #E2E8F0", background: "white", color: pg === pages ? "#CBD5E1" : "#334155", fontSize: 12, cursor: pg === pages ? "not-allowed" : "pointer" }}>Next ›</button>
            </div>
          </div>
        </div>

      </main>
    </div>
  );
}