import { useEffect, useMemo, useRef, useState } from "react";
import { useNavigate } from "react-router-dom";
import ClientNavbar from "../../components/ClientNavbar";
import { NotifPanel } from "../../components/ui/ClientModals/NotificationPannel";
import {
    buildClientNotifications,
    CLIENT_STATUS_META,
    getClientShipments,
} from "../../utils/clientAPI";

const Icon = ({ d, size = 16, stroke = "currentColor", fill = "none", strokeWidth = 1.6 }) => (
    <svg width={size} height={size} viewBox="0 0 24 24" fill={fill} stroke={stroke} strokeWidth={strokeWidth} strokeLinecap="round" strokeLinejoin="round">
        <path d={d} />
    </svg>
);

const icons = {
    search: "M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z",
    download: "M21 15v4a2 2 0 01-2 2H5a2 2 0 01-2-2v-4 M7 10l5 5 5-5 M12 15V3",
    plus: "M12 5v14 M5 12h14",
};

const PER_PAGE = 6;

const StatusBadge = ({ status }) => {
    const meta = CLIENT_STATUS_META[status] || CLIENT_STATUS_META.Pending;
    return <span style={{ fontSize: 11, fontWeight: 700, padding: "4px 10px", borderRadius: 20, background: meta.bg, color: meta.color }}>{status}</span>;
};

const exportShipments = (rows) => {
    const header = ["Tracking ID", "Pickup City", "Delivery City", "Agent", "Weight", "Price", "Status", "Created On"];
    const csvRows = rows.map((row) => [row.id, row.from, row.to, row.agent, row.kg, row.price, row.status, row.date]);
    const csv = [header, ...csvRows].map((line) => line.map((value) => `"${String(value ?? "").replace(/"/g, '""')}"`).join(",")).join("\n");
    const blob = new Blob([csv], { type: "text/csv;charset=utf-8;" });
    const url = URL.createObjectURL(blob);
    const link = document.createElement("a");
    link.href = url;
    link.download = "client-shipments.csv";
    link.click();
    URL.revokeObjectURL(url);
};

