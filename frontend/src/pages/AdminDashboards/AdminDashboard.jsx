import { useState, useEffect } from "react";
import { getCurrentUser } from "../../utils/auth";
import DashboardNavbar from "../../components/DashboardNavbar";
import { Link } from "react-router-dom";

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
};

const shipments = [
    {
        id: "V1-20250301",
        client: "Apex Traders",
        agent: "Ravi Kumar",
        origin: "Chennai",
        dest: "Mumbai",
        status: "In Transit",
        eta: "Today 6PM",
        risk: "Low",
    },
    {
        id: "V1-20250302",
        client: "BlueStar Exports",
        agent: "Priya Nair",
        origin: "Delhi",
        dest: "Bangalore",
        status: "Delivered",
        eta: "Completed",
        risk: "Low",
    },
    {
        id: "V1-20250303",
        client: "Metro Supplies",
        agent: "Arjun Das",
        origin: "Hyderabad",
        dest: "Chennai",
        status: "Delayed",
        eta: "Tomorrow 2PM",
        risk: "High",
    },
    {
        id: "V1-20250304",
        client: "Sunrise Co.",
        agent: "Meena Shah",
        origin: "Mumbai",
        dest: "Pune",
        status: "Pending",
        eta: "Mar 5, 10AM",
        risk: "Medium",
    },
    {
        id: "V1-20250305",
        client: "Northern Goods",
        agent: "Kiran Roy",
        origin: "Kolkata",
        dest: "Delhi",
        status: "In Transit",
        eta: "Mar 4, 8PM",
        risk: "Low",
    },
    {
        id: "V1-20250306",
        client: "South Freight",
        agent: "Ravi Kumar",
        origin: "Bangalore",
        dest: "Hyderabad",
        status: "In Transit",
        eta: "Today 9PM",
        risk: "Medium",
    },
];

const agents = [
    { name: "Ravi Kumar", status: "Active", deliveries: 11, rate: "98.2%" },
    { name: "Priya Nair", status: "Active", deliveries: 9, rate: "100%" },
    { name: "Arjun Das", status: "Idle", deliveries: 6, rate: "83.5%" },
    { name: "Meena Shah", status: "Active", deliveries: 14, rate: "95.7%" },
    { name: "Kiran Roy", status: "Off", deliveries: 4, rate: "90.0%" },
];

const riskAlerts = [
    { icon: "⚠️", label: "Route congestion — Chennai Port", border: "#FDE68A" },
    { icon: "🌦️", label: "Weather delay — Mumbai region", border: "#BFDBFE" },
    { icon: "📦", label: "3 clients with overdue invoices", border: "#FECACA" },
];

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

const agentStatusColor = { Active: "#22C55E", Idle: "#F59E0B", Off: "#9CA3AF" };

