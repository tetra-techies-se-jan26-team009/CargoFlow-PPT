import { useState, useEffect } from "react";
import { getCurrentUser } from "../../utils/auth";
import { getDashboard, getShipments, getAgents } from "../../utils/adminAPI";
import DashboardNavbar from "../../components/DashboardNavbar";
import { Link } from "react-router-dom";
import { statusMeta, BASE_RISK_ALERTS } from "../../utils/tempData";
import AddShipmentModal from "../../components/ui/Modals/AddShipments";
import { AddClientModal } from "../../components/ui/Modals/AddClientModal";
import { AIInsightsModal } from "../../components/ui/Modals/AIInsightsModal";
import { AlertModal } from "../../components/ui/Modals/AlertModal";
import { ExportModal } from "../../components/ui/Modals/ExportModal";
import { ReportModal } from "../../components/ui/Modals/ReportModal";
import { ShipmentDetailModal } from "../../components/ui/Modals/ShipmentDetailModal";
import { AssignModal } from "../../components/ui/Modals/AssignModal"
import TrackingMap from "../../components/TrackingMap";
import { getWeather } from "../../utils/weatherAPI";



const Icon = ({
    d,
    size = 18,
    stroke = "currentColor",
    fill = "none",
    strokeWidth = 1.6,
}) => (
    <svg
        width={size}
        height={size}
        viewBox="0 0 24 24"
        fill={fill}
        stroke={stroke}
        strokeWidth={strokeWidth}
        strokeLinecap="round"
        strokeLinejoin="round"
    >
        <path d={d} />
    </svg>
);

const icons = {
    truck:
        "M1 3h15v13H1z M16 8h4l3 3v5h-7V8z M5.5 21a1.5 1.5 0 100-3 1.5 1.5 0 000 3z M18.5 21a1.5 1.5 0 100-3 1.5 1.5 0 000 3z",
    check: "M22 11.08V12a10 10 0 11-5.93-9.14 M22 4L12 14.01l-3-3",
    agents:
        "M17 21v-2a4 4 0 00-4-4H5a4 4 0 00-4 4v2 M9 11a4 4 0 100-8 4 4 0 000 8z M23 21v-2a4 4 0 00-3-3.87 M16 3.13a4 4 0 010 7.75",
    clients:
        "M20 21v-2a4 4 0 00-4-4H8a4 4 0 00-4 4v2 M12 11a4 4 0 100-8 4 4 0 000 8z",
    warning:
        "M10.29 3.86L1.82 18a2 2 0 001.71 3h16.94a2 2 0 001.71-3L13.71 3.86a2 2 0 00-3.42 0z M12 9v4 M12 17h.01",
    bell: "M18 8A6 6 0 006 8c0 7-3 9-3 9h18s-3-2-3-9 M13.73 21a2 2 0 01-3.46 0",
    search: "M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z",
    logout: "M9 21H5a2 2 0 01-2-2V5a2 2 0 012-2h4 M16 17l5-5-5-5 M21 12H9",
    plus: "M12 5v14 M5 12h14",
    risk: "M12 2L2 7l10 5 10-5-10-5z M2 17l10 5 10-5 M2 12l10 5 10-5",
    download: "M21 15v4a2 2 0 01-2 2H5a2 2 0 01-2-2v-4 M7 10l5 5 5-5 M12 15V3",
    refresh:
        "M23 4v6h-6 M1 20v-6h6 M3.51 9a9 9 0 0114.85-3.36L23 10M1 14l4.64 4.36A9 9 0 0020.49 15",
    reports:
        "M14 2H6a2 2 0 00-2 2v16a2 2 0 002 2h12a2 2 0 002-2V8z M14 2v6h6 M16 13H8 M16 17H8 M10 9H8",
    close: "M18 6L6 18 M6 6l12 12",
    eye: "M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z M12 15a3 3 0 100-6 3 3 0 000 6z",
};


const riskMeta = {
    Low: { bg: "#D1FAE5", color: "#065F46" },
    Medium: { bg: "#FEF3C7", color: "#92400E" },
    High: { bg: "#FEE2E2", color: "#991B1B" },
};

const agentStatusColor = { Active: "#22C55E", Idle: "#F59E0B", Off: "#9CA3AF" };