export default function ClientShipments() {
    const navigate = useNavigate();
    const notifRef = useRef(null);
    const [q, setQ] = useState("");
    const [tab, setTab] = useState("All");
    const [page, setPage] = useState(1);
    const [shipments, setShipments] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState("");
    const [notifOpen, setNotifOpen] = useState(false);
    const [notifs, setNotifs] = useState([]);

    useEffect(() => {
        let mounted = true;

        const load = async () => {
            try {
                setLoading(true);
                const response = await getClientShipments();
                if (!mounted) return;
                const rows = response?.shipments || [];
                setShipments(rows);
                setNotifs(buildClientNotifications(rows));
                setError("");
            } catch (err) {
                if (mounted) {
                    setError(err.response?.data?.detail || "Failed to load shipments data.");
                }
            } finally {
                if (mounted) {
                    setLoading(false);
                }
            }
        };

        load();
        return () => {
            mounted = false;
        };
    }, []);

    useEffect(() => {
        const handleClickOutside = (event) => {
            if (notifRef.current && !notifRef.current.contains(event.target)) {
                setNotifOpen(false);
            }
        };
        document.addEventListener("mousedown", handleClickOutside);
        return () => document.removeEventListener("mousedown", handleClickOutside);
    }, []);

    const counts = useMemo(() => ({
        All: shipments.length,
        "In Transit": shipments.filter((row) => row.status === "In Transit").length,
        Delivered: shipments.filter((row) => row.status === "Delivered").length,
        Pending: shipments.filter((row) => row.status === "Pending").length,
        Failed: shipments.filter((row) => row.status === "Failed").length,
    }), [shipments]);

    const rows = useMemo(() => shipments.filter((row) => {
        const matchesTab = tab === "All" || row.status === tab;
        const term = q.trim().toLowerCase();
        const matchesSearch = !term || [row.id, row.from, row.to, row.agent].some((value) => String(value || "").toLowerCase().includes(term));
        return matchesTab && matchesSearch;
    }), [shipments, tab, q]);

    const pages = Math.max(1, Math.ceil(rows.length / PER_PAGE));
    const slice = rows.slice((page - 1) * PER_PAGE, page * PER_PAGE);
    const unreadCount = notifs.filter((item) => item.unread).length;

    return (
        <div style={{ display: "flex", flexDirection: "column", minHeight: "100vh", fontFamily: "'DM Sans','Segoe UI',sans-serif", background: "#F8FAFC", color: "#0F172A" }}>
            <title>Shipments</title>
            <div ref={notifRef} style={{ position: "relative" }}>
                <ClientNavbar onBellClick={() => setNotifOpen((value) => !value)} unreadCount={unreadCount} />
                {notifOpen && (
                    <NotifPanel notifs={notifs} setNotifs={setNotifs} onTrack={() => {}} onClose={() => setNotifOpen(false)} showToast={() => {}} />
                )}
            </div>

            <main style={{ flex: 1, overflow: "auto", padding: "28px 100px", display: "flex", flexDirection: "column", gap: 20 }}>
                <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start" }}>
                    <div>
                        <h1 style={{ fontSize: 24, fontWeight: 800, color: "#0F172A", margin: "0 0 4px", letterSpacing: "-0.6px" }}>My Shipments</h1>
                        <p style={{ fontSize: 13, color: "#94A3B8", margin: 0 }}>Live shipment history synced from the client backend</p>
                    </div>
                    <div style={{ display: "flex", gap: 10 }}>
                        <button onClick={() => exportShipments(rows)} style={{ display: "flex", alignItems: "center", gap: 6, padding: "9px 16px", borderRadius: 10, background: "white", border: "1px solid #E2E8F0", color: "#334155", fontSize: 12, fontWeight: 500, cursor: "pointer" }}>
                            <Icon d={icons.download} size={13} stroke="#334155" /> Export CSV
                        </button>
                        <button onClick={() => navigate("/pickup")} style={{ display: "flex", alignItems: "center", gap: 6, padding: "9px 18px", borderRadius: 10, background: "linear-gradient(135deg,#2563EB,#3B82F6)", border: "none", color: "white", fontSize: 12, fontWeight: 700, cursor: "pointer" }}>
                            <Icon d={icons.plus} size={13} stroke="white" /> Request Pickup
                        </button>
                    </div>
                </div>

                <div style={{ display: "grid", gridTemplateColumns: "repeat(5,1fr)", gap: 12 }}>
                    {[
                        { key: "All", color: "#0F172A", bg: "#F8FAFC", border: "#E2E8F0" },
                        { key: "In Transit", color: "#1D4ED8", bg: "#EFF6FF", border: "#BFDBFE" },
                        { key: "Delivered", color: "#065F46", bg: "#F0FDF4", border: "#A7F3D0" },
                        { key: "Pending", color: "#92400E", bg: "#FFFBEB", border: "#FDE68A" },
                        { key: "Failed", color: "#991B1B", bg: "#FFF5F5", border: "#FECACA" },
                    ].map((card) => (
                        <button key={card.key} onClick={() => { setTab(card.key); setPage(1); }} style={{ padding: "14px 16px", background: tab === card.key ? card.bg : "white", border: `1.5px solid ${tab === card.key ? card.border : "#E2E8F0"}`, borderRadius: 12, cursor: "pointer", textAlign: "left" }}>
                            <div style={{ fontSize: 24, fontWeight: 900, color: tab === card.key ? card.color : "#0F172A" }}>{counts[card.key]}</div>
                            <div style={{ fontSize: 11, color: "#94A3B8", marginTop: 5, fontWeight: 500 }}>{card.key}</div>
                        </button>
                    ))}
                </div>

                <div style={{ display: "flex", gap: 10, alignItems: "center" }}>
                    <div style={{ position: "relative", flex: 1, maxWidth: 320 }}>
                        <input value={q} onChange={(e) => { setQ(e.target.value); setPage(1); }} placeholder="Search by ID, city, or agent..." style={{ width: "100%", background: "white", border: "1px solid #E2E8F0", borderRadius: 10, padding: "9px 14px 9px 36px", color: "#334155", fontSize: 12, outline: "none", boxSizing: "border-box" }} />
                        <span style={{ position: "absolute", left: 12, top: "50%", transform: "translateY(-50%)" }}>
                            <Icon d={icons.search} size={13} stroke="#94A3B8" />
                        </span>
                    </div>
                    <span style={{ marginLeft: "auto", fontSize: 12, color: "#94A3B8" }}>{rows.length} shipments</span>
                </div>

                <div style={{ background: "white", borderRadius: 16, boxShadow: "0 2px 16px rgba(0,0,0,0.06)", border: "1px solid #F1F5F9", overflow: "hidden" }}>
                    {loading ? (
                        <div style={{ padding: 32, fontSize: 13, color: "#64748B" }}>Loading shipments...</div>
                    ) : error ? (
                        <div style={{ padding: 32, fontSize: 13, color: "#991B1B", background: "#FEF2F2" }}>{error}</div>
                    ) : (
                        <>
                            <table style={{ width: "100%", borderCollapse: "collapse" }}>
                                <thead>
                                    <tr style={{ background: "#F8FAFC" }}>
                                        {["Tracking ID", "Route", "Agent", "Weight", "Price", "Date", "Progress", "Status"].map((label) => (
                                            <th key={label} style={{ padding: "11px 16px", fontSize: 11, fontWeight: 600, color: "#94A3B8", textAlign: "left", borderBottom: "1px solid #F1F5F9" }}>{label}</th>
                                        ))}
                                    </tr>
                                </thead>
                                <tbody>
                                    {slice.length === 0 ? (
                                        <tr>
                                            <td colSpan={8} style={{ padding: 48, textAlign: "center", color: "#94A3B8", fontSize: 13 }}>No shipments match your filters.</td>
                                        </tr>
                                    ) : slice.map((shipment) => (
                                        <tr key={shipment.id} style={{ borderBottom: "1px solid #F8FAFC" }}>
                                            <td style={{ padding: "13px 16px", fontSize: 12, fontWeight: 700, color: "#2563EB" }}>{shipment.id}</td>
                                            <td style={{ padding: "13px 16px" }}>
                                                <div style={{ fontSize: 12, fontWeight: 600, color: "#334155" }}>{shipment.from} → {shipment.to}</div>
                                            </td>
                                            <td style={{ padding: "13px 16px", fontSize: 12, color: "#64748B" }}>{shipment.agent}</td>
                                            <td style={{ padding: "13px 16px", fontSize: 12, color: "#64748B" }}>{shipment.kg} kg</td>
                                            <td style={{ padding: "13px 16px", fontSize: 12, fontWeight: 700, color: "#0F172A" }}>{shipment.priceLabel}</td>
                                            <td style={{ padding: "13px 16px", fontSize: 11, color: "#94A3B8" }}>{shipment.date}</td>
                                            <td style={{ padding: "13px 16px", fontSize: 12, color: "#64748B" }}>{shipment.progress}%</td>
                                            <td style={{ padding: "13px 16px" }}><StatusBadge status={shipment.status} /></td>
                                        </tr>
                                    ))}
                                </tbody>
                            </table>

                            <div style={{ padding: "12px 20px", borderTop: "1px solid #F1F5F9", display: "flex", justifyContent: "space-between", alignItems: "center" }}>
                                <span style={{ fontSize: 12, color: "#94A3B8" }}>Showing {rows.length === 0 ? 0 : (page - 1) * PER_PAGE + 1}–{Math.min(page * PER_PAGE, rows.length)} of {rows.length}</span>
                                <div style={{ display: "flex", gap: 4 }}>
                                    <button onClick={() => setPage((value) => Math.max(1, value - 1))} disabled={page === 1} style={{ padding: "5px 12px", borderRadius: 8, border: "1px solid #E2E8F0", background: "white", color: page === 1 ? "#CBD5E1" : "#334155", fontSize: 12, cursor: page === 1 ? "not-allowed" : "pointer" }}>‹ Prev</button>
                                    {Array.from({ length: pages }, (_, index) => index + 1).map((value) => (
                                        <button key={value} onClick={() => setPage(value)} style={{ width: 32, height: 32, borderRadius: 8, border: "1px solid", borderColor: value === page ? "#2563EB" : "#E2E8F0", background: value === page ? "#2563EB" : "white", color: value === page ? "white" : "#334155", fontSize: 12, cursor: "pointer", fontWeight: value === page ? 700 : 400 }}>{value}</button>
                                    ))}
                                    <button onClick={() => setPage((value) => Math.min(pages, value + 1))} disabled={page === pages} style={{ padding: "5px 12px", borderRadius: 8, border: "1px solid #E2E8F0", background: "white", color: page === pages ? "#CBD5E1" : "#334155", fontSize: 12, cursor: page === pages ? "not-allowed" : "pointer" }}>Next ›</button>
                                </div>
                            </div>
                        </>
                    )}
                </div>
            </main>
        </div>
    );
}