const LiveMap = () => (
    <div
        style={{
            position: "relative",
            width: "100%",
            height: "100%",
            background: "#EFF6FF",
            borderRadius: 10,
            overflow: "hidden",
        }}
    >
        <svg
            width="100%"
            height="100%"
            viewBox="0 0 900 320"
            preserveAspectRatio="xMidYMid slice"
        >
            {Array.from({ length: 8 }).map((_, i) => (
                <line
                    key={`h${i}`}
                    x1="0"
                    y1={i * 46}
                    x2="900"
                    y2={i * 46}
                    stroke="#BFDBFE"
                    strokeWidth="0.7"
                />
            ))}
            {Array.from({ length: 18 }).map((_, i) => (
                <line
                    key={`v${i}`}
                    x1={i * 53}
                    y1="0"
                    x2={i * 53}
                    y2="320"
                    stroke="#BFDBFE"
                    strokeWidth="0.7"
                />
            ))}
            <path
                d="M120 240 Q280 140 440 170"
                stroke="#2563EB"
                strokeWidth="2.5"
                fill="none"
                strokeDasharray="7,4"
                opacity="0.9"
            />
            <path
                d="M440 170 Q600 100 750 130"
                stroke="#2563EB"
                strokeWidth="2.5"
                fill="none"
                strokeDasharray="7,4"
                opacity="0.9"
            />
            <path
                d="M200 260 Q380 210 560 230"
                stroke="#10B981"
                strokeWidth="2"
                fill="none"
                strokeDasharray="6,4"
                opacity="0.65"
            />
            <path
                d="M300 180 Q500 240 680 200"
                stroke="#F59E0B"
                strokeWidth="2"
                fill="none"
                strokeDasharray="6,4"
                opacity="0.65"
            />
            <path
                d="M120 240 Q200 290 350 270"
                stroke="#8B5CF6"
                strokeWidth="1.8"
                fill="none"
                strokeDasharray="5,5"
                opacity="0.5"
            />
            {[
                [120, 240, "Chennai", true],
                [440, 170, "Hyderabad", false],
                [750, 130, "Mumbai", true],
                [200, 260, "Bangalore", false],
                [560, 230, "Pune", false],
                [300, 180, "Delhi", false],
                [680, 200, "Kolkata", false],
                [350, 270, "Kochi", false],
            ].map(([x, y, label, active]) => (
                <g key={label}>
                    {active && (
                        <circle cx={x} cy={y} r={20} fill="#2563EB" opacity="0.12" />
                    )}
                    <circle
                        cx={x}
                        cy={y}
                        r={active ? 9 : 5.5}
                        fill={active ? "#2563EB" : "#93C5FD"}
                        opacity={active ? 1 : 0.75}
                    />
                    <text
                        x={x}
                        y={y - 15}
                        textAnchor="middle"
                        fontSize="9.5"
                        fill="#1E3A5F"
                        fontFamily="sans-serif"
                        fontWeight="700"
                    >
                        {label}
                    </text>
                </g>
            ))}
            <rect x="415" y="149" width="28" height="17" rx="5" fill="#1D4ED8" />
            <text
                x="429"
                y="162"
                textAnchor="middle"
                fontSize="10"
                fill="white"
                fontFamily="sans-serif"
            >
                🚚
            </text>
        </svg>
        <div
            style={{
                position: "absolute",
                top: 10,
                right: 12,
                background: "white",
                borderRadius: 20,
                padding: "3px 10px",
                fontSize: 10,
                fontWeight: 700,
                color: "#EF4444",
                boxShadow: "0 1px 4px rgba(0,0,0,0.1)",
                display: "flex",
                alignItems: "center",
                gap: 5,
            }}
        >
            <span
                style={{
                    width: 6,
                    height: 6,
                    borderRadius: "50%",
                    background: "#EF4444",
                    display: "inline-block",
                }}
            />
            LIVE
        </div>
        <div
            style={{
                position: "absolute",
                bottom: 10,
                left: 12,
                display: "flex",
                gap: 14,
                fontSize: 10,
                color: "#64748B",
                fontFamily: "sans-serif",
            }}
        >
            {[
                ["#2563EB", "Active"],
                ["#10B981", "Delivered"],
                ["#F59E0B", "Delayed"],
                ["#8B5CF6", "Scheduled"],
            ].map(([c, l]) => (
                <span key={l} style={{ display: "flex", alignItems: "center", gap: 5 }}>
                    <span
                        style={{
                            width: 18,
                            height: 2.5,
                            background: c,
                            display: "inline-block",
                            borderRadius: 2,
                        }}
                    />
                    {l}
                </span>
            ))}
        </div>
    </div>
);