// ═══════════════════════════════════════════════════════════════════════════
// MAIN DASHBOARD
// ═══════════════════════════════════════════════════════════════════════════
export default function AdminDashboard() {
    const [userName, setUserName] = useState("Admin");

    // ── Shipments state (mutable) ──
    const [isLoading, setIsLoading] = useState(true);
    const [error, setError] = useState(null);
    const [selectedShipment, setSelectedShipment] = useState(null);
    const [dynamicAlerts, setDynamicAlerts] = useState([]);
    //eslint-disable-next-line
    const [weather, setWeather] = useState(null);
    // ── Dynamic state ──
    const [shipments, setShipments] = useState([]);
    const [etaMap, setEtaMap] = useState({});
    const [agentsList, setAgentsList] = useState([]);
    const [dashboardStats, setDashboardStats] = useState({
        active_shipments: 0,
        delivered_this_month: 0,
        active_agents: 0,
        registered_clients: 0,
        recent_shipments: [],
        today_shipments: [],
        open_issues: 0
    });

    // ── Filter state ──
    const [statusFilter, setStatusFilter] = useState("Status");
    const [agentFilter, setAgentFilter] = useState("Agent");
    const [clientFilter, setClientFilter] = useState("Client");

    // ── Pagination ──
    const PER_PAGE = 6;
    const [page, setPage] = useState(1);

    // ── Map refresh flash ──
    const [mapRefreshed, setMapRefreshed] = useState(false);

    // ── Modal state — one at a time ──
    const [modal, setModal] = useState(null);
    const [modalData, setModalData] = useState(null);

    const openModal = (key, data = null) => { setModal(key); setModalData(data); };
    const closeModal = () => { setModal(null); setModalData(null); };

    const getGreeting = () => {
        const hour = new Date().getHours();
        if (hour < 12) return "Good Morning";
        if (hour < 17) return "Good Afternoon";
        return "Good Evening";
    };

    const getFormattedDate = () =>
        new Date().toLocaleDateString("en-IN", { weekday: "long", year: "numeric", month: "long", day: "numeric" });

    useEffect(() => {
        const fetchData = async () => {
            try {
                const user = await getCurrentUser();
                if (user?.name) setUserName(user.name);
                const [dashRes, shipRes, agentsRes] = await Promise.all([
                    getDashboard(),
                    getShipments(),
                    getAgents()
                ]);

                setDashboardStats({
                    ...(dashRes || {}),
                    open_issues: (shipRes?.shipments || []).filter(s => ["High", "Medium"].includes(s.risk)).length
                });


                const mapStatus = (status) => {
                    if (status === "CREATED") return "Pending";
                    if (["ASSIGNED", "OUT_FOR_DELIVERY"].includes(status)) return "In Transit";
                    if (status === "DELIVERED") return "Delivered";
                    if (["FAILED", "RETURN_TO_ORIGIN"].includes(status)) return "Delayed";
                    return status;
                };

                const mappedShipments = (shipRes?.shipments || []).map(s => ({
                    ...s,
                    db_id: s.id,
                    id: s.tracking_id,
                    dest: s.destination,
                    agent: s.agent || "Unassigned",
                    status: mapStatus(s.status)
                }));
                setShipments(mappedShipments);

                const mappedAgents = (agentsRes?.agents || []).map(a => ({
                    ...a,
                    id: a.agent_id,
                    zone: a.city,
                    deliveries: a.today_deliveries || 0,
                    completed: a.total_deliveries || 0,
                    rate: "100%", // Placeholder until calculated
                }));
                setAgentsList(mappedAgents);

                setError(null);
            } catch (err) {
                console.error("Dashboard fetch error:", err);
                setError("Failed to load dashboard data. Please check your connection.");
            } finally {
                setIsLoading(false);
            }
        };
        fetchData();
    }, []);

    // ── Filtered shipments ──
    const filtered = shipments.filter(s => {
        const ms = statusFilter === "Status" || s.status === statusFilter;
        const ma = agentFilter === "Agent" || s.agent === agentFilter;
        const mc = clientFilter === "Client" || s.client === clientFilter;
        return ms && ma && mc;
    });
    const totalShipments = shipments.length;

    const deliveredCount = shipments.filter(s => s.status === "Delivered").length;
    const delayedCount = shipments.filter(s => s.status === "Delayed").length;

    // ✅ Performance formula
    const performance =
        totalShipments > 0
            ? ((deliveredCount - delayedCount * 0.5) / totalShipments) * 100
            : 0;

    const performanceValue = performance.toFixed(1);

    const totalPages = Math.max(1, Math.ceil(filtered.length / PER_PAGE));
    const pageSlice = filtered.slice((page - 1) * PER_PAGE, page * PER_PAGE);

    const uniqueAgents = [...new Set(shipments.map(s => s.agent))];
    const uniqueClients = [...new Set(shipments.map(s => s.client))];
    const hasFilters = statusFilter !== "Status" || agentFilter !== "Agent" || clientFilter !== "Client";

    const handleRefreshMap = () => {
        setMapRefreshed(true);
        setTimeout(() => setMapRefreshed(false), 900);
    };

    const addShipment = (newS) => {
        setShipments(prev => [newS, ...prev]);
    };

    if (isLoading) {
        return (
            <div style={{ display: "flex", flexDirection: "column", minHeight: "100vh", background: "#F1F5F9", fontFamily: "'DM Sans','Segoe UI',sans-serif" }}>
                <DashboardNavbar />
                <main style={{ flex: 1, display: "flex", justifyContent: "center", alignItems: "center" }}>
                    <div style={{ padding: 20, background: "white", borderRadius: 12, boxShadow: "0 1px 3px rgba(0,0,0,0.06)", border: "1px solid #E2E8F0", textAlign: "center", minWidth: 250 }}>
                        <div style={{ fontSize: 24, marginBottom: 10 }}>⏳</div>
                        <div style={{ fontSize: 14, fontWeight: 600, color: "#0F172A" }}>Loading Dashboard...</div>
                        <div style={{ fontSize: 12, color: "#64748B", marginTop: 4 }}>Fetching live metrics and shipments</div>
                    </div>
                </main>
            </div>
        );
    }

    if (error) {
        return (
            <div style={{ display: "flex", flexDirection: "column", minHeight: "100vh", background: "#F1F5F9", fontFamily: "'DM Sans','Segoe UI',sans-serif" }}>
                <DashboardNavbar />
                <main style={{ flex: 1, display: "flex", justifyContent: "center", alignItems: "center" }}>
                    <div style={{ padding: 24, background: "#FEF2F2", borderRadius: 12, border: "1px solid #FCA5A5", textAlign: "center", maxWidth: 400 }}>
                        <div style={{ fontSize: 24, marginBottom: 10 }}>⚠️</div>
                        <div style={{ fontSize: 14, fontWeight: 700, color: "#991B1B" }}>Dashboard Error</div>
                        <div style={{ fontSize: 13, color: "#991B1B", marginTop: 6, opacity: 0.9 }}>{error}</div>
                        <button
                            onClick={() => window.location.reload()}
                            style={{ marginTop: 16, padding: "8px 16px", background: "white", border: "1px solid #FCA5A5", borderRadius: 6, color: "#991B1B", fontSize: 12, fontWeight: 600, cursor: "pointer" }}
                        >
                            Retry Connection
                        </button>
                    </div>
                </main>
            </div>
        );
    }

    return (
        <>
            <title>Admin Dashboard | CargoFlow</title>

            {/* ── Modals ── */}
            {modal === "addShipment" && (
                <AddShipmentModal onClose={closeModal} onAdd={(s) => { addShipment(s); closeModal(); }} />
            )}
            {modal === "assign" && (
                <AssignModal shipments={shipments} onClose={closeModal} />
            )}
            {modal === "addClient" && (
                <AddClientModal onClose={closeModal} />
            )}
            {modal === "insights" && (
                <AIInsightsModal onClose={closeModal} />
            )}
            {modal === "report" && (
                <ReportModal shipments={shipments} onClose={closeModal} />
            )}
            {modal === "export" && (
                <ExportModal shipments={filtered} onClose={closeModal} />
            )}
            {modal === "detail" && modalData && (
                <ShipmentDetailModal s={modalData} onClose={closeModal} />
            )}
            {modal === "alert" && modalData && (
                <AlertModal alert={modalData} onClose={closeModal} />
            )}

            <div
                style={{
                    display: "flex",
                    flexDirection: "column",
                    minHeight: "100vh",
                    fontFamily: "'DM Sans','Segoe UI',sans-serif",
                    background: "#F1F5F9",
                    color: "#0F172A",
                    minWidth: 1100,
                }}
            >
                <DashboardNavbar />

                {/* MAIN */}
                <main
                    style={{
                        flex: 1,
                        overflow: "auto",
                        padding: "24px 100px",
                        display: "flex",
                        flexDirection: "column",
                        gap: 20,
                    }}
                >
                    {/* ── Welcome Header ── */}
                    <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between" }}>
                        <div>
                            <h1 style={{ fontSize: 24, fontWeight: 800, color: "#0F172A", margin: 0, letterSpacing: "-0.6px" }}>
                                {getGreeting()}, {userName}
                            </h1>
                            <p style={{ fontSize: 13, color: "#94A3B8", margin: "4px 0 0" }}>
                                Logistics command overview — {getFormattedDate()} · Updated just now
                            </p>
                        </div>
                        <div style={{ display: "flex", gap: 10 }}>
                            <button
                                onClick={() => openModal("export")}
                                style={{
                                    display: "flex", alignItems: "center", gap: 6,
                                    padding: "9px 16px", border: "1px solid #E2E8F0", borderRadius: 8,
                                    background: "white", color: "#475569", fontSize: 12, fontWeight: 500, cursor: "pointer",
                                    transition: "all 0.15s",
                                }}
                                onMouseEnter={e => e.currentTarget.style.background = "#F8FAFC"}
                                onMouseLeave={e => e.currentTarget.style.background = "white"}
                            >
                                <Icon d={icons.download} size={13} stroke="#475569" /> Export Report
                            </button>
                            <button
                                onClick={() => openModal("addShipment")}
                                style={{
                                    display: "flex", alignItems: "center", gap: 6,
                                    padding: "9px 18px", border: "none", borderRadius: 8,
                                    background: "#2563EB", color: "white", fontSize: 12, fontWeight: 600, cursor: "pointer",
                                    boxShadow: "0 2px 8px rgba(37,99,235,0.3)", transition: "all 0.15s",
                                }}
                                onMouseEnter={e => e.currentTarget.style.background = "#1D4ED8"}
                                onMouseLeave={e => e.currentTarget.style.background = "#2563EB"}
                            >
                                <Icon d={icons.plus} size={13} stroke="white" /> Add Shipment
                            </button>
                        </div>
                    </div>

                    {/* ── KPI Row ── */}
                    <div style={{ display: "grid", gridTemplateColumns: "repeat(5,1fr)", gap: 14 }}>
                        {[
                            { label: "Active Shipments", value: dashboardStats.active_shipments || 0, trend: "+12%", icon: icons.truck, up: true },
                            { label: "Delivered This Month", value: dashboardStats.delivered_this_month || 0, trend: "+8%", icon: icons.check, up: true },
                            { label: "Active Agents", value: dashboardStats.active_agents || 0, trend: null, icon: icons.agents, up: null },
                            { label: "Registered Clients", value: dashboardStats.registered_clients || 0, trend: "+3", icon: icons.clients, up: true },
                            { label: "Open Issues", value: dashboardStats.open_issues || 0, trend: "-2", icon: icons.warning, up: false },
                        ].map(kpi => (
                            <div
                                key={kpi.label}
                                style={{
                                    background: "white", borderRadius: 12, padding: "18px 18px 16px",
                                    boxShadow: "0 1px 3px rgba(0,0,0,0.06)", border: "1px solid #F1F5F9",
                                    transition: "all 0.2s", cursor: "default",
                                }}
                                onMouseEnter={e => { e.currentTarget.style.transform = "translateY(-2px)"; e.currentTarget.style.boxShadow = "0 4px 16px rgba(0,0,0,0.08)"; }}
                                onMouseLeave={e => { e.currentTarget.style.transform = "translateY(0)"; e.currentTarget.style.boxShadow = "0 1px 3px rgba(0,0,0,0.06)"; }}
                            >
                                <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start", marginBottom: 14 }}>
                                    <div style={{ background: "#EFF6FF", borderRadius: 9, width: 38, height: 38, display: "flex", alignItems: "center", justifyContent: "center" }}>
                                        <Icon d={kpi.icon} size={17} stroke="#2563EB" />
                                    </div>
                                    {kpi.up !== null && (
                                        <span style={{ fontSize: 11, fontWeight: 700, color: kpi.up ? "#10B981" : "#EF4444", background: kpi.up ? "#D1FAE5" : "#FEE2E2", padding: "2px 8px", borderRadius: 20 }}>
                                            {kpi.trend}
                                        </span>
                                    )}
                                </div>
                                <div style={{ fontSize: 32, fontWeight: 800, color: "#0F172A", letterSpacing: "-1.2px", lineHeight: 1 }}>{kpi.value}</div>
                                <div style={{ fontSize: 11, color: "#94A3B8", marginTop: 5, fontWeight: 500 }}>{kpi.label}</div>
                            </div>
                        ))}
                    </div>

                    {/* ── Map + Right Column ── */}
                    <div style={{ display: "grid", gridTemplateColumns: "1fr 310px", gap: 16 }}>
                        {/* Live Map */}
                        <div style={{ background: "white", borderRadius: 12, padding: "16px 18px", boxShadow: "0 1px 3px rgba(0,0,0,0.06)", border: "1px solid #F1F5F9" }}>
                            <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 12 }}>
                                <div>
                                    <h3 style={{ margin: 0, fontSize: 14, fontWeight: 700, color: "#0F172A" }}>Live Tracking Map</h3>
                                    <p style={{ margin: "3px 0 0", fontSize: 11, color: "#94A3B8" }}>
                                        {shipments.filter(s => s.status === "In Transit").length} shipments in transit across India
                                    </p>
                                </div>
                                <button
                                    onClick={handleRefreshMap}
                                    style={{
                                        background: "none", border: "1px solid #E2E8F0", borderRadius: 7,
                                        padding: "5px 12px", fontSize: 11,
                                        color: mapRefreshed ? "#10B981" : "#64748B",
                                        cursor: "pointer", display: "flex", alignItems: "center", gap: 5,
                                        transition: "color 0.3s",
                                    }}
                                >
                                    <Icon d={icons.refresh} size={11} stroke={mapRefreshed ? "#10B981" : "#64748B"} />
                                    {mapRefreshed ? "Updated!" : "Refresh"}
                                </button>
                            </div>
                            <div style={{ height: 300 }}>
                                <TrackingMap
                                    pickup={selectedShipment?.pickup_coords || null}
                                    delivery={selectedShipment?.delivery_coords || null}
                                    currentAgent={null}
                                    shipmentId={selectedShipment?.id}
                                    setEtaMap={setEtaMap}
                                />
                            </div>
                        </div>

                        {/* Active Shipments + Risk Alerts stacked */}
                        <div style={{ display: "flex", flexDirection: "column", gap: 14 }}>
                            {/* Active Shipments mini list */}
                            <div style={{ background: "white", borderRadius: 12, padding: 16, boxShadow: "0 1px 3px rgba(0,0,0,0.06)", border: "1px solid #F1F5F9", flex: 1 }}>
                                <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 10 }}>
                                    <h3 style={{ margin: 0, fontSize: 13, fontWeight: 700, color: "#0F172A" }}>Active Shipments</h3>
                                    <Link to="/admin/shipments" style={{ fontSize: 11, color: "#2563EB", cursor: "pointer", fontWeight: 600, textDecoration: "none" }}>
                                        View all →
                                    </Link>
                                </div>
                                <div style={{ display: "flex", flexDirection: "column", gap: 8 }}>
                                    {shipments.filter(s => s.status !== "Delivered").slice(0, 4).map(s => (
                                        <button
                                            key={s.id}
                                            onClick={async () => {
                                                setSelectedShipment(s);

                                                if (s.delivery_coords) {
                                                    const data = await getWeather(
                                                        s.delivery_coords.lat,
                                                        s.delivery_coords.lng
                                                    );

                                                    setWeather(data);

                                                    // 🔥 Generate alerts
                                                    if (data) {
                                                        const alerts = [];

                                                        if (data.temp > 38) {
                                                            alerts.push({
                                                                icon: "🌡",
                                                                label: `High temperature near ${s.dest}`,
                                                                border: "#FCA5A5"
                                                            });
                                                        }

                                                        if (data.wind > 30) {
                                                            alerts.push({
                                                                icon: "💨",
                                                                label: `Strong winds near ${s.dest}`,
                                                                border: "#FCD34D"
                                                            });
                                                        }
                                                        if (data.rain > 0) {
                                                            alerts.push({
                                                                icon: "🌧",
                                                                label: `Rain may delay delivery`,
                                                                border: "#60A5FA"
                                                            });
                                                        }
                                                        if (s.price > 50000) {
                                                            alerts.push({
                                                                icon: "💰",
                                                                label: `High value shipment`,
                                                                border: "#F59E0B"
                                                            });
                                                        }
                                                        setDynamicAlerts(alerts);
                                                    }
                                                }
                                            }}
                                            style={{
                                                display: "flex", alignItems: "center", gap: 10,
                                                padding: "9px 10px", background: "#F8FAFC", borderRadius: 8,
                                                border: "none", cursor: "pointer", textAlign: "left", width: "100%",
                                                transition: "background 0.15s",
                                            }}
                                            onMouseEnter={e => e.currentTarget.style.background = "#EFF6FF"}
                                            onMouseLeave={e => e.currentTarget.style.background = "#F8FAFC"}
                                        >
                                            <div style={{ width: 32, height: 32, background: s.status === "Delayed" ? "#FEE2E2" : "#EFF6FF", borderRadius: 7, display: "flex", alignItems: "center", justifyContent: "center", flexShrink: 0 }}>
                                                <Icon d={icons.truck} size={14} stroke={s.status === "Delayed" ? "#EF4444" : "#2563EB"} />
                                            </div>
                                            <div style={{ flex: 1, minWidth: 0 }}>
                                                <div style={{ fontSize: 11, fontWeight: 700, color: "#0F172A" }}>{s.id}</div>
                                                <div style={{ fontSize: 10, color: "#94A3B8", marginTop: 1, whiteSpace: "nowrap", overflow: "hidden", textOverflow: "ellipsis" }}>
                                                    {s.origin} → {s.dest}
                                                </div>
                                            </div>
                                            <span style={{ fontSize: 10, fontWeight: 700, padding: "2px 7px", borderRadius: 20, background: statusMeta[s.status]?.bg, color: statusMeta[s.status]?.color, flexShrink: 0 }}>
                                                {s.status}
                                            </span>
                                        </button>
                                    ))}
                                </div>
                            </div>

                            {/* Risk Alerts */}
                            <div style={{ background: "white", borderRadius: 12, padding: "14px 16px", boxShadow: "0 1px 3px rgba(0,0,0,0.06)", border: "1px solid #F1F5F9" }}>
                                <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 10 }}>
                                    <h3 style={{ margin: 0, fontSize: 13, fontWeight: 700, color: "#0F172A" }}>Risk Alerts</h3>
                                    <span style={{ background: "#FEE2E2", color: "#991B1B", fontSize: 10, fontWeight: 700, padding: "2px 8px", borderRadius: 20 }}>
                                        {dynamicAlerts.length + BASE_RISK_ALERTS.length} Active
                                    </span>
                                </div>
                                <div style={{ display: "flex", flexDirection: "column", gap: 7 }}>
                                    {[...dynamicAlerts, ...BASE_RISK_ALERTS].map((a, i) => (
                                        <button
                                            key={i}
                                            onClick={() => openModal("alert", {
                                                ...a,
                                                shipments
                                            })} style={{
                                                display: "flex", alignItems: "center", gap: 10,
                                                padding: "9px 12px", background: "#F8FAFC", borderRadius: 8,
                                                border: `1px solid ${a.border}`, cursor: "pointer", width: "100%",
                                                textAlign: "left", transition: "all 0.15s",
                                            }}
                                            onMouseEnter={e => { e.currentTarget.style.background = "#FFFBEB"; e.currentTarget.style.transform = "translateX(2px)"; }}
                                            onMouseLeave={e => { e.currentTarget.style.background = "#F8FAFC"; e.currentTarget.style.transform = "translateX(0)"; }}
                                        >
                                            <span style={{ fontSize: 14 }}>{a.icon}</span>
                                            <span style={{ fontSize: 11, color: "#334155", fontWeight: 500, flex: 1 }}>{a.label}</span>
                                            <span style={{ color: "#CBD5E1", fontSize: 16 }}>›</span>
                                        </button>
                                    ))}
                                </div>
                            </div>
                        </div>
                    </div>

                    {/* ── Performance Bar ── */}
                    <div style={{ background: "white", borderRadius: 12, padding: "20px 28px", boxShadow: "0 1px 3px rgba(0,0,0,0.06)", border: "1px solid #F1F5F9", display: "flex", alignItems: "center", gap: 48 }}>
                        <div style={{ minWidth: 200 }}>
                            <div style={{ fontSize: 11, fontWeight: 600, color: "#94A3B8", letterSpacing: "0.5px", marginBottom: 4 }}>
                                DELIVERY PERFORMANCE SCORE
                            </div>
                            <div style={{ fontSize: 52, fontWeight: 800, color: "#0F172A", letterSpacing: "-2px", lineHeight: 1 }}>
                                {performanceValue}
                                <span style={{ fontSize: 26, color: "#2563EB" }}>%</span>
                            </div>
                            <div style={{ fontSize: 11, color: "#94A3B8", marginTop: 5 }}>AI-calculated operational efficiency</div>
                        </div>
                        <div style={{ flex: 1 }}>
                            <div style={{ background: "#F1F5F9", borderRadius: 6, height: 10, overflow: "hidden", marginBottom: 16 }}>
                                <div style={{ width: `${performanceValue}%`, height: "100%", background: "linear-gradient(90deg,#10B981,#2563EB)", borderRadius: 6 }} />
                            </div>
                            <div style={{ display: "grid", gridTemplateColumns: "repeat(3,1fr)", gap: 16 }}>
                                {[
                                    {
                                        label: "On-time Rate",
                                        value: `${((deliveredCount / totalShipments) * 100 || 0).toFixed(1)}%`,
                                        color: "#10B981"
                                    },
                                    {
                                        label: "Delayed",
                                        value: `${delayedCount} shipments`,
                                        color: "#EF4444"
                                    },
                                    {
                                        label: "Risk Flagged",
                                        value: `${shipments.filter(s => s.risk === "High").length} shipments`,
                                        color: "#F59E0B"
                                    },].map(m => (
                                        <div key={m.label}>
                                            <div style={{ fontSize: 20, fontWeight: 800, color: m.color, letterSpacing: "-0.5px" }}>{m.value}</div>
                                            <div style={{ fontSize: 11, color: "#94A3B8", marginTop: 2 }}>{m.label}</div>
                                        </div>
                                    ))}
                            </div>
                        </div>
                    </div>

                    {/* ── Shipments Table + Agent Panel ── */}
                    <div style={{ display: "grid", gridTemplateColumns: "1fr 270px", gap: 16 }}>

                        {/* Shipments Table */}
                        <div style={{ background: "white", borderRadius: 12, boxShadow: "0 1px 3px rgba(0,0,0,0.06)", border: "1px solid #F1F5F9", overflow: "hidden" }}>
                            <div style={{ padding: "16px 20px", borderBottom: "1px solid #F1F5F9", display: "flex", justifyContent: "space-between", alignItems: "center" }}>
                                <h3 style={{ margin: 0, fontSize: 14, fontWeight: 700, color: "#0F172A" }}>
                                    Recent Shipments
                                </h3>
                                <div style={{ display: "flex", gap: 8, alignItems: "center" }}>
                                    {/* Status filter */}
                                    <select
                                        value={statusFilter}
                                        onChange={e => { setStatusFilter(e.target.value); setPage(1); }}
                                        style={{ border: "1px solid #E2E8F0", borderRadius: 6, padding: "5px 10px", fontSize: 11, color: "#64748B", background: "white", cursor: "pointer", outline: "none" }}
                                    >
                                        <option>Status</option>
                                        {["In Transit", "Delivered", "Delayed", "Pending"].map(s => <option key={s}>{s}</option>)}
                                    </select>
                                    {/* Agent filter */}
                                    <select
                                        value={agentFilter}
                                        onChange={e => { setAgentFilter(e.target.value); setPage(1); }}
                                        style={{ border: "1px solid #E2E8F0", borderRadius: 6, padding: "5px 10px", fontSize: 11, color: "#64748B", background: "white", cursor: "pointer", outline: "none" }}
                                    >
                                        <option>Agent</option>
                                        {uniqueAgents.map(a => <option key={a}>{a}</option>)}
                                    </select>
                                    {/* Client filter */}
                                    <select
                                        value={clientFilter}
                                        onChange={e => { setClientFilter(e.target.value); setPage(1); }}
                                        style={{ border: "1px solid #E2E8F0", borderRadius: 6, padding: "5px 10px", fontSize: 11, color: "#64748B", background: "white", cursor: "pointer", outline: "none" }}
                                    >
                                        <option>Client</option>
                                        {uniqueClients.map(c => <option key={c}>{c}</option>)}
                                    </select>
                                    {/* Clear filters */}
                                    {hasFilters && (
                                        <button
                                            onClick={() => { setStatusFilter("Status"); setAgentFilter("Agent"); setClientFilter("Client"); setPage(1); }}
                                            style={{ border: "1px solid #FECACA", borderRadius: 6, padding: "5px 10px", fontSize: 11, color: "#EF4444", background: "#FFF5F5", cursor: "pointer" }}
                                        >
                                            ✕ Clear
                                        </button>
                                    )}
                                </div>
                            </div>

                            <table style={{ width: "100%", borderCollapse: "collapse" }}>
                                <thead>
                                    <tr style={{ background: "#F8FAFC" }}>
                                        {["Tracking ID", "Client", "Agent", "Origin", "Destination", "Status", "ETA", "Risk", ""].map(h => (
                                            <th key={h} style={{ padding: "10px 16px", fontSize: 11, fontWeight: 600, color: "#94A3B8", textAlign: "left", borderBottom: "1px solid #F1F5F9", whiteSpace: "nowrap" }}>
                                                {h}
                                            </th>
                                        ))}
                                    </tr>
                                </thead>
                                <tbody>
                                    {pageSlice.length === 0 ? (
                                        <tr>
                                            <td colSpan={9} style={{ padding: 40, textAlign: "center", color: "#94A3B8", fontSize: 13 }}>
                                                No shipments match your filters.
                                            </td>
                                        </tr>
                                    ) : pageSlice.map(s => (
                                        <tr
                                            key={s.id}
                                            style={{ borderBottom: "1px solid #F8FAFC", cursor: "pointer" }}
                                            onMouseEnter={e => e.currentTarget.style.background = "#F8FAFC"}
                                            onMouseLeave={e => e.currentTarget.style.background = "white"}
                                        >
                                            <td style={{ padding: "12px 16px", fontSize: 12, fontWeight: 700, color: "#2563EB" }}>{s.id}</td>
                                            <td style={{ padding: "12px 16px", fontSize: 12, color: "#334155" }}>{s.client}</td>
                                            <td style={{ padding: "12px 16px", fontSize: 12, color: "#334155" }}>{s.agent}</td>
                                            <td style={{ padding: "12px 16px", fontSize: 12, color: "#64748B" }}>{s.origin}</td>
                                            <td style={{ padding: "12px 16px", fontSize: 12, color: "#64748B" }}>{s.dest}</td>
                                            <td style={{ padding: "12px 16px" }}>
                                                <span style={{ fontSize: 11, fontWeight: 600, padding: "3px 9px", borderRadius: 20, background: statusMeta[s.status]?.bg, color: statusMeta[s.status]?.color }}>
                                                    {s.status}
                                                </span>
                                            </td>
                                            <td style={{ padding: "12px 16px", fontSize: 11, color: "#64748B", whiteSpace: "nowrap" }}> {etaMap[s.id]
                                                ? `${etaMap[s.id].eta} mins`
                                                : "—"} </td>
                                            <td style={{ padding: "12px 16px" }}>
                                                <span style={{ fontSize: 11, fontWeight: 600, padding: "3px 9px", borderRadius: 20, background: riskMeta[s.risk]?.bg, color: riskMeta[s.risk]?.color }}>
                                                    {s.risk}
                                                </span>
                                            </td>
                                            {/* View button */}
                                            <td style={{ padding: "12px 16px" }}>
                                                <button
                                                    onClick={() => openModal("detail", s)}
                                                    style={{ display: "flex", alignItems: "center", gap: 4, padding: "4px 10px", borderRadius: 7, background: "#F8FAFC", border: "1px solid #E2E8F0", color: "#64748B", fontSize: 11, cursor: "pointer" }}
                                                    onMouseEnter={e => { e.currentTarget.style.background = "#EFF6FF"; e.currentTarget.style.color = "#2563EB"; }}
                                                    onMouseLeave={e => { e.currentTarget.style.background = "#F8FAFC"; e.currentTarget.style.color = "#64748B"; }}
                                                >
                                                    <Icon d={icons.eye} size={11} stroke="currentColor" /> View
                                                </button>
                                            </td>
                                        </tr>
                                    ))}
                                </tbody>
                            </table>

                            {/* Pagination */}
                            <div style={{ padding: "12px 20px", borderTop: "1px solid #F1F5F9", display: "flex", justifyContent: "space-between", alignItems: "center" }}>
                                <span style={{ fontSize: 11, color: "#94A3B8" }}>
                                    Showing {filtered.length === 0 ? 0 : (page - 1) * PER_PAGE + 1}–{Math.min(page * PER_PAGE, filtered.length)} of {filtered.length} shipments
                                </span>
                                <div style={{ display: "flex", gap: 4 }}>
                                    <button
                                        onClick={() => setPage(p => Math.max(1, p - 1))}
                                        disabled={page === 1}
                                        style={{ width: 28, height: 28, borderRadius: 6, border: "1px solid #E2E8F0", background: "white", color: page === 1 ? "#CBD5E1" : "#64748B", fontSize: 12, cursor: page === 1 ? "not-allowed" : "pointer" }}
                                    >‹</button>
                                    {Array.from({ length: totalPages }, (_, i) => i + 1).map(p => (
                                        <button
                                            key={p}
                                            onClick={() => setPage(p)}
                                            style={{ width: 28, height: 28, borderRadius: 6, border: "1px solid", borderColor: p === page ? "#2563EB" : "#E2E8F0", background: p === page ? "#2563EB" : "white", color: p === page ? "white" : "#64748B", fontSize: 12, cursor: "pointer", fontWeight: p === page ? 700 : 400 }}
                                        >
                                            {p}
                                        </button>
                                    ))}
                                    <button
                                        onClick={() => setPage(p => Math.min(totalPages, p + 1))}
                                        disabled={page === totalPages}
                                        style={{ width: 28, height: 28, borderRadius: 6, border: "1px solid #E2E8F0", background: "white", color: page === totalPages ? "#CBD5E1" : "#64748B", fontSize: 12, cursor: page === totalPages ? "not-allowed" : "pointer" }}
                                    >›</button>
                                </div>
                            </div>
                        </div>

                        {/* ── Agent Panel ── */}
                        <div style={{ background: "white", borderRadius: 12, padding: 16, boxShadow: "0 1px 3px rgba(0,0,0,0.06)", border: "1px solid #F1F5F9", display: "flex", flexDirection: "column" }}>
                            <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 12 }}>
                                <h3 style={{ margin: 0, fontSize: 14, fontWeight: 700, color: "#0F172A" }}>Agent Activity</h3>
                                <span style={{ fontSize: 11, color: "#2563EB", cursor: "pointer", fontWeight: 600 }}>
                                    <Link to="/admin/agents" style={{ textDecoration: "none", color: "inherit" }}>Manage →</Link>
                                </span>
                            </div>

                            <div style={{ display: "flex", flexDirection: "column", gap: 8 }}>
                                {agentsList.map(agent => (
                                    <div
                                        key={agent.name}
                                        style={{ display: "flex", alignItems: "center", gap: 10, padding: "10px 12px", background: "#F8FAFC", borderRadius: 8, transition: "background 0.15s", cursor: "default" }}
                                        onMouseEnter={e => e.currentTarget.style.background = "#EFF6FF"}
                                        onMouseLeave={e => e.currentTarget.style.background = "#F8FAFC"}
                                    >
                                        <div style={{ width: 32, height: 32, borderRadius: "50%", background: "#EFF6FF", display: "flex", alignItems: "center", justifyContent: "center", fontSize: 12, fontWeight: 700, color: "#2563EB", flexShrink: 0 }}>
                                            {agent.name[0]}
                                        </div>
                                        <div style={{ flex: 1, minWidth: 0 }}>
                                            <div style={{ fontSize: 12, fontWeight: 600, color: "#0F172A", whiteSpace: "nowrap", overflow: "hidden", textOverflow: "ellipsis" }}>{agent.name}</div>
                                            <div style={{ fontSize: 10, color: "#94A3B8", marginTop: 1 }}>{agent.deliveries} today · {agent.rate}</div>
                                        </div>
                                        <div style={{ display: "flex", alignItems: "center", gap: 4, flexShrink: 0 }}>
                                            <div style={{ width: 7, height: 7, borderRadius: "50%", background: agentStatusColor[agent.status] }} />
                                            <span style={{ fontSize: 10, color: "#64748B" }}>{agent.status}</span>
                                        </div>
                                    </div>
                                ))}
                            </div>

                            {/* Quick Actions */}
                            <div style={{ marginTop: 16, paddingTop: 14, borderTop: "1px solid #F1F5F9" }}>
                                <div style={{ fontSize: 12, fontWeight: 700, color: "#0F172A", marginBottom: 10 }}>Quick Actions</div>
                                <div style={{ display: "flex", flexDirection: "column", gap: 8 }}>
                                    {[
                                        { label: "Assign Shipment to Agent", icon: icons.truck, fn: () => openModal("assign") },
                                        { label: "Generate Monthly Report", icon: icons.reports, fn: () => openModal("report") },
                                        { label: "Add New Client", icon: icons.plus, fn: () => openModal("addClient") },
                                        { label: "View AI Insights", icon: icons.risk, fn: () => openModal("insights") },
                                    ].map(action => (
                                        <button
                                            key={action.label}
                                            onClick={action.fn}
                                            style={{ display: "flex", alignItems: "center", gap: 8, padding: "8px 12px", border: "1px solid #E2E8F0", borderRadius: 8, background: "white", color: "#334155", fontSize: 11, fontWeight: 500, cursor: "pointer", textAlign: "left", transition: "all 0.15s" }}
                                            onMouseEnter={e => { e.currentTarget.style.background = "#EFF6FF"; e.currentTarget.style.borderColor = "#BFDBFE"; e.currentTarget.style.color = "#2563EB"; }}
                                            onMouseLeave={e => { e.currentTarget.style.background = "white"; e.currentTarget.style.borderColor = "#E2E8F0"; e.currentTarget.style.color = "#334155"; }}
                                        >
                                            <Icon d={action.icon} size={13} stroke="currentColor" />
                                            {action.label}
                                        </button>
                                    ))}
                                </div>
                            </div>
                        </div>
                    </div>
                </main >
            </div >
        </>
    );
}