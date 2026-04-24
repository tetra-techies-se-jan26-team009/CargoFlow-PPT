import { useState, useEffect } from "react";
import DashboardNavbar from "../../components/DashboardNavbar";
import { getShipments } from "../../utils/adminAPI";
import AddShipmentModal from "../../components/ui/Modals/AddShipments";
import { ExportModal } from "../../components/ui/Modals/ExportModal";
import ViewShipmentModal from "../../components/ui/Modals/ViewShipmentModal";
import InvoiceModal from "../../components/ui/Modals/InvoiceModal";
import { useToast } from "../../hooks/useToast";
import Toast from "../../components/ui/Toast";
import { useLocation } from "react-router-dom";

const Icon = ({
    d,
    size = 16,
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

const buttonStyles = {
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    border: "1px solid #E2E8F0",
    borderRadius: 6,
    padding: "6px",
    background: "white",
    cursor: "pointer",
    color: "#64748B",
    transition: "all 0.2s ease",
};

const icons = {
    plus: "M12 5v14 M5 12h14",
    download: "M21 15v4a2 2 0 01-2 2H5a2 2 0 01-2-2v-4 M7 10l5 5 5-5 M12 15V3",
    filter: "M22 3H2l8 9.46V19l4 2v-8.54L22 3z",
    eye: "M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z M12 15a3 3 0 100-6 3 3 0 000 6z",
    edit: "M11 4H4a2 2 0 00-2 2v14a2 2 0 002 2h14a2 2 0 002-2v-7 M18.5 2.5a2.121 2.121 0 013 3L12 15l-4 1 1-4 9.5-9.5z",
    search: "M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z",
    truck:
        "M1 3h15v13H1z M16 8h4l3 3v5h-7V8z M5.5 21a1.5 1.5 0 100-3 1.5 1.5 0 000 3z M18.5 21a1.5 1.5 0 100-3 1.5 1.5 0 000 3z",
};

const statusMeta = {
    "In Transit": { bg: "#DBEAFE", color: "#1D4ED8" },
    Delivered: { bg: "#D1FAE5", color: "#065F46" },
    Delayed: { bg: "#FEE2E2", color: "#991B1B" },
    Pending: { bg: "#FEF3C7", color: "#92400E" },
};

const riskMeta = {
    Low: { bg: "#D1FAE5", color: "#065F46" },
    Medium: { bg: "#FEF3C7", color: "#92400E" },
    High: { bg: "#FEE2E2", color: "#991B1B" },
};

const ITEMS_PER_PAGE = 7;

export default function ShipmentsPage() {
    const [statusFilter, setStatusFilter] = useState("All");
    const [riskFilter, setRiskFilter] = useState("All");
    const [searchQ, setSearchQ] = useState("");
    const [page, setPage] = useState(1);
    const [modal, setModal] = useState(null);

    // Strict State Management Rule
    const [data, setData] = useState({ total: 0, in_transit: 0, delivered: 0, delayed: 0, pending: 0 });
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const [shipments, setShipments] = useState([]);
    const [selectedShipment, setSelectedShipment] = useState(null);
    const { toast, showToast, hideToast } = useToast();

    // Search 
    const { search } = useLocation();
    const queryParams = new URLSearchParams(search);
    const globalSearchQ = queryParams.get("q") || "";
    const location = useLocation();

    useEffect(() => {
        const params = new URLSearchParams(location.search);
        const q = params.get("q") || "";
        setSearchQ(q); // This updates the local search state used by your filter
    }, [location.search]);


    const addShipment = (shipment) => {
        setShipments((prev) => [shipment, ...prev]);
    };

    const openModal = (key) => { setModal(key); };
    const closeModal = () => { setModal(null); };

    useEffect(() => {
        let isMounted = true;
        const fetchData = async () => {
            try {
                setLoading(true);
                const shipRes = await getShipments();

                if (!isMounted) return;

                setData({
                    total: shipRes?.total || 0,
                    in_transit: shipRes?.in_transit || 0,
                    delivered: shipRes?.delivered || 0,
                    delayed: shipRes?.delayed || 0,
                    pending: shipRes?.pending || 0
                });

                const mapStatus = (status) => {
                    if (status === "CREATED") return "Pending";
                    if (["ASSIGNED", "OUT_FOR_DELIVERY"].includes(status)) return "In Transit";
                    if (status === "DELIVERED") return "Delivered";
                    if (["FAILED", "RETURN_TO_ORIGIN"].includes(status)) return "Delayed";
                    return status;
                };

                const mapShipment = (s) => ({
                    ...s,
                    id: s.tracking_id,
                    dest: s.destination,
                    agent: s.agent || "Unassigned",
                    status: mapStatus(s.status)
                });

                const mappedShipments = (shipRes?.shipments || []).map(mapShipment);
                setShipments(mappedShipments);
                setError(null);
            } catch (err) {
                if (isMounted) {
                    console.error("Failed to fetch shipments:", err);
                    setError("Failed to load shipments data.");
                }
            } finally {
                if (isMounted) setLoading(false);
            }
        };
        fetchData();
        return () => { isMounted = false; };
    }, []);


    const filtered = shipments.filter((s) => {
        const term = globalSearchQ || searchQ; // Use navbar search if local search is empty
        const matchSearch = !term || [s.id, s.client, s.agent].some(v =>
            v.toLowerCase().includes(term.toLowerCase())
        );
        const matchStatus = statusFilter === "All" || s.status === statusFilter;
        const matchRisk = riskFilter === "All" || s.risk === riskFilter;

        return matchStatus && matchRisk && matchSearch;
    });

    const totalPages = Math.ceil(filtered.length / ITEMS_PER_PAGE);
    const paginated = filtered.slice(
        (page - 1) * ITEMS_PER_PAGE,
        page * ITEMS_PER_PAGE,
    );

    if (loading) {
        return (
            <div style={{ display: "flex", flexDirection: "column", height: "100vh", fontFamily: "'DM Sans','Segoe UI',sans-serif", background: "#F1F5F9" }}>
                <DashboardNavbar />
                <main style={{ flex: 1, display: "flex", justifyContent: "center", alignItems: "center" }}>
                    <div style={{ padding: 24, textAlign: "center", background: "white", borderRadius: 12, border: "1px solid #E2E8F0" }}>
                        <div style={{ fontSize: 24, marginBottom: 10 }}>⏳</div>
                        <div style={{ fontSize: 14, fontWeight: 600, color: "#0F172A" }}>Loading Shipments...</div>
                    </div>
                </main>
            </div>
        );
    }

    if (error) {
        return (
            <div style={{ display: "flex", flexDirection: "column", height: "100vh", fontFamily: "'DM Sans','Segoe UI',sans-serif", background: "#F1F5F9" }}>
                <DashboardNavbar />
                <main style={{ flex: 1, display: "flex", justifyContent: "center", alignItems: "center" }}>
                    <div style={{ padding: 24, background: "#FEF2F2", borderRadius: 12, border: "1px solid #FCA5A5", textAlign: "center", maxWidth: 400 }}>
                        <div style={{ fontSize: 24, marginBottom: 10 }}>⚠️</div>
                        <div style={{ fontSize: 14, fontWeight: 700, color: "#991B1B" }}>Error Loading Data</div>
                        <div style={{ fontSize: 13, color: "#991B1B", marginTop: 6 }}>{error}</div>
                        <button onClick={() => window.location.reload()} style={{ marginTop: 16, padding: "8px 16px", background: "white", border: "1px solid #FCA5A5", borderRadius: 6, color: "#991B1B", fontWeight: 600, cursor: "pointer" }}>Retry</button>
                    </div>
                </main>
            </div>
        );
    }

    return (
        <>
            <title>Shipments | CargoFlow</title>
            {/* Modals */}
            {modal === "addShipment" && (
                <AddShipmentModal onClose={closeModal} onAdd={(s) => { addShipment(s); closeModal(); }} showToast={showToast} />
            )}
            {modal === "export" && (
                <ExportModal shipments={filtered} onClose={closeModal} showToast={showToast} />
            )}

            {modal === "viewShipment" && (
                <ViewShipmentModal
                    shipment={selectedShipment}
                    onClose={closeModal}
                    showToast={showToast}
                />
            )}
            {modal === "invoice" && (
                <InvoiceModal
                    shipment={selectedShipment}
                    onClose={closeModal}
                    showToast={showToast}
                />
            )}
            <div
                style={{
                    display: "flex",
                    flexDirection: "column",
                    height: "100vh",
                    fontFamily: "'DM Sans','Segoe UI',sans-serif",
                    background: "#F1F5F9",
                    color: "#0F172A",
                }}
            >
                <DashboardNavbar />

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
                    {/* Header */}
                    <div
                        style={{
                            display: "flex",
                            alignItems: "center",
                            justifyContent: "space-between",
                        }}
                    >
                        <div>
                            <h1
                                style={{
                                    fontSize: 22,
                                    fontWeight: 800,
                                    color: "#0F172A",
                                    margin: 0,
                                    letterSpacing: "-0.5px",
                                }}
                            >
                                All Shipments
                            </h1>
                            <p style={{ fontSize: 12, color: "#94A3B8", margin: "4px 0 0" }}>
                                Manage and track all shipments across your network
                            </p>
                        </div>
                        <div style={{ display: "flex", gap: 10 }}>
                            <button
                                style={{
                                    display: "flex",
                                    alignItems: "center",
                                    gap: 6,
                                    padding: "9px 16px",
                                    border: "1px solid #E2E8F0",
                                    borderRadius: 8,
                                    background: "white",
                                    color: "#475569",
                                    fontSize: 12,
                                    fontWeight: 500,
                                    cursor: "pointer",
                                }}
                                onClick={() => openModal("export")}
                            >
                                <Icon d={icons.download} size={13} stroke="#475569" /> Export CSV
                            </button>
                            <button
                                style={{
                                    display: "flex",
                                    alignItems: "center",
                                    gap: 6,
                                    padding: "9px 18px",
                                    border: "none",
                                    borderRadius: 8,
                                    background: "#2563EB",
                                    color: "white",
                                    fontSize: 12,
                                    fontWeight: 600,
                                    cursor: "pointer",
                                }}
                                onClick={() => openModal("addShipment")}
                            >
                                <Icon d={icons.plus} size={13} stroke="white" /> New Shipment
                            </button>
                        </div>
                    </div>

                    {/* Status Summary Cards */}
                    <div
                        style={{
                            display: "grid",
                            gridTemplateColumns: "repeat(5,1fr)",
                            gap: 12,
                        }}
                    >
                        {[
                            {
                                label: "Total",
                                value: data.total,
                                color: "#2563EB",
                                bg: "#EFF6FF",
                            },
                            {
                                label: "In Transit",
                                value: data.in_transit,
                                color: "#1D4ED8",
                                bg: "#DBEAFE",
                            },
                            {
                                label: "Delivered",
                                value: data.delivered,
                                color: "#065F46",
                                bg: "#D1FAE5",
                            },
                            {
                                label: "Delayed",
                                value: data.delayed,
                                color: "#991B1B",
                                bg: "#FEE2E2",
                            },
                            {
                                label: "Pending",
                                value: data.pending,
                                color: "#92400E",
                                bg: "#FEF3C7",
                            },
                        ].map((c) => (
                            <div
                                key={c.label}
                                onClick={() => {
                                    setStatusFilter(c.label === "Total" ? "All" : c.label);
                                    setPage(1);
                                }}
                                style={{
                                    background: "white",
                                    borderRadius: 10,
                                    padding: "14px 16px",
                                    boxShadow: "0 1px 3px rgba(0,0,0,0.05)",
                                    border: "1px solid #F1F5F9",
                                    cursor: "pointer",
                                    transition: "all 0.15s",
                                }}
                                onMouseEnter={(e) =>
                                (e.currentTarget.style.boxShadow =
                                    "0 4px 12px rgba(0,0,0,0.08)")
                                }
                                onMouseLeave={(e) =>
                                    (e.currentTarget.style.boxShadow = "0 1px 3px rgba(0,0,0,0.05)")
                                }
                            >
                                <div
                                    style={{
                                        fontSize: 26,
                                        fontWeight: 800,
                                        color: c.color,
                                        letterSpacing: "-1px",
                                    }}
                                >
                                    {c.value}
                                </div>
                                <div
                                    style={{
                                        fontSize: 11,
                                        color: "#94A3B8",
                                        marginTop: 3,
                                        fontWeight: 500,
                                    }}
                                >
                                    {c.label}
                                </div>
                            </div>
                        ))}
                    </div>

                    {/* Filters + Table */}
                    <div
                        style={{
                            background: "white",
                            borderRadius: 12,
                            boxShadow: "0 1px 3px rgba(0,0,0,0.06)",
                            border: "1px solid #F1F5F9",
                            overflow: "hidden",
                        }}
                    >
                        {/* Filter bar */}
                        <div
                            style={{
                                padding: "14px 20px",
                                borderBottom: "1px solid #F1F5F9",
                                display: "flex",
                                gap: 10,
                                alignItems: "center",
                                flexWrap: "wrap",
                            }}
                        >
                            <div style={{ position: "relative", flex: 1, minWidth: 180 }}>
                                <input
                                    value={searchQ}
                                    onChange={(e) => {
                                        setSearchQ(e.target.value);
                                        setPage(1);
                                    }}
                                    placeholder="Search by ID, client, agent..."
                                    style={{
                                        width: "100%",
                                        border: "1px solid #E2E8F0",
                                        borderRadius: 8,
                                        padding: "7px 12px 7px 34px",
                                        fontSize: 12,
                                        color: "#334155",
                                        outline: "none",
                                        boxSizing: "border-box",
                                    }}
                                />
                                <span
                                    style={{
                                        position: "absolute",
                                        left: 10,
                                        top: "50%",
                                        transform: "translateY(-50%)",
                                    }}
                                >
                                    <Icon d={icons.search} size={13} stroke="#94A3B8" />
                                </span>
                            </div>
                            <select
                                value={statusFilter}
                                onChange={(e) => {
                                    setStatusFilter(e.target.value);
                                    setPage(1);
                                }}
                                style={{
                                    border: "1px solid #E2E8F0",
                                    borderRadius: 8,
                                    padding: "7px 12px",
                                    fontSize: 12,
                                    color: "#334155",
                                    background: "white",
                                    cursor: "pointer",
                                    outline: "none",
                                }}
                            >
                                {["All", "In Transit", "Delivered", "Delayed", "Pending"].map(
                                    (s) => (
                                        <option key={s}>{s}</option>
                                    ),
                                )}
                            </select>
                            <select
                                value={riskFilter}
                                onChange={(e) => {
                                    setRiskFilter(e.target.value);
                                    setPage(1);
                                }}
                                style={{
                                    border: "1px solid #E2E8F0",
                                    borderRadius: 8,
                                    padding: "7px 12px",
                                    fontSize: 12,
                                    color: "#334155",
                                    background: "white",
                                    cursor: "pointer",
                                    outline: "none",
                                }}
                            >
                                {["All", "Low", "Medium", "High"].map((r) => (
                                    <option key={r}>{r}</option>
                                ))}
                            </select>
                            {(statusFilter !== "All" || riskFilter !== "All" || searchQ) && (
                                <button
                                    onClick={() => {
                                        setStatusFilter("All");
                                        setRiskFilter("All");
                                        setSearchQ("");
                                        setPage(1);
                                    }}
                                    style={{
                                        border: "1px solid #FCA5A5",
                                        borderRadius: 8,
                                        padding: "7px 12px",
                                        fontSize: 11,
                                        color: "#EF4444",
                                        background: "#FEF2F2",
                                        cursor: "pointer",
                                        fontWeight: 600,
                                    }}
                                >
                                    Clear filters
                                </button>
                            )}
                            <span
                                style={{ marginLeft: "auto", fontSize: 11, color: "#94A3B8" }}
                            >
                                {filtered.length} results
                            </span>
                        </div>

                        {/* Table */}
                        <table style={{ width: "100%", borderCollapse: "collapse" }}>
                            <thead>
                                <tr style={{ background: "#F8FAFC" }}>
                                    {[
                                        "Tracking ID",
                                        "Client",
                                        "Agent",
                                        "Pickup",
                                        "Destination",
                                        "Weight (Kg)",
                                        "Price",
                                        "Status",
                                        "Risk",
                                        "Actions",
                                    ].map((h) => (
                                        <th
                                            key={h}
                                            style={{
                                                padding: "10px 14px",
                                                fontSize: 11,
                                                fontWeight: 600,
                                                color: "#94A3B8",
                                                textAlign: "left",
                                                borderBottom: "1px solid #F1F5F9",
                                                whiteSpace: "nowrap",
                                            }}
                                        >
                                            {h}
                                        </th>
                                    ))}
                                </tr>
                            </thead>
                            <tbody>
                                {paginated.length === 0 ? (
                                    <tr>
                                        <td
                                            colSpan={11}
                                            style={{
                                                padding: "40px",
                                                textAlign: "center",
                                                color: "#94A3B8",
                                                fontSize: 13,
                                            }}
                                        >
                                            No shipments match your filters.
                                        </td>
                                    </tr>
                                ) : (
                                    paginated.map((s) => (
                                        <tr
                                            key={s.id}
                                            style={{
                                                borderBottom: "1px solid #F8FAFC",
                                                cursor: "pointer",
                                                transition: "background 0.1s",
                                            }}
                                            onMouseEnter={(e) =>
                                                (e.currentTarget.style.background = "#F8FAFC")
                                            }
                                            onMouseLeave={(e) =>
                                                (e.currentTarget.style.background = "white")
                                            }
                                        >
                                            <td
                                                style={{
                                                    padding: "12px 14px",
                                                    fontSize: 12,
                                                    fontWeight: 700,
                                                    color: "#2563EB",
                                                }}
                                            >
                                                {s.id}
                                            </td>
                                            <td
                                                style={{
                                                    padding: "12px 14px",
                                                    fontSize: 12,
                                                    color: "#334155",
                                                    fontWeight: 500,
                                                }}
                                            >
                                                {s.client}
                                            </td>
                                            <td
                                                style={{
                                                    padding: "12px 14px",
                                                    fontSize: 12,
                                                    color: "#64748B",
                                                }}
                                            >
                                                {s.agent}
                                            </td>
                                            <td
                                                style={{
                                                    padding: "12px 14px",
                                                    fontSize: 12,
                                                    color: "#64748B",
                                                }}
                                            >
                                                {s.origin}
                                            </td>
                                            <td
                                                style={{
                                                    padding: "12px 14px",
                                                    fontSize: 12,
                                                    color: "#64748B",
                                                }}
                                            >
                                                {s.dest}
                                            </td>
                                            <td
                                                style={{
                                                    padding: "12px 14px",
                                                    fontSize: 12,
                                                    color: "#64748B",
                                                }}
                                            >
                                                {s.weight}
                                            </td>
                                            <td
                                                style={{
                                                    padding: "12px 14px",
                                                    fontSize: 12,
                                                    color: "#334155",
                                                    fontWeight: 600,
                                                }}
                                            >
                                                {s.price}
                                            </td>
                                            <td style={{ padding: "12px 14px" }}>
                                                <span
                                                    style={{
                                                        fontSize: 11,
                                                        fontWeight: 600,
                                                        padding: "3px 9px",
                                                        borderRadius: 20,
                                                        background: statusMeta[s.status]?.bg,
                                                        color: statusMeta[s.status]?.color,
                                                    }}
                                                >
                                                    {s.status}
                                                </span>
                                            </td>
                                            
                                            <td style={{ padding: "12px 14px" }}>
                                                <span
                                                    style={{
                                                        fontSize: 11,
                                                        fontWeight: 600,
                                                        padding: "3px 9px",
                                                        borderRadius: 20,
                                                        background: riskMeta[s.risk]?.bg,
                                                        color: riskMeta[s.risk]?.color,
                                                    }}
                                                >
                                                    {s.risk}
                                                </span>
                                            </td>
                                            <td style={{ padding: "12px 14px" }}>
                                                <div style={{ display: "flex", gap: 6 }}>
                                                    <button
                                                        onClick={() => {
                                                            setSelectedShipment(s);
                                                            openModal("viewShipment");
                                                        }}
                                                        style={{ ...buttonStyles }}
                                                    >
                                                        <Icon d={icons.eye} size={13} stroke="#64748B" />
                                                    </button>
                                                    <button
                                                        onClick={() => {
                                                            setSelectedShipment(s);
                                                            openModal("invoice");
                                                        }}
                                                        style={{ ...buttonStyles }}
                                                    >
                                                        {/* Use a document/file icon here */}
                                                        <Icon d="M14 2H6a2 2 0 00-2 2v16a2 2 0 002 2h12a2 2 0 002-2V8z" size={13} stroke="#64748B" />
                                                    </button>
                                                </div>
                                            </td>
                                        </tr>
                                    ))
                                )}
                            </tbody>
                        </table>

                        {/* Pagination */}
                        <div
                            style={{
                                padding: "12px 20px",
                                borderTop: "1px solid #F1F5F9",
                                display: "flex",
                                justifyContent: "space-between",
                                alignItems: "center",
                            }}
                        >
                            <span style={{ fontSize: 11, color: "#94A3B8" }}>
                                Showing{" "}
                                {Math.min((page - 1) * ITEMS_PER_PAGE + 1, filtered.length)}–
                                {Math.min(page * ITEMS_PER_PAGE, filtered.length)} of{" "}
                                {filtered.length}
                            </span>
                            <div style={{ display: "flex", gap: 4 }}>
                                <button
                                    onClick={() => setPage((p) => Math.max(1, p - 1))}
                                    disabled={page === 1}
                                    style={{
                                        padding: "5px 10px",
                                        borderRadius: 6,
                                        border: "1px solid #E2E8F0",
                                        background: "white",
                                        color: page === 1 ? "#CBD5E1" : "#64748B",
                                        fontSize: 12,
                                        cursor: page === 1 ? "not-allowed" : "pointer",
                                    }}
                                >
                                    ‹
                                </button>
                                {Array.from({ length: totalPages }, (_, i) => i + 1).map((p) => (
                                    <button
                                        key={p}
                                        onClick={() => setPage(p)}
                                        style={{
                                            width: 30,
                                            height: 30,
                                            borderRadius: 6,
                                            border: "1px solid",
                                            borderColor: p === page ? "#2563EB" : "#E2E8F0",
                                            background: p === page ? "#2563EB" : "white",
                                            color: p === page ? "white" : "#64748B",
                                            fontSize: 12,
                                            cursor: "pointer",
                                            fontWeight: p === page ? 700 : 400,
                                        }}
                                    >
                                        {p}
                                    </button>
                                ))}
                                <button
                                    onClick={() => setPage((p) => Math.min(totalPages, p + 1))}
                                    disabled={page === totalPages}
                                    style={{
                                        padding: "5px 10px",
                                        borderRadius: 6,
                                        border: "1px solid #E2E8F0",
                                        background: "white",
                                        color: page === totalPages ? "#CBD5E1" : "#64748B",
                                        fontSize: 12,
                                        cursor: page === totalPages ? "not-allowed" : "pointer",
                                    }}
                                >
                                    ›
                                </button>
                            </div>
                        </div>
                    </div>
                </main>
            </div>
            <Toast
                show={toast.show}
                message={toast.message}
                type={toast.type}
                onClose={hideToast}
            />
        </>

    );
}