export default function AdminDashboard() {
    const [userName, setUserName] = useState("Admin");

    const getGreeting = () => {
        const hour = new Date().getHours();
        if (hour < 12) return "Good Morning";
        if (hour < 17) return "Good Afternoon";
        return "Good Evening";
    };

    const getFormattedDate = () => {
        return new Date().toLocaleDateString("en-IN", {
            weekday: "long",
            year: "numeric",
            month: "long",
            day: "numeric",
        });
    };

    useEffect(() => {
        const fetchUser = async () => {
            try {
                const user = await getCurrentUser();
                if (user?.name) setUserName(user.name);
            } catch (err) {
                console.error("Failed to fetch user:", err);
            }
        };
        fetchUser();
    }, []);

    return (
        <>
            <title>Admin Dashboard | CargoFlow</title>
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
                    {/* Welcome Header */}
                    <div
                        style={{
                            display: "flex",
                            alignItems: "center",
                            justifyContent: "space-between",
                        }}
                    >
                        {/* Welcome Header */}
                        <div>
                            <h1 style={{ fontSize: 24, fontWeight: 800, color: "#0F172A", margin: 0, letterSpacing: "-0.6px" }}>
                                {getGreeting()}, {userName}
                            </h1>
                            <p style={{ fontSize: 13, color: "#94A3B8", margin: "4px 0 0" }}>
                                Logistics command overview — {getFormattedDate()} · Updated just now  {/* ✅ dynamic date */}
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
                            >
                                <Icon d={icons.download} size={13} stroke="#475569" /> Export
                                Report
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
                            >
                                <Icon d={icons.plus} size={13} stroke="white" /> Add Shipment
                            </button>
                        </div>
                    </div>

                    {/* KPI Row */}
                    <div
                        style={{
                            display: "grid",
                            gridTemplateColumns: "repeat(5,1fr)",
                            gap: 14,
                        }}
                    >
                        {[
                            {
                                label: "Active Shipments",
                                value: "148",
                                trend: "+12%",
                                icon: icons.truck,
                                up: true,
                            },
                            {
                                label: "Delivered This Month",
                                value: "892",
                                trend: "+8%",
                                icon: icons.check,
                                up: true,
                            },
                            {
                                label: "Active Agents",
                                value: "24",
                                trend: null,
                                icon: icons.agents,
                                up: null,
                            },
                            {
                                label: "Registered Clients",
                                value: "67",
                                trend: "+3",
                                icon: icons.clients,
                                up: true,
                            },
                            {
                                label: "Open Issues",
                                value: "5",
                                trend: "-2",
                                icon: icons.warning,
                                up: false,
                            },
                        ].map((kpi) => (
                            <div
                                key={kpi.label}
                                style={{
                                    background: "white",
                                    borderRadius: 12,
                                    padding: "18px 18px 16px",
                                    boxShadow: "0 1px 3px rgba(0,0,0,0.06)",
                                    border: "1px solid #F1F5F9",
                                }}
                            >
                                <div
                                    style={{
                                        display: "flex",
                                        justifyContent: "space-between",
                                        alignItems: "flex-start",
                                        marginBottom: 14,
                                    }}
                                >
                                    <div
                                        style={{
                                            background: "#EFF6FF",
                                            borderRadius: 9,
                                            width: 38,
                                            height: 38,
                                            display: "flex",
                                            alignItems: "center",
                                            justifyContent: "center",
                                        }}
                                    >
                                        <Icon d={kpi.icon} size={17} stroke="#2563EB" />
                                    </div>
                                    {kpi.up !== null && (
                                        <span
                                            style={{
                                                fontSize: 11,
                                                fontWeight: 700,
                                                color: kpi.up ? "#10B981" : "#EF4444",
                                                background: kpi.up ? "#D1FAE5" : "#FEE2E2",
                                                padding: "2px 8px",
                                                borderRadius: 20,
                                            }}
                                        >
                                            {kpi.trend}
                                        </span>
                                    )}
                                </div>
                                <div
                                    style={{
                                        fontSize: 32,
                                        fontWeight: 800,
                                        color: "#0F172A",
                                        letterSpacing: "-1.2px",
                                        lineHeight: 1,
                                    }}
                                >
                                    {kpi.value}
                                </div>
                                <div
                                    style={{
                                        fontSize: 11,
                                        color: "#94A3B8",
                                        marginTop: 5,
                                        fontWeight: 500,
                                    }}
                                >
                                    {kpi.label}
                                </div>
                            </div>
                        ))}
                    </div>

                    {/* Map + Right column */}
                    <div
                        style={{
                            display: "grid",
                            gridTemplateColumns: "1fr 310px",
                            gap: 16,
                        }}
                    >
                        {/* Live Map */}
                        <div
                            style={{
                                background: "white",
                                borderRadius: 12,
                                padding: "16px 18px",
                                boxShadow: "0 1px 3px rgba(0,0,0,0.06)",
                                border: "1px solid #F1F5F9",
                            }}
                        >
                            <div
                                style={{
                                    display: "flex",
                                    justifyContent: "space-between",
                                    alignItems: "center",
                                    marginBottom: 12,
                                }}
                            >
                                <div>
                                    <h3
                                        style={{
                                            margin: 0,
                                            fontSize: 14,
                                            fontWeight: 700,
                                            color: "#0F172A",
                                        }}
                                    >
                                        Live Tracking Map
                                    </h3>
                                    <p
                                        style={{
                                            margin: "3px 0 0",
                                            fontSize: 11,
                                            color: "#94A3B8",
                                        }}
                                    >
                                        12 shipments in transit across India
                                    </p>
                                </div>
                                <button
                                    style={{
                                        background: "none",
                                        border: "1px solid #E2E8F0",
                                        borderRadius: 7,
                                        padding: "5px 12px",
                                        fontSize: 11,
                                        color: "#64748B",
                                        cursor: "pointer",
                                        display: "flex",
                                        alignItems: "center",
                                        gap: 5,
                                    }}
                                >
                                    <Icon d={icons.refresh} size={11} stroke="#64748B" /> Refresh
                                </button>
                            </div>
                            <div style={{ height: 300 }}>
                                <LiveMap />
                            </div>
                        </div>

                        {/* Active cards + risk stacked */}
                        <div style={{ display: "flex", flexDirection: "column", gap: 14 }}>
                            <div
                                style={{
                                    background: "white",
                                    borderRadius: 12,
                                    padding: 16,
                                    boxShadow: "0 1px 3px rgba(0,0,0,0.06)",
                                    border: "1px solid #F1F5F9",
                                    flex: 1,
                                }}
                            >
                                <div
                                    style={{
                                        display: "flex",
                                        justifyContent: "space-between",
                                        alignItems: "center",
                                        marginBottom: 10,
                                    }}
                                >
                                    <h3
                                        style={{
                                            margin: 0,
                                            fontSize: 13,
                                            fontWeight: 700,
                                            color: "#0F172A",
                                        }}
                                    >
                                        Active Shipments
                                    </h3>
                                    <Link to="/admin/shipments"
                                        style={{
                                            fontSize: 11,
                                            color: "#2563EB",
                                            cursor: "pointer",
                                            fontWeight: 600,
                                        }}
                                    >

                                        View all →
                                    </Link>
                                </div>
                                <div
                                    style={{ display: "flex", flexDirection: "column", gap: 8 }}
                                >
                                    {shipments
                                        .filter((s) => s.status !== "Delivered")
                                        .slice(0, 4)
                                        .map((s) => (
                                            <div
                                                key={s.id}
                                                style={{
                                                    display: "flex",
                                                    alignItems: "center",
                                                    gap: 10,
                                                    padding: "9px 10px",
                                                    background: "#F8FAFC",
                                                    borderRadius: 8,
                                                }}
                                            >
                                                <div
                                                    style={{
                                                        width: 32,
                                                        height: 32,
                                                        background:
                                                            s.status === "Delayed" ? "#FEE2E2" : "#EFF6FF",
                                                        borderRadius: 7,
                                                        display: "flex",
                                                        alignItems: "center",
                                                        justifyContent: "center",
                                                        flexShrink: 0,
                                                    }}
                                                >
                                                    <Icon
                                                        d={icons.truck}
                                                        size={14}
                                                        stroke={
                                                            s.status === "Delayed" ? "#EF4444" : "#2563EB"
                                                        }
                                                    />
                                                </div>
                                                <div style={{ flex: 1, minWidth: 0 }}>
                                                    <div
                                                        style={{
                                                            fontSize: 11,
                                                            fontWeight: 700,
                                                            color: "#0F172A",
                                                        }}
                                                    >
                                                        {s.id}
                                                    </div>
                                                    <div
                                                        style={{
                                                            fontSize: 10,
                                                            color: "#94A3B8",
                                                            marginTop: 1,
                                                            whiteSpace: "nowrap",
                                                            overflow: "hidden",
                                                            textOverflow: "ellipsis",
                                                        }}
                                                    >
                                                        {s.origin} → {s.dest}
                                                    </div>
                                                </div>
                                                <span
                                                    style={{
                                                        fontSize: 10,
                                                        fontWeight: 700,
                                                        padding: "2px 7px",
                                                        borderRadius: 20,
                                                        background: statusMeta[s.status]?.bg,
                                                        color: statusMeta[s.status]?.color,
                                                        flexShrink: 0,
                                                    }}
                                                >
                                                    {s.status}
                                                </span>
                                            </div>
                                        ))}
                                </div>
                            </div>
                            <div
                                style={{
                                    background: "white",
                                    borderRadius: 12,
                                    padding: "14px 16px",
                                    boxShadow: "0 1px 3px rgba(0,0,0,0.06)",
                                    border: "1px solid #F1F5F9",
                                }}
                            >
                                <div
                                    style={{
                                        display: "flex",
                                        justifyContent: "space-between",
                                        alignItems: "center",
                                        marginBottom: 10,
                                    }}
                                >
                                    <h3
                                        style={{
                                            margin: 0,
                                            fontSize: 13,
                                            fontWeight: 700,
                                            color: "#0F172A",
                                        }}
                                    >
                                        Risk Alerts
                                    </h3>
                                    <span
                                        style={{
                                            background: "#FEE2E2",
                                            color: "#991B1B",
                                            fontSize: 10,
                                            fontWeight: 700,
                                            padding: "2px 8px",
                                            borderRadius: 20,
                                        }}
                                    >
                                        3 Active
                                    </span>
                                </div>
                                <div
                                    style={{ display: "flex", flexDirection: "column", gap: 7 }}
                                >
                                    {riskAlerts.map((a, i) => (
                                        <div
                                            key={i}
                                            style={{
                                                display: "flex",
                                                alignItems: "center",
                                                gap: 10,
                                                padding: "9px 12px",
                                                background: "#F8FAFC",
                                                borderRadius: 8,
                                                border: `1px solid ${a.border}`,
                                                cursor: "pointer",
                                            }}
                                        >
                                            <span style={{ fontSize: 14 }}>{a.icon}</span>
                                            <span
                                                style={{
                                                    fontSize: 11,
                                                    color: "#334155",
                                                    fontWeight: 500,
                                                    flex: 1,
                                                }}
                                            >
                                                {a.label}
                                            </span>
                                            <span style={{ color: "#CBD5E1", fontSize: 16 }}>›</span>
                                        </div>
                                    ))}
                                </div>
                            </div>
                        </div>
                    </div>

                    {/* Performance Bar */}
                    <div
                        style={{
                            background: "white",
                            borderRadius: 12,
                            padding: "20px 28px",
                            boxShadow: "0 1px 3px rgba(0,0,0,0.06)",
                            border: "1px solid #F1F5F9",
                            display: "flex",
                            alignItems: "center",
                            gap: 48,
                        }}
                    >
                        <div style={{ minWidth: 200 }}>
                            <div
                                style={{
                                    fontSize: 11,
                                    fontWeight: 600,
                                    color: "#94A3B8",
                                    letterSpacing: "0.5px",
                                    marginBottom: 4,
                                }}
                            >
                                DELIVERY PERFORMANCE SCORE
                            </div>
                            <div
                                style={{
                                    fontSize: 52,
                                    fontWeight: 800,
                                    color: "#0F172A",
                                    letterSpacing: "-2px",
                                    lineHeight: 1,
                                }}
                            >
                                96.4<span style={{ fontSize: 26, color: "#2563EB" }}>%</span>
                            </div>
                            <div style={{ fontSize: 11, color: "#94A3B8", marginTop: 5 }}>
                                AI-calculated operational efficiency
                            </div>
                        </div>
                        <div style={{ flex: 1 }}>
                            <div
                                style={{
                                    background: "#F1F5F9",
                                    borderRadius: 6,
                                    height: 10,
                                    overflow: "hidden",
                                    marginBottom: 16,
                                }}
                            >
                                <div
                                    style={{
                                        width: "96.4%",
                                        height: "100%",
                                        background: "linear-gradient(90deg,#10B981,#2563EB)",
                                        borderRadius: 6,
                                    }}
                                />
                            </div>
                            <div
                                style={{
                                    display: "grid",
                                    gridTemplateColumns: "repeat(3,1fr)",
                                    gap: 16,
                                }}
                            >
                                {[
                                    { label: "On-time Rate", value: "99.1%", color: "#10B981" },
                                    { label: "Delayed", value: "0.9%", color: "#EF4444" },
                                    {
                                        label: "Risk Flagged",
                                        value: "4 shipments",
                                        color: "#F59E0B",
                                    },
                                ].map((m) => (
                                    <div key={m.label}>
                                        <div
                                            style={{
                                                fontSize: 20,
                                                fontWeight: 800,
                                                color: m.color,
                                                letterSpacing: "-0.5px",
                                            }}
                                        >
                                            {m.value}
                                        </div>
                                        <div
                                            style={{ fontSize: 11, color: "#94A3B8", marginTop: 2 }}
                                        >
                                            {m.label}
                                        </div>
                                    </div>
                                ))}
                            </div>
                        </div>
                    </div>

                    {/* Table + Agents */}
                    <div
                        style={{
                            display: "grid",
                            gridTemplateColumns: "1fr 270px",
                            gap: 16,
                        }}
                    >
                        {/* Shipments Table */}
                        <div
                            style={{
                                background: "white",
                                borderRadius: 12,
                                boxShadow: "0 1px 3px rgba(0,0,0,0.06)",
                                border: "1px solid #F1F5F9",
                                overflow: "hidden",
                            }}
                        >
                            <div
                                style={{
                                    padding: "16px 20px",
                                    borderBottom: "1px solid #F1F5F9",
                                    display: "flex",
                                    justifyContent: "space-between",
                                    alignItems: "center",
                                }}
                            >
                                <h3
                                    style={{
                                        margin: 0,
                                        fontSize: 14,
                                        fontWeight: 700,
                                        color: "#0F172A",
                                    }}
                                >
                                    Today's Shipments
                                </h3>
                                <div style={{ display: "flex", gap: 8 }}>
                                    {["Status", "Agent", "Client"].map((f) => (
                                        <select
                                            key={f}
                                            style={{
                                                border: "1px solid #E2E8F0",
                                                borderRadius: 6,
                                                padding: "5px 10px",
                                                fontSize: 11,
                                                color: "#64748B",
                                                background: "white",
                                                cursor: "pointer",
                                                outline: "none",
                                            }}
                                        >
                                            <option>{f}</option>
                                        </select>
                                    ))}
                                </div>
                            </div>
                            <table style={{ width: "100%", borderCollapse: "collapse" }}>
                                <thead>
                                    <tr style={{ background: "#F8FAFC" }}>
                                        {[
                                            "Tracking ID",
                                            "Client",
                                            "Agent",
                                            "Origin",
                                            "Destination",
                                            "Status",
                                            "ETA",
                                            "Risk",
                                        ].map((h) => (
                                            <th
                                                key={h}
                                                style={{
                                                    padding: "10px 16px",
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
                                    {shipments.map((s) => (
                                        <tr
                                            key={s.id}
                                            style={{
                                                borderBottom: "1px solid #F8FAFC",
                                                cursor: "pointer",
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
                                                    padding: "12px 16px",
                                                    fontSize: 12,
                                                    fontWeight: 700,
                                                    color: "#2563EB",
                                                }}
                                            >
                                                {s.id}
                                            </td>
                                            <td
                                                style={{
                                                    padding: "12px 16px",
                                                    fontSize: 12,
                                                    color: "#334155",
                                                }}
                                            >
                                                {s.client}
                                            </td>
                                            <td
                                                style={{
                                                    padding: "12px 16px",
                                                    fontSize: 12,
                                                    color: "#334155",
                                                }}
                                            >
                                                {s.agent}
                                            </td>
                                            <td
                                                style={{
                                                    padding: "12px 16px",
                                                    fontSize: 12,
                                                    color: "#64748B",
                                                }}
                                            >
                                                {s.origin}
                                            </td>
                                            <td
                                                style={{
                                                    padding: "12px 16px",
                                                    fontSize: 12,
                                                    color: "#64748B",
                                                }}
                                            >
                                                {s.dest}
                                            </td>
                                            <td style={{ padding: "12px 16px" }}>
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
                                            <td
                                                style={{
                                                    padding: "12px 16px",
                                                    fontSize: 11,
                                                    color: "#64748B",
                                                    whiteSpace: "nowrap",
                                                }}
                                            >
                                                {s.eta}
                                            </td>
                                            <td style={{ padding: "12px 16px" }}>
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
                                        </tr>
                                    ))}
                                </tbody>
                            </table>
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
                                    Showing 6 of 148 shipments
                                </span>
                                <div style={{ display: "flex", gap: 4 }}>
                                    {[1, 2, 3, "…"].map((p) => (
                                        <button
                                            key={p}
                                            style={{
                                                width: 28,
                                                height: 28,
                                                borderRadius: 6,
                                                border: "1px solid",
                                                borderColor: p === 1 ? "#2563EB" : "#E2E8F0",
                                                background: p === 1 ? "#2563EB" : "white",
                                                color: p === 1 ? "white" : "#64748B",
                                                fontSize: 12,
                                                cursor: "pointer",
                                                fontWeight: p === 1 ? 700 : 400,
                                            }}
                                        >
                                            {p}
                                        </button>
                                    ))}
                                </div>
                            </div>
                        </div>

                        {/* Agent Panel */}
                        <div
                            style={{
                                background: "white",
                                borderRadius: 12,
                                padding: 16,
                                boxShadow: "0 1px 3px rgba(0,0,0,0.06)",
                                border: "1px solid #F1F5F9",
                                display: "flex",
                                flexDirection: "column",
                            }}
                        >
                            <div
                                style={{
                                    display: "flex",
                                    justifyContent: "space-between",
                                    alignItems: "center",
                                    marginBottom: 12,
                                }}
                            >
                                <h3
                                    style={{
                                        margin: 0,
                                        fontSize: 14,
                                        fontWeight: 700,
                                        color: "#0F172A",
                                    }}
                                >
                                    Agent Activity
                                </h3>
                                <span
                                    style={{
                                        fontSize: 11,
                                        color: "#2563EB",
                                        cursor: "pointer",
                                        fontWeight: 600,
                                    }}
                                >
                                    <Link to="/admin/agents">
                                    Manage →
                                    </Link>
                                </span>
                            </div>
                            <div style={{ display: "flex", flexDirection: "column", gap: 8 }}>
                                {agents.map((agent) => (
                                    <div
                                        key={agent.name}
                                        style={{
                                            display: "flex",
                                            alignItems: "center",
                                            gap: 10,
                                            padding: "10px 12px",
                                            background: "#F8FAFC",
                                            borderRadius: 8,
                                        }}
                                    >
                                        <div
                                            style={{
                                                width: 32,
                                                height: 32,
                                                borderRadius: "50%",
                                                background: "#EFF6FF",
                                                display: "flex",
                                                alignItems: "center",
                                                justifyContent: "center",
                                                fontSize: 12,
                                                fontWeight: 700,
                                                color: "#2563EB",
                                                flexShrink: 0,
                                            }}
                                        >
                                            {agent.name[0]}
                                        </div>
                                        <div style={{ flex: 1, minWidth: 0 }}>
                                            <div
                                                style={{
                                                    fontSize: 12,
                                                    fontWeight: 600,
                                                    color: "#0F172A",
                                                    whiteSpace: "nowrap",
                                                    overflow: "hidden",
                                                    textOverflow: "ellipsis",
                                                }}
                                            >
                                                {agent.name}
                                            </div>
                                            <div
                                                style={{ fontSize: 10, color: "#94A3B8", marginTop: 1 }}
                                            >
                                                {agent.deliveries} today · {agent.rate}
                                            </div>
                                        </div>
                                        <div
                                            style={{
                                                display: "flex",
                                                alignItems: "center",
                                                gap: 4,
                                                flexShrink: 0,
                                            }}
                                        >
                                            <div
                                                style={{
                                                    width: 7,
                                                    height: 7,
                                                    borderRadius: "50%",
                                                    background: agentStatusColor[agent.status],
                                                }}
                                            />
                                            <span style={{ fontSize: 10, color: "#64748B" }}>
                                                {agent.status}
                                            </span>
                                        </div>
                                    </div>
                                ))}
                            </div>
                            <div
                                style={{
                                    marginTop: 16,
                                    paddingTop: 14,
                                    borderTop: "1px solid #F1F5F9",
                                }}
                            >
                                <div
                                    style={{
                                        fontSize: 12,
                                        fontWeight: 700,
                                        color: "#0F172A",
                                        marginBottom: 10,
                                    }}
                                >
                                    Quick Actions
                                </div>
                                <div
                                    style={{ display: "flex", flexDirection: "column", gap: 8 }}
                                >
                                    {[
                                        { label: "Assign Shipment to Agent", icon: icons.truck },
                                        { label: "Generate Monthly Report", icon: icons.reports },
                                        { label: "Add New Client", icon: icons.plus },
                                        { label: "View AI Insights", icon: icons.risk },
                                    ].map((action) => (
                                        <button
                                            key={action.label}
                                            style={{
                                                display: "flex",
                                                alignItems: "center",
                                                gap: 8,
                                                padding: "8px 12px",
                                                border: "1px solid #E2E8F0",
                                                borderRadius: 8,
                                                background: "white",
                                                color: "#334155",
                                                fontSize: 11,
                                                fontWeight: 500,
                                                cursor: "pointer",
                                                textAlign: "left",
                                                transition: "all 0.15s",
                                            }}
                                            onMouseEnter={(e) => {
                                                e.currentTarget.style.background = "#EFF6FF";
                                                e.currentTarget.style.borderColor = "#BFDBFE";
                                                e.currentTarget.style.color = "#2563EB";
                                            }}
                                            onMouseLeave={(e) => {
                                                e.currentTarget.style.background = "white";
                                                e.currentTarget.style.borderColor = "#E2E8F0";
                                                e.currentTarget.style.color = "#334155";
                                            }}
                                        >
                                            <Icon d={action.icon} size={13} stroke="currentColor" />
                                            {action.label}
                                        </button>
                                    ))}
                                </div>
                            </div>
                        </div>
                    </div>
                </main>
            </div>
        </>
    );
}
