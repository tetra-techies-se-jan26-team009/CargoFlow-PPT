import { useState, useEffect } from "react";
import ClientNavbar from "../../components/ClientNavbar";
import { getClientShipments, CLIENT_STATUS_META } from "../../utils/clientAPI";
import InvoiceModal from "../../components/ui/Modals/InvoiceModal";

const Icon = ({ d, size = 16, stroke = "currentColor", fill = "none", strokeWidth = 1.6 }) => (
  <svg width={size} height={size} viewBox="0 0 24 24" fill={fill} stroke={stroke} strokeWidth={strokeWidth} strokeLinecap="round" strokeLinejoin="round">
    <path d={d} />
  </svg>
);

const icons = {
  invoice: "M14 2H6a2 2 0 00-2 2v16a2 2 0 002 2h12a2 2 0 002-2V8z M14 2v6h6 M16 13H8 M16 17H8",
  download: "M21 15v4a2 2 0 01-2 2H5a2 2 0 01-2-2v-4 M7 10l5 5 5-5 M12 15V3",
  check: "M22 11.08V12a10 10 0 11-5.93-9.14 M22 4L12 14.01l-3-3",
  clock: "M12 22a10 10 0 100-20 10 10 0 000 20z M12 6v6l4 2",
  warning: "M10.29 3.86L1.82 18a2 2 0 001.71 3h16.94a2 2 0 001.71-3L13.71 3.86a2 2 0 00-3.42 0z M12 9v4 M12 17h.01",
  search: "M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z",
  close: "M18 6L6 18 M6 6l12 12",
};

export default function ClientInvoices() {
  const [invoices, setInvoices] = useState([]);
  const [loading, setLoading] = useState(true);
  const [filter, setFilter] = useState("All");
  const [q, setQ] = useState("");
  const [viewingPdf, setViewingPdf] = useState(null);

  useEffect(() => {
    const fetchData = async () => {
      try {
        setLoading(true);
        // Using your clientAPI function to hit /api/v1/client/shipments
        const data = await getClientShipments();

        // Transform the standardized API objects for this page's UI
        const mapped = data.shipments.map(s => ({
          ...s,
          invoiceId: `INV-${s.id.split("-").pop()}`, // Derive Invoice ID from Tracking ID
          dueDate: new Date(new Date(s.date).getTime() + 1209600000).toLocaleDateString(), // Mock 14-day due date
          rawStatus: s.status // Using mapped "Pending", "In Transit", etc. from clientAPI
        }));
        setInvoices(mapped);
      } catch (err) {
        console.error("Sync failed", err);
      } finally {
        setLoading(false);
      }
    };
    fetchData();
  }, []);

  const rows = invoices.filter(inv => {
    const matchFilter = filter === "All" || inv.status === filter;
    const matchSearch = !q || inv.id.toLowerCase().includes(q.toLowerCase()) || inv.invoiceId.toLowerCase().includes(q.toLowerCase());
    return matchFilter && matchSearch;
  });

  const totalPaid = invoices.filter(i => i.status === "Delivered").reduce((a, b) => a + b.price, 0);
  const totalDue = invoices.filter(i => i.status !== "Delivered").reduce((a, b) => a + b.price, 0);

  return (
    <div style={{ display: "flex", flexDirection: "column", minHeight: "100vh", background: "#F8FAFC", fontFamily: "'DM Sans', sans-serif" }}>
      <title>Invoices & Billings </title>

      <ClientNavbar />

      {/* PDF MODAL COMPONENT */}
      {viewingPdf && (
        <InvoiceModal
          shipment={viewingPdf}
          onClose={() => setViewingPdf(null)}
        />
      )}
      <main style={{ flex: 1, padding: "28px 100px", display: "flex", flexDirection: "column", gap: 24 }}>
        <header style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start" }}>
          <div>
            <h1 style={{ fontSize: 24, fontWeight: 800, color: "#0F172A", margin: 0 }}>Invoices</h1>
            <p style={{ fontSize: 13, color: "#94A3B8", margin: "4px 0 0" }}>Manage billing for your shipments</p>
          </div>
        </header>

        {/* Financial KPIs */}
        <div style={{ display: "grid", gridTemplateColumns: "repeat(2, 1fr)", gap: 16 }}>
          <StatCard label="Outstanding Balance" val={`₹${totalDue.toLocaleString()}`} icon={icons.clock} color="#92400E" bg="linear-gradient(135deg,#FFFBEB,#FEF3C7)" />
          <StatCard label="Lifetime Paid" val={`₹${totalPaid.toLocaleString()}`} icon={icons.check} color="#065F46" bg="linear-gradient(135deg,#F0FDF4,#D1FAE5)" />
        </div>

        {/* Filter Bar */}
        <div style={{ display: "flex", gap: 12, alignItems: "center" }}>
          <div style={{ position: "relative" }}>
            <input value={q} onChange={e => setQ(e.target.value)} placeholder="Search ID..." style={inputStyle} />
            <span style={{ position: "absolute", left: 12, top: "50%", transform: "translateY(-50%)" }}><Icon d={icons.search} size={13} stroke="#94A3B8" /></span>
          </div>
          {["All", "Pending", "In Transit", "Delivered"].map(f => (
            <button key={f} onClick={() => setFilter(f)} style={{ ...filterBtn, borderColor: filter === f ? "#2563EB" : "#E2E8F0", color: filter === f ? "#1D4ED8" : "#64748B", background: filter === f ? "#EFF6FF" : "white" }}>{f}</button>
          ))}
        </div>

        {/* Invoice List */}
        <div style={{ display: "flex", flexDirection: "column", gap: 8 }}>
          {loading ? <div style={{ textAlign: "center", padding: 40, color: "#94A3B8" }}>Fetching invoices...</div> :
            rows.map(inv => (
              <div key={inv.id} style={itemRow}>
                <div style={iconBox}><Icon d={icons.invoice} size={20} stroke="#94A3B8" /></div>
                <div style={{ flex: 1 }}>
                  <div style={{ display: "flex", gap: 8, alignItems: "center" }}>
                    <span style={{ fontSize: 13, fontWeight: 700, color: "#2563EB" }}>{inv.invoiceId}</span>
                    <span style={{ fontSize: 10, color: "#CBD5E1" }}>ID: {inv.id}</span>
                  </div>
                  <div style={{ fontSize: 11, color: "#64748B" }}>{inv.from} → {inv.to}</div>
                </div>
                <div style={{ textAlign: "right", minWidth: 100 }}>
                  <div style={{ fontSize: 16, fontWeight: 800 }}>{inv.priceLabel}</div>
                  <div style={{ fontSize: 10, fontWeight: 600, color: CLIENT_STATUS_META[inv.status]?.color }}>{inv.status}</div>
                </div>
                <button onClick={() =>
                  setViewingPdf({
                    ...inv,
                    client: inv.client || "Business Client",
                    origin: inv.from,
                    dest: inv.to,
                    weight: inv.kg,
                  })
                }style={actionBtn}>View PDF</button>
              </div>
            ))}
    </div>
      </main >
    </div >
  );
}

// PDF Modal (Dummy Visual with Real Data)
function InvoicePdfModal({ invoice, onClose }) {
  return (
    <div style={{ position: "fixed", inset: 0, background: "rgba(0,0,0,0.6)", backdropFilter: "blur(4px)", zIndex: 1000, display: "flex", alignItems: "center", justifyContent: "center" }}>
      <div style={{ background: "white", width: 600, borderRadius: 16, overflow: "hidden", position: "relative", padding: 40, boxShadow: "0 25px 50px rgba(0,0,0,0.2)" }}>
        <button onClick={onClose} style={{ position: "absolute", right: 20, top: 20, background: "none", border: "none", cursor: "pointer" }}><Icon d={icons.close} size={20} stroke="#94A3B8" /></button>
        <div style={{ display: "flex", justifyContent: "space-between", marginBottom: 40 }}>
          <h2 style={{ color: "#2563EB", fontWeight: 900 }}>CargoFlow</h2>
          <div style={{ textAlign: "right" }}><p style={{ margin: 0, fontSize: 10, color: "#94A3B8" }}>INVOICE</p><p style={{ margin: 0, fontWeight: 700 }}>#{invoice.invoiceId}</p></div>
        </div>
        <div style={{ borderBottom: "2px solid #F1F5F9", paddingBottom: 20, marginBottom: 20 }}>
          <p style={{ fontSize: 12, margin: 0 }}>Shipment Date: <strong>{invoice.date}</strong></p>
          <p style={{ fontSize: 12, margin: 0 }}>Route: <strong>{invoice.from} to {invoice.to}</strong></p>
        </div>
        <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-end" }}>
          <div>
            <img src={`https://api.qrserver.com/v1/create-qr-code/?size=80x80&data=${invoice.id}`} alt="QR" />
            <p style={{ fontSize: 9, color: "#94A3B8", marginTop: 4 }}>Scan to track</p>
          </div>
          <div style={{ textAlign: "right" }}>
            <p style={{ margin: 0, fontSize: 12 }}>Total Amount Paid</p>
            <h1 style={{ margin: 0, fontSize: 32, fontWeight: 900 }}>{invoice.priceLabel}</h1>
          </div>
        </div>
        <div style={{ border: "2px solid rgba(37,99,235,0.1)", borderRadius: "50%", width: 100, height: 100, display: "flex", alignItems: "center", justifyContent: "center", position: "absolute", bottom: 40, left: 150, transform: "rotate(-15deg)", color: "rgba(37,99,235,0.2)" }}>
          <strong style={{ fontSize: 10 }}>CARGOFLOW<br />STAMP</strong>
        </div>
      </div>
    </div>
  );
}

// Shared Styles
//eslint-disable-next-line
const StatCard = ({ label, val, color, bg, icon }) => (
  <div style={{ background: bg, borderRadius: 16, padding: 24, border: "1px solid rgba(255,255,255,0.6)" }}>
    <div style={{ fontSize: 11, fontWeight: 600, color: "#94A3B8", textTransform: "uppercase", marginBottom: 12 }}>{label}</div>
    <div style={{ fontSize: 32, fontWeight: 900, color: "#0F172A" }}>{val}</div>
  </div>
);

const itemRow = { background: "white", borderRadius: 12, padding: "14px 20px", border: "1px solid #F1F5F9", display: "flex", alignItems: "center", gap: 16 };
const iconBox = { width: 40, height: 40, background: "#F8FAFC", borderRadius: 10, display: "flex", alignItems: "center", justifyContent: "center" };
const inputStyle = { width: 220, border: "1px solid #E2E8F0", borderRadius: 10, padding: "8px 12px 8px 34px", fontSize: 12, outline: "none" };
const filterBtn = { padding: "7px 14px", borderRadius: 9, border: "1px solid", fontSize: 12, cursor: "pointer", fontWeight: 600 };
const actionBtn = { padding: "6px 14px", background: "white", border: "1px solid #E2E8F0", borderRadius: 8, fontSize: 11, fontWeight: 600, cursor: "pointer" };